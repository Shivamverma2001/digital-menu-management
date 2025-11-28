import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { cookies, headers } from "next/headers";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext, sessionTokenStore } from "~/server/api/trpc";

const SESSION_COOKIE_NAME = "session-token";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const handler = async (req: NextRequest) => {
  // Generate request ID for tracking session tokens (must be consistent)
  const requestId = req.headers.get("x-request-id") || `${Date.now()}-${Math.random()}`;
  const headersWithId = new Headers(req.headers);
  headersWithId.set("x-request-id", requestId);
  
  const createContext = async () => {
    return createTRPCContext({
      headers: headersWithId,
    });
  };
  
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    onError: undefined,
  });

  // Read response body to ensure mutation completes
  // This ensures the mutation has finished executing before we check the Map
  const responseBody = await response.text();
  
  // Wait a bit more to ensure token is stored in Map
  await new Promise(resolve => setTimeout(resolve, 50));

  const responseHeaders = new Headers(response.headers);
  
  // Check Map for stored session token AFTER mutation completes;
  
  const storedToken = sessionTokenStore.get(requestId);
  
  if (storedToken) {
    const isProduction = env.NODE_ENV === "production";
    const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
    const cookieString = `${SESSION_COOKIE_NAME}=${storedToken}; Path=/; HttpOnly; ${
      isProduction ? "Secure; " : ""
    }SameSite=Lax; Max-Age=${maxAge}`;
    
    responseHeaders.set("Set-Cookie", cookieString);
    
    // Clean up stored token
    sessionTokenStore.delete(requestId);
  }

  // Return response with Set-Cookie header if token was stored
  return new Response(responseBody, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};

export { handler as GET, handler as POST };
