import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { sendVerificationCode } from "~/server/email";
import { createSession } from "~/server/auth";
import { isValidCountry } from "~/server/utils/countries";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session-token";

// Generate 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authRouter = createTRPCRouter({
  sendCode: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete old codes for this email
      await db.emailVerification.deleteMany({
        where: { email: input.email },
      });

      // Create new verification code
      await db.emailVerification.create({
        data: {
          email: input.email,
          code,
          expiresAt,
        },
      });

      // TEMPORARY: Log code to console for testing (remove in production)
      console.log(`[AUTH] Verification code for ${input.email}: ${code}`);

      // Send email
      try {
        const emailResult = await sendVerificationCode(input.email, code);
        if (!emailResult.success) {
          console.error("[AUTH] Email sending failed:", emailResult.error);
          // Still return success because code is saved - user can check console or use the code
          // In production, you'd want to throw an error here
          console.warn(`[AUTH] Email failed but code saved. Code: ${code}`);
          return { 
            success: true, 
            warning: "Email delivery failed. Please check the console for your verification code or use your verified email address." 
          };
        }
        console.log(`[AUTH] Verification code sent successfully to ${input.email}`);
        return { success: true };
      } catch (error: any) {
        console.error("[AUTH] Email sending error:", error);
        // Code is already saved, so we can still allow registration
        // User can check console for the code
        console.warn(`[AUTH] Email error but code saved. Code: ${code}`);
        return { 
          success: true, 
          warning: error?.message || "Email delivery failed. Please check the console for your verification code." 
        };
      }
    }),

  verifyCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6, "Code must be 6 digits"),
      })
    )
    .mutation(async ({ input }) => {
      const verification = await db.emailVerification.findFirst({
        where: {
          email: input.email,
          code: input.code,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!verification) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired verification code",
        });
      }

      // Delete used code
      await db.emailVerification.delete({
        where: { id: verification.id },
      });

      return { verified: true };
    }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
        fullName: z.string().min(1, "Full name is required"),
        countryName: z.string().min(1, "Country name is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify code first
      const verification = await db.emailVerification.findFirst({
        where: {
          email: input.email,
          code: input.code,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!verification) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired verification code",
        });
      }

      // Validate country name
      if (!isValidCountry(input.countryName)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid country name",
        });
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Create user
      const user = await db.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          countryName: input.countryName,
        },
      });

      // Delete used code
      await db.emailVerification.delete({
        where: { id: verification.id },
      });

      // Create session
      const sessionToken = await createSession({
        userId: user.id,
        email: user.email,
      });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      // Also store in context for route handler to access
      console.log(`[AUTH] Attempting to store token in context (login)`);
      console.log(`[AUTH] ctx.setSessionToken exists: ${!!ctx.setSessionToken}`);
      console.log(`[AUTH] ctx.requestId: ${ctx.requestId}`);
      
      if (ctx.setSessionToken) {
        ctx.setSessionToken(sessionToken);
        console.log(`[AUTH] ✅ Token stored via setSessionToken (login)`);
      } else {
        console.log(`[AUTH] ❌ setSessionToken not available in context (login)`);
      }

      console.log(`[AUTH] Cookie set for user: ${user.email}`);
      console.log(`[AUTH] Session token length: ${sessionToken.length}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          countryName: user.countryName,
        },
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify code
      const verification = await db.emailVerification.findFirst({
        where: {
          email: input.email,
          code: input.code,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!verification) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired verification code",
        });
      }

      // Find user
      const user = await db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please register first.",
        });
      }

      // Delete used code
      await db.emailVerification.delete({
        where: { id: verification.id },
      });

      // Create session
      const sessionToken = await createSession({
        userId: user.id,
        email: user.email,
      });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      // Also store in context for route handler to access
      console.log(`[AUTH] Attempting to store token in context (login)`);
      console.log(`[AUTH] ctx.setSessionToken exists: ${!!ctx.setSessionToken}`);
      console.log(`[AUTH] ctx.requestId: ${ctx.requestId}`);
      
      if (ctx.setSessionToken) {
        ctx.setSessionToken(sessionToken);
        console.log(`[AUTH] ✅ Token stored via setSessionToken (login)`);
      } else {
        console.log(`[AUTH] ❌ setSessionToken not available in context (login)`);
      }

      console.log(`[AUTH] Cookie set for user: ${user.email}`);
      console.log(`[AUTH] Session token length: ${sessionToken.length}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          countryName: user.countryName,
        },
      };
    }),

  logout: publicProcedure.mutation(async () => {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null;
    }
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      fullName: ctx.user.fullName,
      countryName: ctx.user.countryName,
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1, "Full name is required").optional(),
        countryName: z.string().min(1, "Country name is required").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate country name if provided
      if (input.countryName && !isValidCountry(input.countryName)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid country name",
        });
      }

      const updated = await db.user.update({
        where: { id: ctx.user.id },
        data: {
          ...(input.fullName && { fullName: input.fullName }),
          ...(input.countryName && { countryName: input.countryName }),
        },
      });

      return {
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
        countryName: updated.countryName,
      };
    }),
});

