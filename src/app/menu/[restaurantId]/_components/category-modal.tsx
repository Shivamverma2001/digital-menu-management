"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children: Category[];
  dishes: Array<{ dish: { id: string } }>;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryModal({
  isOpen,
  onClose,
  categories,
  onSelectCategory,
}: CategoryModalProps) {
  // Get top-level categories
  const topLevelCategories = categories.filter((cat) => !cat.parentId);

  const getItemCount = (category: Category): number => {
    // Count only direct dishes in this category
    return category.dishes.length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Menu Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {topLevelCategories.map((category) => {
            const subcategories = category.children || [];
            const hasSubcategories = subcategories.length > 0;
            const mainCategoryCount = getItemCount(category);

            return (
              <div key={category.id} className="space-y-1">
                {/* Main Category - Red, Bold Heading */}
                <div className="px-2 py-1 -mx-2 text-center">
                  <h3 className="font-bold text-red-600 text-base leading-tight">{category.name}</h3>
                </div>
                
                {/* Subcategories or Main Category with Count */}
                <div className="pl-4">
                  {hasSubcategories ? (
                    // Show subcategories if they exist
                    <div className="space-y-0.5">
                      {subcategories.map((subcategory) => {
                        const subCount = subcategory.dishes.length;
                        return (
                          <button
                            key={subcategory.id}
                            onClick={() => {
                              onSelectCategory(subcategory.id);
                            }}
                            className="w-full text-black hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded -mx-2 text-sm flex justify-between items-center"
                          >
                            <span className="text-left">{subcategory.name}</span>
                            <span className="text-right">{subCount}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Show main category with count if no subcategories
                    mainCategoryCount > 0 && (
                      <button
                        onClick={() => {
                          onSelectCategory(category.id);
                        }}
                        className="w-full text-black hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded -mx-2 text-sm flex justify-between items-center"
                      >
                        <span className="text-left">{category.name}</span>
                        <span className="text-right">{mainCategoryCount}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

