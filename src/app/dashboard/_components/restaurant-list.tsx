import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface Restaurant {
  id: string;
  name: string;
  location: string;
  createdAt: Date;
}

export function RestaurantList({ restaurants }: { restaurants: Restaurant[] }) {
  if (restaurants.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center px-4 sm:px-6">
          <p className="text-sm sm:text-base text-gray-500">No restaurants yet. Create your first restaurant!</p>
          <Link
            href="/dashboard/restaurants/new"
            className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm sm:text-base text-white hover:bg-blue-700 transition-colors"
          >
            Create Restaurant
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <Link key={restaurant.id} href={`/dashboard/restaurants/${restaurant.id}`}>
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{restaurant.name}</CardTitle>
              <CardDescription className="text-sm sm:text-base">{restaurant.location}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Created {new Date(restaurant.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

