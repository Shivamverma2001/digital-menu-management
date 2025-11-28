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

export default function DishesPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const { data: dishes, refetch } = api.dish.getByRestaurant.useQuery({
    restaurantId,
  });

  const { data: categories } = api.category.getByRestaurant.useQuery({
    restaurantId,
  });

  const { data: restaurant } = api.restaurant.getById.useQuery({ id: restaurantId });

  const createMutation = api.dish.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateOpen(false);
      setCreateImageUrl("");
    },
  });

  const updateMutation = api.dish.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditOpen(false);
      setEditingDish(null);
      setEditImageUrl("");
    },
  });

  const deleteMutation = api.dish.delete.useMutation({
    onSuccess: () => {
      refetch();
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
    <div className="container mx-auto py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <Link
          href={`/dashboard/restaurants/${restaurantId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {restaurant?.name || "Restaurant"}</span>
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dishes</h1>
          <p className="text-gray-600">Manage menu items</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Dish</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Dish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dish Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <ImageUpload
                value={createImageUrl}
                onChange={setCreateImageUrl}
              />
              <input type="hidden" name="image" value={createImageUrl} />
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spiceLevel">Spice Level (0-3)</Label>
                  <Select name="spiceLevel">
                    <SelectTrigger>
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
                <Label htmlFor="dietaryType">Dietary Type *</Label>
                <Select name="dietaryType" defaultValue="vegetarian">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {categories?.map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-2">
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
              <Button type="submit" disabled={createMutation.isPending}>
                Create Dish
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dishes?.map((dish) => (
          <Card key={dish.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{dish.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingDish(dish);
                      setEditImageUrl(dish.image || "");
                      setIsEditOpen(true);
                    }}
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
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {dish.image && (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {dish.description || "No description"}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold">
                  {dish.price !== null ? `₹ ${dish.price.toFixed(0)}` : "---"}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      dish.dietaryType === "vegetarian" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {dish.spiceLevel !== null && dish.spiceLevel > 0 && (
                    <span className="text-red-500">
                      {Array(dish.spiceLevel).fill("🌶️").join("")}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Dish</DialogTitle>
          </DialogHeader>
          {editingDish && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Dish Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingDish.name}
                  required
                />
              </div>
              <ImageUpload
                value={editImageUrl}
                onChange={setEditImageUrl}
              />
              <input type="hidden" name="image" value={editImageUrl} />
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={editingDish.description || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingDish.price || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-spiceLevel">Spice Level</Label>
                  <Select name="spiceLevel" defaultValue={editingDish.spiceLevel?.toString() || "__none__"}>
                    <SelectTrigger>
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
                <Label htmlFor="edit-dietaryType">Dietary Type *</Label>
                <Select name="dietaryType" defaultValue={editingDish.dietaryType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {categories?.map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-2">
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
              <Button type="submit" disabled={updateMutation.isPending}>
                Update Dish
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

