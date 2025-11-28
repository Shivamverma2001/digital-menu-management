"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
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

  const hasItems = (category: Category): boolean => {
    // Check if category has direct dishes
    if (category.dishes.length > 0) return true;
    
    // Check if any subcategory has dishes
    const subcategories = category.children || [];
    return subcategories.some(sub => sub.dishes.length > 0);
  };

  // Filter categories that have items
  const categoriesWithItems = topLevelCategories.filter(hasItems);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md w-full max-h-[80vh] overflow-y-auto p-0 left-[50%] top-[50%] gap-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6 pb-3 sm:pb-4">
          <DialogTitle className="text-base sm:text-lg">Menu Categories</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-2 sm:space-y-3">
          {categoriesWithItems.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No categories with items available</p>
          ) : (
            categoriesWithItems.map((category) => {
              const subcategories = category.children || [];
              const hasSubcategories = subcategories.length > 0;
              const mainCategoryCount = getItemCount(category);
              
              // Filter subcategories that have items
              const subcategoriesWithItems = subcategories.filter(sub => sub.dishes.length > 0);

              return (
                <div key={category.id} className="space-y-0.5 sm:space-y-1">
                  {/* Main Category - Red, Bold Heading */}
                  <div className="px-2 py-1 -mx-2 text-center">
                    <h3 className="font-bold text-red-600 text-sm sm:text-base leading-tight">{category.name}</h3>
                  </div>
                  
                  {/* Subcategories or Main Category with Count */}
                  <div className="pl-2 sm:pl-4">
                    {hasSubcategories && subcategoriesWithItems.length > 0 ? (
                      // Show subcategories if they exist and have items
                      <div className="space-y-0.5">
                        {subcategoriesWithItems.map((subcategory) => {
                          const subCount = subcategory.dishes.length;
                          return (
                            <button
                              key={subcategory.id}
                              onClick={() => {
                                onSelectCategory(subcategory.id);
                              }}
                              className="w-full text-black hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 sm:py-2 rounded -mx-2 text-xs sm:text-sm flex justify-between items-center transition-colors"
                            >
                              <span className="text-left">{subcategory.name}</span>
                              <span className="text-right font-medium">{subCount}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      // Show main category with count if no subcategories with items
                      mainCategoryCount > 0 && (
                        <button
                          onClick={() => {
                            onSelectCategory(category.id);
                          }}
                          className="w-full text-black hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 sm:py-2 rounded -mx-2 text-xs sm:text-sm flex justify-between items-center transition-colors"
                        >
                          <span className="text-left">{category.name}</span>
                          <span className="text-right font-medium">{mainCategoryCount}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

