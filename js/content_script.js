const BANNER_ID = "it-translation-banner";

console.log('[CS] 内容脚本已加载并准备接收消息');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[CS] 1. 收到来自后台的消息:', request); 
  if (request.type && request.type.startsWith("TRANSLATION_")) {
    showTranslationBanner(request.type, request.payload);
  }
  return false;
});

function showTranslationBanner(type, payload) {
  const existingBanner = document.getElementById(BANNER_ID);
  if (existingBanner) existingBanner.remove();

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  
  let contentHtml = '';
  if (type === "TRANSLATION_SUCCESS") {
    contentHtml = `
      <div class="it-translated-text">${escapeHtml(payload.translatedText)}</div>
      <div class="it-original-text">${escapeHtml(payload.originalText)}</div>
    `;
  } else {
    banner.classList.add("error");
    contentHtml = `<div class="it-translated-text">翻译失败</div>`;
  }

  banner.innerHTML = `
    <button class="it-close-btn">×</button>
    ${contentHtml}
  `;
  
  document.body.appendChild(banner);

  const closeBtn = banner.querySelector('.it-close-btn');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    banner.remove();
  });

  document.addEventListener('click', function handleClickOutside(e) {
    if (!banner.contains(e.target)) {
      banner.remove();
      document.removeEventListener('click', handleClickOutside);
    }
  });
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}