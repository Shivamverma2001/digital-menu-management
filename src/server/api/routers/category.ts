import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        name: z.string().min(1, "Category name is required"),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.user.id,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      // If parentId is provided, verify it exists and belongs to same restaurant
      if (input.parentId) {
        const parent = await ctx.db.category.findFirst({
          where: {
            id: input.parentId,
            restaurantId: input.restaurantId,
          },
        });

        if (!parent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent category not found",
          });
        }
      }

      const category = await ctx.db.category.create({
        data: {
          name: input.name,
          restaurantId: input.restaurantId,
          parentId: input.parentId,
        },
      });

      return category;
    }),

  getByRestaurant: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.user.id,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const categories = await ctx.db.category.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              dishes: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return categories;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        parentId: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: { id: input.id },
        include: {
          restaurant: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      if (category.restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this category",
        });
      }

      // If parentId is provided, verify it exists and belongs to same restaurant
      if (input.parentId) {
        const parent = await ctx.db.category.findFirst({
          where: {
            id: input.parentId,
            restaurantId: category.restaurantId,
          },
        });

        if (!parent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent category not found",
          });
        }
      }

      const updated = await ctx.db.category.update({
        where: { id: input.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.parentId !== undefined && { parentId: input.parentId }),
        },
      });

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: { id: input.id },
        include: {
          restaurant: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      if (category.restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this category",
        });
      }

      await ctx.db.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

