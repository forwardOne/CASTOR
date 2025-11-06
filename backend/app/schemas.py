from pydantic import BaseModel

# 同一名フィールドを扱うが、扱うオブジェクト数が異なるため複数クラスで定義している
class ChatRequest(BaseModel):
    project: str = "default_project"
    phase: str = "default"
    message: str

class HistoryRequest(BaseModel):
    project: str
    phase: str # filenameにするか迷い中

class CreateProjectRequest(BaseModel):
    project: str