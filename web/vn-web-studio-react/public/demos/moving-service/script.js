// Thùng Xanh: xếp đồ lên xe để ra giá, tab đóng gói, form đặt lịch demo.
const ITEMS = [
  { id: 'bed', name: 'Giường và nệm', vol: 1.1, n: 1, max: 6 },
  { id: 'wardrobe', name: 'Tủ quần áo', vol: 1.2, n: 1, max: 6 },
  { id: 'fridge', name: 'Tủ lạnh', vol: 0.7, n: 1, max: 4 },
  { id: 'washer', name: 'Máy giặt', vol: 0.5, n: 1, max: 4 },
  { id: 'sofa', name: 'Bộ sofa', vol: 1.3, n: 0, max: 6 },
  { id: 'table', name: 'Bàn ăn và ghế', vol: 0.9, n: 0, max: 6 },
  { id: 'desk', name: 'Bàn làm việc', vol: 0.5, n: 1, max: 30 },
  { id: 'box', name: 'Thùng đồ 60×40×40 cm', vol: 0.1, n: 10, max: 80, step: 5 }
];

// len: chiều dài thùng xe trên hình, tính theo đơn vị của viewBox SVG
const TRUCKS = [
  { name: 'Xe 500 kg', cap: 3, base: 690000, perKm: 12000, crew: '1 người bốc xếp', len: 200 },
  { name: 'Xe 1,25 tấn', cap: 7, base: 1290000, perKm: 16000, crew: '2 người bốc xếp', len: 280 },
  { name: 'Xe 2,5 tấn', cap: 14, base: 2290000, perKm: 22000, crew: '3 người bốc xếp', len: 350 },
  { name: 'Xe 5 tấn', cap: 28, base: 3990000, perKm: 32000, crew: '5 người bốc xếp', len: 420 }
];

const FREE_KM = 10;
const FLOOR_FEE = 25000; // mỗi m³, mỗi tầng đi bộ
const PACK_FEE = 60000; // mỗi m³
const BUILD_FEE = 300000;
const ALLEY_FEE = 350000;
const NIGHT_RATE = 0.15;

const $ = id => document.getElementById(id);
const money = n => `${Math.round(n).toLocaleString('vi-VN')}₫`;
const roundTen = n => Math.round(n / 10000) * 10000;
const m3 = v => `${v.toFixed(1).replace('.', ',')} m³`;

// Vẽ danh sách đồ
const itemsBox = $('items');
ITEMS.forEach(item => {
  const row = document.createElement('div');
  row.className = 'item';
  row.innerHTML = `
    <div class="item-name">${item.name}<small>${String(item.vol).replace('.', ',')} m³${item.step ? ' mỗi thùng' : ''}</small></div>
    <div class="stepper">
      <button type="button" aria-label="Bớt ${item.name}">−</button>
      <output aria-label="Số lượng ${item.name}"></output>
      <button type="button" aria-label="Thêm ${item.name}">+</button>
    </div>`;
  const [minus, plus] = row.querySelectorAll('button');
  const step = item.step || 1;
  minus.addEventListener('click', () => { item.n = Math.max(0, item.n - step); render(); });
  plus.addEventListener('click', () => { item.n = Math.min(item.max, item.n + step); render(); });
  item.row = row; item.minus = minus; item.plus = plus; item.out = row.querySelector('output');
  itemsBox.append(row);
});

function drawTruck(truck, fill) {
  const L = truck.len;
  $('body').setAttribute('width', L);
  $('load').setAttribute('width', Math.max(0, (L - 8) * fill));
  $('chassis').setAttribute('width', L + 90);
  const cabX = 20 + L + 6;
  $('cab').setAttribute('transform', `translate(${cabX} 0)`);
  $('wheelRear').setAttribute('transform', `translate(${L * 0.3 - 70} 0)`);
  $('wheelFront').setAttribute('transform', `translate(${cabX + 56 - 362} 0)`);
}

function render() {
  ITEMS.forEach(item => {
    item.out.textContent = item.n;
    item.row.classList.toggle('on', item.n > 0);
    item.minus.disabled = item.n === 0;
    item.plus.disabled = item.n >= item.max;
  });

  const volume = Math.round(ITEMS.reduce((sum, i) => sum + i.vol * i.n, 0) * 10) / 10;
  const km = Number($('km').value);
  const floors = Number($('floors').value);
  $('kmOut').textContent = `${km} km`;
  $('volume').textContent = m3(volume);

  const truck = TRUCKS.find(t => volume <= t.cap);
  const lines = $('lines');
  const meter = document.querySelector('.meter');
  lines.replaceChildren();

  if (volume === 0) {
    drawTruck(TRUCKS[0], 0);
    $('truckName').textContent = 'Chưa có đồ';
    $('meterBar').style.width = '0';
    meter.classList.remove('full');
    $('meterNote').textContent = 'Bấm dấu cộng để thêm món đồ đầu tiên.';
    $('total').textContent = '—';
    $('quoteNote').textContent = 'Chưa chọn món đồ nào, nhân viên sẽ tư vấn khi gọi lại.';
    return;
  }

  if (!truck) {
    const biggest = TRUCKS.at(-1);
    drawTruck(biggest, 1);
    $('truckName').textContent = 'Từ 2 xe trở lên';
    $('meterBar').style.width = '100%';
    meter.classList.add('full');
    $('meterNote').textContent = `Hơn ${biggest.cap} m³ cần ghép nhiều xe, Thùng Xanh sẽ khảo sát miễn phí tại nhà.`;
    $('total').textContent = 'Khảo sát';
    $('quoteNote').textContent = `${m3(volume)} đồ, ${km} km: báo giá sau khảo sát miễn phí.`;
    return;
  }

  const fill = volume / truck.cap;
  drawTruck(truck, fill);
  $('truckName').textContent = truck.name;
  $('meterBar').style.width = `${Math.round(fill * 100)}%`;
  meter.classList.remove('full');
  $('meterNote').textContent = `Thùng xe đầy ${Math.round(fill * 100)}%, chứa được tới ${truck.cap} m³.`;

  const billable = Math.ceil(volume);
  const rows = [[`${truck.name}, ${truck.crew}, 10 km đầu`, truck.base]];
  if (km > FREE_KM) rows.push([`Thêm ${km - FREE_KM} km`, (km - FREE_KM) * truck.perKm]);
  if (floors > 0) rows.push([`Đi bộ ${floors} tầng`, FLOOR_FEE * billable * floors]);
  if ($('optPack').checked) rows.push(['Đóng gói hộ', PACK_FEE * billable]);
  if ($('optBuild').checked) rows.push(['Tháo lắp giường, tủ', BUILD_FEE]);
  if ($('optAlley').checked) rows.push(['Trung chuyển ngõ nhỏ', ALLEY_FEE]);

  let subtotal = rows.reduce((sum, r) => sum + r[1], 0);
  if ($('optNight').checked) {
    const extra = subtotal * NIGHT_RATE;
    rows.push(['Chuyển sau 20 giờ', extra]);
    subtotal += extra;
  }

  rows.forEach(([label, value]) => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const price = document.createElement('b');
    name.textContent = label;
    price.textContent = money(value);
    li.append(name, price);
    lines.append(li);
  });

  const total = roundTen(subtotal);
  $('total').textContent = money(total);
  $('quoteNote').textContent = `${m3(volume)} đồ, ${truck.name.toLowerCase()}, ${km} km: ${money(total)}`;
}

['km', 'floors', 'optPack', 'optBuild', 'optAlley', 'optNight'].forEach(id => {
  $(id).addEventListener('input', render);
});
render();

// Tab đóng gói
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach(t => {
    const active = t === tab;
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    $(t.getAttribute('aria-controls')).hidden = !active;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// Form đặt lịch chỉ là demo
const today = new Date();
$('fDate').min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

$('bookForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = $('formMsg');
  const name = $('fName').value.trim();
  const phone = $('fPhone').value.trim();
  const digits = phone.replace(/\D/g, '');
  msg.hidden = false;
  if (!name || digits.length < 9 || digits.length > 11 || !$('fDate').value) {
    msg.className = 'form-msg err';
    msg.textContent = 'Bạn điền giúp họ tên, số điện thoại đúng và ngày muốn chuyển nhé.';
    return;
  }
  const date = $('fDate').value.split('-').reverse().join('/');
  msg.className = 'form-msg';
  msg.textContent = `Đây là bản demo. Đã ghi nhận lịch ngày ${date} của ${name}, Thùng Xanh sẽ gọi lại số ${phone} trong 15 phút.`;
  e.target.reset();
});
