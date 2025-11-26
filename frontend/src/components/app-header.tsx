// frontend/src/components/app-header.tsx
import * as React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MemoPad } from "./memo-pad";
import { NotebookPen } from "lucide-react";

interface AppHeaderProps {
  project: string | null;
  phase: string | null;
}

export function AppHeader({ project, phase }: AppHeaderProps) {
  const { state: sidebarState } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center bg-card md:rounded-tl-xl md:rounded-tr-xl gap-2">
      <div className="flex items-center gap-4 px-3">
        <SidebarTrigger className="" />
        {sidebarState === 'collapsed' && (
          <div className="text-lg text-muted-foreground font-semibold mb-1 pr-3">CASTOR - AI Pentest Assistant</div>
        )}
        {project && (
          <>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-base font-semibold text-blue-500">{project}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-base font-semibold text-blue-500">{phase}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>
      <div className="ml-auto pr-3 flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <NotebookPen className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-3/4 lg:w-1/2 xl:w-1/3 p-4">
            <SheetTitle className="pt-2 pl-2">Memo Pad</SheetTitle>
            <p className="text-xs text-muted-foreground pl-2">
              コマンド等をメモとして記録できます
            </p>
            <p className="text-xs text-muted-foreground text-start pl-2">
              内容は自動的に保存されます
            </p>
            <div className="py-2 h-full">
              <MemoPad />
            </div>
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </div>
    </header>
  );
}
