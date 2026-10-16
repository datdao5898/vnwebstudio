const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
const dialog = document.querySelector('#event-dialog');
const dialogTitle = document.querySelector('#dialog-title');

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

const reveal = () => document.querySelectorAll('.reveal').forEach((element) => {
  if (element.getBoundingClientRect().top < window.innerHeight * 0.9) element.classList.add('visible');
});
reveal();
window.addEventListener('scroll', reveal, { passive: true });

document.querySelectorAll('[data-event]').forEach((button) => button.addEventListener('click', () => {
  dialogTitle.textContent = button.dataset.event;
  dialog.showModal();
}));
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
