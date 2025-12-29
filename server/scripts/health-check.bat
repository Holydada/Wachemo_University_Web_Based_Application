@echo off
REM ============================================
REM DATABASE HEALTH CHECK SCRIPT
REM ============================================

setlocal enabledelayedexpansion

set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set DB_NAME=wcu_digital_campus
set DB_USER=root

echo ============================================
echo WCU Digital Campus - Database Health Check
echo ============================================
echo.
echo Timestamp: %date% %time%
echo.

REM Check database connection
echo [1/5] Checking database connection...
echo SELECT 1; | "%MYSQL_PATH%" -u %DB_USER% -p %DB_NAME% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database connection successful
) else (
    echo [ERROR] Cannot connect to database
    pause
    exit /b 1
)

echo.
echo [2/5] Checking table status...
echo SHOW TABLE STATUS; | "%MYSQL_PATH%" -u %DB_USER% -p %DB_NAME% --table

echo.
echo [3/5] Checking database size...
echo SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = '%DB_NAME%' GROUP BY table_schema; | "%MYSQL_PATH%" -u %DB_USER% -p --table

echo.
echo [4/5] Checking index usage...
echo SELECT TABLE_NAME, INDEX_NAME, CARDINALITY FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = '%DB_NAME%' AND INDEX_NAME != 'PRIMARY' ORDER BY TABLE_NAME, INDEX_NAME; | "%MYSQL_PATH%" -u %DB_USER% -p --table

echo.
echo [5/5] Checking for missing indexes...
echo SELECT DISTINCT TABLE_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '%DB_NAME%' AND COLUMN_NAME IN ('user_id', 'student_id', 'course_id') AND TABLE_NAME NOT IN (SELECT DISTINCT TABLE_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = '%DB_NAME%'); | "%MYSQL_PATH%" -u %DB_USER% -p --table

echo.
echo ============================================
echo Health check completed
echo ============================================
pause
