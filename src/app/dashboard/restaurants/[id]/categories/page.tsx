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
import { Skeleton } from "~/components/ui/skeleton";

export default function CategoriesPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; parentId: string | null } | null>(null);
  const [selectedParentForCreate, setSelectedParentForCreate] = useState<string | null>(null);
  const [createParentId, setCreateParentId] = useState<string>("__none__");
  const [editParentId, setEditParentId] = useState<string>("__none__");
  const [createCategoryName, setCreateCategoryName] = useState<string>("");
  const [editCategoryName, setEditCategoryName] = useState<string>("");

  const utils = api.useUtils();
  const { data: categories, isLoading: categoriesLoading } = api.category.getByRestaurant.useQuery({
    restaurantId,
  });

  const createMutation = api.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getByRestaurant.invalidate({ restaurantId });
      setIsCreateOpen(false);
      setSelectedParentForCreate(null);
      setCreateParentId("__none__");
      setCreateCategoryName("");
    },
  });

  const updateMutation = api.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.getByRestaurant.invalidate({ restaurantId });
      setIsEditOpen(false);
      setEditingCategory(null);
    },
  });

  const deleteMutation = api.category.delete.useMutation({
    onSuccess: async () => {
      await utils.category.getByRestaurant.invalidate({ restaurantId });
    },
  });

  const topLevelCategories = categories?.filter((cat) => !cat.parentId) || [];
  const subcategories = categories?.filter((cat) => cat.parentId) || [];

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = createCategoryName.trim();
    if (!name) return;
    
    const parentIdValue = createParentId;
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

    const name = editCategoryName.trim();
    if (!name) return;
    
    const parentIdValue = editParentId;
    const parentId = parentIdValue && parentIdValue !== "__none__" ? parentIdValue : null;

    updateMutation.mutate({
      id: editingCategory.id,
      name,
      parentId: parentId || undefined,
    });
  };

  const { data: restaurant } = api.restaurant.getById.useQuery({ id: restaurantId });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 sm:mb-6">
        <Link
          href={`/dashboard/restaurants/${restaurantId}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Back to {restaurant?.name || "Restaurant"}</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage menu categories</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setSelectedParentForCreate(null);
            setCreateParentId("__none__");
            setCreateCategoryName("");
          } else {
            setCreateParentId(selectedParentForCreate || "__none__");
          }
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto text-sm sm:text-base">+ Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md w-full">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                {selectedParentForCreate 
                  ? `Create Subcategory under "${topLevelCategories.find(c => c.id === selectedParentForCreate)?.name}"`
                  : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Category Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  className="text-sm sm:text-base"
                  value={createCategoryName}
                  onChange={(e) => setCreateCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-sm sm:text-base">Parent Category</Label>
                <Select 
                  value={createParentId}
                  onValueChange={setCreateParentId}
                >
                  <SelectTrigger className="text-sm sm:text-base">
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
                <input type="hidden" name="parentId" value={createParentId} />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Select a parent category to create a subcategory, or "None" for a top-level category
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || !createCategoryName.trim()} 
                className="text-sm sm:text-base w-full sm:w-auto"
              >
                {createMutation.isPending 
                  ? (selectedParentForCreate ? "Creating..." : "Creating...") 
                  : (selectedParentForCreate ? "Create Subcategory" : "Create Category")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hierarchical Category View */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">All Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {categoriesLoading ? (
            <div className="space-y-0">
              {/* Skeleton Loaders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <Skeleton className="h-4 w-32 sm:w-40" />
                      <Skeleton className="h-3 w-20 hidden sm:block" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                      <Skeleton className="h-8 w-24 sm:w-28" />
                      <Skeleton className="h-8 w-16 sm:w-20" />
                      <Skeleton className="h-8 w-16 sm:w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories && categories.length === 0 ? (
            <p className="text-center text-sm sm:text-base text-gray-500 py-8 px-4">No categories yet. Create your first category!</p>
          ) : (
            <div className="space-y-0">
              {/* Show main categories with their subcategories nested */}
              {topLevelCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((mainCategory) => {
                  const subcategories = categories?.filter(cat => cat.parentId === mainCategory.id) || [];
                  
                  return (
                    <div key={mainCategory.id} className="border-b border-gray-200 last:border-b-0">
                      {/* Main Category */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <span className="font-semibold text-sm sm:text-base text-gray-800 truncate">{mainCategory.name}</span>
                          <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">(Main Category)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedParentForCreate(mainCategory.id);
                              setIsCreateOpen(true);
                            }}
                            className="text-xs sm:text-sm flex-1 sm:flex-initial"
                          >
                            + Add Subcategory
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(mainCategory);
                              setEditCategoryName(mainCategory.name);
                              setEditParentId(mainCategory.parentId || "__none__");
                              setIsEditOpen(true);
                            }}
                            className="text-xs sm:text-sm flex-1 sm:flex-initial"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this category?")) {
                                deleteMutation.mutate({ id: mainCategory.id });
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="text-xs sm:text-sm flex-1 sm:flex-initial"
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Subcategories nested under parent */}
                      {subcategories.length > 0 && (
                        <div className="bg-gray-50/50">
                          {subcategories
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-3 pl-6 sm:pl-8 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                                  <span className="text-xs sm:text-sm text-gray-700 truncate">{subcategory.name}</span>
                                  <span className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0 hidden sm:inline">
                                    (Subcategory)
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingCategory(subcategory);
                                      setEditCategoryName(subcategory.name);
                                      setEditParentId(subcategory.parentId || "__none__");
                                      setIsEditOpen(true);
                                    }}
                                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this category?")) {
                                        deleteMutation.mutate({ id: subcategory.id });
                                      }
                                    }}
                                    disabled={deleteMutation.isPending}
                                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                                  >
                                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (open && editingCategory) {
          setEditParentId(editingCategory.parentId || "__none__");
          setEditCategoryName(editingCategory.name);
        } else {
          setEditCategoryName("");
        }
      }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm sm:text-base">Category Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  required
                  className="text-sm sm:text-base"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parentId" className="text-sm sm:text-base">Parent Category</Label>
                <Select 
                  value={editParentId}
                  onValueChange={setEditParentId}
                >
                  <SelectTrigger className="text-sm sm:text-base">
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
                <input type="hidden" name="parentId" value={editParentId} />
              </div>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending || !editCategoryName.trim()} 
                className="text-sm sm:text-base w-full sm:w-auto"
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

