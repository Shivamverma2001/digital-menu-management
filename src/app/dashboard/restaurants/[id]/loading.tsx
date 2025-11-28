import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function RestaurantLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 sm:mb-6">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-6 sm:mb-8">
        <Skeleton className="h-8 sm:h-9 w-64 mb-2" />
        <Skeleton className="h-4 sm:h-5 w-48" />
      </div>

      {/* QR Code Card Skeleton */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="p-4 sm:p-6">
          <Skeleton className="h-6 sm:h-7 w-32" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="w-32 h-32 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="p-4 sm:p-6">
              <Skeleton className="h-6 sm:h-7 w-24" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

