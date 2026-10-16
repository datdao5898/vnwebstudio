const nav = document.querySelector('#site-nav');
const menu = document.querySelector('.menu-toggle');
const studioBack = document.querySelector('.studio-back');

if (window.location.pathname.includes('/demos/')) {
  studioBack.href = '../../index.html';
}

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const caseDetails = {
  vesper: {
    kicker: 'CASE STUDY / 01',
    title: 'Maison Vesper',
    copy: 'A still life series for an independent fragrance house, shaped through shadow, carved stone and an unmistakable note of oxblood.',
    scope: 'Still life · Lighting · Retouching',
    year: '2026'
  },
  atelier: {
    kicker: 'CASE STUDY / 02',
    title: 'Atelier No. Seven',
    copy: 'A fashion detail series that placed material intelligence and the evidence of the hand at the centre of every frame.',
    scope: 'Fashion photography · Lighting · Retouching',
    year: '2024'
  },
  hotel: {
    kicker: 'CASE STUDY / 03',
    title: 'Hôtel Époque',
    copy: 'An interior series for a historic hotel, balancing inherited grandeur with the warmth and ease of contemporary hospitality.',
    scope: 'Interior photography · Architecture · Retouching',
    year: '2022'
  }
};

const dialog = document.querySelector('#case-dialog');
const dialogKicker = document.querySelector('#dialog-kicker');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCopy = document.querySelector('#dialog-copy');
const dialogScope = document.querySelector('#dialog-scope');
const dialogYear = document.querySelector('#dialog-year');

document.querySelectorAll('[data-case]').forEach((button) => button.addEventListener('click', () => {
  const item = caseDetails[button.dataset.case];
  dialogKicker.textContent = item.kicker;
  dialogTitle.textContent = item.title;
  dialogCopy.textContent = item.copy;
  dialogScope.textContent = item.scope;
  dialogYear.textContent = item.year;
  dialog.showModal();
}));

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('.dialog-link').addEventListener('click', () => dialog.close());
