(function initGlobalTheme() {
  'use strict';
  try {
    const STORAGE_KEY = 'siteTheme';
    const root = document.documentElement;
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('ds-theme'); 
    // Default to light unless user has explicitly chosen
    const initial = saved === 'dark' || saved === 'light' ? saved : 'light';

    function applyTheme(mode) {
      const isDark = mode === 'dark';
      root.classList.toggle('dark', isDark);
      if (document.body) document.body.classList.toggle('dark', isDark);
      
      // Update browser UI theme color to match background
      try {
        const meta = document.querySelector('meta[name="theme-color"]') || (function () {
          const m = document.createElement('meta');
          m.name = 'theme-color';
          document.head.appendChild(m);
          return m;
        })();
        meta.setAttribute('content', isDark ? '#0b1220' : '#ffffff');
      } catch (_) {}
      
      try {
        localStorage.setItem(STORAGE_KEY, mode);
        localStorage.setItem('ds-theme', mode);
      } catch (_) {}
    }

    applyTheme(initial);

    // Build bottom-left preferences dock with Theme shortcut
    if (!document.getElementById('global-preferences-dock')) {
      const dock = document.createElement('div');
      dock.id = 'global-preferences-dock';
      Object.assign(dock.style, {
        position: 'fixed',
        left: '1rem',
        bottom: '1rem',
        zIndex: '9999',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      });

      // Theme button
      const themeBtn = document.createElement('button');
      themeBtn.id = 'global-theme-btn';
      themeBtn.type = 'button';
      themeBtn.title = 'Toggle theme';
      themeBtn.setAttribute('aria-label', 'Toggle color theme');
      themeBtn.setAttribute('aria-pressed', initial === 'dark' ? 'true' : 'false');
      
      // Inline styles for button (dark mode styles will be injected)
      Object.assign(themeBtn.style, {
        width: '44px',
        height: '44px',
        borderRadius: '9999px',
        cursor: 'pointer',
        border: '1px solid rgba(212,175,55,0.5)',
        background: 'rgba(255,255,255,0.9)',
        color: '#0A2540',
        fontWeight: '700',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'all 0.2s ease'
      });

      const updateThemeBtnIcon = () => {
        const dark = root.classList.contains('dark');
        themeBtn.textContent = dark ? '\u2600\uFE0F' : '\uD83C\uDF19';
        themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      };
      
      updateThemeBtnIcon();
      
      themeBtn.addEventListener('click', e => {
        e.preventDefault();
        const nowDark = !root.classList.contains('dark');
        applyTheme(nowDark ? 'dark' : 'light');
        updateThemeBtnIcon();
      });

      dock.appendChild(themeBtn);
      
      // Wait for body to exist before appending
      if (document.body) {
         document.body.appendChild(dock);
      } else {
         document.addEventListener('DOMContentLoaded', () => document.body.appendChild(dock));
      }
    }

    // Inject styles for the dark mode button state
    const darkStyle = document.createElement('style');
    darkStyle.setAttribute('data-global-dark-styles', 'true');
    darkStyle.textContent = `
      html.dark #global-preferences-dock #global-theme-btn { 
          background:rgba(17,34,64,0.9) !important; 
          color:#ffffff !important; 
          border-color:rgba(212,175,55,0.6) !important; 
      }
    `;
    document.head.appendChild(darkStyle);

  } catch (e) {
    console.error("Theme init failed", e);
  }
})();
