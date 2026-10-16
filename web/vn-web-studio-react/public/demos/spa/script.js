const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);
const NEW_OFF = 0.15;

const TABS = [
  { k: "da", name: "Chăm sóc da", note: "Mọi liệu trình da đều bắt đầu bằng soi da 3D miễn phí." },
  { k: "body", name: "Massage & body", note: "Tinh dầu nguyên chất, bạn chọn mùi trước khi vào phòng." },
  { k: "goi", name: "Gói liệu trình", note: "Gói nhiều buổi bảo lưu 12 tháng, dùng chung được cho người thân." },
];
const S = [
  { id: 1, tab: "da", name: "Làm sạch sâu & thải độc da", desc: "Tẩy trang, hút dầu bằng sóng siêu âm, mặt nạ đất sét Kaolin. Hợp da dầu, lỗ chân lông to.", mins: 60, price: 450000, tag: "Khách mới hay chọn" },
  { id: 2, tab: "da", name: "Cấp ẩm HA chuyên sâu", desc: "Điện di Hyaluronic Acid 3 phân tử, massage nâng cơ mặt, mặt nạ thạch lạnh.", mins: 75, price: 690000 },
  { id: 3, tab: "da", name: "Trị mụn chuẩn y khoa", desc: "Lấy nhân mụn vô khuẩn, chiếu ánh sáng xanh, đắp mặt nạ làm dịu. Có phiếu theo dõi mỗi buổi.", mins: 90, price: 590000 },
  { id: 4, tab: "da", name: "Nâng cơ trẻ hóa RF", desc: "Sóng RF đơn cực làm săn da vùng má, cằm, rãnh cười. Không nghỉ dưỡng sau buổi.", mins: 90, price: 1250000 },
  { id: 5, tab: "body", name: "Massage Thụy Điển tinh dầu", desc: "Lực vừa, miết dài theo cơ, giảm mỏi lưng vai cho dân văn phòng.", mins: 60, price: 420000 },
  { id: 6, tab: "body", name: "Đá nóng bazan", desc: "Đá núi lửa làm ấm 55°C đặt dọc sống lưng, kết hợp massage tinh dầu gừng.", mins: 90, price: 650000, tag: "Bán chạy" },
  { id: 7, tab: "body", name: "Ấn huyệt cổ vai gáy & chân", desc: "Day ấn huyệt theo y học cổ truyền, chườm túi thảo mộc ngải cứu.", mins: 60, price: 350000 },
  { id: 8, tab: "body", name: "Tắm lá thuốc người Dao đỏ", desc: "Bồn gỗ pơ mu, lá thuốc lấy từ Sa Pa mỗi tuần. Ra mồ hôi, ngủ sâu hơn.", mins: 45, price: 280000 },
  { id: 9, tab: "goi", name: "Gói Tĩnh Tại nửa ngày", desc: "Xông hơi, đá nóng 90 phút, làm sạch da mặt, bữa nhẹ chay và trà sen.", mins: 180, price: 1390000, old: 1720000, tag: "Tiết kiệm 19%" },
  { id: 10, tab: "goi", name: "Liệu trình trị mụn 10 buổi", desc: "10 buổi trị mụn, soi da trước – sau mỗi buổi, tặng bộ sữa rửa mặt và kem dưỡng.", mins: 90, price: 4900000, old: 5900000 },
  { id: 11, tab: "goi", name: "Gói cặp đôi phòng VIP", desc: "Phòng đôi view hồ, bồn ngâm thảo dược, massage đá nóng cho hai người.", mins: 120, price: 1980000 },
  { id: 12, tab: "goi", name: "Chăm sóc mẹ bầu", desc: "Từ tuần thai thứ 14. Gối nằm nghiêng chuyên dụng, dầu dừa ép lạnh không mùi.", mins: 75, price: 750000 },
];
const ADDONS = [
  { id: "salt", name: "Xông hơi đá muối Himalaya", mins: 15, price: 120000 },
  { id: "mask", name: "Mặt nạ tảo xoắn Spirulina", mins: 15, price: 150000 },
  { id: "foot", name: "Ngâm chân thảo mộc", mins: 15, price: 90000 },
  { id: "room", name: "Phòng riêng view hồ Tây", mins: 0, price: 200000 },
];
const SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

const state = { svc: 1, add: new Set(), date: "", slot: null, booked: false };

/* availability: seeded by date so the same day always shows the same booked slots */
function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280 }
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function slotsFor(day) {
  const r = rng(+day.replaceAll("-", "") % 233280), now = new Date(), today = day === iso(now);
  return SLOTS.map(t => {
    const [h, m] = t.split(":").map(Number), taken = r() < 0.35;
    const past = today && h * 60 + m <= now.getHours() * 60 + now.getMinutes() + 30;
    return { t, free: !taken && !past };
  });
}
function firstOpenDay() {
  const d = new Date();
  for (let i = 0; i < 7; i++, d.setDate(d.getDate() + 1)) if (slotsFor(iso(d)).some(s => s.free)) return iso(d);
  return iso(new Date());
}
const dayLabel = day => {
  const s = new Date(day + "T00:00").toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/* services */
let tab = "da";
$("tabs").innerHTML = TABS.map(t => `<button class="tab" role="tab" type="button" data-k="${t.k}" aria-selected="${t.k === tab}">${t.name}</button>`).join("");
$("tabs").onclick = e => {
  const b = e.target.closest(".tab"); if (!b) return;
  tab = b.dataset.k;
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x === b));
  renderMenu();
};
function renderMenu() {
  $("tabNote").textContent = TABS.find(t => t.k === tab).note;
  $("menu").innerHTML = S.filter(s => s.tab === tab).map(s => `
    <article class="svc">
      <div class="svc-main"><h3>${s.name}${s.tag ? `<span class="tag">${s.tag}</span>` : ""}</h3><p>${s.desc}</p></div>
      <div class="svc-time">${s.mins} phút</div>
      <div class="svc-price">${fmt(s.price)}${s.old ? `<s>${fmt(s.old)}</s>` : ""}</div>
      <button class="pick${s.id === state.svc ? " on" : ""}" type="button" data-id="${s.id}">${s.id === state.svc ? "Đã chọn ✓" : "Chọn"}</button>
    </article>`).join("");
}
$("menu").onclick = e => {
  const b = e.target.closest(".pick"); if (!b) return;
  state.svc = +b.dataset.id; $("b-svc").value = state.svc;
  renderMenu(); renderSummary();
  toast(`Đã chọn “${S.find(s => s.id === state.svc).name}”, chọn giờ bên dưới nhé`);
  $("book").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};

/* booking form */
$("b-svc").innerHTML = TABS.map(t => `<optgroup label="${t.name}">${S.filter(s => s.tab === t.k).map(s => `<option value="${s.id}">${s.name} · ${s.mins}′ · ${fmt(s.price)}</option>`).join("")}</optgroup>`).join("");
$("b-svc").onchange = e => { state.svc = +e.target.value; renderMenu(); renderSummary() };

$("addons").innerHTML = ADDONS.map(a => `
  <label class="addon"><input type="checkbox" value="${a.id}" /><div><b>${a.name}</b><span>+${fmt(a.price)}${a.mins ? ` · ${a.mins} phút` : ""}</span></div></label>`).join("");
$("addons").onchange = e => { e.target.checked ? state.add.add(e.target.value) : state.add.delete(e.target.value); renderSummary() };

state.date = firstOpenDay();
$("b-date").min = iso(new Date());
$("b-date").value = state.date;
$("b-date").onchange = e => { state.date = e.target.value || firstOpenDay(); state.slot = null; renderSlots(); renderSummary() };

function renderSlots() {
  $("slots").innerHTML = slotsFor(state.date).map(s =>
    `<button type="button" class="slot" role="radio" aria-checked="${s.t === state.slot}" data-t="${s.t}" ${s.free ? "" : "disabled"}>${s.t}</button>`).join("");
}
$("slots").onclick = e => {
  const b = e.target.closest(".slot"); if (!b || b.disabled) return;
  state.slot = b.dataset.t; $("slotErr").hidden = true; renderSlots(); renderSummary();
};
$("tech").onchange = renderSummary;
$("b-new").onchange = renderSummary;

function calc() {
  const s = S.find(x => x.id === state.svc), adds = ADDONS.filter(a => state.add.has(a.id));
  const sub = s.price + adds.reduce((n, a) => n + a.price, 0);
  const off = $("b-new").checked ? Math.round(sub * NEW_OFF / 1000) * 1000 : 0;
  return { s, adds, sub, off, total: sub - off, mins: s.mins + adds.reduce((n, a) => n + a.mins, 0) };
}
function renderSummary() {
  if (state.booked) return;
  const c = calc(), tech = document.querySelector('[name="tech"]:checked').value;
  $("summary").innerHTML = `
    <h3>${c.s.name}</h3>
    <div class="s-when">${dayLabel(state.date)} · ${state.slot || "chưa chọn giờ"} · ${c.mins} phút</div>
    <ul class="lines">
      <li><span>${c.s.name}</span><span>${fmt(c.s.price)}</span></li>
      ${c.adds.map(a => `<li><span>${a.name}</span><span>+${fmt(a.price)}</span></li>`).join("")}
      ${c.off ? `<li class="off"><span>Ưu đãi lần đầu −15%</span><span>−${fmt(c.off)}</span></li>` : ""}
      <li><span>${tech}</span><span>Miễn phí</span></li>
    </ul>
    <div class="total"><span>Thanh toán tại spa</span><strong>${fmt(c.total)}</strong></div>
    <button class="btn" type="submit">Giữ chỗ ${state.slot ? "lúc " + state.slot : ""}</button>
    <p class="fine">Không cần đặt cọc. Tịnh Thủy gọi xác nhận trong 15 phút và nhắc lịch qua Zalo trước 1 ngày.</p>`;
}

$("booker").onsubmit = e => {
  e.preventDefault();
  if (!state.slot) { $("slotErr").hidden = false; $("slots").scrollIntoView({ block: "center" }); return }
  if (!$("b-name").value.trim() || !$("b-phone").value.trim()) { toast("Điền họ tên và số điện thoại giúp mình nhé"); return }
  const c = calc();
  state.booked = true;
  $("summary").innerHTML = `
    <div class="ok">
      <h3>Đã giữ chỗ mẫu cho ${$("b-name").value.trim()}</h3>
      <div class="s-when">${c.s.name} · ${state.slot}, ${dayLabel(state.date)}</div>
      <p>Tổng dự kiến ${fmt(c.total)}, thanh toán tại spa. Đây là website mẫu nên lịch hẹn không được gửi đi. Khi chạy thật, form này sẽ nối với Zalo OA, Google Sheets hoặc phần mềm quản lý spa.</p>
      <button class="btn" type="button" id="again">Đặt thêm lịch khác</button>
    </div>`;
  $("again").onclick = () => { state.booked = false; state.slot = null; renderSlots(); renderSummary() };
};

/* hero: next open slots */
function renderHeroSlots() {
  const day = firstOpenDay(), free = slotsFor(day).filter(s => s.free).slice(0, 3);
  const when = day === iso(new Date()) ? "hôm nay" : dayLabel(day).toLowerCase();
  $("heroSlots").innerHTML = `<div class="lbl">Còn trống ${when}<small>Phòng riêng, có kỹ thuật viên nữ</small></div>
    <div class="chips">${free.map(s => `<a href="#book" data-day="${day}" data-t="${s.t}">${s.t}</a>`).join("")}</div>`;
}
$("heroSlots").onclick = e => {
  const a = e.target.closest("a[data-t]"); if (!a) return;
  state.date = a.dataset.day; state.slot = a.dataset.t; state.booked = false;
  $("b-date").value = state.date; $("slotErr").hidden = true;
  renderSlots(); renderSummary();
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 2200) }

renderMenu(); renderSlots(); renderSummary(); renderHeroSlots();
