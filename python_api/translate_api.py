from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import MarianMTModel, MarianTokenizer
import time

# 初始化 FastAPI 应用
app = FastAPI()

# 定义请求体的数据模型
class TranslationRequest(BaseModel):
    text: str

# 加载模型和分词器（启动时加载一次）
model_name = "Helsinki-NLP/opus-mt-en-zh"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# 翻译接口
@app.post("/translate")
async def translate_text(request: TranslationRequest):
    # 检查输入是否为空
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="输入文本不能为空！")

    # 记录开始时间
    start_time = time.time()

    # 翻译输入
    inputs = tokenizer(request.text, return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)

    # 计算耗时
    elapsed_time = time.time() - start_time

    # 返回翻译结果和耗时
    return {
        "translation": result,
        "elapsed_time": f"{elapsed_time:.3f} 秒"
    }



# pip install fastapi uvicorn transformers torch pydantic
# 启动 api:

# uvicorn translate_api:app --host 127.0.0.1 --port 8989
# 开机自动启动
r"""
1. 开机目录：
   C:\Users\Administrator\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup

2. 写个 bat 脚本：
"""














