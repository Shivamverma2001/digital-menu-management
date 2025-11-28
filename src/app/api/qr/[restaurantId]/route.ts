import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const { restaurantId } = await params;
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const menuUrl = `${origin}/menu/${restaurantId}`;

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

