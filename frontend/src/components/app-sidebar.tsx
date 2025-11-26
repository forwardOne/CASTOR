// frontend/src/components/app-sidebar.tsx
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { SidebarActions } from "./sidebar-actions";
import { ProjectHistoryList } from "./sidebar-historylist";



interface AppSidebarProps {
  startNewChat: (project: string, phase: string) => void;
  displayHistory: (project: string, phase: string, sessionId: string) => void;
  project: string | null;
  resetChat: () => Promise<void>;
  isHistoryVisible: boolean;
  toggleHistoryVisibility: () => void;
}

export function AppSidebar({
  startNewChat,
  displayHistory,
  project,
  resetChat,
  isHistoryVisible,
  toggleHistoryVisibility,
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-muted">
      <SidebarHeader project={project} resetChat={resetChat} />
      <SidebarContent className="bg-muted">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarActions
              startNewChat={startNewChat}
              isHistoryVisible={isHistoryVisible}
              toggleHistoryVisibility={toggleHistoryVisibility}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {isHistoryVisible && <ProjectHistoryList displayHistory={displayHistory} />}
      </SidebarContent>
      <SidebarFooter className="bg-muted border-t border-border p-2">
      </SidebarFooter>
    </Sidebar>
  );
}