import { api } from "~/trpc/server";
import { MenuView } from "./_components/menu-view";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  // Force no caching to ensure fresh data on every request
  noStore();
  
  const { restaurantId } = await params;

  try {
    const restaurant = await api.menu.getByRestaurantId({ restaurantId });
    return <MenuView restaurant={restaurant} />;
  } catch (error) {
    notFound();
  }
}

