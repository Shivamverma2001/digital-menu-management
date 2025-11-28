"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";

interface Dish {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  spiceLevel: number | null;
  dietaryType: string;
  price: number | null;
}

export function MenuItem({ dish }: { dish: Dish }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Case-insensitive check for vegetarian
  const isVegetarian = dish.dietaryType?.toLowerCase() === "vegetarian";
  const dietaryColor = isVegetarian ? "bg-green-500" : "bg-red-500";
  
  const shouldShowReadMore = dish.description && dish.description.length > 100;

  return (
    <>
      <div className="bg-white border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 flex gap-2 sm:gap-3 items-start w-full">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
            {/* Dietary Indicator */}
            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${dietaryColor} flex-shrink-0`} />
            
            {/* Spice Level */}
            {dish.spiceLevel !== null && dish.spiceLevel > 0 && (
              <div className="flex gap-0.5">
                {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                  <span key={i} className="text-red-500 text-[10px] sm:text-xs">🌶️</span>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5">{dish.name}</h3>
          
          <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-1.5">
            {dish.price !== null ? `₹ ${Math.round(dish.price)}` : "---"}
          </div>

          {dish.description && (
            <div className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
              {isDescriptionExpanded ? (
                <>
                  {dish.description}
                  {shouldShowReadMore && (
                    <button 
                      onClick={() => setIsDescriptionExpanded(false)}
                      className="text-blue-600 ml-1 hover:underline"
                    >
                      read less
                    </button>
                  )}
                </>
              ) : (
                <>
                  {dish.description.length > 100 ? (
                    <>
                      {dish.description.substring(0, 100)}
                      <button 
                        onClick={() => setIsDescriptionExpanded(true)}
                        className="text-blue-600 ml-1 hover:underline"
                      >
                        ...read more
                      </button>
                    </>
                  ) : (
                    dish.description
                  )}
                </>
              )}
            </div>
          )}
          {!dish.description && (
            <p className="text-[10px] sm:text-xs text-gray-400">---</p>
          )}
        </div>

        {/* Right side - Image */}
        {dish.image && (
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={dish.image}
              alt={dish.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </div>

      {/* Image Modal - Portrait Card Layout */}
      {dish.image && (
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg w-full p-0 left-[50%] top-[50%] gap-0">
            <DialogHeader className="sr-only">
              <DialogTitle>{dish.name}</DialogTitle>
              <DialogDescription>
                {dish.price !== null ? `Price: ₹${Math.round(dish.price)}` : "Dish image"}
              </DialogDescription>
            </DialogHeader>
            {/* Image Section - Takes full width */}
            <div className="w-full overflow-hidden pt-10 sm:pt-12">
              <div className="w-full aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center bg-gray-50">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) 28rem, 32rem"
                />
              </div>
            </div>
            {/* Content Section */}
            <div className="px-4 py-3 sm:px-5 sm:py-4">
              <h3 className="font-semibold text-base sm:text-lg mb-1">{dish.name}</h3>
              {dish.price !== null && (
                <p className="text-sm sm:text-base font-medium text-gray-800">₹ {Math.round(dish.price)}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

