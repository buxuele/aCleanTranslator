![1](./效果图/img1.png)
![2](./效果图/img2.png)

# 立马翻译 - Chrome 插件

Chrome 浏览器划词翻译插件，选中英文文本右键即时翻译成中文。

## 功能特性

- 划词翻译：选中文本右键翻译
- 悬浮面板：居中显示，点击空白关闭
- 历史记录：自动保存最近100条翻译
- 导出功能：可导出 JSON 格式

## 安装使用

### 1. 配置 API Key

访问 [Groq Console](https://console.groq.com/) 获取免费 API Key

复制 `js/config.example.js` 为 `js/config.js`，替换 API Key：
```javascript
const CONFIG = {
  GROQ_API_KEY: "your-api-key-here",
  GROQ_API_URL: "https://api.groq.com/openai/v1/chat/completions",
  MODEL: "openai/gpt-oss-120b"
};
```

### 2. 加载扩展

1. Chrome 地址栏输入 `chrome://extensions`
2. 开启右上角"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本项目文件夹

### 3. 使用

1. 打开任意网页
2. 选中英文文本
3. 右键点击"立马翻译"
4. 查看翻译结果

**重要**：首次使用或重新加载扩展后，需刷新页面（F5）

## 常见问题

### 翻译没反应？

刷新页面（F5），确认控制台（F12）看到：
```
[CS] 内容脚本已加载并准备接收消息
```

### 翻译失败？

检查 `js/background.js` 中的 API Key 是否正确

### 查看历史记录

点击浏览器工具栏的扩展图标

## 项目起源

- [起因](https://blog.csdn.net/waterHBO/article/details/148702167?spm=1001.2014.3001.5501)
- [过程](https://blog.csdn.net/waterHBO/article/details/148725898?spm=1001.2014.3001.5501)
