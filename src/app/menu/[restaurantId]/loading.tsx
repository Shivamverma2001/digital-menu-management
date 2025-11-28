import { Skeleton } from "~/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 bg-white border-b flex-shrink-0">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <Skeleton className="h-6 sm:h-7 w-48 mb-1" />
          <Skeleton className="h-3 sm:h-4 w-32" />
        </div>
      </header>

      {/* Menu Items Skeleton */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 pb-20">
          <div className="bg-white">
            {[1, 2, 3].map((categoryIndex) => (
              <div key={categoryIndex}>
                {/* Category Header Skeleton */}
                <div className="py-2 sm:py-3 text-center border-b border-gray-200">
                  <Skeleton className="h-4 sm:h-5 w-32 mx-auto" />
                </div>
                
                {/* Menu Items Skeleton */}
                {[1, 2, 3, 4].map((itemIndex) => (
                  <div
                    key={itemIndex}
                    className="border-b border-gray-100 last:border-b-0 px-2 sm:px-4 py-2 sm:py-3"
                  >
                    <div className="flex gap-2 sm:gap-3">
                      <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Skeleton className="h-4 sm:h-5 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-3/4 mb-2" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Button Skeleton */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10">
        <Skeleton className="h-12 sm:h-14 w-24 sm:w-28 rounded-full" />
      </div>
    </div>
  );
}

