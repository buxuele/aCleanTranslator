@REM @echo off
@REM :: 切换到项目文件夹
@REM cd /d C:\Users\Administrator\Work\hugging_face
@REM
@REM :: 激活虚拟环境
@REM call C:\Users\Administrator\Work\hugging_face\hug_venv\Scripts\activate
@REM
@REM :: 切换到代码文件夹
@REM cd /d C:\Users\Administrator\Work\hugging_face\clean_translate_api
@REM
@REM :: 静默运行 Uvicorn
@REM @REM start /min uvicorn translate_api:app --host 127.0.0.1 --port 8989
@REM start /min uvicorn translate_api:app --host 127.0.0.1 --port 8989

@echo off
:: 设置日志文件路径
set LOGFILE=C:\Users\Administrator\Work\hugging_face\startup_log.txt
echo %date% %time% 启动脚本开始运行 >> %LOGFILE%

:: 确保切换到项目文件夹
cd /d "C:\Users\Administrator\Work\hugging_face" || (
    echo %date% %time% 错误：无法切换到 C:\Users\Administrator\Work\hugging_face >> %LOGFILE%
    exit /b
)
echo %date% %time% 成功切换到项目文件夹 >> %LOGFILE%

:: 检查并激活虚拟环境
if exist "C:\Users\Administrator\Work\hugging_face\hug_venv\Scripts\activate.bat" (
    call "C:\Users\Administrator\Work\hugging_face\hug_venv\Scripts\activate.bat"
    echo %date% %time% 虚拟环境激活成功 >> %LOGFILE%
) else (
    echo %date% %time% 错误：虚拟环境激活脚本不存在：C:\Users\Administrator\Work\hugging_face\hug_venv\Scripts\activate.bat >> %LOGFILE%
    exit /b
)
:: 切换到代码文件夹
cd /d "C:\Users\Administrator\Work\hugging_face\clean_translate_api" || (
    echo %date% %time% 错误：无法切换到 C:\Users\Administrator\Work\hugging_face\clean_translate_api >> %LOGFILE%
    exit /b
)
echo %date% %time% 成功切换到代码文件夹 >> %LOGFILE%

:: 检查 uvicorn 是否可用并静默运行
where uvicorn >nul 2>&1
if %ERRORLEVEL%==0 (
    start /min pythonw translate_api.pyw
    echo %date% %time% uvicorn 启动成功 >> %LOGFILE%
) else (
    echo %date% %time% 错误：uvicorn 未安装或未在虚拟环境中找到 >> %LOGFILE%
    exit /b
)