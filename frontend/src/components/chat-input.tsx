// frontend/src/components/chat-input.tsx
import React from 'react';
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  phase: string;
  setPhase: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const phaseLists = [ "default", "creative", "analyst_with_search" ];

export const ChatInput: React.FC<ChatInputProps> = ({
  phase,
  setPhase,
  input,
  setInput,
  isLoading,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>

      <div className="flex flex-col rounded-2xl border shadow-lg bg-card p-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力してください..."
          disabled={isLoading}
          className="bg-transparent text-card-foreground resize-none border-none focus-visible:ring-0 shadow-none min-h-[50px] p-2"
        />

        <div className="flex items-center p-1">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-sm font-semibold text-muted-foreground px-3 h-8"
                >
                  {phase}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-40">
                <DropdownMenuLabel>Phase list</DropdownMenuLabel>
                <DropdownMenuSeparator />
                  {phaseLists.map((phaseOption) => (
                    <DropdownMenuItem
                      key={phaseOption}
                      onClick={() => setPhase(phaseOption)}
                    >
                    {phaseOption}
                  </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex-grow flex items-center justify-end space-x-2 text-sm text-muted-foreground mr-2">
            <span className="hidden sm:inline">Project: default</span>
            <Separator orientation="vertical" className="h-4" />
          </div>

          <Button
            type="submit"
            size="icon"
            className="rounded-full h-8 w-8"
            disabled={isLoading || !input.trim()}
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
