// Al-Haq Assistant Frontend Logic
(function() {
  const CHATBOT_URL = window.ALHAQ_CHATBOT_URL || 'https://alhaq-hf-alhaq-website-chatbot.hf.space';
  const CHATBOT_SRC = CHATBOT_URL + (CHATBOT_URL.indexOf('?') === -1 ? '?' : '&') + '__theme=light&context=amnshield';

  document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
      #alhaq-chatbot-launcher{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:30px;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#fff;border:none;box-shadow:0 10px 25px rgba(29,78,216,0.3);cursor:pointer;z-index:999999;display:flex;align-items:center;justify-content:center;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s ease;}
      #alhaq-chatbot-launcher:hover{transform:scale(1.05) translateY(-2px);box-shadow:0 14px 30px rgba(29,78,216,0.4);}
      #alhaq-chatbot-launcher.open{transform:scale(0.9);background:#e2e8f0;color:#0f172a;box-shadow:0 4px 10px rgba(15,23,42,0.1);}
      #alhaq-chatbot-launcher svg{width:28px;height:28px;transition:opacity 0.2s ease;}
      #alhaq-chatbot-tip{position:fixed;bottom:36px;right:96px;background:#fff;color:#0f172a;padding:8px 14px;border-radius:8px;font-size:14px;font-weight:600;box-shadow:0 4px 15px rgba(15,23,42,0.08);opacity:0;pointer-events:none;transform:translateX(10px);transition:opacity 0.3s ease,transform 0.3s ease;z-index:999998;white-space:nowrap;border:1px solid #e2e8f0;}
      #alhaq-chatbot-launcher:hover + #alhaq-chatbot-tip,#alhaq-chatbot-launcher:focus-visible + #alhaq-chatbot-tip{opacity:1;transform:translateX(0);}
      #alhaq-chatbot-panel{position:fixed;bottom:100px;right:24px;width:400px;height:650px;max-height:calc(100vh - 120px);max-width:calc(100vw - 48px);background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(15,23,42,0.15);display:flex;flex-direction:column;overflow:hidden;z-index:999999;opacity:0;pointer-events:none;transform:translateY(20px) scale(0.98);transform-origin:bottom right;transition:opacity 0.3s ease,transform 0.3s cubic-bezier(0.2,0.8,0.2,1);border:1px solid #e2e8f0;}
      #alhaq-chatbot-panel.open{opacity:1;pointer-events:auto;transform:translateY(0) scale(1);}
      #alhaq-chatbot-panel.expanded{width:800px;height:80vh;max-width:calc(100vw - 48px);max-height:calc(100vh - 48px);bottom:24px;}
      #alhaq-chatbot-header{padding:16px 20px;background:#fff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
      .alhaq-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#fff;display:flex;align-items:center;justify-content:center;margin-right:12px;flex-shrink:0;}
      .alhaq-avatar svg{width:22px;height:22px;}
      .alhaq-meta{flex-grow:1;min-width:0;display:flex;flex-direction:column;}
      .alhaq-title{font-size:16px;font-weight:700;color:#0f172a;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:system-ui,-apple-system,sans-serif;}
      .alhaq-sub{font-size:12px;color:#64748b;margin-top:2px;}
      .alhaq-actions{display:flex;gap:4px;}
      .alhaq-actions button{background:transparent;border:none;color:#94a3b8;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.2s,color 0.2s;}
      .alhaq-actions button:hover{background:#f1f5f9;color:#0f172a;}
      .alhaq-actions button svg{width:20px;height:20px;}
      #alhaq-chatbot-body{flex-grow:1;position:relative;background:#fff;display:flex;flex-direction:column;}
      #alhaq-chatbot-frame{width:100%;height:100%;border:none;background:transparent;flex-grow:1;}
      #alhaq-chatbot-loading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;color:#64748b;font-size:14px;font-weight:500;z-index:2;}
      #alhaq-chatbot-loading.hidden{display:none;}
      .alhaq-spinner{width:30px;height:30px;border:3px solid #e2e8f0;border-top-color:#1d4ed8;border-radius:50%;animation:alhaq-spin 1s linear infinite;margin-bottom:12px;}
      @keyframes alhaq-spin{to{transform:rotate(360deg);}}
      #alhaq-chatbot-footer{padding:10px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
      #alhaq-chatbot-footer a{color:#64748b;text-decoration:none;font-weight:600;}
      #alhaq-chatbot-footer a:hover{color:#0f172a;text-decoration:underline;}
      @media (max-width:480px){
        #alhaq-chatbot-panel{width:100%;height:100%;max-width:none;max-height:none;bottom:0;right:0;border-radius:0;border:none;}
        #alhaq-chatbot-panel.expanded{width:100%;height:100%;}
        #alhaq-chatbot-launcher{bottom:16px;right:16px;}
        #alhaq-chatbot-tip{display:none;}
        #alhaq-chatbot-expand{display:none;}
      }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'alhaq-chatbot-launcher';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open Al-Haq Assistant chatbot');
    btn.setAttribute('aria-expanded', 'false');
    const ICON_CHAT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    const ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    btn.innerHTML = ICON_CHAT;

    const tip = document.createElement('div');
    tip.id = 'alhaq-chatbot-tip';
    tip.textContent = 'Ask the Al-Haq Assistant';

    const panel = document.createElement('div');
    panel.id = 'alhaq-chatbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Al-Haq Assistant');
    panel.innerHTML = `
      <div id="alhaq-chatbot-header">
        <div class="alhaq-avatar" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="alhaq-meta">
          <span class="alhaq-title">Al-Haq Assistant</span>
          <span class="alhaq-sub">Online &middot; AI Driven</span>
        </div>
        <div class="alhaq-actions">
          <button type="button" id="alhaq-chatbot-expand" aria-label="Expand or shrink chatbot" title="Expand">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
          <button type="button" id="alhaq-chatbot-close" aria-label="Close chatbot" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div id="alhaq-chatbot-body">
        <div id="alhaq-chatbot-loading">
          <div class="alhaq-spinner" aria-hidden="true"></div>
          <div>Loading the Assistant&hellip;</div>
        </div>
        <iframe id="alhaq-chatbot-frame" title="Al-Haq Assistant" loading="lazy" referrerpolicy="no-referrer" allow="clipboard-write"></iframe>
      </div>
      <div id="alhaq-chatbot-footer">
        <span>Powered by Al-Haq Studio</span>
        <a href="mailto:contact@alhaq.uk">Need a human?</a>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(tip);
    document.body.appendChild(panel);

    const frame = panel.querySelector('#alhaq-chatbot-frame');
    const loading = panel.querySelector('#alhaq-chatbot-loading');
    const expandBtn = panel.querySelector('#alhaq-chatbot-expand');
    let loaded = false;

    frame.addEventListener('load', function(){
      if (loaded) loading.classList.add('hidden');
    });

    function open(){
      if (!loaded) { frame.src = CHATBOT_SRC; loaded = true; }
      panel.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close Al-Haq Assistant chatbot');
      btn.innerHTML = ICON_CLOSE;
    }
    function close(){
      panel.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open Al-Haq Assistant chatbot');
      btn.innerHTML = ICON_CHAT;
    }
    btn.addEventListener('click', function(){
      if (panel.classList.contains('open')) close(); else open();
    });
    panel.querySelector('#alhaq-chatbot-close').addEventListener('click', close);
    expandBtn.addEventListener('click', function(){
      panel.classList.toggle('expanded');
    });
  });
})();
