"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export default function CategoriesPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; parentId: string | null } | null>(null);
  const [selectedParentForCreate, setSelectedParentForCreate] = useState<string | null>(null);

  const { data: categories, refetch } = api.category.getByRestaurant.useQuery({
    restaurantId,
  });

  const createMutation = api.category.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateOpen(false);
      setSelectedParentForCreate(null);
    },
  });

  const updateMutation = api.category.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditOpen(false);
      setEditingCategory(null);
    },
  });

  const deleteMutation = api.category.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const topLevelCategories = categories?.filter((cat) => !cat.parentId) || [];
  const subcategories = categories?.filter((cat) => cat.parentId) || [];

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const parentIdValue = formData.get("parentId") as string;
    const parentId = parentIdValue && parentIdValue !== "__none__" ? parentIdValue : undefined;

    createMutation.mutate({
      restaurantId,
      name,
      parentId,
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const parentIdValue = formData.get("parentId") as string;
    const parentId = parentIdValue && parentIdValue !== "__none__" ? parentIdValue : null;

    updateMutation.mutate({
      id: editingCategory.id,
      name,
      parentId: parentId || undefined,
    });
  };

  const { data: restaurant } = api.restaurant.getById.useQuery({ id: restaurantId });

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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600">Manage menu categories</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setSelectedParentForCreate(null);
        }}>
          <DialogTrigger asChild>
            <Button>+ Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedParentForCreate 
                  ? `Create Subcategory under "${topLevelCategories.find(c => c.id === selectedParentForCreate)?.name}"`
                  : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select 
                  name="parentId" 
                  defaultValue={selectedParentForCreate || "__none__"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None (Top Level Category)</SelectItem>
                    {topLevelCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a parent category to create a subcategory, or "None" for a top-level category
                </p>
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {selectedParentForCreate ? "Create Subcategory" : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Complete Flat List View */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories && categories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No categories yet. Create your first category!</p>
          ) : (
            <div className="space-y-2">
              {/* Show all categories in one flat list - sorted: main categories first, then subcategories */}
              {categories
                ?.sort((a, b) => {
                  // Main categories first (parentId is null)
                  if (!a.parentId && b.parentId) return -1;
                  if (a.parentId && !b.parentId) return 1;
                  // If both are subcategories, group by parent
                  if (a.parentId && b.parentId) {
                    if (a.parentId === b.parentId) {
                      return a.name.localeCompare(b.name);
                    }
                    // Find parent names for sorting
                    const aParent = categories.find(c => c.id === a.parentId);
                    const bParent = categories.find(c => c.id === b.parentId);
                    if (aParent && bParent) {
                      return aParent.name.localeCompare(bParent.name);
                    }
                  }
                  // Main categories sorted alphabetically
                  return a.name.localeCompare(b.name);
                })
                .map((category) => {
                const isMainCategory = !category.parentId;
                const parentCategory = isMainCategory 
                  ? null 
                  : categories.find(cat => cat.id === category.parentId);
                
                return (
                  <div 
                    key={category.id} 
                    className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {isMainCategory ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <span className="font-semibold text-gray-800">{category.name}</span>
                          <span className="text-xs text-gray-500">(Main Category)</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{category.name}</span>
                          <span className="text-xs text-gray-400">
                            (Subcategory of {parentCategory?.name || "Unknown"})
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isMainCategory && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedParentForCreate(category.id);
                            setIsCreateOpen(true);
                          }}
                        >
                          + Add Subcategory
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this category?")) {
                            deleteMutation.mutate({ id: category.id });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingCategory.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parentId">Parent Category</Label>
                <Select name="parentId" defaultValue={editingCategory.parentId || "__none__"}>
                  <SelectTrigger>
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None (Top Level)</SelectItem>
                    {topLevelCategories
                      .filter((cat) => cat.id !== editingCategory.id)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                Update
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

