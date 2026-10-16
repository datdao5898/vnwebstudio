function addStudioBackLink() {
  const link = document.createElement('a');
  link.href = location.pathname.includes('/demos/') ? '../../index.html' : '../vn-web-studio-react/';
  link.textContent = '← VN Web Studio';
  link.setAttribute('aria-label', 'Quay lại VN Web Studio');
  Object.assign(link.style, { position: 'fixed', top: '96px', right: '18px', zIndex: '100', padding: '9px 12px', border: '1px solid rgba(255,255,255,.56)', background: 'rgba(15,28,31,.7)', color: '#fff', backdropFilter: 'blur(10px)', font: '600 10px Arial, sans-serif', letterSpacing: '.02em', textDecoration: 'none', boxShadow: '0 6px 18px rgba(0,0,0,.16)' });
  document.body.append(link);
}

const exercises = [
  { title: 'Xuất phát', at: 0.02, text: 'Thắt dây an toàn, bật xi nhan trái rồi mới nhả phanh tay. Đi qua vạch xuất phát trong vòng 20 giây kể từ khi có lệnh.', error: 'Hay bị trừ điểm: quên xi nhan trái, xuất phát chậm quá 20 giây.' },
  { title: 'Dừng xe nhường đường cho người đi bộ', at: 0.1, text: 'Giảm tốc từ xa, dừng sao cho đầu xe cách vạch dừng không quá 50 cm. Dừng hẳn rồi mới đi tiếp.', error: 'Hay bị trừ điểm: dừng quá vạch hoặc chưa tới vạch quá xa.' },
  { title: 'Dừng và khởi hành ngang dốc', at: 0.19, text: 'Dừng đúng vị trí trên dốc, giữ chân phanh. Khi khởi hành, phối hợp ga – côn (hoặc ga – phanh tay) để xe không tụt.', error: 'Lỗi nặng: xe tụt dốc quá 50 cm hoặc không khởi hành được trong 30 giây.' },
  { title: 'Qua vệt bánh xe và đường hẹp vuông góc', at: 0.28, text: 'Căn bánh xe bên phụ theo mốc trên nắp capo, đi thật chậm. Vào cua vuông góc khi gương chiếu hậu ngang mép đường.', error: 'Lỗi nặng: bánh xe không đi vào vệt quy định.' },
  { title: 'Qua ngã tư có đèn tín hiệu', at: 0.37, text: 'Quan sát đèn từ xa. Đèn đỏ thì dừng trước vạch, đèn xanh mới đi. Rẽ trái, rẽ phải đều phải bật xi nhan.', error: 'Hay bị trừ điểm: vượt đèn đỏ, quên xi nhan khi rẽ.' },
  { title: 'Qua đường vòng quanh co', at: 0.46, text: 'Đi ga đều, đánh lái sớm và trả lái từ từ theo mốc đã tập. Không phanh gấp giữa đường cong.', error: 'Hay bị trừ điểm: bánh xe đè lên vạch giới hạn.' },
  { title: 'Ghép xe dọc vào nơi đỗ', at: 0.55, text: 'Bài lùi chuồng. Dừng đúng mốc, đánh hết lái và lùi chậm, nhìn gương hai bên. Thời gian tối đa 2 phút.', error: 'Hay bị trừ điểm: chạm vạch, quá thời gian, đỗ lệch khỏi khu vực.' },
  { title: 'Tạm dừng chỗ có đường sắt chạy qua', at: 0.64, text: 'Dừng trước vạch dừng không quá 50 cm, quan sát hai phía rồi mới đi qua đường ray.', error: 'Hay bị trừ điểm: không dừng hoặc dừng quá vạch.' },
  { title: 'Thay đổi số trên đường bằng', at: 0.74, text: 'Trong đoạn quy định phải tăng số và tăng tốc, sau đó giảm về số cũ trước khi hết đoạn.', error: 'Hay bị trừ điểm: không đổi số đúng đoạn, không đạt tốc độ yêu cầu.' },
  { title: 'Ghép xe ngang vào nơi đỗ', at: 0.85, text: 'Bài khó nhất với nhiều người. Dừng khi gương ngang mốc, lùi chéo vào rồi trả lái để thân xe song song với lề.', error: 'Hay bị trừ điểm: bánh xe chạm vạch, quá thời gian 2 phút.' },
  { title: 'Kết thúc', at: 0.97, text: 'Bật xi nhan phải, đi qua vạch kết thúc. Kết quả hiện ngay trên màn hình trong xe.', error: 'Hay bị trừ điểm: quên xi nhan phải khi về đích.' }
];

const ROUTE = 'M 70 390 L 70 150 Q 70 70 150 70 L 300 70 Q 340 70 340 110 L 340 150 Q 340 190 380 190 L 470 190 Q 500 190 500 220 L 500 330 Q 500 390 440 390 L 410 390 C 380 390 380 340 350 340 C 320 340 320 390 290 390 C 260 390 260 340 230 340 C 200 340 200 390 170 390 L 92 390';
const NS = 'http://www.w3.org/2000/svg';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(name, attrs, parent) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (parent) parent.append(node);
  return node;
}

function buildMap(container) {
  const svg = el('svg', { viewBox: '0 0 560 450', role: 'img', 'aria-hidden': 'true' }, container);
  el('rect', { x: 0, y: 0, width: 560, height: 450, rx: 6, class: 'grass' }, svg);
  const trees = [[120, 300], [150, 250], [190, 290], [420, 110], [460, 80], [520, 120], [250, 260], [110, 230]];
  trees.forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 13, class: 'tree' }, svg));
  el('rect', { x: 140, y: 140, width: 150, height: 70, rx: 4, class: 'building' }, svg);
  el('text', { x: 215, y: 180, class: 'building-text', 'text-anchor': 'middle' }, svg).textContent = 'Nhà điều hành';
  el('path', { d: ROUTE, class: 'road-edge' }, svg);
  el('path', { d: ROUTE, class: 'road' }, svg);
  const center = el('path', { d: ROUTE, class: 'road-line' }, svg);
  const length = center.getTotalLength();
  const features = el('g', {}, svg);
  const marks = el('g', {}, svg);
  const points = exercises.map((exercise, index) => {
    const distance = exercise.at * length;
    const point = center.getPointAtLength(distance);
    const ahead = center.getPointAtLength(Math.min(length, distance + 1));
    const angle = Math.atan2(ahead.y - point.y, ahead.x - point.x);
    const nx = -Math.sin(angle), ny = Math.cos(angle);
    const side = index === 0 || index === 10 ? 1 : -1;
    const mx = point.x + nx * 34 * side, my = point.y + ny * 34 * side;
    const marker = el('g', { class: 'checkpoint', 'data-index': index, transform: `translate(${mx} ${my})` }, marks);
    el('circle', { r: 12 }, marker);
    el('text', { 'text-anchor': 'middle', y: 4 }, marker).textContent = index + 1;
    return { distance, point, angle };
  });
  const feature = (index, draw) => {
    const { point, angle } = points[index];
    const group = el('g', { transform: `translate(${point.x} ${point.y}) rotate(${angle * 180 / Math.PI})` }, features);
    draw(group);
  };
  feature(1, (g) => { for (let i = -12; i <= 12; i += 6) el('rect', { x: 8, y: i - 1.5, width: 10, height: 3, class: 'zebra' }, g); });
  feature(2, (g) => el('rect', { x: -14, y: -15, width: 28, height: 30, class: 'slope' }, g));
  feature(4, (g) => { const light = el('g', { transform: 'translate(0 26)' }, g); el('rect', { x: -6, y: -3, width: 20, height: 7, rx: 2, class: 'signal-box' }, light); ['#d23a2b', '#f2c230', '#1e9e5a'].forEach((fill, i) => el('circle', { cx: -2 + i * 6, cy: 0.5, r: 2, fill }, light)); });
  feature(6, (g) => el('rect', { x: -14, y: 18, width: 28, height: 26, class: 'parking' }, g));
  feature(7, (g) => { el('line', { x1: -4, y1: -20, x2: -4, y2: 20, class: 'rail' }, g); el('line', { x1: 4, y1: -20, x2: 4, y2: 20, class: 'rail' }, g); });
  feature(9, (g) => el('rect', { x: -18, y: 17, width: 36, height: 16, class: 'parking' }, g));
  feature(0, (g) => el('rect', { x: -15, y: -1.5, width: 30, height: 3, class: 'start-line' }, g));
  feature(10, (g) => { for (let i = -15; i < 15; i += 5) el('rect', { x: -1.5, y: i, width: 5, height: 5, class: i % 10 === 0 ? 'flag-a' : 'flag-b' }, g); });

  const car = el('g', { class: 'car' }, svg);
  el('rect', { x: -13, y: -7.5, width: 26, height: 15, rx: 4, class: 'car-body' }, car);
  el('rect', { x: 2, y: -6, width: 6, height: 12, rx: 1.5, class: 'car-glass' }, car);
  el('rect', { x: -10, y: -6, width: 4, height: 12, rx: 1.5, class: 'car-glass' }, car);
  el('rect', { x: -4, y: -9, width: 10, height: 3, rx: 1, class: 'car-roof' }, car);

  let position = 0;
  let frame;
  const place = (distance) => {
    const p = center.getPointAtLength(distance);
    const q = center.getPointAtLength(Math.min(length, distance + 1));
    const r = distance >= length - 1 ? center.getPointAtLength(distance - 1) : p;
    const angle = distance >= length - 1 ? Math.atan2(p.y - r.y, p.x - r.x) : Math.atan2(q.y - p.y, q.x - p.x);
    car.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle * 180 / Math.PI})`);
    position = distance;
  };
  const driveTo = (target, duration) => {
    cancelAnimationFrame(frame);
    const from = position;
    if (reduceMotion || duration === 0) { place(target); return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      place(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };
  const highlight = (index) => marks.querySelectorAll('.checkpoint').forEach((mark) => mark.classList.toggle('active', Number(mark.dataset.index) === index));
  place(0);
  return { svg, points, driveTo, highlight, length };
}

const heroMap = buildMap(document.querySelector('[data-map="hero"]'));
const courseMap = buildMap(document.querySelector('[data-map="course"]'));

setTimeout(() => heroMap.driveTo(heroMap.length, 9000), 500);

const list = document.querySelector('#exercise-list');
exercises.forEach((exercise, index) => {
  const item = document.createElement('li');
  item.innerHTML = `<button type="button" aria-pressed="false"><span>${index + 1}</span>${exercise.title}</button>`;
  list.append(item);
});
const buttons = [...list.querySelectorAll('button')];
let current = -1;
function select(index, animate = true) {
  const exercise = exercises[index];
  buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  document.querySelector('#tip-step').textContent = `Bài ${index + 1} / 11`;
  document.querySelector('#tip-title').textContent = exercise.title;
  document.querySelector('#tip-text').textContent = exercise.text;
  document.querySelector('#tip-error').textContent = exercise.error;
  const distance = courseMap.points[index].distance;
  courseMap.driveTo(distance, animate ? Math.min(2400, 500 + Math.abs(index - current) * 260) : 0);
  courseMap.highlight(index);
  current = index;
}
buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
courseMap.svg.querySelectorAll('.checkpoint').forEach((mark) => mark.addEventListener('click', () => select(Number(mark.dataset.index))));
heroMap.svg.querySelectorAll('.checkpoint').forEach((mark) => mark.addEventListener('click', () => { select(Number(mark.dataset.index), false); document.querySelector('#sa-hinh').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }));
select(0, false);

const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((other) => other.setAttribute('aria-selected', String(other === tab)));
  document.querySelectorAll('.plate').forEach((plate) => { plate.hidden = plate.dataset.group !== tab.dataset.group; });
}));

document.querySelectorAll('[data-pick]').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('#class-select').value = link.dataset.pick;
}));

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.textContent = '☰'; menuButton.setAttribute('aria-expanded', 'false'); }));

document.querySelector('#signup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const message = document.querySelector('#form-message');
  const phone = String(data.get('phone') || '').replace(/\D/g, '');
  if (!String(data.get('name') || '').trim()) { message.className = 'form-message error'; message.textContent = 'Vui lòng nhập họ và tên.'; form.name.focus(); return; }
  if (phone.length < 9 || phone.length > 11) { message.className = 'form-message error'; message.textContent = 'Số điện thoại cần có 10 chữ số, ví dụ 0912 345 678.'; form.phone.focus(); return; }
  const first = String(data.get('name')).trim().split(' ').pop();
  message.className = 'form-message ok';
  message.textContent = `Đã đặt lịch học thử cho ${first} — ${data.get('class')}, ${String(data.get('time')).toLowerCase()}. Tư vấn viên sẽ gọi lại sớm.`;
  form.reset();
});

addStudioBackLink();
