"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Restaurant {
  id: string;
  name: string;
  location: string;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface Dish {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  spiceLevel: number | null;
  dietaryType: string;
  price: number | null;
}

interface RestaurantManagementProps {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
  menuUrl: string;
  qrCodeUrl: string;
}

export function RestaurantManagement({
  restaurant,
  categories,
  dishes,
  menuUrl,
  qrCodeUrl,
}: RestaurantManagementProps) {
  // Client-side cache busting for QR code
  const [qrCodeUrlWithCache, setQrCodeUrlWithCache] = useState(qrCodeUrl);
  
  useEffect(() => {
    // Force fresh QR code on client side
    const freshUrl = `${qrCodeUrl}?t=${Date.now()}`;
    setQrCodeUrlWithCache(freshUrl);
  }, [qrCodeUrl]);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-sm sm:text-base text-gray-600">{restaurant.location}</p>
      </div>

      {/* QR Code and Share Link */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Share Menu</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
          <div>
            <label className="text-xs sm:text-sm font-medium mb-2 block">Menu URL</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={menuUrl}
                readOnly
                className="flex-1 px-3 py-2 text-xs sm:text-sm border rounded"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(menuUrl);
                }}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Copy
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-2 block">QR Code</label>
            <div className="flex justify-center sm:justify-start">
              <Image
                src={qrCodeUrlWithCache}
                alt="QR Code"
                width={200}
                height={200}
                className="border rounded w-32 h-32 sm:w-48 sm:h-48 md:w-52 md:h-52"
                unoptimized
                priority
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
            <Link href={`/dashboard/restaurants/${restaurant.id}/categories`}>
              <Button className="w-full text-sm sm:text-base">Manage Categories</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Dishes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {dishes.length} dish{dishes.length !== 1 ? "es" : ""}
            </p>
            <Link href={`/dashboard/restaurants/${restaurant.id}/dishes`}>
              <Button className="w-full text-sm sm:text-base">Manage Dishes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

