@echo off
title Live Ubuntu Server Logs (Debug Mode)
cd /d "%~dp0"

:: Clear previous local debug log files
if exist debug_output.txt del debug_output.txt

set MY_PROJECT=gen-lang-client-0650816059

echo =================================================== >> debug_output.txt
echo  STARTING SCRIPT INITIALIZATION DIAGNOSTICS         >> debug_output.txt
echo =================================================== >> debug_output.txt

:loop
cls
echo ====================================================================================
echo   LIVE SERVER LOGS: %MY_PROJECT% (Auto-Refreshes every 10s)
echo ====================================================================================
echo.
echo [Checking for logs... System errors are being written to debug_output.txt]
echo.

:: The 2^>^&1 below forces all hidden console execution errors to save into the file
gcloud logging read "resource.type=gce_instance AND (logName=projects/%MY_PROJECT%/logs/syslog OR logName=projects/%MY_PROJECT%/logs/custom_server_activity)" --limit=15 --format="table(timestamp.date(tz=LOCAL):label=TIME, textPayload:label=LOG_ENTRY)" >> debug_output.txt 2>&1

echo.
echo ====================================================================================
echo   Press CTRL+C inside this window to close the monitor stream.
echo ====================================================================================

:: Use ping as a backup timer if the standard timeout command is crashing the loop
ping 127.0.0.1 -n 11 >nul 2>&1
goto loop
