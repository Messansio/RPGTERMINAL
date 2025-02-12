@echo off
echo Starting game...

REM Set explicit path
set GAME_DIR=C:\Users\andre\OneDrive\Documenti\Universita\lab1\RPGTERMINAL

REM Check if directory exists
if not exist "%GAME_DIR%" (
    echo Error: Game directory not found!
    echo Path: %GAME_DIR%
    pause
    exit /b 1
)

REM Change to game directory
cd /d "%GAME_DIR%"

REM Check for updates
echo Checking for updates...
git pull
if errorlevel 1 (
    echo Warning: Could not check for updates
    timeout /t 3
) else (
    echo Update check complete
    timeout /t 2
)

REM Launch game with admin rights in Windows Terminal
powershell Start-Process wt -ArgumentList '-d "%GAME_DIR%" cmd /k "title RPG Terminal && node game.js"' -Verb RunAs

REM Add pause to see any errors
if errorlevel 1 (
    echo Launch failed!
    pause
)