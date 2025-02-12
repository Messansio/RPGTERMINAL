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

REM Launch game with admin rights
powershell Start-Process cmd -ArgumentList '/k "cd /d "%GAME_DIR%" && title RPG Terminal && node game.js"' -Verb RunAs

REM Add pause to see any errors
if errorlevel 1 (
    echo Launch failed!
    pause
)