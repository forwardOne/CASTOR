import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header";
import { useChat } from "@/hooks/useChat";

function InnerLayout() {
  const chatState = useChat();
  const { project, phase, resetChat } = chatState;
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  const toggleHistoryVisibility = () => setIsHistoryVisible(prev => !prev);

  return (
    <div className="flex h-screen w-screen bg-muted font-notosansjp">
      <AppSidebar
        startNewChat={chatState.startNewChat}
        displayHistory={chatState.displayHistory}
        resetChat={resetChat}
        project={project}
        isHistoryVisible={isHistoryVisible}
        toggleHistoryVisibility={toggleHistoryVisibility}
      />
      <SidebarInset>
        <AppHeader project={project} phase={phase} />
        <main className="flex-1 overflow-hidden bg-card md:rounded-bl-xl md:rounded-br-xl">
          <Outlet context={chatState} />
        </main>
      </SidebarInset>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <InnerLayout />
    </SidebarProvider>
  );
}
