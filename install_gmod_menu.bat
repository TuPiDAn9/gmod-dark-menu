@echo off
setlocal EnableDelayedExpansion
mode con: cols=100 lines=20
color 0A
title Gmod Dark Menu

cls
echo.
echo.
echo.
echo.
echo.
echo                       ========================================================
echo                                  Gmod Dark Menu Installer/Updater
echo                                 github.com/TuPiDAn9/gmod-dark-menu
echo                       ========================================================
echo.
echo                               Press any key to start installation...
pause >nul

cls
set "GITHUB_OWNER=TuPiDAn9"
set "GITHUB_REPO=gmod-dark-menu"
set "ARCHIVE_NAME=gmod-dark-menu.zip"
set "DOWNLOAD_URL=https://github.com/%GITHUB_OWNER%/%GITHUB_REPO%/releases/latest/download/%ARCHIVE_NAME%"

echo.
echo    [1/5] Locating Steam installation...
echo.

set "STEAM_PATH="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH if exist "C:\Program Files (x86)\Steam" set "STEAM_PATH=C:\Program Files (x86)\Steam"

if not defined STEAM_PATH (
    echo    [ERROR] Steam not found automatically
    echo.
    set /p STEAM_PATH="    Enter Steam path manually: "
)

set "STEAM_PATH=!STEAM_PATH:/=\!"
set "GMOD_PATH=!STEAM_PATH!\steamapps\common\GarrysMod\garrysmod"

if not exist "!GMOD_PATH!" (
    echo    [ERROR] Garry's Mod not found at:
    echo    !GMOD_PATH!
    echo.
    set /p GMOD_PATH="    Enter garrysmod folder path manually: "
    if not exist "!GMOD_PATH!" (
        echo    [ERROR] Invalid path specified
        timeout /t 5 >nul
        exit /b 1
    )
)

echo    [OK] Found Garry's Mod installation
echo    Path: !GMOD_PATH!
timeout /t 2 >nul

cls
echo.
echo    [2/5] Preparing download...
echo.

set "TEMP_DIR=%TEMP%\gmod_menu_installer_%RANDOM%"
if not exist "!TEMP_DIR!" mkdir "!TEMP_DIR!"

echo    [OK] Ready to download
echo    URL: !DOWNLOAD_URL!
timeout /t 2 >nul

echo.
echo    [3/5] Downloading %ARCHIVE_NAME%...
echo.
echo    Please wait, this may take a moment...
echo.

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $web = New-Object Net.WebClient; $web.DownloadFile('%DOWNLOAD_URL%', '%TEMP_DIR%\%ARCHIVE_NAME%')" 2>nul

if errorlevel 1 (
    echo    [ERROR] Download failed
    echo    Check your internet connection
    timeout /t 5 >nul
    rd /s /q "!TEMP_DIR!" 2>nul
    exit /b 1
)

echo    [OK] Download completed successfully
timeout /t 2 >nul

echo.
echo    [4/5] Installing...
echo.
echo    Extracting files to: !GMOD_PATH!
echo.

powershell -Command "Expand-Archive -Path '%TEMP_DIR%\%ARCHIVE_NAME%' -DestinationPath '%GMOD_PATH%' -Force" 2>nul

if errorlevel 1 (
    echo    [ERROR] Installation failed
    timeout /t 5 >nul
    rd /s /q "!TEMP_DIR!" 2>nul
    exit /b 1
)

echo    [OK] Files installed successfully
timeout /t 2 >nul

echo.
echo    [5/5] Cleaning up temporary files...
echo.

rd /s /q "!TEMP_DIR!" 2>nul
echo    [OK] Cleanup completed
timeout /t 1 >nul

cls
echo.
echo                        ========================================================
echo                                        INSTALLATION COMPLETE
echo                        ========================================================
echo.
echo                                Repository:  %GITHUB_OWNER%/%GITHUB_REPO%
echo               Install Path: !GMOD_PATH!
echo.
echo                          Launch Garry's Mod to see your new dark theme menu!
echo.
echo                        ========================================================
echo.
echo                                       Press any key to exit...
pause >nul
exit /b 0
