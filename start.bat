@echo off
echo ========================================
echo   幸运简历 - 启动脚本
echo ========================================
echo.

echo [1/2] 启动后端服务...
start "LuckyResume Server" cmd /k "cd /d D:\Code\LuckyResume\server && node index.js"

echo [2/2] 启动前端服务...
timeout /t 2 /nobreak >nul
start "LuckyResume Frontend" cmd /k "cd /d D:\Code\LuckyResume && npm run dev"

echo.
echo ========================================
echo   服务启动中...
echo   前端: http://localhost:3000
echo   后端: http://localhost:3001
echo ========================================
echo.
pause
