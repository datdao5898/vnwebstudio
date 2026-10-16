function addStudioBackLink() {
  const link = document.createElement('a');
  link.href = location.pathname.includes('/demos/') ? '../../index.html' : '../vn-web-studio-react/';
  link.textContent = '\u2190 VN Web Studio';
  link.setAttribute('aria-label', 'Back to VN Web Studio');
  Object.assign(link.style, { position: 'fixed', top: '96px', right: '18px', zIndex: '100', padding: '9px 12px', border: '1px solid rgba(255,255,255,.56)', background: 'rgba(15,28,31,.7)', color: '#fff', backdropFilter: 'blur(10px)', font: '600 10px Arial, sans-serif', letterSpacing: '.02em', textDecoration: 'none', boxShadow: '0 6px 18px rgba(0,0,0,.16)' });
  document.body.append(link);
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('mobile-open');
  menuToggle.textContent = nav.classList.contains('mobile-open') ? '×' : '☰';
});

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); nav.classList.remove('mobile-open'); }
}));

addStudioBackLink();

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const tabs = document.querySelectorAll('[data-flavor]');
const cards = document.querySelectorAll('.drink-card');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  cards.forEach((card) => card.classList.toggle('hidden', card.dataset.type !== tab.dataset.flavor));
}));

document.querySelectorAll('.drink-card button').forEach((button) => button.addEventListener('click', () => {
  const original = button.textContent;
  button.textContent = '✓';
  button.style.background = '#f75886';
  setTimeout(() => { button.textContent = original; button.style.background = ''; }, 1100);
}));
