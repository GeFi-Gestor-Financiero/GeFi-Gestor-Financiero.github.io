const body = document.body;
const themeButton = document.querySelector('.theme-toggle');
const preferredTheme = localStorage.getItem('gefi-site-theme');
if (preferredTheme === 'dark' || (!preferredTheme && matchMedia('(prefers-color-scheme: dark)').matches)) body.classList.add('dark');
themeButton.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('gefi-site-theme', body.classList.contains('dark') ? 'dark' : 'light');
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
reveals.forEach(item => observer.observe(item));

const slides = [...document.querySelectorAll('.demo-slide')];
const playButtons = [document.querySelector('.player-play'), document.querySelector('.demo-external-play')];
const restartButton = document.querySelector('.player-restart');
const progress = document.querySelector('.timeline span');
const time = document.querySelector('.player-controls time');
let playing = false;
let startedAt = 0;
let elapsed = 0;
let animationFrame;
const duration = 18000;

function renderDemo(now) {
  if (!playing) return;
  elapsed = Math.min(duration, now - startedAt);
  const ratio = elapsed / duration;
  const slideIndex = Math.min(slides.length - 1, Math.floor(ratio * slides.length));
  slides.forEach((slide, index) => slide.classList.toggle('active', index === slideIndex));
  progress.style.width = `${ratio * 100}%`;
  time.textContent = `00:${String(Math.floor(elapsed / 1000)).padStart(2, '0')} / 00:18`;
  if (elapsed >= duration) { playing = false; document.querySelector('.player-play').textContent = '▶'; return; }
  animationFrame = requestAnimationFrame(renderDemo);
}

function toggleDemo() {
  if (elapsed >= duration) elapsed = 0;
  playing = !playing;
  document.querySelector('.player-play').textContent = playing ? '❚❚' : '▶';
  if (playing) { startedAt = performance.now() - elapsed; animationFrame = requestAnimationFrame(renderDemo); document.querySelector('#demo').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  else cancelAnimationFrame(animationFrame);
}

function restartDemo() {
  cancelAnimationFrame(animationFrame); elapsed = 0; playing = true; startedAt = performance.now();
  slides.forEach((slide, index) => slide.classList.toggle('active', index === 0));
  document.querySelector('.player-play').textContent = '❚❚';
  animationFrame = requestAnimationFrame(renderDemo);
}
playButtons.forEach(button => button.addEventListener('click', toggleDemo));
restartButton.addEventListener('click', restartDemo);
