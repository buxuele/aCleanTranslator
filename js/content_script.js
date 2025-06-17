const BANNER_ID = "it-translation-banner";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[CS] 1. 收到来自后台的消息:', request); 
  if (request.type.startsWith("TRANSLATION_")) {
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
    const debugInfo = ``;

    contentHtml = `
      <div class="it-translated-text">${escapeHtml(payload.translatedText)}</div>
      <div class="it-original-text">${escapeHtml(payload.originalText)}</div>
      ${debugInfo} 
    `;
  } else {
    banner.classList.add("error");
    contentHtml = `<div class="it-translated-text">翻译失败，请稍后再试</div>`;
  }

  banner.innerHTML = `
    <button class="it-close-btn" title="关闭">×</button>
    ${contentHtml}
  `;
  
  document.body.appendChild(banner);

  banner.querySelector('.it-close-btn').addEventListener('click', () => {
    banner.remove();
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