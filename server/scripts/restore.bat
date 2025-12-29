@echo off
REM ============================================
REM DATABASE RESTORE SCRIPT FOR WINDOWS
REM ============================================

setlocal enabledelayedexpansion

REM Configuration
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set DB_NAME=wcu_digital_campus
set DB_USER=root
set BACKUP_DIR=%~dp0..\backups

echo ============================================
echo WCU Digital Campus - Database Restore
echo ============================================
echo.

REM Check if backup directory exists
if not exist "%BACKUP_DIR%" (
    echo ERROR: Backup directory not found: %BACKUP_DIR%
    pause
    exit /b 1
)

REM List available backups
echo Available backups:
echo.
set COUNT=0
for %%F in ("%BACKUP_DIR%\*.zip") do (
    set /A COUNT+=1
    echo !COUNT!. %%~nxF - %%~tF
    set "BACKUP_!COUNT!=%%F"
)

if %COUNT% EQU 0 (
    echo No backup files found in %BACKUP_DIR%
    pause
    exit /b 1
)

echo.
set /P CHOICE="Enter backup number to restore (1-%COUNT%) or 0 to cancel: "

if "%CHOICE%"=="0" (
    echo Restore cancelled.
    pause
    exit /b 0
)

REM Validate choice
if %CHOICE% LSS 1 (
    echo Invalid choice!
    pause
    exit /b 1
)
if %CHOICE% GTR %COUNT% (
    echo Invalid choice!
    pause
    exit /b 1
)

REM Get selected backup
set BACKUP_FILE=!BACKUP_%CHOICE%!
echo.
echo Selected backup: %BACKUP_FILE%
echo.

REM Confirm restore
set /P CONFIRM="WARNING: This will replace all current data. Continue? (yes/no): "
if /I not "%CONFIRM%"=="yes" (
    echo Restore cancelled.
    pause
    exit /b 0
)

echo.
echo ============================================
echo Starting restore process...
echo ============================================
echo.

REM Extract backup
set TEMP_SQL=%BACKUP_DIR%\temp_restore.sql
echo Extracting backup...
powershell -Command "Expand-Archive -Path '%BACKUP_FILE%' -DestinationPath '%BACKUP_DIR%\temp' -Force"

REM Find SQL file in extracted folder
for %%F in ("%BACKUP_DIR%\temp\*.sql") do set TEMP_SQL=%%F

if not exist "%TEMP_SQL%" (
    echo ERROR: Could not find SQL file in backup!
    rmdir /S /Q "%BACKUP_DIR%\temp"
    pause
    exit /b 1
)

echo Restoring database...
"%MYSQL_PATH%" -u %DB_USER% -p < "%TEMP_SQL%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Restore completed successfully!
    echo ============================================
    echo Database: %DB_NAME%
    echo Restored from: %BACKUP_FILE%
    echo.
) else (
    echo.
    echo ============================================
    echo ERROR: Restore failed!
    echo ============================================
    rmdir /S /Q "%BACKUP_DIR%\temp"
    pause
    exit /b 1
)

REM Cleanup
rmdir /S /Q "%BACKUP_DIR%\temp"

echo Restore process completed at: %date% %time%
echo ============================================
pause
