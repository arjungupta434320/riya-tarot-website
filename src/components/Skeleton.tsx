export function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square mb-4 bg-primary/10 rounded-sm w-full"></div>
      
      {/* Text Skeletons */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-4 bg-primary/10 rounded-sm w-3/4"></div>
        <div className="h-4 bg-primary/10 rounded-sm w-1/4"></div>
      </div>
    </div>
  );
}

export function TextSkeleton({ width = "w-full", height = "h-4" }: { width?: string, height?: string }) {
  return <div className={`bg-primary/10 rounded-sm animate-pulse ${width} ${height}`}></div>;
}
