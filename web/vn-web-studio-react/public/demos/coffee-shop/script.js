const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);
const SHIP = 15000, FREE = 150000;

/* ---------- small menu icons ---------- */
const ICON = {
  iced: `<svg viewBox="0 0 36 36"><path d="M8 8h20l-2.4 22a2 2 0 0 1-2 1.8h-11.2a2 2 0 0 1-2-1.8z" fill="#fff" stroke="#2147c8" stroke-width="2"/><path d="M9.4 16h17.2l-1.5 13.6a1.4 1.4 0 0 1-1.4 1.2h-11.4a1.4 1.4 0 0 1-1.4-1.2z" fill="#3a2014"/><rect x="12" y="17" width="6" height="6" rx="1.5" fill="#fff" opacity=".7"/><rect x="19" y="19" width="5" height="5" rx="1.5" fill="#fff" opacity=".7"/><path d="M9.6 26h16.8l-.5 3.6a1.4 1.4 0 0 1-1.4 1.2h-11.4a1.4 1.4 0 0 1-1.4-1.2z" fill="#f2dfb6"/></svg>`,
  hot: `<svg viewBox="0 0 36 36"><path d="M14 4q-3 3 0 6M19 3q-3 3 0 6" stroke="#2147c8" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M6 13h20v8a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" fill="#fff" stroke="#2147c8" stroke-width="2"/><path d="M26 15h2.5a3.5 3.5 0 0 1 0 7H26" fill="none" stroke="#2147c8" stroke-width="2"/><ellipse cx="16" cy="15.5" rx="8.5" ry="1.6" fill="#3a2014"/><rect x="4" y="31" width="26" height="2.4" rx="1.2" fill="#2147c8"/></svg>`,
  tea: `<svg viewBox="0 0 36 36"><path d="M7 11h22l-3 20H10z" fill="#fff" stroke="#2147c8" stroke-width="2"/><path d="M8.6 17h18.8l-2 13H10.6z" fill="#e9b949"/><circle cx="21" cy="22" r="3" fill="#ffd6d6"/><path d="M18 11l4-7" stroke="#24160f" stroke-width="2" stroke-linecap="round"/></svg>`,
  cake: `<svg viewBox="0 0 36 36"><path d="M5 20h26v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#f6d58b"/><path d="M5 20l22-10 4 10z" fill="#ffe7b0" stroke="#2147c8" stroke-width="2" stroke-linejoin="round"/><path d="M5 24h26" stroke="#3a2014" stroke-width="2.5"/><circle cx="25" cy="9" r="2.4" fill="#e04a3a"/></svg>`,
  bread: `<svg viewBox="0 0 36 36"><path d="M4 22c0-7 9-12 14-12s14 5 14 12c0 3-3 5-6 5H10c-3 0-6-2-6-5z" fill="#e9a65a" stroke="#2147c8" stroke-width="2"/><path d="M11 16l3 5M17 14l3 6M23 15l3 5" stroke="#b46e2c" stroke-width="2" stroke-linecap="round"/></svg>`,
};

/* ---------- menu ---------- */
const TABS = ["Cà phê phin", "Pha máy", "Trà & khác", "Bánh ăn kèm"];
const MENU = [
  { t: 0, name: "Phin đen đá", desc: "Robusta rang mộc, đắng sâu, hậu ngọt", price: 29000, ic: "iced" },
  { t: 0, name: "Phin sữa đá", desc: "Sữa đặc Ông Thọ, khuấy ngay tại bàn", price: 32000, ic: "iced", tag: "Bán chạy" },
  { t: 0, name: "Bạc xỉu", desc: "Nhiều sữa, ít cà phê, hợp buổi chiều", price: 35000, ic: "iced" },
  { t: 0, name: "Cà phê muối", desc: "Kem muối Huế phủ trên phin sữa", price: 39000, ic: "iced", tag: "Mới" },
  { t: 0, name: "Cà phê trứng", desc: "Lòng đỏ đánh bông, giữ ấm bằng bát nước nóng", price: 45000, ic: "hot" },
  { t: 0, name: "Cà phê cốt dừa", desc: "Cốt dừa Bến Tre xay đá, rưới phin đen", price: 45000, ic: "iced" },
  { t: 1, name: "Espresso", desc: "Một shot 30 ml, hạt Arabica Cầu Đất", price: 35000, ic: "hot" },
  { t: 1, name: "Americano", desc: "Espresso pha nước nóng hoặc đá", price: 39000, ic: "iced" },
  { t: 1, name: "Latte", desc: "Sữa tươi Mộc Châu đánh mịn", price: 49000, ic: "hot" },
  { t: 1, name: "Cappuccino", desc: "Bọt sữa dày, rắc bột quế", price: 49000, ic: "hot" },
  { t: 1, name: "Cold brew cam vàng", desc: "Ủ lạnh 18 giờ, thêm lát cam sành", price: 55000, ic: "iced", tag: "Mới" },
  { t: 2, name: "Trà sen vàng", desc: "Trà Thái Nguyên ướp sen Tây Hồ, hạt sen bùi", price: 39000, ic: "tea" },
  { t: 2, name: "Trà ổi hồng", desc: "Ổi hồng ép, lá dứa, ít ngọt", price: 42000, ic: "tea" },
  { t: 2, name: "Cacao sữa", desc: "Cacao Bến Tre nguyên chất", price: 39000, ic: "hot" },
  { t: 2, name: "Trà đá", desc: "Trà xanh pha mộc, uống bao nhiêu cũng được", price: 5000, ic: "tea" },
  { t: 3, name: "Bánh mì que pate", desc: "Pate gan nhà làm, nướng giòn", price: 15000, ic: "bread" },
  { t: 3, name: "Croissant bơ", desc: "Nướng mới mỗi sáng lúc 6:00", price: 35000, ic: "bread" },
  { t: 3, name: "Bông lan trứng muối", desc: "Chà bông, sốt bơ trứng, trứng muối", price: 32000, ic: "cake" },
  { t: 3, name: "Tiramisu phin", desc: "Ngâm cà phê phin thay espresso", price: 49000, ic: "cake", tag: "Nên thử" },
];
let tab = 0;
$("tabs").innerHTML = TABS.map((t, i) => `<button class="tab" role="tab" aria-selected="${i === tab}" data-i="${i}">${t}</button>`).join("");
$("tabs").onclick = e => {
  const b = e.target.closest(".tab"); if (!b) return;
  tab = +b.dataset.i;
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x === b));
  renderMenu();
};
function renderMenu() {
  $("menuList").innerHTML = MENU.map((m, i) => ({ ...m, i })).filter(m => m.t === tab).map(m => `
    <article class="dish">
      <div class="ic">${ICON[m.ic]}</div>
      <div><h3>${m.name}${m.tag ? `<span class="tag">${m.tag}</span>` : ""}</h3><p>${m.desc}</p></div>
      <div class="end"><span class="price">${fmt(m.price)}</span><button class="add" data-i="${m.i}">Đặt</button></div>
    </article>`).join("");
}
$("menuList").onclick = e => {
  const b = e.target.closest(".add"); if (!b) return;
  const m = MENU[b.dataset.i];
  addLine(m.name, m.t === 3 ? "1 phần" : "Cỡ vừa · theo công thức quán", m.price);
  b.textContent = "Đã thêm ✓"; b.classList.add("done");
  setTimeout(() => { b.textContent = "Đặt"; b.classList.remove("done") }, 1200);
};

/* ---------- drink builder ---------- */
const BASES = [
  { id: "den", name: "Phin đen", price: 29000, color: "#2b160c", milk: 0 },
  { id: "sua", name: "Phin sữa", price: 32000, color: "#4a2a18", milk: .35 },
  { id: "bacxiu", name: "Bạc xỉu", price: 35000, color: "#a0714c", milk: .55 },
  { id: "muoi", name: "Cà phê muối", price: 39000, color: "#4a2a18", milk: .25, foam: "#efe2c8" },
  { id: "cotdua", name: "Cà phê cốt dừa", price: 45000, color: "#b78a63", milk: 0, foam: "#fbf6ea" },
];
const SIZES = [
  { id: "S", name: "Nhỏ", note: "250 ml · −4.000₫", add: -4000, h: .78 },
  { id: "M", name: "Vừa", note: "360 ml", add: 0, h: .89 },
  { id: "L", name: "Lớn", note: "480 ml · +8.000₫", add: 8000, h: 1 },
];
const SWEET = ["0%", "30%", "50%", "70%", "100%"];
const TEMPS = [{ id: "da", name: "Đá" }, { id: "it", name: "Ít đá" }, { id: "nong", name: "Nóng" }];
const EXTRAS = [
  { id: "shot", name: "Thêm 1 phin", add: 10000 },
  { id: "kem", name: "Kem muối", add: 8000 },
  { id: "thach", name: "Thạch cà phê", add: 8000 },
];
const st = { base: "sua", size: "M", sweet: "50%", temp: "da", extras: [] };

const pill = (type, name, value, label, note, checked) =>
  `<label class="pill"><input type="${type}" name="${name}" value="${value}"${checked ? " checked" : ""}><span>${label}${note ? `<small>${note}</small>` : ""}</span></label>`;
$("o-base").innerHTML = BASES.map(b => pill("radio", "base", b.id, b.name, fmt(b.price), b.id === st.base)).join("");
$("o-size").innerHTML = SIZES.map(s => pill("radio", "size", s.id, s.name, s.note, s.id === st.size)).join("");
$("o-sweet").innerHTML = SWEET.map(s => pill("radio", "sweet", s, s, "", s === st.sweet)).join("");
$("o-temp").innerHTML = TEMPS.map(t => pill("radio", "temp", t.id, t.name, "", t.id === st.temp)).join("");
$("o-extra").innerHTML = EXTRAS.map(x => pill("checkbox", "extra", x.id, x.name, "+" + fmt(x.add), false)).join("");
$("opts").onchange = () => {
  const f = $("opts");
  st.base = f.base.value; st.size = f.size.value; st.sweet = f.sweet.value; st.temp = f.temp.value;
  st.extras = [...f.querySelectorAll('input[name="extra"]:checked')].map(i => i.value);
  renderBuilt();
};

function built() {
  const b = BASES.find(x => x.id === st.base), s = SIZES.find(x => x.id === st.size);
  const ex = EXTRAS.filter(x => st.extras.includes(x.id));
  const hot = st.temp === "nong";
  const name = `${b.name} ${hot ? "nóng" : "đá"}`;
  const desc = [`Cỡ ${s.name.toLowerCase()}`, `ngọt ${st.sweet}`, st.temp === "it" ? "ít đá" : "", ...ex.map(x => x.name.toLowerCase())].filter(Boolean).join(" · ");
  return { b, s, ex, hot, name, desc, price: b.price + s.add + ex.reduce((n, x) => n + x.add, 0) };
}

function cupSVG(d) {
  const top = 232 - 200 * d.s.h, liq = top + (232 - top) * .12, L = 236 - liq;
  const glass = `M30 ${top} L170 ${top} L154 232 Q100 240 46 232 Z`;
  let layers = `<rect x="0" y="${liq}" width="200" height="${L}" fill="${d.b.color}"/>`;
  const milkH = d.b.milk * L * .45;
  if (milkH) layers += `<rect x="0" y="${236 - milkH - 8}" width="200" height="10" fill="${d.b.color}" opacity=".5"/><rect x="0" y="${236 - milkH}" width="200" height="${milkH}" fill="#f2dfb6"/>`;
  if (st.extras.includes("thach")) for (let i = 0; i < 6; i++) layers += `<rect x="${50 + i * 17}" y="${214 - (i % 2) * 9}" width="14" height="14" rx="3" fill="#24100a" stroke="#6b3b22"/>`;
  const foam = d.b.foam || (st.extras.includes("kem") ? "#efe2c8" : "");
  const foamH = foam ? 20 + (d.b.foam && st.extras.includes("kem") ? 10 : 0) : 0;
  if (foam) layers += `<rect x="0" y="${liq}" width="200" height="${foamH}" fill="${foam}"/>`;
  const ice = d.hot ? 0 : st.temp === "it" ? 2 : 4;
  for (let i = 0; i < ice; i++) {
    const x = 52 + (i % 2) * 48 + (i > 1 ? 22 : 0), y = liq + foamH + 6 + (i > 1 ? 34 : 0) + (i % 2) * 6, r = (i * 23) % 30 - 15;
    layers += `<rect x="${x}" y="${y}" width="34" height="30" rx="6" fill="rgba(255,255,255,.5)" stroke="rgba(255,255,255,.9)" stroke-width="2" transform="rotate(${r} ${x + 17} ${y + 15})"/>`;
  }
  const steam = d.hot ? `<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M80 ${top - 6} q-8 -10 0 -20"/><path d="M100 ${top - 10} q-8 -10 0 -20"/><path d="M120 ${top - 6} q-8 -10 0 -20"/></g>` : "";
  return `<svg viewBox="0 0 200 244" role="img" aria-label="Minh họa ly ${d.name}">
    <defs><clipPath id="cupClip"><path d="${glass}"/></clipPath></defs>
    ${steam}
    <path d="${glass}" fill="rgba(255,255,255,.2)"/>
    <g clip-path="url(#cupClip)">${layers}</g>
    <path d="${glass}" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
    <path d="M44 ${top + 14} L54 222" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".4"/>
  </svg>`;
}

function renderBuilt() {
  const d = built();
  $("cup").innerHTML = cupSVG(d);
  $("pv-name").textContent = d.name;
  $("pv-desc").textContent = d.desc;
  $("pv-price").textContent = fmt(d.price);
}
$("addBuilt").onclick = () => { const d = built(); addLine(d.name, d.desc, d.price) };

/* ---------- takeaway order ---------- */
let lines = [], placed = false;
function addLine(name, desc, price) {
  const f = lines.find(l => l.name === name && l.desc === desc);
  if (f) f.qty++; else lines.push({ name, desc, price, qty: 1 });
  placed = false; renderOrder();
  toast(`Đã thêm “${name}” vào đơn`);
}
const subtotal = () => lines.reduce((n, l) => n + l.price * l.qty, 0);
const shipFee = mode => mode === "ship" && subtotal() < FREE ? SHIP : 0;

function slots() {
  const now = new Date(), out = ["Sớm nhất (khoảng 15 phút)"];
  let t = Math.ceil((now.getHours() * 60 + now.getMinutes() + 30) / 15) * 15;
  t = Math.max(t, 7 * 60);
  for (; t <= 21 * 60 + 30 && out.length < 12; t += 15) out.push(`${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`);
  if (out.length === 1) out.splice(0, 1, "Sáng mai 7:00", "Sáng mai 7:30", "Sáng mai 8:00");
  return out;
}

function renderOrder() {
  const n = lines.reduce((s, l) => s + l.qty, 0);
  $("count").textContent = n;
  if (placed) return;
  $("items").innerHTML = lines.length ? lines.map((l, i) => `
    <div class="line">
      <div><div class="nm">${l.name}</div><div class="meta">${l.desc}</div></div>
      <div class="qty"><button data-d="-1" data-i="${i}" aria-label="Bớt">−</button><span>${l.qty}</span><button data-d="1" data-i="${i}" aria-label="Thêm">+</button></div>
      <div class="price">${fmt(l.price * l.qty)}</div>
    </div>`).join("") + `<div id="sums"></div>`
    : `<div class="empty">Chưa có món nào.<br>Bấm “Đặt” ở thực đơn hoặc tự pha một ly ở trên.</div>`;
  if (!lines.length) { $("checkout").innerHTML = `<h3>Nhận đồ uống</h3><p class="meta">Đặt trước, đến quán lấy ngay không cần xếp hàng. Giao miễn phí trong 3 km cho đơn từ ${fmt(FREE)}.</p>`; return }
  const keep = $("pickup") ? Object.fromEntries(new FormData($("pickup"))) : null;
  $("checkout").innerHTML = `
    <h3>Nhận đồ uống</h3>
    <form class="pickup" id="pickup">
      <div class="two">
        <label>Tên của bạn<input name="name" required value="Anh Tuấn"></label>
        <label>Số điện thoại<input name="phone" required inputmode="tel" value="0912 345 678"></label>
      </div>
      <label>Nhận tại<select name="mode">
        <option value="hk">Cơ sở Hoàn Kiếm · 18 Nhà Chung</option>
        <option value="dd">Cơ sở Đống Đa · 92 Trần Quang Diệu</option>
        <option value="ship">Giao tận nơi trong 3 km</option>
      </select></label>
      <label>Giờ nhận<select name="slot">${slots().map(s => `<option>${s}</option>`).join("")}</select></label>
      <button class="btn primary" type="submit" id="payBtn">Đặt trước</button>
    </form>`;
  const form = $("pickup");
  if (keep) for (const [k, v] of Object.entries(keep)) if (form[k] && [...(form[k].options || [{ value: v }])].some(o => o.value === v)) form[k].value = v;
  form.mode.onchange = renderSums;
  form.onsubmit = e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form));
    const total = subtotal() + shipFee(fd.mode);
    const where = fd.mode === "ship" ? "giao tận nơi" : form.mode.selectedOptions[0].text.split(" · ")[0];
    placed = true;
    $("checkout").innerHTML = `<div class="ok"><strong>Đã nhận đơn mẫu · ${fmt(total)}</strong>${fd.name} nhận ${n} món tại ${where}, ${fd.slot.toLowerCase()}.<br>Đây là website mẫu nên đơn không được gửi đi. Khi chạy thật, đơn sẽ báo về Zalo của quán hoặc máy in bếp.</div>
      <button class="btn ghost" id="again" style="margin-top:14px">Đặt đơn khác</button>`;
    lines = []; $("count").textContent = 0;
    $("items").innerHTML = `<div class="empty">Barista đang chuẩn bị ly của bạn ☕</div>`;
    $("again").onclick = () => { placed = false; renderOrder() };
  };
  renderSums();
}
function renderSums() {
  const mode = $("pickup").mode.value, sub = subtotal(), ship = shipFee(mode);
  $("sums").innerHTML = `
    <div class="sum"><span>Tạm tính</span><span>${fmt(sub)}</span></div>
    ${mode === "ship" ? `<div class="sum"><span>Phí giao ${ship ? `(miễn phí từ ${fmt(FREE)})` : ""}</span><span>${ship ? fmt(ship) : "Miễn phí"}</span></div>` : ""}
    <div class="sum tot"><span>Tổng cộng</span><span>${fmt(sub + ship)}</span></div>`;
  $("payBtn").textContent = `Đặt trước · ${fmt(sub + ship)}`;
}
$("items").onclick = e => {
  const b = e.target.closest("[data-d]"); if (!b) return;
  const l = lines[b.dataset.i]; l.qty += +b.dataset.d;
  if (l.qty <= 0) lines.splice(b.dataset.i, 1);
  renderOrder();
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 1800) }

renderMenu(); renderBuilt(); renderOrder();

// #don-mau: điền sẵn vài món để demo phần đặt trước cho khách
if (location.hash === "#don-mau") {
  lines = [{ name: "Phin sữa đá", desc: "Cỡ vừa · ngọt 50%", price: 32000, qty: 2 }, { name: "Bông lan trứng muối", desc: "1 phần", price: 32000, qty: 1 }];
  renderOrder(); $("order").scrollIntoView();
}
