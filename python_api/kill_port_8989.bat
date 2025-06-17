@echo off
:: 设置日志文件路径
set LOGFILE=C:\Users\Administrator\Work\hugging_face\kill_port_log.txt
echo %date% %time% 开始关闭 8989 端口 >> %LOGFILE%

:: 查找占用 8989 端口的进程
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8989') do (
    echo %date% %time% 找到占用 8989 端口的进程 PID: %%a >> %LOGFILE%
    :: 强行终止进程
    taskkill /PID %%a /F
    if %ERRORLEVEL%==0 (
        echo %date% %time% 成功终止 PID %%a >> %LOGFILE%
    ) else (
        echo %date% %time% 错误：无法终止 PID %%a >> %LOGFILE%
        pause
        exit /b
    )
)

:: 检查端口是否已释放
netstat -aon | findstr :8989 >nul
if %ERRORLEVEL%==1 (
    echo %date% %time% 端口 8989 已成功释放 >> %LOGFILE%
) else (
    echo %date% %time% 错误：端口 8989 仍在使用 >> %LOGFILE%
    pause
    exit /b
)

echo %date% %time% 脚本执行完成 >> %LOGFILE%
pause