import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { RestaurantManagement } from "./_components/restaurant-management";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await api.auth.me();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const restaurant = await api.restaurant.getById({ id });
  const categories = await api.category.getByRestaurant({ restaurantId: id });
  const dishes = await api.dish.getByRestaurant({ restaurantId: id });

  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const menuUrl = `${origin}/menu/${id}`;
  const qrCodeUrl = `${origin}/api/qr/${id}`;

  return (
    <RestaurantManagement
      restaurant={restaurant}
      categories={categories}
      dishes={dishes}
      menuUrl={menuUrl}
      qrCodeUrl={qrCodeUrl}
    />
  );
}

