const TRANSLATE_API_URL = "http://127.0.0.1:8989/translate";

// ===================================================================
// START: 翻译函数
// ===================================================================
function translate(text) {
  const payload = {
    text: text
  };

  return fetch(TRANSLATE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`翻译服务器错误! 状态码: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.translation) {
      return data.translation;
    } else {
      console.error("[BG] 未预期的翻译API响应格式:", data);
      throw new Error('翻译服务返回了无效的数据格式。');
    }
  });
}

// ===================================================================
// 其他原有逻辑保持不变
// ===================================================================
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "immediately-translate",
    title: "立马翻译",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "immediately-translate" && info.selectionText) {
    const originalText = info.selectionText;

    // --- 日志点 1: 打印用户选择的词 ---
    console.log(`[BG] 1. 用户选择: "${originalText}"`);

    translate(originalText)
      .then(translatedText => {
        // --- 日志点 2: 打印从API得到的翻译结果 ---
        console.log(`[BG] 2. API 翻译结果: "${translatedText}"`);

        const message = {
          type: "TRANSLATION_SUCCESS",
          payload: { originalText, translatedText }
        };
        
        // --- 日志点 3: 打印即将发送给页面的完整消息 ---
        console.log('[BG] 3. 准备发送消息给内容脚本:', message);
        chrome.tabs.sendMessage(tab.id, message);

        saveToHistory({ originalText, translatedText, date: new Date().toISOString() });
      })
      .catch(error => {
        console.error("[BG] 翻译流程出错:", error.message);
        chrome.tabs.sendMessage(tab.id, {
          type: "TRANSLATION_ERROR",
          payload: { message: error.message }
        });
      });
  }
});

async function saveToHistory(record) {
  // --- 日志点 4: 打印即将保存到历史的记录 ---
  console.log('[BG] 4. 正在保存到历史记录:', record);
  try {
    const result = await chrome.storage.local.get(['translationHistory']);
    let history = result.translationHistory || [];

    if (history.length > 0 && history[0].originalText === record.originalText) {
      console.log('[BG] 此条记录已是最新，无需重复保存。');
      return;
    }
    
    history.unshift(record);

    if (history.length > 500) {
      history = history.slice(0, 500);
    }

    await chrome.storage.local.set({ translationHistory: history });
    console.log('[BG] 历史记录保存成功。');
  } catch (e) {
    console.error("[BG] 保存历史记录失败:", e);
  }
}