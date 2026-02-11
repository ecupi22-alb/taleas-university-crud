@echo off
REM Start backend and frontend dev servers in separate cmd windows
REM Usage: double-click this file or run it from project root: start-dev.bat

REM Change drive and directory to script location
cd /d %~dp0

start "Backend" cmd /k "cd /d %~dp0backend && npm run dev"
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

exit /b 0
