(function () {
  const fmt = (n) => Math.round(n).toLocaleString('vi-VN') + '₫';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const TYPES = {
    cuoi: { name: 'Tiệc cưới', base: 18000000, mult: 1, weeksBase: 6 },
    hoinghi: { name: 'Hội nghị', base: 22000000, mult: 0.9, weeksBase: 5 },
    gala: { name: 'Gala', base: 30000000, mult: 1.2, weeksBase: 7 },
    rieng: { name: 'Tiệc riêng', base: 8000000, mult: 0.85, weeksBase: 3 }
  };
  const TIERS = [
    { name: 'Gọn gàng', perGuest: 90000 },
    { name: 'Tiêu chuẩn', perGuest: 150000 },
    { name: 'Cao cấp', perGuest: 240000 }
  ];
  const ADDONS = {
    mc: { name: 'MC chuyên nghiệp', price: () => 6000000 },
    band: { name: 'Ban nhạc acoustic', price: () => 15000000 },
    media: { name: 'Chụp ảnh và quay phim', price: () => 14000000 },
    led: { name: 'Màn LED sân khấu', price: () => 18000000 },
    booth: { name: 'Photobooth', price: () => 7000000 },
    bus: { name: 'Xe đưa đón', price: (g) => Math.ceil(g / 45) * 4500000, label: (g) => 'Xe đưa đón (' + Math.ceil(g / 45) + ' xe)' }
  };
  const COLORS = { base: '#ffc53d', decor: '#ff5a36', addons: '#2bb3a3' };

  let type = 'cuoi';
  let lastTotal = 0;

  const guests = $('#guests');
  const guestOut = $('#guestOut');
  const tabs = $$('#typeTabs button');

  function compute() {
    const g = +guests.value;
    const t = TYPES[type];
    const tierIdx = +($('input[name="tier"]:checked') || { value: 1 }).value;
    const tier = TIERS[tierIdx];

    const base = t.base;
    const decor = g * tier.perGuest * t.mult;
    const picked = $$('#addons input:checked').map((i) => i.value);
    const addonLines = picked.map((k) => ({
      name: ADDONS[k].label ? ADDONS[k].label(g) : ADDONS[k].name,
      price: ADDONS[k].price(g)
    }));
    const addonSum = addonLines.reduce((s, a) => s + a.price, 0);
    const total = base + decor + addonSum;

    guestOut.textContent = g.toLocaleString('vi-VN');
    $('#resType').textContent = t.name + ' · ' + tier.name;
    animateTotal(total);
    $('#perGuest').textContent = 'khoảng ' + fmt(total / g) + ' mỗi khách';

    $('#bars').innerHTML = [
      ['base', base], ['decor', decor], ['addons', addonSum]
    ].filter((x) => x[1] > 0)
      .map((x) => '<span style="width:' + (x[1] / total * 100).toFixed(1) + '%;background:' + COLORS[x[0]] + '"></span>')
      .join('');

    const lines = [
      { c: COLORS.base, n: 'Concept, điều phối, nhân sự', p: base },
      { c: COLORS.decor, n: 'Trang trí ' + tier.name.toLowerCase() + ' cho ' + g.toLocaleString('vi-VN') + ' khách', p: decor }
    ].concat(addonLines.map((a) => ({ c: COLORS.addons, n: a.name, p: a.price })));
    $('#lines').innerHTML = lines.map((l) =>
      '<li><span><i style="background:' + l.c + '"></i>' + l.n + '</span><span>' + fmt(l.p) + '</span></li>'
    ).join('');

    const weeks = t.weeksBase + (g > 500 ? 3 : g > 250 ? 1 : 0) + (tierIdx === 2 ? 2 : 0);
    $('#prep').innerHTML = 'Nên đặt trước ít nhất <b>' + weeks + ' tuần</b> để kịp khảo sát, dựng phối cảnh và chốt nhà cung cấp.';

    const bt = $('#bookType');
    if (bt) bt.value = type;
    const bg = $('#bookGuests');
    if (bg) bg.value = g;
    const bb = $('#bookBudget');
    if (bb && !bb.dataset.touched) bb.value = 'Khoảng ' + Math.round(total / 1000000) + ' triệu';
  }

  let raf;
  function animateTotal(to) {
    const el = $('#total');
    const from = lastTotal;
    lastTotal = to;
    cancelAnimationFrame(raf);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
    const start = performance.now();
    const dur = 420;
    const step = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  tabs.forEach((b) => b.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    type = b.dataset.type;
    if (type === 'rieng' && +guests.value > 200) guests.value = 80;
    if (type === 'hoinghi') { const led = $('#addons input[value="led"]'); if (led) led.checked = true; }
    compute();
  }));
  guests.addEventListener('input', compute);
  $('#estForm').addEventListener('change', compute);

  const budget = $('#bookBudget');
  if (budget) budget.addEventListener('input', () => { budget.dataset.touched = '1'; });

  compute();

  // Booking form (demo)
  const form = $('#bookForm');
  const msg = $('#formMsg');
  const dateInput = form.querySelector('input[type="date"]');
  const today = new Date();
  const minDate = new Date(today.getTime() + 7 * 864e5);
  dateInput.min = minDate.toISOString().slice(0, 10);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    const nameEl = f.namedItem('name');
    const phoneEl = f.namedItem('phone');
    const name = nameEl.value.trim();
    const phone = phoneEl.value.replace(/\s+/g, '');
    const date = dateInput.value;
    $$('.invalid', form).forEach((el) => el.classList.remove('invalid'));
    const bad = [];
    if (name.length < 2) bad.push(nameEl);
    if (!/^0\d{9,10}$/.test(phone)) bad.push(phoneEl);
    if (!date) bad.push(dateInput);
    msg.hidden = false;
    if (bad.length) {
      bad.forEach((el) => el.classList.add('invalid'));
      msg.className = 'form-msg err';
      msg.textContent = 'Bạn kiểm tra lại họ tên, số điện thoại (10 hoặc 11 số) và ngày dự kiến nhé.';
      bad[0].focus();
      return;
    }
    const d = new Date(date + 'T00:00:00');
    const dayStr = d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    msg.className = 'form-msg';
    msg.textContent = 'Cảm ơn ' + name + '! Sắc Hội đã giữ tạm ' + dayStr + ' trong 7 ngày. Quản lý dự án sẽ gọi số ' + phone + ' trong 2 giờ làm việc. (Đây là bản demo, chưa gửi dữ liệu.)';
    showToast('Đã nhận yêu cầu giữ ngày');
    form.reset();
    compute();
  });

  const toast = $('#toast');
  let tt;
  function showToast(text) {
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(tt);
    tt = setTimeout(() => { toast.hidden = true; }, 2600);
  }

  // Count-up stats
  const stats = $$('.stats b[data-count]');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      const to = +el.dataset.count;
      const start = performance.now();
      const run = (now) => {
        const k = Math.min(1, (now - start) / 1200);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('vi-VN');
        if (k < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  }, { threshold: 0.4 }) : null;
  stats.forEach((el) => {
    el.textContent = (+el.dataset.count).toLocaleString('vi-VN');
    if (io) io.observe(el);
  });
})();
