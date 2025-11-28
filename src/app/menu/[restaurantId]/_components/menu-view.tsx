"use client";

import { useState, useEffect, useRef } from "react";
import { MenuItem } from "./menu-item";
import { CategoryModal } from "./category-modal";
import { FloatingMenuButton } from "./floating-menu-button";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children: Category[];
  dishes: Array<{
    dish: {
      id: string;
      name: string;
      image: string | null;
      description: string | null;
      spiceLevel: number | null;
      dietaryType: string;
      price: number | null;
    };
  }>;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  categories: Category[];
}

export function MenuView({ restaurant }: { restaurant: Restaurant }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoryName, setCurrentCategoryName] = useState<string | null>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Parse restaurant name and location for header
  // Try to split by common patterns, otherwise use location field
  const nameParts = restaurant.name.split(" ");
  let mainName = restaurant.name;
  let locationPart = restaurant.location;

  // If name contains location-like words, try to split
  if (nameParts.length > 1) {
    // Check if last part looks like a location (common city names)
    const lastPart = nameParts[nameParts.length - 1];
    if (lastPart) {
    const commonCities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];
    if (commonCities.some(city => lastPart.toLowerCase().includes(city.toLowerCase()))) {
      mainName = nameParts.slice(0, -1).join(" ");
      locationPart = lastPart;
      }
    }
  }

  // Group dishes by main category only (hide subcategory names)
  const getCategoriesWithDishes = () => {
    // If a specific category is selected, show all dishes from that category (and subcategories if main)
    if (selectedCategoryId) {
      const selectedCategory = restaurant.categories.find((cat) => cat.id === selectedCategoryId);
      if (selectedCategory) {
        const mainCategory = selectedCategory.parentId
          ? restaurant.categories.find(cat => cat.id === selectedCategory.parentId)
          : selectedCategory;
        
        if (!mainCategory) return [];

        // Collect all dishes from main category and all its subcategories
        const allDishes: Array<{
          id: string;
          name: string;
          image: string | null;
          description: string | null;
          spiceLevel: number | null;
          dietaryType: string;
          price: number | null;
        }> = [];

        // Add dishes from main category
        mainCategory.dishes.forEach((dc) => {
          if (!allDishes.find(d => d.id === dc.dish.id)) {
            allDishes.push(dc.dish);
          }
        });

        // Add dishes from all subcategories
        mainCategory.children.forEach((subCategory) => {
          subCategory.dishes.forEach((dc) => {
            if (!allDishes.find(d => d.id === dc.dish.id)) {
              allDishes.push(dc.dish);
            }
          });
        });

        if (allDishes.length > 0) {
          return [{
            category: mainCategory,
            dishes: allDishes
          }];
        }
        return [];
      }
    }

    // Otherwise, group all dishes by main category only
    const topLevelCategories = restaurant.categories.filter((cat) => !cat.parentId);
    const categoriesWithDishes: Array<{
      category: Category;
      dishes: Array<{
        id: string;
        name: string;
        image: string | null;
        description: string | null;
        spiceLevel: number | null;
        dietaryType: string;
        price: number | null;
      }>;
    }> = [];

    // Process main categories - combine dishes from main category and all its subcategories
    topLevelCategories.forEach((mainCategory) => {
      const allDishes: Array<{
        id: string;
        name: string;
        image: string | null;
        description: string | null;
        spiceLevel: number | null;
        dietaryType: string;
        price: number | null;
      }> = [];

      // Add dishes from main category
      mainCategory.dishes.forEach((dc) => {
        if (!allDishes.find(d => d.id === dc.dish.id)) {
          allDishes.push(dc.dish);
        }
      });

      // Add dishes from all subcategories
      mainCategory.children.forEach((subCategory) => {
        subCategory.dishes.forEach((dc) => {
          if (!allDishes.find(d => d.id === dc.dish.id)) {
            allDishes.push(dc.dish);
          }
        });
      });

      // Only add if there are dishes
      if (allDishes.length > 0) {
        categoriesWithDishes.push({
          category: mainCategory,
          dishes: allDishes
        });
      }
    });

    return categoriesWithDishes;
  };

  const categoriesWithDishes = getCategoriesWithDishes();

  // Set up Intersection Observer to track which category is currently in view
  useEffect(() => {
    if (categoriesWithDishes.length === 0 || !scrollContainerRef.current) {
      // Set initial category name if available
      if (categoriesWithDishes.length > 0) {
        setCurrentCategoryName(categoriesWithDishes[0]?.category.name || null);
      }
      return;
    }

    const observers: IntersectionObserver[] = [];
    const options = {
      root: scrollContainerRef.current,
      rootMargin: "-100px 0px -60% 0px", // Trigger when category header is near the top of scroll container
      threshold: [0, 0.1, 0.5],
    };

    // Wait for refs to be set
    const timeoutId = setTimeout(() => {
      categoryRefs.current.forEach((element, categoryId) => {
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
              const category = categoriesWithDishes.find(
                (c) => c.category.id === categoryId
              );
              if (category) {
                setCurrentCategoryName(category.category.name);
              }
            }
          });
        }, options);

        observer.observe(element);
        observers.push(observer);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [categoriesWithDishes]);

  // Reset current category when selection changes
  useEffect(() => {
    if (selectedCategoryId && categoriesWithDishes.length > 0) {
      setCurrentCategoryName(categoriesWithDishes[0]?.category.name || null);
    } else if (!selectedCategoryId && categoriesWithDishes.length > 0) {
      setCurrentCategoryName(categoriesWithDishes[0]?.category.name || null);
    }
  }, [selectedCategoryId, categoriesWithDishes]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header - Fixed at top */}
      <header className="sticky top-0 z-20 bg-white border-b flex-shrink-0">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{mainName}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{locationPart}</p>
        </div>
        {/* Fixed Category Name - Shows currently viewed category */}
        {currentCategoryName && (
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
              <h2 className="text-sm sm:text-base font-bold text-gray-800 text-center">
                {currentCategoryName}
              </h2>
            </div>
          </div>
        )}
      </header>

      {/* Menu Items - Scrollable list */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 pb-20">
          {categoriesWithDishes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs sm:text-sm">
              No menu items available
            </div>
          ) : (
            <div className="bg-white">
              {categoriesWithDishes.map(({ category, dishes }) => {
                // Hide category header in list if it's currently shown in sticky header
                const isCurrentCategory = currentCategoryName === category.name;
                
                return (
                  <div
                    key={category.id}
                    ref={(el) => {
                      if (el) {
                        categoryRefs.current.set(category.id, el);
                      } else {
                        categoryRefs.current.delete(category.id);
                      }
                    }}
                  >
                    {/* Category Header - Only show if not currently in sticky header */}
                    {!isCurrentCategory && (
                      <div className="py-2 sm:py-3 text-center border-b border-gray-200">
                        <h2 className="text-sm sm:text-base font-bold text-gray-800">
                          {category.name}
                        </h2>
                      </div>
                    )}
                    
                    {/* Dishes in this category */}
                    {dishes.map((dish) => (
                      <MenuItem key={`${category.id}-${dish.id}`} dish={dish} />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Menu Button */}
      <FloatingMenuButton
        onClick={() => setIsModalOpen(true)}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={restaurant.categories}
        onSelectCategory={(categoryId) => {
          setSelectedCategoryId(categoryId);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

