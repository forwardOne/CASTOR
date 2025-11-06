# backend/main.py
# Endpoint definitions for FastAPI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ChatRequest, HistoryRequest, CreateProjectRequest
from .chat_logic import init_chat, send_chat_message, reset_chat, apply_history_to_chat
from .storage_logic import (
    create_project, 
    load_history, 
    save_message, 
    get_projects_list, get_histories_list, 
    delete_project, delete_history
    )


# --- FastAPI ---
app = FastAPI()

# --- CORS(React/Vite) ---
origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Init and Session Persistence ---
init_chat() # from chat_logic


# --- Endpoints ---
@app.get("/")
def root():
    return {"message": "Castor Backend is running."}


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    メッセージ送信、応答取得、履歴保存
    send_chat_message
    save_message
    """
    try:
        response = await send_chat_message(request.message, phase=request.phase)
        
        save_message(request.project, request.phase, "user", request.message)
        save_message(request.project, request.phase, "model", response)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI応答エラー: {e}")


@app.post("/chat/resume")
async def resume_chat_endpoint(request: HistoryRequest):
    """
    セッション再開：履歴をGeminiに反映（APIに送信）
    load_history
    apply_history_to_chat
    """
    try:
        messages = load_history(request.project, request.phase)
        if not messages:
            return {"status": "no_history", "message": "履歴が存在しません"}

        await apply_history_to_chat(messages)
        return {"status": "resumed", "message_count": len(messages)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"セッション再開失敗: {e}")


@app.post("/chat/reset")
def reset_chat_endpoint():
    """
    チャットセッションをリセット
    reset_chat
    """
    reset_chat()
    return {"message": "Chat session has been reset."}


@app.post("/create_project")
def create_project_endpoint(request: CreateProjectRequest):
    """
    プロジェクト新規作成
    create_project
    """
    try:
        created = create_project(request.project)
        return {"created": created, "project": request.project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"プロジェクト作成に失敗: {e}")


@app.post("/load_history")
async def load_history_endpoint(request: HistoryRequest):
    """
    履歴ファイルの内容をロードしてフロントに返す（APIに送信しない）
    load_history
    """
    try:
        messages = load_history(request.project, request.phase)
        return {"history": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"履歴ロード失敗: {e}")


@app.get("/projects")
def get_projects_endpoint():
    """
    既存プロジェクト一覧を取得
    get_projects_list
    """
    try:
        return {"projects": get_projects_list()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"プロジェクト一覧の取得に失敗: {e}")


@app.get("/projects/{project}/histories")
def get_histories_endpoint(request: HistoryRequest):
    """
    指定プロジェクトの履歴ファイル一覧を取得
    get_histories_list
    """
    try:
        return {"histories": get_histories_list(request.project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"履歴一覧の取得に失敗: {e}")


@app.delete("/projects/{project}")
def remove_project_endpoint(project: str): #出来ればPydantic Modelで統一したい
    """
    指定プロジェクトフォルダを削除
    """
    try:
        deleted = delete_project(project)
        return {"deleted": deleted, "project": project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"プロジェクト削除に失敗: {e}")


@app.delete("/projects/{project}/histories/{filename}")
def remove_history_endpoint(project: str, filename: str): #出来ればPydantic Modelで統一したい
    """
    指定プロジェクト内の履歴ファイルを削除
    """
    try:
        deleted = delete_history(project, filename)
        return {"deleted": deleted, "file": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"履歴ファイル削除に失敗しました: {e}")