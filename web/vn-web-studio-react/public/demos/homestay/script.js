const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

const CATS = ["Tất cả", "Cặp đôi", "Gia đình", "Nhóm bạn", "Glamping"];
const ROOMS = [
  { id: "gacmai", name: "Phòng Gác Mái", cat: "Cặp đôi", cap: 2, max: 2, wd: 650000, we: 850000, area: "18m²", bed: "1 giường 1m6", feats: ["Cửa sổ trời", "Nhận thú cưng"], art: { wall: "#c99a6b", roof: "#7a3f2c", sky: "#d9ecf2", glow: "#ffd977" }, badge: "Giá tốt" },
  { id: "suongsom", name: "Phòng Sương Sớm", cat: "Cặp đôi", cap: 2, max: 3, wd: 890000, we: 1150000, area: "24m²", bed: "1 giường 1m8", feats: ["Ban công thung lũng", "Bồn tắm gỗ"], art: { wall: "#b78558", roof: "#2c5f49", sky: "#e6f0f5", glow: "#ffe08a" }, badge: "Đặt nhiều" },
  { id: "losuoi", name: "Phòng Lò Sưởi", cat: "Cặp đôi", cap: 2, max: 3, wd: 1050000, we: 1350000, area: "28m²", bed: "1 giường 1m8", feats: ["Lò sưởi củi", "View đồi thông"], art: { wall: "#9c6b45", roof: "#5a3a26", sky: "#d4e6ee", glow: "#ffb84d" } },
  { id: "giadinh", name: "Phòng Gia Đình Cây Thông", cat: "Gia đình", cap: 4, max: 5, wd: 1350000, we: 1650000, area: "36m²", bed: "2 giường 1m6", feats: ["Góc đồ chơi cho bé", "Ban công rộng"], art: { wall: "#c4915f", roof: "#3f7a60", sky: "#dcecef", glow: "#ffd977" } },
  { id: "nguyencan", name: "Nhà Gỗ Nguyên Căn", cat: "Nhóm bạn", cap: 6, max: 10, wd: 2900000, we: 3600000, area: "90m² + sân", bed: "3 phòng ngủ", feats: ["Bếp riêng", "Sân BBQ & lửa trại"], art: { wall: "#a8774f", roof: "#7a3f2c", sky: "#e2eff3", glow: "#ffd977", big: true }, badge: "Cho nhóm" },
  { id: "leu", name: "Lều Đồi Glamping", cat: "Glamping", cap: 2, max: 2, wd: 590000, we: 790000, area: "Lều 12m²", bed: "Nệm đôi 1m6", feats: ["Ngắm sao", "Nhận thú cưng"], art: { tent: true, sky: "#d7e7f0", glow: "#ffe08a" }, badge: "Mới" },
];
const ADDONS = [
  { id: "bbq", name: "BBQ tối", note: "rau củ Đà Lạt, sườn, gà, khoai", price: 220000, per: "guest", unit: "/khách" },
  { id: "fire", name: "Lửa trại", note: "củi thông, ghế, chăn len", price: 300000, per: "once", unit: "/lần" },
  { id: "bike", name: "Thuê xe máy", note: "kèm 2 mũ bảo hiểm", price: 120000, per: "night", unit: "/xe/ngày" },
  { id: "pick", name: "Đón sân bay Liên Khương", note: "xe 7 chỗ, 1 chiều", price: 350000, per: "once", unit: "/chiều" },
  { id: "deco", name: "Trang trí kỷ niệm", note: "hoa, nến, bánh nhỏ", price: 450000, per: "once", unit: "/lần" },
];
const HOLIDAYS = ["2026-12-24", "2026-12-31", "2027-01-01", "2027-02-15", "2027-02-16", "2027-02-17"];
const EXTRA = 200000; // mỗi khách vượt tiêu chuẩn, mỗi đêm (nệm phụ + bữa sáng)

/* ---------- room illustrations ---------- */
function pines(xs, fill) {
  return xs.map(([x, h]) => `<path d="M${x} ${150 - h} l${h * .22} ${h * .45} h-${h * .08} l${h * .2} ${h * .45} h-${h * .68} l${h * .2} -${h * .45} h-${h * .08} z" fill="${fill}"/>`).join("");
}
function art(r) {
  const a = r.art;
  let house;
  if (a.tent) {
    house = `<path d="M70 132 L120 62 L170 132 Z" fill="#f4efe4" stroke="#c9b893" stroke-width="2"/><path d="M120 62 L104 132 H136 Z" fill="#ffe7a6"/><path d="M120 62 L112 132 H128 Z" fill="${a.glow}"/>
      <g fill="#fff"><circle cx="40" cy="30" r="1.6"/><circle cx="70" cy="18" r="1.2"/><circle cx="200" cy="26" r="1.6"/><circle cx="168" cy="14" r="1.2"/></g>
      <path d="M150 140 q8 -14 16 0" fill="#e07a3a"/><path d="M154 140 q4 -9 8 0" fill="#f2c230"/>`;
  } else {
    const w = a.big ? 120 : 80, x = 120 - w / 2;
    const wins = a.big ? [x + 12, x + 46, x + 80] : [x + 12, x + 46];
    house = `<path d="M${x - 10} 92 L120 ${a.big ? 48 : 56} L${x + w + 10} 92 Z" fill="${a.roof}"/>
      <rect x="${x}" y="90" width="${w}" height="46" fill="${a.wall}"/>
      ${wins.map(wx => `<rect x="${wx}" y="100" width="${a.big ? 26 : 22}" height="18" rx="2" fill="${a.glow}"/>`).join("")}
      <rect x="${x + w - 30}" y="${a.big ? 58 : 64}" width="9" height="20" fill="#5a3a26"/>`;
  }
  return `<svg viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="240" height="160" fill="${a.sky}"/>
    <path d="M0 110 C60 80 120 100 170 84 C200 76 220 84 240 80 V160 H0Z" fill="#a9cbc2"/>
    ${pines([[22, 70], [44, 56], [208, 74], [226, 58]], "#5c937e")}
    <rect x="-20" y="96" width="180" height="12" rx="6" fill="#fff" opacity=".7"/>
    <path d="M0 136 C80 126 160 132 240 128 V160 H0Z" fill="#3f7a60"/>
    ${house}
    <path d="M0 148 C80 142 160 150 240 144 V160 H0Z" fill="#2c5f49"/>
  </svg>`;
}

/* ---------- room grid ---------- */
let cat = "Tất cả";
function renderTabs() {
  $("tabs").innerHTML = CATS.map(c => `<button role="tab" aria-selected="${c === cat}" data-c="${c}">${c}</button>`).join("");
}
function renderGrid() {
  const list = ROOMS.filter(r => cat === "Tất cả" || r.cat === cat);
  $("grid").innerHTML = list.map(r => `
    <article class="card">
      <div class="art">${art(r)}${r.badge ? `<span class="badge">${r.badge}</span>` : ""}</div>
      <div class="body">
        <div class="meta">${r.cat} · ${r.area} · ${r.bed}</div>
        <h3>${r.name}</h3>
        <ul class="feats">${r.feats.map(f => `<li>${f}</li>`).join("")}<li>${r.cap} khách${r.max > r.cap ? `, tối đa ${r.max}` : ""}</li></ul>
        <div class="price">
          <div><span>Ngày thường</span><strong>${fmt(r.wd)}</strong></div>
          <div><span>Cuối tuần</span><strong>${fmt(r.we)}</strong></div>
        </div>
        <button class="btn outline wide" data-pick="${r.id}">Chọn phòng này</button>
      </div>
    </article>`).join("");
}
$("tabs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  cat = b.dataset.c; renderTabs(); renderGrid();
});
$("grid").addEventListener("click", e => {
  const b = e.target.closest("[data-pick]"); if (!b) return;
  const r = ROOMS.find(x => x.id === b.dataset.pick);
  $("bRoom").value = r.id;
  if (+$("bGuests").value > r.max) $("bGuests").value = r.max;
  calc();
  $("book").scrollIntoView({ behavior: "smooth" });
  toast(`Đã chọn ${r.name}. Chọn ngày để xem tổng tiền.`);
});

/* ---------- dates ---------- */
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const isPeak = d => d.getDay() === 5 || d.getDay() === 6 || HOLIDAYS.includes(iso(d));

const today = new Date(); today.setHours(0, 0, 0, 0);
let nextFri = addDays(today, (5 - today.getDay() + 7) % 7 || 7);
for (const id of ["qIn", "bIn", "bOut"]) $(id).min = iso(today);
$("qIn").value = iso(nextFri);
$("bIn").value = iso(nextFri);
$("bOut").value = iso(addDays(nextFri, 2));

/* ---------- booking calculator ---------- */
$("bRoom").innerHTML = ROOMS.map(r => `<option value="${r.id}">${r.name} · từ ${fmt(r.wd)}</option>`).join("");
$("bRoom").value = "suongsom";
$("addons").insertAdjacentHTML("beforeend", ADDONS.map(a => `
  <label class="addon"><input type="checkbox" value="${a.id}" />
    <span><b>${a.name}</b><small>${a.note}</small></span><em>${fmt(a.price)}${a.unit}</em></label>`).join(""));

function calc() {
  const r = ROOMS.find(x => x.id === $("bRoom").value);
  let g = Math.max(1, +$("bGuests").value || 1);
  $("bGuests").max = r.max;
  const lines = [];
  let warn = "";
  if (g > r.max) { warn = `${r.name} nhận tối đa ${r.max} khách, đã tính theo ${r.max} khách.`; g = r.max; }

  let din = $("bIn").value ? parse($("bIn").value) : null;
  let dout = $("bOut").value ? parse($("bOut").value) : null;
  if (din) $("bOut").min = iso(addDays(din, 1));
  if (din && (!dout || dout <= din)) { dout = addDays(din, 1); $("bOut").value = iso(dout); }

  $("billRoom").textContent = r.name;
  if (!din) {
    $("billDates").textContent = "Chọn ngày để xem giá";
    $("billLines").innerHTML = ""; $("billTotal").textContent = "0₫"; $("billDeposit").textContent = "0₫";
    return null;
  }
  const nights = Math.round((dout - din) / 864e5);
  let wdN = 0, weN = 0;
  for (let i = 0; i < nights; i++) isPeak(addDays(din, i)) ? weN++ : wdN++;
  const f = d => `${DOW[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  $("billDates").textContent = `${f(din)} → ${f(dout)} · ${nights} đêm · ${g} khách`;

  let total = 0;
  if (wdN) { lines.push([`${wdN} đêm ngày thường × ${fmt(r.wd)}`, r.wd * wdN]); }
  if (weN) { lines.push([`${weN} đêm cuối tuần/lễ × ${fmt(r.we)}`, r.we * weN]); }
  const extra = Math.max(0, g - r.cap);
  if (extra) lines.push([`Khách thêm ${extra} × ${nights} đêm (nệm phụ + ăn sáng)`, EXTRA * extra * nights]);
  for (const box of $("addons").querySelectorAll("input:checked")) {
    const a = ADDONS.find(x => x.id === box.value);
    const q = a.per === "guest" ? g : a.per === "night" ? nights : 1;
    lines.push([`${a.name}${q > 1 ? ` × ${q}` : ""}`, a.price * q]);
  }
  if (nights >= 3) {
    const room = r.wd * wdN + r.we * weN;
    lines.push([`Ưu đãi ở từ 3 đêm (−10% tiền phòng)`, -Math.round(room * .1 / 1000) * 1000]);
  }
  total = lines.reduce((s, l) => s + l[1], 0);
  $("billLines").innerHTML = lines.map(([t, v]) => `<li class="${v < 0 ? "minus" : ""}"><span>${t}</span><b>${v < 0 ? "−" + fmt(-v) : fmt(v)}</b></li>`).join("")
    + (warn ? `<li class="warn"><span>${warn}</span></li>` : "");
  $("billTotal").textContent = fmt(total);
  $("billDeposit").textContent = fmt(Math.round(total * .3 / 1000) * 1000);
  return { r, nights, g, total };
}
for (const id of ["bRoom", "bGuests", "bIn", "bOut"]) $(id).addEventListener("input", calc);
$("addons").addEventListener("change", calc);

$("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const res = calc(); if (!res) return;
  const name = $("bName").value.trim();
  const m = $("bookMsg");
  m.hidden = false;
  m.textContent = `Cảm ơn ${name}! Đồi Thông Nhỏ đã giữ ${res.r.name} cho ${res.g} khách, ${res.nights} đêm (${fmt(res.total)}). Chị Hạnh sẽ gọi Zalo ${$("bPhone").value.trim()} trong 15 phút để gửi thông tin đặt cọc. (Bản demo — chưa có đơn thật.)`;
  toast("Đã gửi yêu cầu giữ phòng");
});

/* quick availability in hero */
$("quick").addEventListener("submit", e => {
  e.preventDefault();
  const din = parse($("qIn").value), n = +$("qN").value, g = +$("qG").value;
  const fit = ROOMS.filter(r => r.max >= g);
  const pick = fit.find(r => r.cap >= g) || fit[0];
  $("bIn").value = iso(din); $("bOut").value = iso(addDays(din, n));
  $("bGuests").value = g; $("bRoom").value = pick.id;
  calc();
  $("book").scrollIntoView({ behavior: "smooth" });
  toast(`Còn ${fit.length} lựa chọn cho ${g} khách. Gợi ý: ${pick.name}.`);
});

/* toast */
let tt;
function toast(t) {
  const el = $("toast"); el.textContent = t; el.hidden = false;
  clearTimeout(tt); tt = setTimeout(() => el.hidden = true, 3200);
}

renderTabs(); renderGrid(); calc();
