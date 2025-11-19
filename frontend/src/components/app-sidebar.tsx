import * as React from "react";
import { FolderPlus, SquarePen, Shield, Trash2, MoreHorizontal } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useProject } from "@/hooks/useProject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AppSidebarProps {
  startNewChat: (project: string, phase: string) => void;
  displayHistory: (project: string, phase: string, sessionId: string) => void;
  project: string | null; // Added
  resetChat: () => Promise<void>; // Added
}

type HistoryToDelete = { projectName: string; phase: string; sessionId: string } | null;

export function AppSidebar({ startNewChat, displayHistory, project, resetChat }: AppSidebarProps) {
  const {
    projects,
    newProjectName,
    setNewProjectName,
    isCreateProjectDialogOpen,
    setIsCreateProjectDialogOpen,
    handleCreateProject,
    deleteHistory,
  } = useProject();

  // For "New Chat" Dialog
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string>("");
  const [selectedPhase, setSelectedPhase] = React.useState<string>("default");

  // For Delete Confirmation Dialog
  const [historyToDelete, setHistoryToDelete] = React.useState<HistoryToDelete>(null);

  // For Home Alert Dialog
  const [isHomeAlertOpen, setIsHomeAlertOpen] = React.useState(false);

  const phaseLists = [
    "default", "1_Recon_Enumeration", "2_Vulnerability_Identification",
    "3_Exploitation Preparation", "4_Initial_Foothold", "5_Exploitation",
    "6_Privilege_Escalation", "7_Flag_Capture"
  ];

  const handleStartChat = () => {
    if (!selectedProject) {
      console.error("Project must be selected");
      return;
    }
    startNewChat(selectedProject, selectedPhase);
    setIsNewChatDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!historyToDelete) return;
    deleteHistory(historyToDelete.projectName, historyToDelete.phase, historyToDelete.sessionId);
    setHistoryToDelete(null);
  };

  const handleGoHome = () => {
    if (project) { // Use the project prop
      setIsHomeAlertOpen(true);
    } else {
      resetChat(); // Call resetChat directly if no active project
    }
  };

  const confirmGoHome = () => {
    resetChat();
    setIsHomeAlertOpen(false);
  };

  React.useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].name);
    }
  }, [projects, selectedProject]);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent className="bg-sidebar">
        <div
          className="group flex h-14 shrink-0 items-center justify-center gap-2 px-4 border-b border-border cursor-pointer"
          onClick={handleGoHome}
        >
          <Shield className="h-6 w-6 text-sidebar-foreground" />
          <span className="group-data-[state=collapsed]:hidden">
            <h1 className="inline-block text-xl font-bold text-sidebar-foreground">Castor</h1>
            <span className="ml-2 text-xs text-muted-foreground">ver1.0.1</span>
          </span>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full text-base justify-start" onClick={() => setIsNewChatDialogOpen(true)}>
                    <SquarePen className="mr-2 h-4 w-4" /> New Chat
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full text-base justify-start" onClick={() => setIsCreateProjectDialogOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" /> New Project
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="flex-1 overflow-y-auto">
          <SidebarGroupLabel className="text-sidebar-foreground">Histories</SidebarGroupLabel>
          <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No projects found.</p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {projects.map((projectData) => (
                  <AccordionItem key={projectData.name} value={projectData.name}>
                    <AccordionTrigger className="px-2 py-1.5 text-sm font-medium hover:no-underline">
                      {projectData.name}
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      {projectData.histories.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-2 py-1">No history.</p>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {projectData.histories.map((historyItem) => (
                            <div key={historyItem.id} className="flex items-center justify-between w-full pr-1 group">
                              <Button
                                variant="ghost"
                                className="flex-1 justify-start h-auto px-2 py-1 text-xs"
                                onClick={() => displayHistory(projectData.name, historyItem.phase, historyItem.id)}
                              >
                                <span className="truncate">{historyItem.phase}_{historyItem.id.substring(0, 8)}...</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" align="center">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent accordion from toggling
                                      setHistoryToDelete({
                                        projectName: projectData.name,
                                        phase: historyItem.phase,
                                        sessionId: historyItem.id,
                                      });
                                    }}
                                    className="text-red-500"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete History
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Enter a name for your new project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input id="newProjectName" placeholder="Project Name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Chat</DialogTitle>
            <DialogDescription>Select a project and a phase to begin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Project</p>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                <SelectContent>{projects.map((p) => (<SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Phase</p>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger><SelectValue placeholder="Select a phase" /></SelectTrigger>
                <SelectContent>{phaseLists.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStartChat}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!historyToDelete} onOpenChange={(isOpen) => !isOpen && setHistoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isHomeAlertOpen} onOpenChange={setIsHomeAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>セッションを終了しホーム画面に戻りますか？</AlertDialogTitle>
            <AlertDialogDescription>
              現在のチャットセッションは終了しますが、ヒストリーからいつでも再開できます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGoHome}>ホームに戻る</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}