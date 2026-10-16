const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Đóng' : 'Menu';
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

document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-category]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('[data-menu]').forEach((dish) => {
    dish.hidden = dish.dataset.menu !== button.dataset.category;
  });
}));

document.querySelector('#reserve-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = `Cảm ơn ${data.get('name')}. Bếp đã ghi nhận yêu cầu và sẽ gọi xác nhận bàn sớm nhất.`;
  event.currentTarget.reset();
});
