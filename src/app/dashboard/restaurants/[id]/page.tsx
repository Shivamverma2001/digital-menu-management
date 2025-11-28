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

  // For QR code generation, always use localhost when running locally
  // The QR code API route will use NEXT_PUBLIC_APP_URL internally to generate the correct menu URL
  const isLocal = process.env.NODE_ENV === "development" || !process.env.VERCEL;
  const qrCodeOrigin = isLocal ? "http://localhost:3000" : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  
  // Menu URL should always use production URL (for sharing)
  const menuOrigin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const menuUrl = `${menuOrigin}/menu/${id}`;
  const qrCodeUrl = `${qrCodeOrigin}/api/qr/${id}`;

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

