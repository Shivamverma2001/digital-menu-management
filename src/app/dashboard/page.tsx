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
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.fullName}!</p>
        </div>
        <a
          href="/dashboard/restaurants/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + New Restaurant
        </a>
      </div>

      <RestaurantList restaurants={restaurants} />
    </div>
  );
}

