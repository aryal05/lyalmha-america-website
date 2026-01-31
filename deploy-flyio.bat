@echo off
echo ========================================
echo   Fly.io Deployment Script
echo   Lyaymha America Backend
echo ========================================
echo.

cd backend

echo [Step 1/3] Checking Flyctl installation...
flyctl version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Flyctl is not installed!
    echo.
    echo Please install it first:
    echo   PowerShell: iwr https://fly.io/install.ps1 -useb ^| iex
    echo.
    pause
    exit /b 1
)
echo ✓ Flyctl is installed
echo.

echo [Step 2/3] Checking authentication...
flyctl auth whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo You are not logged in. Opening browser for authentication...
    flyctl auth login
    if %errorlevel% neq 0 (
        echo ERROR: Authentication failed
        pause
        exit /b 1
    )
)
echo ✓ Authenticated
echo.

echo [Step 3/3] Deploying to Fly.io...
flyctl deploy
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your API is now live at:
flyctl info --json | findstr "hostname"
echo.
echo Useful commands:
echo   flyctl logs          - View logs
echo   flyctl status        - Check status
echo   flyctl ssh console   - SSH into container
echo.
pause
