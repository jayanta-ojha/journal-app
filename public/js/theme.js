/**
 * Journal Application — Theme Management Engine
 * Prevents UI layout flashes by checking localStorage and system preferences early.
 */

(function () {
  const STORAGE_KEY = 'journal_theme';
  const THEME_ATTR = 'data-theme';

  /**
   * Determine the valid theme state string
   */
  function getSavedTheme() {
    // 1. Check if the user has explicitly chosen a theme previously
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // 2. Fall back to the system's preferred color scheme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  }

  /**
   * Apply the designated theme to the document element root
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
  }

  // Execute immediate theme setting before body injection to secure zero-flash rendering
  const activeTheme = getSavedTheme();
  applyTheme(activeTheme);

  // Set up event listeners after the DOM infrastructure initializes
  window.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Click handler to toggle between modes fluently
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
    });

    // Listen for system preference modifications natively
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });
})();