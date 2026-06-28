/**
 * AmnShield Guide — Interactive Tutorial Logic
 * - Intersection Observer for scroll-synced phone transitions
 * - SpeechSynthesis narration with toggle
 * - Progress dot navigation
 */

(function () {
  'use strict';

  // ─── Step Data ───────────────────────────────────────────────
  const STEPS = [
    {
      id: 'step-home',
      narration: 'The Home dashboard shows your protection status at a glance. You can see which features are active, today\'s screen time, and quick-access chips to configure each feature.'
    },
    {
      id: 'step-blocks',
      narration: 'The Blocks screen is your control centre. Toggle App Blocker, Keyword Filter, Website Blocker, and Focus Mode on or off. Advanced rules like cheat hours and block schedules give you fine-grained control.'
    },
    {
      id: 'step-keywords',
      narration: 'The Keyword Blocker lets you add specific words to your blocklist. When any keyword appears on screen, AmnShield instantly blocks the view or navigates back. All detection runs on-device.'
    },
    {
      id: 'step-focus',
      narration: 'Focus Mode locks down distracting apps for a set duration. Choose your timer, select which apps to block, and start a focused session. Track your earned focus minutes over time.'
    },
    {
      id: 'step-stats',
      narration: 'Usage Stats give you clear data: daily screen time, your most-used apps, reels scrolled, and blocking events. All data stays on your device and is never sent to any server.'
    },
    {
      id: 'step-settings',
      narration: 'Settings lets you customise your experience. Choose from five visual themes, enable anti-uninstall protection, configure notifications, manage error reporting, and access your privacy controls.'
    }
  ];

  let currentStep = 0;
  let narrationEnabled = false;
  let synth = null;
  let currentUtterance = null;

  // ─── DOM Ready ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    synth = window.speechSynthesis || null;
    setupIntersectionObserver();
    setupVoiceoverToggle();
    setupProgressDots();
    restoreNarrationPreference();
  }

  // ─── Intersection Observer ───────────────────────────────────
  function setupIntersectionObserver() {
    const stepElements = document.querySelectorAll('.guide-step');
    const screenSlides = document.querySelectorAll('.screen-slide');

    if (!stepElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add in-view class for fade-in
            entry.target.classList.add('in-view');

            // Find which step index this is
            const stepIndex = Array.from(stepElements).indexOf(entry.target);
            if (stepIndex !== -1 && stepIndex !== currentStep) {
              currentStep = stepIndex;
              activateScreen(stepIndex, screenSlides);
              updateProgressDots(stepIndex);

              // Narrate if enabled
              if (narrationEnabled && STEPS[stepIndex]) {
                speak(STEPS[stepIndex].narration);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
      }
    );

    stepElements.forEach((el) => observer.observe(el));
  }

  // ─── Screen Transitions ──────────────────────────────────────
  function activateScreen(index, slides) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  // ─── Progress Dots ───────────────────────────────────────────
  function setupProgressDots() {
    const dotsContainer = document.querySelector('.guide-progress');
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const targetStep = document.getElementById(STEPS[i].id);
        if (targetStep) {
          targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  function updateProgressDots(index) {
    const dots = document.querySelectorAll('.guide-progress .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // ─── Voiceover / SpeechSynthesis ─────────────────────────────
  function setupVoiceoverToggle() {
    const toggleBtn = document.getElementById('voiceover-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      narrationEnabled = !narrationEnabled;
      toggleBtn.setAttribute('aria-pressed', narrationEnabled.toString());

      // Save preference
      try {
        localStorage.setItem('amnshield-guide-narration', narrationEnabled ? '1' : '0');
      } catch (e) { /* storage unavailable */ }

      if (narrationEnabled) {
        // Speak current step
        if (STEPS[currentStep]) {
          speak(STEPS[currentStep].narration);
        }
      } else {
        stopSpeaking();
      }
    });
  }

  function restoreNarrationPreference() {
    try {
      const pref = localStorage.getItem('amnshield-guide-narration');
      if (pref === '1') {
        narrationEnabled = true;
        const toggleBtn = document.getElementById('voiceover-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'true');
      }
    } catch (e) { /* storage unavailable */ }
  }

  function speak(text) {
    if (!synth) return;

    // Cancel any current speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to pick a natural English voice
    const voices = synth.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;

    currentUtterance = utterance;
    synth.speak(utterance);
  }

  function stopSpeaking() {
    if (synth) synth.cancel();
    currentUtterance = null;
  }

  // Ensure voices are loaded (some browsers fire this async)
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function () {
      // Voices now available
    };
  }
})();
