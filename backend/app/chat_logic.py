# backend/chat_logic.py
# Gemini API Call by Google GenAI Python SDK
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from .storage_logic import load_history
import asyncio

load_dotenv()

# --- Gemini ---
GEMINI_MODEL = "gemini-2.5-flash"

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key or api_key == "YOUR_API_KEY_FROM_GOOGLE_AI_STUDIO":
    raise ValueError("APIキーが.envファイルに設定されていないか、無効です。")

client = genai.Client(api_key=api_key)
chat = None #global chat object
chat_lock = asyncio.Lock() #asyncio lock for chat object


# --- PromptConfigs ---
CONFIG_FILE_PATH = Path(__file__).parent.parent / "gemini_configs.json"
GEMINI_CONFIGS = {}
try:
    with open(CONFIG_FILE_PATH, 'r', encoding='utf-8') as f:
        GEMINI_CONFIGS = json.load(f)
    print("Gemini Configs loaded successfully.")
except FileNotFoundError:
    print(f"ERROR: Config file not found at {CONFIG_FILE_PATH}.")
except json.JSONDecodeError:
    print(f"ERROR: Config file is not valid JSON.")



# --- Definitions ---
def get_generation_content_config(phase: str):
    """
    フェーズに応じて、GenerateContentConfigを取得
    """
    config_data = GEMINI_CONFIGS.get(phase, GEMINI_CONFIGS.get("default", {}))
    tools_list = []
    if "google_search" in config_data.get("tools", []):
        tools_list.append(types.Tool(google_search=types.GoogleSearch()))

    generate_content_config = types.GenerateContentConfig(
        temperature=config_data.get("temperature", 0.5),
        thinking_config=types.ThinkingConfig(thinking_budget=-1),
        tools=tools_list,
        response_mime_type=config_data.get("response_mime_type", "text/plain"),
        system_instruction=config_data.get(
            "system_instruction",
            "あなたは丁寧で正確な情報を提供するアシスタントです。"
        ),
    )
    return generate_content_config


def init_chat():
    """
    チャットオブジェクト初期化
    """
    global chat
    chat = client.aio.chats.create(model=GEMINI_MODEL)
    print("Chat session initialized.")


def reset_chat():
    """
    チャットセッションリセット
    """
    global chat
    chat = client.aio.chats.create(model=GEMINI_MODEL)
    print("Chat session reset.")


async def apply_history_to_chat(project: str, phase: str):
    """
    保存されたチャット履歴をロード、セッションに反映（APIに送信）
    """
    global chat
    history = load_history(project, phase)
    async with chat_lock:
        for msg in history:
            role = msg["role"]
            text = msg["parts"][0] if "parts" in msg else msg["text"]

            # AI発話は chat.send_message で再構築
            if role == "user":
                await chat.send_message(text)
            elif role == "model":
                # モデル側は履歴にだけ反映（Geminiでは明示的送信不要）
                chat._history.append(types.Content(role="model", parts=[text]))

    print(f"History applied for project='{project}', phase='{phase}'.")


async def send_chat_message(message: str, phase: str = "default"):
    """
    メッセージ送信、応答取得
    """
    global chat
    config = get_generation_content_config(phase)
    async with chat_lock:
        response = await chat.send_message(message, config=config)
        return response.text



