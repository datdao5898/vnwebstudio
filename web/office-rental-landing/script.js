const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const studioBack = document.querySelector('.studio-back');

if (window.location.pathname.includes('/demos/')) {
  studioBack.href = '../../index.html';
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
  menuButton.textContent = isOpen ? '×' : '☰';
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
  menuButton.textContent = '☰';
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const rows = [...document.querySelectorAll('.space-row')];
const pills = [...document.querySelectorAll('.filter-pills button')];
const result = document.querySelector('#finder-result');

function filterSpaces(size = 'all', location = 'all') {
  let count = 0;
  rows.forEach((row) => {
    const matchesSize = size === 'all' || row.dataset.size === size;
    const matchesLocation = location === 'all' || row.dataset.location === location;
    const visible = matchesSize && matchesLocation;
    row.classList.toggle('is-hidden', !visible);
    if (visible) count += 1;
  });
  result.textContent = count
    ? `Đang hiển thị ${count} lựa chọn phù hợp. Chọn “Xem chi tiết” để nhận báo giá.`
    : 'Chưa có không gian khớp chính xác. Hãy liên hệ để nhận phương án tùy chỉnh.';
}

pills.forEach((pill) => pill.addEventListener('click', () => {
  pills.forEach((item) => item.classList.remove('active'));
  pill.classList.add('active');
  filterSpaces(pill.dataset.filter, 'all');
}));

document.querySelector('#space-finder').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const size = formData.get('size');
  const location = formData.get('location');
  pills.forEach((item) => item.classList.toggle('active', item.dataset.filter === size));
  filterSpaces(size, location);
  document.querySelector('#spaces').scrollIntoView({ behavior: 'smooth' });
});

const zoneContent = {
  focus: ['01 / FOCUS', 'Văn phòng tập trung', 'Không gian riêng với tiêu âm chủ động, ánh sáng tự nhiên và quyền kiểm soát ra vào.'],
  meet: ['02 / MEET', 'Phòng họp linh hoạt', 'Từ cuộc họp nhanh bốn người đến phiên workshop lớn, thiết bị đã được kết nối và sẵn sàng.'],
  social: ['03 / SOCIAL', 'Lounge kết nối', 'Bàn cộng đồng, pantry và khu tiếp khách giúp những cuộc trò chuyện tự nhiên có chỗ để bắt đầu.'],
  reset: ['04 / RESET', 'Khoảng nghỉ phục hồi', 'Không gian xanh, ghế nghỉ và góc yên tĩnh để đội ngũ nạp lại năng lượng giữa ngày.']
};

const zoneInfo = document.querySelector('#zone-info');
document.querySelectorAll('.zone').forEach((zone) => zone.addEventListener('click', () => {
  document.querySelectorAll('.zone').forEach((item) => item.classList.remove('active'));
  zone.classList.add('active');
  const [label, title, copy] = zoneContent[zone.dataset.zone];
  zoneInfo.innerHTML = `<span>${label}</span><h3>${title}</h3><p>${copy}</p>`;
}));

const dialog = document.querySelector('#space-dialog');
const dialogTitle = document.querySelector('#dialog-title');

document.querySelectorAll('[data-space]').forEach((button) => button.addEventListener('click', () => {
  dialogTitle.textContent = button.dataset.space;
  dialog.showModal();
}));

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
