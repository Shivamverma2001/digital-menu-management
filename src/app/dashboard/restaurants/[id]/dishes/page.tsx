"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ImageUpload } from "~/components/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";

export default function DishesPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const utils = api.useUtils();
  const { data: dishes, isLoading: dishesLoading } = api.dish.getByRestaurant.useQuery({
    restaurantId,
  });

  const { data: categories, isLoading: categoriesLoading } = api.category.getByRestaurant.useQuery({
    restaurantId,
  });

  const { data: restaurant, isLoading: restaurantLoading } = api.restaurant.getById.useQuery({ id: restaurantId });

  const createMutation = api.dish.create.useMutation({
    onSuccess: async () => {
      await utils.dish.getByRestaurant.invalidate({ restaurantId });
      setIsCreateOpen(false);
      setCreateImageUrl("");
    },
  });

  const updateMutation = api.dish.update.useMutation({
    onSuccess: async () => {
      await utils.dish.getByRestaurant.invalidate({ restaurantId });
      setIsEditOpen(false);
      setEditingDish(null);
      setEditImageUrl("");
    },
  });

  const deleteMutation = api.dish.delete.useMutation({
    onSuccess: async () => {
      await utils.dish.getByRestaurant.invalidate({ restaurantId });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const image = createImageUrl || (formData.get("image") as string);
    const description = formData.get("description") as string;
    const spiceLevel = formData.get("spiceLevel") ? parseInt(formData.get("spiceLevel") as string) : undefined;
    const dietaryType = formData.get("dietaryType") as "vegetarian" | "non-vegetarian";
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined;
    const categoryIds = formData.getAll("categoryIds") as string[];

    createMutation.mutate({
      restaurantId,
      name,
      image: image || undefined,
      description: description || undefined,
      spiceLevel,
      dietaryType,
      price,
      categoryIds,
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDish) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const image = editImageUrl || (formData.get("image") as string);
    const description = formData.get("description") as string;
    const spiceLevelValue = formData.get("spiceLevel") as string;
    const spiceLevel = spiceLevelValue && spiceLevelValue !== "__none__" ? parseInt(spiceLevelValue) : null;
    const dietaryType = formData.get("dietaryType") as "vegetarian" | "non-vegetarian";
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
    const categoryIds = formData.getAll("categoryIds") as string[];

    updateMutation.mutate({
      id: editingDish.id,
      name,
      image: image || null,
      description: description || null,
      spiceLevel,
      dietaryType,
      price,
      categoryIds,
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 sm:mb-6">
        {restaurantLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <Link
            href={`/dashboard/restaurants/${restaurantId}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Back to {restaurant?.name || "Restaurant"}</span>
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dishes</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage menu items</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto text-sm sm:text-base">+ Add Dish</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Create Dish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Dish Name *</Label>
                <Input id="name" name="name" required className="text-sm sm:text-base" />
              </div>
              <ImageUpload
                value={createImageUrl}
                onChange={setCreateImageUrl}
              />
              <input type="hidden" name="image" value={createImageUrl} />
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                <Textarea id="description" name="description" rows={3} className="text-sm sm:text-base" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm sm:text-base">Price (₹)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" className="text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spiceLevel" className="text-sm sm:text-base">Spice Level (0-3)</Label>
                  <Select name="spiceLevel">
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - No spice</SelectItem>
                      <SelectItem value="1">1 - Mild</SelectItem>
                      <SelectItem value="2">2 - Medium</SelectItem>
                      <SelectItem value="3">3 - Hot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietaryType" className="text-sm sm:text-base">Dietary Type *</Label>
                <Select name="dietaryType" defaultValue="vegetarian">
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {categories?.map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-2 text-sm sm:text-base">
                      <input
                        type="checkbox"
                        name="categoryIds"
                        value={cat.id}
                        className="rounded"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="text-sm sm:text-base w-full sm:w-auto">
                {createMutation.isPending ? "Creating..." : "Create Dish"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {dishesLoading ? (
          // Skeleton Loaders
          [1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader className="p-4 sm:p-6">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Skeleton className="w-full h-40 sm:h-48 rounded mb-3 sm:mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          dishes?.map((dish) => (
          <Card key={dish.id} className="h-full">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base sm:text-lg flex-1">{dish.name}</CardTitle>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingDish(dish);
                      setEditImageUrl(dish.image || "");
                      setIsEditOpen(true);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        deleteMutation.mutate({ id: dish.id });
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-xs sm:text-sm"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {dish.image && (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={200}
                  height={200}
                  className="w-full h-40 sm:h-48 object-cover rounded mb-3 sm:mb-4"
                />
              )}
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                {dish.description || "No description"}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base">
                  {dish.price !== null ? `₹ ${dish.price.toFixed(0)}` : "---"}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                      dish.dietaryType === "vegetarian" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {dish.spiceLevel !== null && dish.spiceLevel > 0 && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {Array(dish.spiceLevel).fill("🌶️").join("")}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Dish</DialogTitle>
          </DialogHeader>
          {editingDish && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm sm:text-base">Dish Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingDish.name}
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              <ImageUpload
                value={editImageUrl}
                onChange={setEditImageUrl}
              />
              <input type="hidden" name="image" value={editImageUrl} />
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm sm:text-base">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={editingDish.description || ""}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-sm sm:text-base">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingDish.price || ""}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-spiceLevel" className="text-sm sm:text-base">Spice Level</Label>
                  <Select name="spiceLevel" defaultValue={editingDish.spiceLevel?.toString() || "__none__"}>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      <SelectItem value="0">0 - No spice</SelectItem>
                      <SelectItem value="1">1 - Mild</SelectItem>
                      <SelectItem value="2">2 - Medium</SelectItem>
                      <SelectItem value="3">3 - Hot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dietaryType" className="text-sm sm:text-base">Dietary Type *</Label>
                <Select name="dietaryType" defaultValue={editingDish.dietaryType}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {categories?.map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-2 text-sm sm:text-base">
                      <input
                        type="checkbox"
                        name="categoryIds"
                        value={cat.id}
                        defaultChecked={editingDish.categories?.some(
                          (dc: any) => dc.categoryId === cat.id
                        )}
                        className="rounded"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={updateMutation.isPending} className="text-sm sm:text-base w-full sm:w-auto">
                {updateMutation.isPending ? "Updating..." : "Update Dish"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

