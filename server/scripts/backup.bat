@echo off
REM ============================================
REM DATABASE BACKUP SCRIPT FOR WINDOWS
REM ============================================

setlocal enabledelayedexpansion

REM Configuration
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set MYSQLDUMP_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe
set DB_NAME=wcu_digital_campus
set DB_USER=root
set BACKUP_DIR=%~dp0..\backups
set TIMESTAMP=%date:~-4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=%BACKUP_DIR%\backup_%TIMESTAMP%.sql

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ============================================
echo WCU Digital Campus - Database Backup
echo ============================================
echo.
echo Backup started at: %date% %time%
echo Database: %DB_NAME%
echo Backup file: %BACKUP_FILE%
echo.

REM Perform backup
"%MYSQLDUMP_PATH%" -u %DB_USER% -p --databases %DB_NAME% --single-transaction --routines --triggers --events > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Backup completed successfully!
    echo ============================================
    echo File: %BACKUP_FILE%
    
    REM Get file size
    for %%A in ("%BACKUP_FILE%") do set SIZE=%%~zA
    echo Size: !SIZE! bytes
    echo.
    
    REM Compress backup
    echo Compressing backup...
    powershell -Command "Compress-Archive -Path '%BACKUP_FILE%' -DestinationPath '%BACKUP_FILE%.zip' -Force"
    
    if !ERRORLEVEL! EQU 0 (
        echo Backup compressed: %BACKUP_FILE%.zip
        del "%BACKUP_FILE%"
    )
    
    REM Clean old backups (keep last 7 days)
    echo.
    echo Cleaning old backups...
    forfiles /P "%BACKUP_DIR%" /M *.zip /D -7 /C "cmd /c del @path" 2>nul
    echo Old backups cleaned (kept last 7 days)
    
) else (
    echo.
    echo ============================================
    echo ERROR: Backup failed!
    echo ============================================
    exit /b 1
)

echo.
echo Backup process completed at: %date% %time%
echo ============================================
pause
