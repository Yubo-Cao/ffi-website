import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const MainEditorSkeleton = () => {
  return (
    <SidebarProvider>
      <div className="flex">
        <div className="p-4 border-r w-96 header-space">
          <Skeleton className="w-full h-8 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-3/4 h-6" />
                <div className="pl-4 space-y-2">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="w-5/6 h-4" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <main className="w-full pl-4 header-space">
          <div className="flex flex-row items-center gap-2">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Skeleton className="w-24 h-4" />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Skeleton className="w-32 h-4" />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mt-6 space-y-4">
            <Skeleton className="w-3/4 h-12" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
              <Skeleton className="w-4/6 h-4" />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainEditorSkeleton;
