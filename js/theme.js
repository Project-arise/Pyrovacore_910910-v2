const STORAGE_KEY = 'pyrova-theme';
const DEFAULT_THEME = 'dark';

const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return DEFAULT_THEME;
}

function toggleTheme() {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

applyTheme(getPreferredTheme());

if (toggleBtn) {
  toggleBtn.addEventListener('click', toggleTheme);
}
