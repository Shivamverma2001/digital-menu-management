import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const { restaurantId } = await params;
  
  // Priority order for base URL:
  // 1. NEXT_PUBLIC_APP_URL (explicitly set in environment) - ALWAYS USE IF SET
  // 2. Host header from the request (most reliable in production)
  // 3. Vercel's x-vercel-url header
  // 4. Origin header (if not localhost)
  // 5. localhost (development fallback)
  
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const vercelUrl = request.headers.get("x-vercel-url");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  
  // Trim and validate env URL - if it exists and is not empty, use it
  let baseUrl = envUrl?.trim();
  
  // If env var is not set or empty, use the request's host (most reliable in production)
  if (!baseUrl || baseUrl === "") {
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      // Use https in production (Vercel always uses HTTPS)
      const protocol = forwardedProto || 
                      (host.includes("vercel.app") ? "https" : "http");
      baseUrl = `${protocol}://${host}`;
    } else {
      // Check Vercel's deployment URL header
      if (vercelUrl) {
        baseUrl = `https://${vercelUrl}`;
      } else {
        // Check origin header (if not localhost)
        if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
          baseUrl = origin;
        } else {
          baseUrl = "http://localhost:3000";
        }
      }
    }
  }
  
  const menuUrl = `${baseUrl}/menu/${restaurantId}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 300,
      margin: 2,
    });

    // Convert data URL to buffer
    const base64Data = qrCodeDataUrl.split(",")[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: "Failed to generate QR code" },
        { status: 500 }
      );
    }
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}

