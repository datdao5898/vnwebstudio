function addStudioBackLink() {
  const link = document.createElement('a');
  link.href = location.pathname.includes('/demos/') ? '../../index.html' : '../vn-web-studio-react/';
  link.textContent = '\u2190 VN Web Studio';
  link.setAttribute('aria-label', 'Back to VN Web Studio');
  Object.assign(link.style, { position: 'fixed', top: '96px', right: '18px', zIndex: '100', padding: '9px 12px', border: '1px solid rgba(15,28,31,.7)', background: 'rgba(15,28,31,.7)', color: '#fff', backdropFilter: 'blur(10px)', font: '600 10px Arial, sans-serif', letterSpacing: '.02em', textDecoration: 'none', boxShadow: '0 6px 18px rgba(0,0,0,.16)' });
  document.body.append(link);
}

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('.ticket-body form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('.form-note').textContent = 'Mây đã nhận được lời nhắn. Hẹn gặp bạn ở một chuyến đi thật đẹp.';
  event.currentTarget.reset();
});

addStudioBackLink();
