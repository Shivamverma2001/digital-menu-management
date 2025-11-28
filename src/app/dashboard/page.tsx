import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { RestaurantList } from "./_components/restaurant-list";

export default async function DashboardPage() {
  const user = await api.auth.me();

  if (!user) {
    redirect("/login");
  }

  const restaurants = await api.restaurant.getAll();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back, {user.fullName}!</p>
        </div>
        <a
          href="/dashboard/restaurants/new"
          className="w-full sm:w-auto rounded bg-blue-600 px-4 py-2 text-sm sm:text-base text-white hover:bg-blue-700 text-center transition-colors"
        >
          + New Restaurant
        </a>
      </div>

      <RestaurantList restaurants={restaurants} />
    </div>
  );
}

