"use client";

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
  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-gray-600">{restaurant.location}</p>
      </div>

      {/* QR Code and Share Link */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Menu URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={menuUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(menuUrl);
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">QR Code</label>
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={200}
              height={200}
              className="border rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
            <Link href={`/dashboard/restaurants/${restaurant.id}/categories`}>
              <Button className="w-full">Manage Categories</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {dishes.length} dish{dishes.length !== 1 ? "es" : ""}
            </p>
            <Link href={`/dashboard/restaurants/${restaurant.id}/dishes`}>
              <Button className="w-full">Manage Dishes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

