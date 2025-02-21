"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const SkeletonMessageCard = () => {
  return (
    <Card className="card-bordered border-2 p-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="w-40 h-6 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
        <div className="text-sm mt-2">
          <Skeleton className="w-32 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-16" />
      </CardContent>
    </Card>
  );
};

export default SkeletonMessageCard;
