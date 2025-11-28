import { api } from "~/trpc/server";
import { MenuView } from "./_components/menu-view";
import { notFound } from "next/navigation";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  try {
    const restaurant = await api.menu.getByRestaurantId({ restaurantId });
    return <MenuView restaurant={restaurant} />;
  } catch (error) {
    notFound();
  }
}

