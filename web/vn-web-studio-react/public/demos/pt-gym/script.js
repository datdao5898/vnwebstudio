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

const programData = {
  strength: { code: 'PROGRAM / 01', title: 'STRENGTH<br>BASE', description: 'Xây kỹ thuật các bài compound, tăng sức mạnh nền và khối lượng cơ bắp có kiểm soát.', duration: '12 TUẦN', frequency: '3 BUỔI / TUẦN', level: 'MỚI — TRUNG CẤP', tracking: 'LOAD · RPE · FORM' },
  fatloss: { code: 'PROGRAM / 02', title: 'LEAN<br>& FIT', description: 'Giảm mỡ bằng sức mạnh, conditioning phù hợp và thói quen vận động có thể duy trì.', duration: '10 TUẦN', frequency: '3–4 BUỔI / TUẦN', level: 'MỌI TRÌNH ĐỘ', tracking: 'WAIST · HR · VOLUME' },
  movement: { code: 'PROGRAM / 03', title: 'MOVE<br>BETTER', description: 'Khôi phục biên độ, kiểm soát chuyển động và xây lại nền tảng trước khi tăng tải.', duration: '08 TUẦN', frequency: '2–3 BUỔI / TUẦN', level: 'QUAY LẠI VẬN ĐỘNG', tracking: 'ROM · PAIN · CONTROL' }
};

document.querySelectorAll('[data-program]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-program]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const program = programData[button.dataset.program];
  document.querySelector('#program-code').textContent = program.code;
  document.querySelector('#program-title').innerHTML = program.title;
  document.querySelector('#program-description').textContent = program.description;
  document.querySelector('#program-duration').textContent = program.duration;
  document.querySelector('#program-frequency').textContent = program.frequency;
  document.querySelector('#program-level').textContent = program.level;
  document.querySelector('#program-tracking').textContent = program.tracking;
}));

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  event.currentTarget.querySelector('.form-status').textContent = `Cảm ơn ${data.get('name')}. K/V Performance đã ghi nhận và sẽ liên hệ để xác nhận lịch đánh giá.`;
  event.currentTarget.reset();
});
