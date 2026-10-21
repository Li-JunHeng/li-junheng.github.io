'use strict';

const themeContent = {
  provenance: { copy: 'Tracing the influence of LLM supervision through observable model behavior.', href: '#research' },
  generation: { copy: 'Using visual planning and render feedback to guide educational animation generation.', href: '#research' },
  discovery: { copy: 'Connecting literature, hypotheses, and experiments in autonomous research workflows.', href: '#systems' }
};

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButtons = [...document.querySelectorAll('[data-theme]')];
let themeAnimation;

function updateTheme(theme, focus = false) {
  if (!Object.hasOwn(themeContent, theme)) return;
  themeButtons.forEach(button => {
    const selected = button.dataset.theme === theme;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  document.querySelectorAll('[data-node]').forEach(node => node.classList.toggle('is-active', node.dataset.node === theme));
  document.querySelector('[data-theme-copy]').textContent = themeContent[theme].copy;
  document.querySelector('[data-theme-link]').setAttribute('href', themeContent[theme].href);
  const panel = document.querySelector('#theme-detail');
  panel.setAttribute('aria-labelledby', `theme-${theme}`);
  if (!motionPreference.matches && typeof panel.animate === 'function') {
    themeAnimation?.cancel();
    themeAnimation = panel.animate([
      { opacity: 0.35, transform: 'translateY(5px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}

themeButtons.forEach((button, index) => {
  button.addEventListener('click', () => updateTheme(button.dataset.theme));
  button.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % themeButtons.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + themeButtons.length) % themeButtons.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = themeButtons.length - 1;
    if (target !== undefined) {
      event.preventDefault();
      updateTheme(themeButtons[target].dataset.theme, true);
    }
  });
});
updateTheme('provenance');

document.querySelectorAll('.paper-visual svg path').forEach((path, index) => {
  path.classList.add('diagram-trace');
  path.setAttribute('pathLength', '1');
  path.style.setProperty('--trace-delay', `${(index % 5) * 90}ms`);
});

const revealTargets = [...document.querySelectorAll('[data-reveal]')];
let revealObserver;
function syncMotionPreference() {
  revealObserver?.disconnect();
  const canAnimate = !motionPreference.matches && 'IntersectionObserver' in window;
  document.body.classList.toggle('motion-ready', canAnimate);
  if (!canAnimate) {
    themeAnimation?.cancel();
    revealTargets.forEach(target => target.classList.add('is-visible'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  revealTargets.forEach(target => revealObserver.observe(target));
}
syncMotionPreference();
motionPreference.addEventListener('change', syncMotionPreference);

requestAnimationFrame(() => document.body.classList.add('is-loaded'));

const progress = document.querySelector('.reading-progress > span');
let scrollFrame;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const position = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
  progress.style.transform = `scaleX(${position})`;
  document.querySelector('.site-header').classList.toggle('is-scrolled', window.scrollY > 24);
  scrollFrame = undefined;
}
function scheduleScroll() {
  if (scrollFrame === undefined) scrollFrame = requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
updateScroll();

if ('IntersectionObserver' in window) {
  const sectionLinks = [...document.querySelectorAll('.main-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

// A subtle light follows a fine pointer inside the diagram; touch is unaffected.
const map = document.querySelector('.research-map');
let pointerFrame;
map.addEventListener('pointermove', event => {
  if (motionPreference.matches || event.pointerType === 'touch') return;
  if (pointerFrame !== undefined) cancelAnimationFrame(pointerFrame);
  const { clientX, clientY } = event;
  pointerFrame = requestAnimationFrame(() => {
    const bounds = map.getBoundingClientRect();
    map.style.setProperty('--pointer-x', `${clientX - bounds.left}px`);
    map.style.setProperty('--pointer-y', `${clientY - bounds.top}px`);
    map.classList.add('has-pointer');
    pointerFrame = undefined;
  });
}, { passive: true });
map.addEventListener('pointerleave', () => {
  if (pointerFrame !== undefined) cancelAnimationFrame(pointerFrame);
  pointerFrame = undefined;
  map.classList.remove('has-pointer');
});

document.querySelector('[data-year]').textContent = String(new Date().getFullYear());

// Animate the research workflow only while it is on screen and motion is enabled.
const workflow = document.querySelector('.research-loop');
const workflowStages = [...workflow.querySelectorAll('li')];
let workflowVisible = false;
let workflowTimer;
let workflowStage = 0;
function showWorkflowStage(index) {
  workflowStage = index;
  workflow.dataset.stage = String(index);
  workflowStages.forEach((stage, position) => stage.classList.toggle('is-current', position === index));
}
function syncWorkflow() {
  if (workflowTimer !== undefined) clearInterval(workflowTimer);
  workflowTimer = undefined;
  const running = workflowVisible && !motionPreference.matches && !document.hidden;
  workflow.classList.toggle('is-running', running);
  if (running) {
    workflowTimer = setInterval(() => showWorkflowStage((workflowStage + 1) % workflowStages.length), 2800);
  }
}
showWorkflowStage(0);
if ('IntersectionObserver' in window) {
  const workflowObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      workflowVisible = entry.isIntersecting;
      syncWorkflow();
    });
  }, { threshold: 0.25 });
  workflowObserver.observe(workflow);
}
document.addEventListener('visibilitychange', syncWorkflow);
motionPreference.addEventListener('change', syncWorkflow);
