import { useState, useEffect, useCallback } from 'react';

// データ構造の型定義
export interface HistoryItem {
  id: string; // session_id
  phase: string;
}

export interface ProjectWithHistories {
  name: string;
  histories: HistoryItem[];
}

export const useProject = () => {
  const [projects, setProjects] = useState<ProjectWithHistories[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);

  // プロジェクトとそれぞれの履歴をすべて取得する関数
  const fetchAllProjectsAndHistories = useCallback(async () => {
    try {
      const projectsRes = await fetch('http://localhost:8000/projects');
      if (!projectsRes.ok) {
        console.error('Failed to fetch projects');
        return;
      }
      const projectsData = await projectsRes.json();
      const projectNames: string[] = projectsData.projects;

      // 各プロジェクトの履歴を並行して取得
      const projectsWithHistories = await Promise.all(
        projectNames.map(async (name) => {
          const historiesRes = await fetch(`http://localhost:8000/projects/${name}/histories`);
          if (!historiesRes.ok) {
            console.error(`Failed to fetch histories for project: ${name}`);
            return { name, histories: [] };
          }
          const historiesData = await historiesRes.json();
          
          const histories: HistoryItem[] = historiesData.histories.map((filename: string) => {
            const parts = filename.replace('.json', '').split('_');
            const phase = parts[0];
            const id = parts.slice(1).join('_');
            return { id, phase };
          });

          return { name, histories };
        })
      );

      setProjects(projectsWithHistories);

    } catch (error) {
      console.error('Error fetching projects and histories:', error);
    }
  }, []);

  // 新しいプロジェクトを作成する関数
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await fetch('http://localhost:8000/create_project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: newProjectName }),
      });
      if (res.ok) {
        setNewProjectName('');
        setIsCreateProjectDialogOpen(false);
        fetchAllProjectsAndHistories(); // プロジェクト作成後に一覧を再取得
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // コンポーネントマウント時にプロジェクト一覧を取得
  useEffect(() => {
    fetchAllProjectsAndHistories();
  }, [fetchAllProjectsAndHistories]);

  // カスタムイベントをリッスンして履歴を更新
  useEffect(() => {
    const handleHistoryUpdate = () => {
      fetchAllProjectsAndHistories();
    };

    window.addEventListener('history-updated', handleHistoryUpdate);

    return () => {
      window.removeEventListener('history-updated', handleHistoryUpdate);
    };
  }, [fetchAllProjectsAndHistories]);

  // プロジェクトを削除する関数
  const deleteProject = async (projectName: string) => {
    try {
      const res = await fetch(`http://localhost:8000/projects/${projectName}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAllProjectsAndHistories(); // Refresh list
      } else {
        console.error(`Failed to delete project: ${projectName}`);
        // TODO: Add user-facing error notification
      }
    } catch (error) {
      console.error(`Error deleting project: ${projectName}`, error);
    }
  };

  // 履歴を削除する関数
  const deleteHistory = async (projectName: string, phase: string, sessionId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/projects/${projectName}/histories/${phase}/${sessionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAllProjectsAndHistories(); // Refresh list
      } else {
        console.error(`Failed to delete history: ${phase}_${sessionId}`);
        // TODO: Add user-facing error notification
      }
    } catch (error) {
      console.error(`Error deleting history: ${phase}_${sessionId}`, error);
    }
  };

  return {
    projects,
    newProjectName,
    setNewProjectName,
    isCreateProjectDialogOpen,
    setIsCreateProjectDialogOpen,
    handleCreateProject,
    fetchAllProjectsAndHistories,
    deleteProject,
    deleteHistory,
  };
};
