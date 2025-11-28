"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "~/components/ui/dialog";

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
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex gap-3 items-start w-full">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {/* Dietary Indicator */}
            <div className={`w-2.5 h-2.5 rounded-full ${dietaryColor} flex-shrink-0`} />
            
            {/* Spice Level */}
            {dish.spiceLevel !== null && dish.spiceLevel > 0 && (
              <div className="flex gap-0.5">
                {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                  <span key={i} className="text-red-500 text-xs">🌶️</span>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{dish.name}</h3>
          
          <div className="text-sm font-bold text-gray-800 mb-1.5">
            {dish.price !== null ? `₹ ${Math.round(dish.price)}` : "---"}
          </div>

          {dish.description && (
            <div className="text-xs text-gray-600 leading-relaxed">
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
            <p className="text-xs text-gray-400">---</p>
          )}
        </div>

        {/* Right side - Image */}
        {dish.image && (
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
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

      {/* Image Modal */}
      {dish.image && (
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-2xl p-0">
            <div className="relative w-full aspect-square">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{dish.name}</h3>
              {dish.price !== null && (
                <p className="text-gray-600">₹ {Math.round(dish.price)}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

