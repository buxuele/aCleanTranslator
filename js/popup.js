/* /immediately-translate-extension/js/popup.js (完整最终版) */

document.addEventListener('DOMContentLoaded', () => {
  const historyListEl = document.getElementById('history-list');
  const exportBtn = document.getElementById('export-json-btn');
  const clearBtn = document.getElementById('clear-history-btn');
  
  loadHistory();

  exportBtn.addEventListener('click', exportHistoryAsJSON);
  clearBtn.addEventListener('click', clearHistory);

  async function loadHistory() {
    try {
      const result = await chrome.storage.local.get(['translationHistory']);
      const history = result.translationHistory || [];

      // --- 日志点 7: 打印从 storage 中加载的历史记录 ---
      console.log('[POPUP] 1. 从 storage 加载的历史记录:', history);

      // 确保在清空前获取 empty-state 元素
      const emptyStateEl = document.getElementById('empty-state');
      if (emptyStateEl) emptyStateEl.remove();

      if (history.length === 0) {
        historyListEl.innerHTML = '<p id="empty-state" class="empty-state">还没有翻译历史哦，快去试试吧！</p>';
      } else {
        historyListEl.innerHTML = '';
        history.forEach(item => {
          // --- 日志点 8: 打印正在渲染的每一条历史记录 ---
          console.log(`[POPUP] 2. 正在渲染条目: 原文="${item.originalText}", 译文="${item.translatedText}"`);
          const div = document.createElement('div');
          div.className = 'history-item';
          div.innerHTML = `
            <div class="original">${escapeHtml(item.originalText)}</div>
            <div class="translated">${escapeHtml(item.translatedText)}</div>
          `;
          historyListEl.appendChild(div);
        });
      }
    } catch (e) {
      console.error("[POPUP] 加载历史记录失败:", e);
      historyListEl.innerHTML = '<p class="empty-state error">加载历史记录失败。</p>';
    }
  }

  async function exportHistoryAsJSON() {
    const result = await chrome.storage.local.get(['translationHistory']);
    const history = result.translationHistory || [];
    
    if (history.length === 0) {
      alert('没有历史记录可以导出。');
      return;
    }

    const vocabulary = history.map(item => ({
        "word": item.originalText,
        "translation": item.translatedText,
        "date_added": item.date
    }));

    const blob = new Blob([JSON.stringify(vocabulary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    try {
      await chrome.downloads.download({
        url: url,
        filename: `立马翻译历史_${new Date().toISOString().slice(0,10)}.json`,
        saveAs: true
      });
    } catch(e) {
      console.error("导出失败:", e);
      alert("导出文件失败，请检查插件权限。");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function clearHistory() {
    if (confirm('确定要清空所有翻译历史吗？此操作不可恢复。')) {
      await chrome.storage.local.remove('translationHistory');
      loadHistory();
    }
  }

  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/'/g, "'");
  }
});