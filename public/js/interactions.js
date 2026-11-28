// Efeito de onda ao clicar em botões e links de navegação
const RIPPLE_TARGETS = '.btn, .link-button, .site-nav__list a, .lesson-list a';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('click', (event) => {
  const target = event.target.closest(RIPPLE_TARGETS);
  if (!target || reduceMotion.matches) return;

  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});
