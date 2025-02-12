@echo off
echo Starting RPG Terminal...

REM Get current directory
set GAME_DIR=%~dp0
if not exist "%GAME_DIR%" (
    echo Error: Game directory not found!
    pause
    exit /b 1
)

cd /d "%GAME_DIR%"

REM Check for required programs
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check for git and updates
where git >nul 2>&1
if %errorlevel% equ 0 (
    echo Checking for updates...
    git pull
    if errorlevel 1 (
        echo Warning: Could not check for updates
        timeout /t 2 >nul
    ) else (
        echo Update check complete
        timeout /t 1 >nul
    )
) else (
    echo Git not found, skipping updates
    timeout /t 2 >nul
)

REM Launch game in current window
title RPG Terminal
node game.js

exit
