document.addEventListener('DOMContentLoaded', () => {
  const historyListEl = document.getElementById('history-list');
  const exportBtn = document.getElementById('export-json-btn');
  const clearBtn = document.getElementById('clear-history-btn');
  const translateBtn = document.getElementById('translate-btn');
  const inputText = document.getElementById('input-text');
  const resultText = document.getElementById('result-text');
  
  loadHistory();

  translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) return;

    translateBtn.textContent = '翻译中...';
    translateBtn.disabled = true;

    const response = await chrome.runtime.sendMessage({
      type: 'TRANSLATE_CN_TO_EN',
      text: text
    });

    if (response.success) {
      resultText.innerHTML = `
        <div class="result-content">${escapeHtml(response.translation)}</div>
        <button class="copy-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>复制</span>
        </button>
      `;
      resultText.classList.add('show');
      
      const copyBtn = resultText.querySelector('.copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(response.translation);
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>已复制</span>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>复制</span>
          `;
        }, 1500);
      });
    } else {
      resultText.innerHTML = '<div class="result-content">翻译失败: ' + escapeHtml(response.error) + '</div>';
      resultText.classList.add('show');
    }

    translateBtn.textContent = '翻译';
    translateBtn.disabled = false;
  });

  exportBtn.addEventListener('click', exportHistoryAsJSON);
  clearBtn.addEventListener('click', clearHistory);

  async function loadHistory() {
    const result = await chrome.storage.local.get(['translationHistory']);
    const history = result.translationHistory || [];

    console.log('[SIDEPANEL] 加载历史记录:', history);

    const emptyStateEl = document.getElementById('empty-state');
    if (emptyStateEl) emptyStateEl.remove();

    if (history.length === 0) {
      historyListEl.innerHTML = '<p id="empty-state" class="empty-state">还没有翻译历史</p>';
    } else {
      historyListEl.innerHTML = '';
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
          <div class="original">${escapeHtml(item.originalText)}</div>
          <div class="translated">${escapeHtml(item.translatedText)}</div>
        `;
        historyListEl.appendChild(div);
      });
    }
  }

  async function exportHistoryAsJSON() {
    const result = await chrome.storage.local.get(['translationHistory']);
    const history = result.translationHistory || [];
    
    if (history.length === 0) {
      alert('没有历史记录可以导出');
      return;
    }

    const vocabulary = history.map(item => ({
        "word": item.originalText,
        "translation": item.translatedText,
        "date_added": item.date
    }));

    const blob = new Blob([JSON.stringify(vocabulary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    await chrome.downloads.download({
      url: url,
      filename: `翻译历史_${new Date().toISOString().slice(0,10)}.json`,
      saveAs: true
    });

    URL.revokeObjectURL(url);
  }

  async function clearHistory() {
    if (confirm('确定要清空所有翻译历史吗？')) {
      await chrome.storage.local.remove('translationHistory');
      loadHistory();
    }
  }

  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
});
