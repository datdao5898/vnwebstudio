function addStudioBackLink() {
  const link = document.createElement('a');
  link.href = location.pathname.includes('/demos/') ? '../../index.html' : '../vn-web-studio-react/';
  link.textContent = '← VN Web Studio';
  link.setAttribute('aria-label', 'Quay lại VN Web Studio');
  Object.assign(link.style, { position: 'fixed', top: '96px', right: '18px', zIndex: '100', padding: '9px 12px', border: '1px solid rgba(255,255,255,.56)', background: 'rgba(15,28,31,.7)', color: '#fff', backdropFilter: 'blur(10px)', font: '600 10px Arial, sans-serif', letterSpacing: '.02em', textDecoration: 'none', boxShadow: '0 6px 18px rgba(0,0,0,.16)' });
  document.body.append(link);
}
