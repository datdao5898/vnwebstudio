function addStudioBackLink() {
  const link = document.createElement('a');
  link.href = location.pathname.includes('/demos/') ? '../../index.html' : '../vn-web-studio-react/';
  link.textContent = '\u2190 VN Web Studio';
  link.setAttribute('aria-label', 'Back to VN Web Studio');
  Object.assign(link.style, { position: 'fixed', top: '96px', right: '18px', zIndex: '100', padding: '9px 12px', border: '1px solid rgba(255,255,255,.56)', background: 'rgba(15,28,31,.7)', color: '#fff', backdropFilter: 'blur(10px)', font: '600 10px Arial, sans-serif', letterSpacing: '.02em', textDecoration: 'none', boxShadow: '0 6px 18px rgba(0,0,0,.16)' });
  document.body.append(link);
}

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) { event.preventDefault(); section.scrollIntoView({ behavior: 'smooth' }); }
}));

const quotes = [
  { text: 'Hannah helped my daughter go from dreading maths to raising her hand in class. She finally believes she can do it.', name: 'Maya, parent of Year 8 student', subtitle: 'Maths support · 6 months', initial: 'M' },
  { text: 'The lessons feel calm, clear and completely tailored to me. My English grades have improved, but so has my confidence.', name: 'Oliver, Year 10 student', subtitle: 'English support · 4 months', initial: 'O' },
  { text: 'We saw a real change within a few weeks — not just in results, but in how relaxed our son felt about school.', name: 'Sophie, parent of Year 9 student', subtitle: 'Science support · 5 months', initial: 'S' }
];
let quoteIndex = 0;
const renderQuote = () => { const quote = quotes[quoteIndex]; document.querySelector('#quote-text').textContent = quote.text; document.querySelector('#quote-name').textContent = quote.name; document.querySelector('#quote-subtitle').textContent = quote.subtitle; document.querySelector('#quote-avatar').textContent = quote.initial; };
document.querySelector('.quote-next').addEventListener('click', () => { quoteIndex = (quoteIndex + 1) % quotes.length; renderQuote(); });
document.querySelector('.quote-prev').addEventListener('click', () => { quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length; renderQuote(); });

document.querySelector('#booking-form').addEventListener('submit', (event) => { event.preventDefault(); const name = new FormData(event.currentTarget).get('name').split(' ')[0]; document.querySelector('.form-message').textContent = `Thanks, ${name}! Your free-call request is ready to send.`; event.currentTarget.reset(); });

addStudioBackLink();
