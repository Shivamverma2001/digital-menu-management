import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function CategoriesLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 sm:mb-6">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-7 sm:h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 sm:w-40" />
      </div>

      {/* Categories Card Skeleton */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <Skeleton className="h-6 sm:h-7 w-32" />
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="space-y-0">
            {[1, 2, 3, 4].map((i) => (
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
        </CardContent>
      </Card>
    </div>
  );
}

