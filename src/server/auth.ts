import { SignJWT, jwtVerify } from "jose";
import { env } from "~/env";
import { db } from "~/server/db";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const ALG = "HS256";

export interface SessionPayload {
  userId: string;
  email: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALG],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromSession(token: string | null) {
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      countryName: true,
    },
  });

  return user;
}

