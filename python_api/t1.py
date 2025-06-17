import time
from transformers import MarianMTModel, MarianTokenizer

# 加载模型和分词器
model_name = "Helsinki-NLP/opus-mt-en-zh"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# 进入循环，接收用户输入
while True:
    # 获取用户输入
    user_input = input("请输入要翻译的英文（输入 'q' 退出）：")

    # 检查是否退出
    if user_input.lower() == 'q':
        print("退出程序，拜拜！")
        break

    # 检查是否为空
    if not user_input.strip():
        print("输入不能为空，请重新输入！")
        continue

    # 记录开始时间
    start_time = time.time()

    # 翻译输入
    inputs = tokenizer(user_input, return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)

    # 记录结束时间并计算耗时
    end_time = time.time()
    elapsed_time = end_time - start_time

    # 输出翻译结果和耗时
    print(f"翻译结果：{result}")
    print(f"翻译耗时：{elapsed_time:.3f} 秒\n")