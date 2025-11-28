"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  location: z.string().min(1, "Location is required"),
});

type RestaurantForm = z.infer<typeof restaurantSchema>;

export default function NewRestaurantPage() {
  const router = useRouter();
  const createMutation = api.restaurant.create.useMutation({
    onSuccess: (restaurant) => {
      router.push(`/dashboard/restaurants/${restaurant.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantForm>({
    resolver: zodResolver(restaurantSchema),
  });

  const onSubmit = async (data: RestaurantForm) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to create restaurant:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Create New Restaurant</CardTitle>
          <CardDescription className="text-sm sm:text-base">Add a new restaurant to manage</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Restaurant Name</Label>
              <Input
                id="name"
                placeholder="Super Restaurant"
                className="text-sm sm:text-base"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
              <Input
                id="location"
                placeholder="Mumbai"
                className="text-sm sm:text-base"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-xs sm:text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 text-sm sm:text-base"
              >
                {createMutation.isPending ? "Creating..." : "Create Restaurant"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

