const fmt = n => Math.round(n).toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

/* line icons, drawn on a 32×32 grid */
const IC = {
  check: `<path d="M10 6c-3 0-5 2.6-4.6 6.2.3 3 1.8 4.5 2.3 7.5.5 3 1 5.3 2.3 5.3 1.4 0 1.7-2.8 2.3-5 .4-1.2 1.2-1.6 3.7-1.6s3.3.4 3.7 1.6c.6 2.2.9 5 2.3 5 1.3 0 1.8-2.3 2.3-5.3.5-3 2-4.5 2.3-7.5C27 8.6 25 6 22 6c-2.6 0-3.4 1.6-6 1.6S12.6 6 10 6z"/><path d="M12 12l3 3 5-5"/>`,
  fill: `<path d="M10 6c-3 0-5 2.6-4.6 6.2.3 3 1.8 4.5 2.3 7.5.5 3 1 5.3 2.3 5.3 1.4 0 1.7-2.8 2.3-5 .4-1.2 1.2-1.6 3.7-1.6s3.3.4 3.7 1.6c.6 2.2.9 5 2.3 5 1.3 0 1.8-2.3 2.3-5.3.5-3 2-4.5 2.3-7.5C27 8.6 25 6 22 6c-2.6 0-3.4 1.6-6 1.6S12.6 6 10 6z"/><circle cx="16" cy="12" r="2.5"/>`,
  root: `<path d="M10 4c-3 0-5 2.6-4.6 6.2.3 3 1.8 4.5 2.3 7.5.5 3 1 5.3 2.3 5.3 1.4 0 1.7-2.8 2.3-5 .4-1.2 1.2-1.6 3.7-1.6s3.3.4 3.7 1.6c.6 2.2.9 5 2.3 5 1.3 0 1.8-2.3 2.3-5.3.5-3 2-4.5 2.3-7.5C27 6.6 25 4 22 4c-2.6 0-3.4 1.6-6 1.6S12.6 4 10 4z"/><path d="M12.5 19v9M19.5 19v9"/>`,
  extract: `<path d="M10 10c-3 0-5 2.6-4.6 6.2.3 3 1.8 4.5 2.3 7.5.5 3 1 4.3 2.3 4.3 1.4 0 1.7-2.8 2.3-5 .4-1.2 1.2-1.6 3.7-1.6s3.3.4 3.7 1.6c.6 2.2.9 5 2.3 5 1.3 0 1.8-1.3 2.3-4.3.5-3 2-4.5 2.3-7.5C27 12.6 25 10 22 10c-2.6 0-3.4 1.6-6 1.6S12.6 10 10 10z"/><path d="M16 7V2M12 4l4-3 4 3"/>`,
  crown: `<path d="M6 14l4-8 6 5 6-5 4 8z"/><path d="M8 14c0 6 2 13 4 13s2-6 4-6 2 6 4 6 4-7 4-13"/>`,
  implant: `<path d="M9 4h14l-2 7H11z"/><path d="M12 14h8M12.5 17h7M13 20h6M13.5 23h5M14.5 26h3"/><path d="M16 11v18"/>`,
  brace: `<path d="M4 16c4-4 20-4 24 0"/><rect x="7" y="11" width="4" height="4" rx="1"/><rect x="14" y="10" width="4" height="4" rx="1"/><rect x="21" y="11" width="4" height="4" rx="1"/><path d="M4 20c4 4 20 4 24 0"/>`,
  white: `<path d="M10 8c-3 0-5 2.6-4.6 6.2.3 3 1.8 4.5 2.3 7.5.5 3 1 5.3 2.3 5.3 1.4 0 1.7-2.8 2.3-5 .4-1.2 1.2-1.6 3.7-1.6s3.3.4 3.7 1.6c.6 2.2.9 5 2.3 5 1.3 0 1.8-2.3 2.3-5.3.5-3 2-4.5 2.3-7.5C27 10.6 25 8 22 8c-2.6 0-3.4 1.6-6 1.6S12.6 8 10 8z"/><path d="M25 2v4M23 4h4M5 3v3M3.5 4.5h3"/>`,
};
const icon = k => `<svg viewBox="0 0 32 32" fill="none" stroke="var(--blue)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;

const SVC = [
  { ic: "check", name: "Khám & cạo vôi răng", d: "Khám tổng quát, cạo vôi siêu âm, đánh bóng. Nên làm 6 tháng/lần.", from: 300000, unit: "lần" },
  { ic: "fill", name: "Trám răng thẩm mỹ", d: "Composite 3M cùng màu răng, trám răng sâu, mẻ, kẽ hở nhỏ.", from: 400000, unit: "răng" },
  { ic: "root", name: "Điều trị tủy", d: "Máy đo chiều dài ống tủy, trâm xoay Protaper. 1–2 buổi.", from: 1500000, unit: "răng" },
  { ic: "extract", name: "Nhổ răng khôn", d: "Chụp phim trước nhổ, máy Piezotome giảm sưng đau.", from: 1500000, unit: "răng", to: 3500000 },
  { ic: "crown", name: "Bọc răng sứ", d: "Titan, Zirconia, Cercon HT. Thiết kế Smile Design 3D.", from: 2500000, unit: "răng" },
  { ic: "implant", name: "Cấy ghép implant", d: "Trụ Dentium, Nobel, Straumann. Chụp CT Cone Beam miễn phí.", from: 15500000, unit: "trụ" },
  { ic: "brace", name: "Niềng răng", d: "Mắc cài kim loại, mắc cài sứ, khay trong suốt.", from: 28000000, unit: "liệu trình" },
  { ic: "white", name: "Tẩy trắng răng", d: "Laser Whitening tại phòng khám hoặc máng tẩy tại nhà.", from: 1800000, unit: "liệu trình" },
];
$("svcGrid").innerHTML = SVC.map(s => `
  <article class="svc">
    <div class="ic">${icon(s.ic)}</div>
    <h3>${s.name}</h3>
    <p>${s.d}</p>
    <div class="pr">${s.to ? `${fmt(s.from)} – ${fmt(s.to)}` : `từ ${fmt(s.from)}`} <small>/ ${s.unit}</small></div>
  </article>`).join("");

/* estimator */
const T = [
  { id: "brace", name: "Niềng răng", opts: [
      { n: "Mắc cài kim loại", d: "Bền, chi phí tốt nhất · 18–24 tháng", p: 28000000 },
      { n: "Mắc cài sứ", d: "Cùng màu răng, khó nhận ra · 18–24 tháng", p: 38000000 },
      { n: "Khay trong suốt", d: "Tháo lắp được, thay khay mỗi 2 tuần", p: 75000000 }],
    addons: [{ n: "Hàm duy trì sau niềng", p: 2500000 }, { n: "Nhổ 4 răng chỉnh nha", p: 2000000 }] },
  { id: "implant", name: "Cấy implant", unit: "trụ", max: 8, qty: 1, opts: [
      { n: "Dentium (Hàn Quốc)", d: "Bảo hành 10 năm · phổ biến nhất", p: 15500000 },
      { n: "Nobel Biocare (Mỹ)", d: "Bề mặt TiUnite, tích hợp xương nhanh", p: 24000000 },
      { n: "Straumann SLActive (Thụy Sĩ)", d: "Bảo hành trọn đời · lành thương 3–4 tuần", p: 28000000 }],
    addons: [{ n: "Răng sứ Zirconia trên implant", p: 5500000, per: true }, { n: "Ghép xương nhân tạo", p: 6000000, per: true }] },
  { id: "crown", name: "Bọc răng sứ", unit: "răng", max: 20, qty: 6, opts: [
      { n: "Sứ kim loại Titan", d: "Chịu lực tốt cho răng hàm · bảo hành 5 năm", p: 2500000 },
      { n: "Sứ Zirconia", d: "Không viền đen, trong tự nhiên · bảo hành 10 năm", p: 5500000 },
      { n: "Sứ Cercon HT (Đức)", d: "Độ trong cao cho răng cửa · bảo hành 15 năm", p: 7000000 }],
    addons: [{ n: "Điều trị tủy trước khi bọc", p: 1500000, per: true }, { n: "Smile Design 3D xem trước", p: 1000000 }] },
  { id: "white", name: "Tẩy trắng", opts: [
      { n: "Máng tẩy tại nhà", d: "Lấy dấu làm máng riêng, dùng 14 đêm", p: 1800000 },
      { n: "Laser Whitening", d: "Tại phòng khám 60 phút, trắng 2–4 tông", p: 3500000 },
      { n: "Combo laser + máng", d: "Trắng nhanh và giữ màu lâu hơn", p: 4500000 }],
    addons: [{ n: "Cạo vôi & đánh bóng trước tẩy", p: 300000 }] },
];
const state = Object.fromEntries(T.map(t => [t.id, { opt: 0, qty: t.qty || 1, add: new Set() }]));
let cur = "crown", pickedPlan = "";

$("tabs").innerHTML = T.map(t => `<button class="tab" role="tab" data-id="${t.id}" aria-selected="${t.id === cur}">${t.name}</button>`).join("");
$("tabs").onclick = e => {
  const b = e.target.closest(".tab"); if (!b) return;
  cur = b.dataset.id;
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x === b));
  renderEst();
};

function renderEst() {
  const t = T.find(x => x.id === cur), s = state[cur];
  $("estBody").innerHTML = `
    <div><h3>Chọn phương pháp</h3><div class="opts">${t.opts.map((o, i) => `
      <label class="opt"><input type="radio" name="opt" value="${i}" ${i === s.opt ? "checked" : ""}>
        <span><b>${o.n}</b><span class="d">${o.d}</span></span>
        <span class="p">${fmt(o.p)}${t.unit ? `<br><span class="d">/ ${t.unit}</span>` : ""}</span></label>`).join("")}</div></div>
    ${t.unit ? `<div><h3>Số ${t.unit}</h3><div class="qty-row">
      <div class="stepper"><button type="button" data-q="-1" aria-label="Bớt">−</button><output id="qty">${s.qty}</output><button type="button" data-q="1" aria-label="Thêm">+</button></div>
      <div class="teeth" aria-hidden="true">${Array.from({ length: t.max }, (_, i) => `<i class="${i < s.qty ? "on" : ""}"></i>`).join("")}</div></div></div>` : ""}
    <div><h3>Tùy chọn thêm</h3><div class="opts">${t.addons.map((a, i) => `
      <label class="addon"><input type="checkbox" value="${i}" ${s.add.has(i) ? "checked" : ""}>${a.n}<span class="p">+${fmt(a.p)}${a.per ? ` / ${t.unit}` : ""}</span></label>`).join("")}</div></div>`;
  renderSum();
}
$("estBody").onchange = e => {
  const s = state[cur], el = e.target;
  if (el.name === "opt") s.opt = +el.value;
  else if (el.type === "checkbox") el.checked ? s.add.add(+el.value) : s.add.delete(+el.value);
  renderSum();
};
$("estBody").onclick = e => {
  const b = e.target.closest("[data-q]"); if (!b) return;
  const t = T.find(x => x.id === cur), s = state[cur];
  s.qty = Math.min(t.max, Math.max(1, s.qty + +b.dataset.q));
  $("qty").textContent = s.qty;
  document.querySelectorAll(".teeth i").forEach((i, k) => i.classList.toggle("on", k < s.qty));
  renderSum();
};

function calc() {
  const t = T.find(x => x.id === cur), s = state[cur], o = t.opts[s.opt], q = t.unit ? s.qty : 1;
  const lines = [[`${o.n}${t.unit ? ` × ${q} ${t.unit}` : ""}`, o.p * q]];
  [...s.add].sort().forEach(i => { const a = t.addons[i]; lines.push([a.n + (a.per ? ` × ${q}` : ""), a.p * (a.per ? q : 1)]) });
  return { t, o, q, lines, total: lines.reduce((n, l) => n + l[1], 0) };
}
function renderSum() {
  const { t, o, q, lines, total } = calc();
  $("estSum").innerHTML = `
    <span class="k">Ước tính cho ${t.name.toLowerCase()}</span>
    <div class="total">${fmt(total)}</div>
    ${lines.map(([n, p]) => `<div class="line"><span>${n}</span><span>${fmt(p)}</span></div>`).join("")}
    <div class="line"><span>Khám, chụp phim X-quang</span><span>Miễn phí</span></div>
    ${total >= 3000000 ? `<div class="month">Trả góp 0% trong 12 tháng<br><b>${fmt(total / 12)}</b> / tháng</div>` : `<div class="month">Thanh toán một lần sau khi điều trị</div>`}
    <button class="btn sun" type="button" id="estBook">Đặt lịch tư vấn gói này</button>
    <p class="note">Chi phí tham khảo. Bác sĩ báo giá chính xác sau khi khám và chụp phim.</p>`;
  $("estBook").onclick = () => {
    $("b-svc").value = t.name;
    pickedPlan = `${o.n}${t.unit ? `, ${q} ${t.unit}` : ""} · ${fmt(total)}`;
    $("book").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    toast(`Đã chọn gói ${t.name.toLowerCase()} cho lịch hẹn`);
  };
}
renderEst();

/* booking */
const SLOTS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:30", "17:00", "18:30", "19:30"];
const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const now = new Date();
let slot = null;

$("b-svc").innerHTML = ["Khám tổng quát", ...T.map(t => t.name), "Trám răng", "Điều trị tủy", "Nhổ răng khôn", "Khám cho trẻ em"].map(n => `<option>${n}</option>`).join("");
$("b-date").min = ymd(now);
$("b-date").value = ymd(now);

function renderSlots() {
  const v = $("b-date").value; if (!v) return;
  const [y, m, d] = v.split("-").map(Number), day = new Date(y, m - 1, d);
  const sunday = day.getDay() === 0, today = v === ymd(now);
  let seed = y * 372 + m * 31 + d;
  const busy = () => (seed = (seed * 9301 + 49297) % 233280) / 233280 < .3;
  const list = SLOTS.map(t => {
    const [h, mi] = t.split(":").map(Number);
    const off = (sunday && h >= 12) || (today && h * 60 + mi <= now.getHours() * 60 + now.getMinutes() + 30) || busy();
    return { t, off };
  });
  if (!list.find(s => s.t === slot && !s.off)) slot = (list.find(s => !s.off) || {}).t || null;
  $("slots").innerHTML = list.map(s => `<button type="button" data-t="${s.t}" ${s.off ? "disabled" : ""} aria-pressed="${s.t === slot}">${s.t}</button>`).join("");
  if (!slot) $("slots").insertAdjacentHTML("beforeend", `<span class="k" style="grid-column:1/-1">Ngày này đã kín lịch, vui lòng chọn ngày khác.</span>`);
}
$("b-date").onchange = renderSlots;
$("slots").onclick = e => {
  const b = e.target.closest("button"); if (!b || b.disabled) return;
  slot = b.dataset.t;
  document.querySelectorAll(".slots button").forEach(x => x.setAttribute("aria-pressed", x === b));
};
// after 19:00 today has no slots left, so open on tomorrow
if (now.getHours() >= 19) { const t = new Date(now); t.setDate(t.getDate() + 1); $("b-date").value = ymd(t) }
renderSlots();

$("bookForm").onsubmit = e => {
  e.preventDefault();
  if (!slot) { toast("Vui lòng chọn một khung giờ còn trống"); return }
  const date = $("b-date").value.split("-").reverse().join("/");
  $("bookOk").innerHTML = `<strong>Đã giữ lịch mẫu cho ${$("b-name").value}</strong>${$("b-svc").value} lúc ${slot}, ngày ${date}${pickedPlan ? ` (${pickedPlan})` : ""}.<br>Đây là website mẫu nên lịch hẹn không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA, email hoặc phần mềm quản lý phòng khám.`;
  $("bookOk").hidden = false;
  toast("Đặt lịch thành công");
};

/* counters: final numbers are already in the HTML, animate only when scrolled into view */
const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, plus = el.hasAttribute("data-plus") ? "+" : "", t0 = performance.now();
    const tick = t => { const k = Math.min(1, (t - t0) / 1200), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString("vi-VN") + plus; if (k < 1) requestAnimationFrame(tick) };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  counters.forEach(c => io.observe(c));
}

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 2000) }
