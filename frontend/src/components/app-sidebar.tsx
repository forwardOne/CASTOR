import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { SidebarActions } from "./sidebar-actions";
import { ProjectHistoryList } from "./sidebar-historylist";

interface AppSidebarProps {
  startNewChat: (project: string, phase: string) => void;
  displayHistory: (project: string, phase: string, sessionId: string) => void;
  project: string | null;
  resetChat: () => Promise<void>;
}

export function AppSidebar({ startNewChat, displayHistory, project, resetChat }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent className="bg-muted">
        {/*
          SidebarHeader: サイドバーのヘッダー部分（ロゴ、タイトル、ホームに戻る機能）を扱います。
          - `project`: 現在アクティブなプロジェクト名（useChatから）。ホームに戻る際の確認ダイアログ表示判定に使用。
          - `resetChat`: チャットセッションをリセットする関数（useChatから）。
        */}
        <SidebarHeader project={project} resetChat={resetChat} />

        {/*
          SidebarActions: 「New Chat」と「New Project」ボタン、および関連するダイアログを扱います。
          - `startNewChat`: 新しいチャットセッションを開始する関数（useChatから）。
          - 内部で`useProject`フックを呼び出し、プロジェクト作成関連のロジックを処理します。
        */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarActions startNewChat={startNewChat} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/*
          ProjectHistoryList: プロジェクトと履歴のアコーディオンリストを表示し、履歴の削除機能を扱います。
          - `displayHistory`: 選択された履歴を表示する関数（useChatから）。
          - 内部で`useProject`フックを呼び出し、プロジェクトと履歴のデータ取得および削除ロジックを処理します。
        */}
        <ProjectHistoryList displayHistory={displayHistory} />
      </SidebarContent>
    </Sidebar>
  );
}