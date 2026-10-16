const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Đóng' : 'Menu';
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
}));

document.querySelectorAll('[data-service]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-service]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
}));
