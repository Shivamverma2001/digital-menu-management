import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { env } from "~/env";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const { restaurantId } = await params;
  // Use NEXT_PUBLIC_APP_URL from environment, fallback to origin header, then localhost
  const baseUrl = env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";
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

