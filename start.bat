@echo off
setlocal

set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend

echo Starting backend window...
start "Backend (close to stop)" cmd /k "cd /d %BACKEND% && call venv\Scripts\activate && uvicorn app.main:app --reload"

echo Starting frontend window...
start "Frontend (close to stop)" cmd /k "cd /d %FRONTEND% && npm run dev"

echo Both backend and frontend windows are now running.
echo Close each of those windows to stop their processes.

