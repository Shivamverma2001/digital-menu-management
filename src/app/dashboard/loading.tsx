import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 sm:h-9 w-48 mb-2" />
          <Skeleton className="h-4 sm:h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32 sm:w-40" />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader className="p-4 sm:p-6">
              <Skeleton className="h-6 sm:h-7 w-3/4 mb-2" />
              <Skeleton className="h-4 sm:h-5 w-1/2" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Skeleton className="h-3 sm:h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

