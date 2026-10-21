const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);
const DAY = 864e5;
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const vn = d => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const today = new Date(); today.setHours(0, 0, 0, 0);
const SP = { dog: "Chó", cat: "Mèo" };

/* dịch vụ: giá riêng cho chó và mèo */
const ICON = {
  steth: '<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
  syringe: '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
  tooth: '<path d="M7 3C4.5 3 3 5 3 7.5c0 3 1.5 4.5 2 7.5.4 2.7 1 6 2.6 6 1.8 0 1.6-5 4.4-5s2.6 5 4.4 5c1.6 0 2.2-3.3 2.6-6 .5-3 2-4.5 2-7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z"/>',
  bath: '<path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2Z"/><path d="M6 12V5a2 2 0 0 1 3.5-1.3"/><circle cx="13" cy="6" r="1.5"/><circle cx="17" cy="4" r="1"/><circle cx="16.5" cy="8.5" r="1"/>',
};
const SV = [
  { id: "kham", icon: "steth", name: "Khám tổng quát", desc: "Kiểm tra tim phổi, da lông, tai mắt, răng miệng và cân nặng. Có phiếu khám điện tử gửi qua Zalo.", dog: 150000, cat: 150000, unit: "/lần" },
  { id: "tiem", icon: "syringe", name: "Tiêm phòng", desc: { dog: "Vaccine 7 bệnh nhập khẩu, khám trước khi tiêm, kèm sổ tiêm và SMS nhắc mũi sau.", cat: "Vaccine 4 bệnh cho mèo, khám trước khi tiêm, kèm sổ tiêm và SMS nhắc mũi sau." }, dog: 250000, cat: 280000, unit: "/mũi" },
  { id: "triet", icon: "scissors", name: "Triệt sản", desc: "Gây mê hô hấp, theo dõi monitor suốt ca mổ, có áo mổ và tái khám cắt chỉ miễn phí.", dog: 1200000, cat: 600000, from: true },
  { id: "xn", icon: "flask", name: "Xét nghiệm & siêu âm", desc: "Xét nghiệm máu có kết quả sau 15 phút, siêu âm ổ bụng, X-quang kỹ thuật số tại chỗ.", dog: 250000, cat: 250000, from: true },
  { id: "rang", icon: "tooth", name: "Cạo vôi răng", desc: "Cạo bằng máy siêu âm, đánh bóng men răng, kiểm tra nướu và nhổ răng sữa sót nếu cần.", dog: 800000, cat: 700000, unit: "/lần" },
  { id: "spa", icon: "bath", name: "Tắm & cắt tỉa", desc: "Sữa tắm dịu da, sấy khô, cắt móng, vệ sinh tai và tuyến hôi. Có bác sĩ ở ngay phòng bên.", dog: 180000, cat: 220000, from: true },
];
const price = (s, sp) => (s.from ? "từ " : "") + fmt(s[sp]);

let svSp = "dog";
function renderServices(flash) {
  $("services").innerHTML = SV.map(s => `
    <article class="sv">
      <div class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[s.icon]}</svg></div>
      <h3>${s.name}</h3>
      <p>${typeof s.desc === "string" ? s.desc : s.desc[svSp]}</p>
      <div class="price${flash ? " flash" : ""}"><b>${price(s, svSp)}</b><small>${s.unit || ""}</small></div>
    </article>`).join("");
}
function seg(el, cb) {
  el.onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    el.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    cb(b.dataset.sp);
  };
}
seg($("svSeg"), sp => { svSp = sp; renderServices(true) });

/* lịch tiêm phòng: tính theo tuần tuổi */
const VAC = {
  dog: [
    { w: 6, name: "Mũi 1 · Vaccine 5 bệnh", note: "Care, Parvo, viêm gan, ho cũi chó, phó cúm", price: 220000 },
    { w: 9, name: "Mũi 2 · Vaccine 7 bệnh", note: "Thêm 2 chủng xoắn khuẩn Lepto", price: 250000 },
    { w: 12, name: "Mũi 3 · Vaccine 7 bệnh", note: "Hoàn tất miễn dịch cơ bản", price: 250000 },
    { w: 16, name: "Mũi dại", note: "Bắt buộc theo quy định thú y", price: 100000 },
    { w: 68, name: "Nhắc lại sau 1 năm", note: "7 bệnh + dại, sau đó mỗi năm một lần", price: 350000 },
  ],
  cat: [
    { w: 8, name: "Mũi 1 · Vaccine 4 bệnh", note: "Giảm bạch cầu, viêm mũi khí quản, Calici, Chlamydia", price: 280000 },
    { w: 12, name: "Mũi 2 · Vaccine 4 bệnh", note: "Tăng cường miễn dịch", price: 280000 },
    { w: 16, name: "Mũi dại", note: "Tiêm cùng buổi khám sức khỏe", price: 100000 },
    { w: 68, name: "Nhắc lại sau 1 năm", note: "4 bệnh + dại, sau đó mỗi năm một lần", price: 380000 },
  ],
};
const age = w => w < 52 ? `${w} tuần tuổi` : "khoảng 15 tháng tuổi";

let vSp = "dog", nextDose = null;
const birth = $("v-birth");
birth.max = iso(today);
birth.value = iso(new Date(today.getTime() - 7 * 7 * DAY));

function renderVac() {
  if (!birth.value) return;
  const b = new Date(birth.value + "T00:00:00");
  const name = $("v-name").value.trim() || "bé";
  const rows = VAC[vSp].map(d => ({ d, date: new Date(b.getTime() + d.w * 7 * DAY) }));
  nextDose = rows.find(r => r.date >= today) || null;
  $("v-list").innerHTML = rows.map(r => {
    const past = r.date < today, isNext = r === nextDose;
    const tag = isNext ? `<span class="tag">Mũi tiếp theo</span>` : past ? `<span class="tag">Đã đến hạn · tiêm bù nếu chưa tiêm</span>` : "";
    return `<li class="${past ? "past" : ""}${isNext ? " next" : ""}">
      <time datetime="${iso(r.date)}">${vn(r.date)}</time>
      <div><b>${r.d.name}</b><span>${r.d.note} · ${age(r.d.w)}</span>${tag}</div>
      <em>${fmt(r.d.price)}</em></li>`;
  }).join("");
  $("v-total").textContent = fmt(VAC[vSp].reduce((s, d) => s + d.price, 0));
  if (nextDose) {
    const days = Math.round((nextDose.date - today) / DAY);
    $("v-sum").innerHTML = `Mũi tiếp theo của ${esc(name)}: <b>${vn(nextDose.date)}</b> ${days ? `(còn ${days} ngày)` : "(hôm nay)"} · ${nextDose.d.name}`;
  } else {
    $("v-sum").innerHTML = `${esc(name)} đã qua lịch tiêm cơ bản. Nên tiêm nhắc lại mỗi năm một lần, đặt lịch khám để bác sĩ kiểm tra sổ tiêm.`;
  }
  $("v-book").textContent = nextDose ? `Đặt lịch ${nextDose.d.name.split(" · ")[0].toLowerCase()} cho ${name}` : "Đặt lịch tiêm nhắc lại";
}
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
seg($("vSeg"), sp => { vSp = sp; renderVac() });
birth.oninput = renderVac;
$("v-name").oninput = renderVac;

$("v-book").onclick = () => {
  $("b-sp").value = vSp; fillServices(); $("b-sv").value = "tiem";
  $("b-pet").value = $("v-name").value.trim() || "Bé";
  $("b-date").value = iso(nextDose && nextDose.date > today ? nextDose.date : today);
  renderSlots();
  $("dat-lich").scrollIntoView({ behavior: "smooth" });
  toast("Đã điền sẵn lịch tiêm, chọn giờ là xong");
};

/* pet shop: lọc theo nhóm, giữ hàng tại quầy */
const CATS = ["Tất cả", "Thức ăn", "Vệ sinh & thuốc", "Phụ kiện"];
const SHOP = [
  { id: 1, cat: "Thức ăn", for: "Chó", name: "Hạt cho chó nhỏ vị gà & gạo lứt", size: "Túi 2 kg", price: 385000, art: "bag", c: "#ff8a3d", bg: "#fff1e8" },
  { id: 2, cat: "Thức ăn", for: "Mèo", name: "Hạt mèo trưởng thành vị cá hồi", size: "Túi 1,5 kg", price: 320000, art: "bag", c: "#2f5bea", bg: "#e9effe" },
  { id: 3, cat: "Thức ăn", for: "Mèo", name: "Pate mèo cá ngừ sốt thạch", size: "Lốc 12 hộp × 85 g", price: 216000, art: "can", c: "#18a874", bg: "#e6f7f0" },
  { id: 4, cat: "Vệ sinh & thuốc", for: "Mèo", name: "Cát đậu nành khử mùi trà xanh", size: "Túi 6 L", price: 129000, art: "litter", c: "#7cb342", bg: "#eef6e4" },
  { id: 5, cat: "Vệ sinh & thuốc", for: "Chó", name: "Thuốc nhỏ gáy trị ve rận, bọ chét", size: "Chó 4–10 kg · 3 tuýp", price: 145000, art: "drop", c: "#e5484d", bg: "#fdecec" },
  { id: 6, cat: "Phụ kiện", for: "Chó", name: "Yếm và dây dắt phản quang", size: "Size S, dài 1,2 m", price: 165000, art: "leash", c: "#2f5bea", bg: "#fff8dc" },
  { id: 7, cat: "Phụ kiện", for: "Chó & mèo", name: "Đệm ngủ vải chống thấm", size: "Size M · 60 × 45 cm", price: 290000, art: "bed", c: "#8b6fd1", bg: "#f1edfb" },
  { id: 8, cat: "Phụ kiện", for: "Chó", name: "Bóng gặm cao su tự nhiên", size: "Đường kính 7 cm", price: 75000, art: "ball", c: "#ff8a3d", bg: "#e9effe" },
];
const paw = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><ellipse cx="0" cy="6" rx="9" ry="7.5"/><circle cx="-9" cy="-5" r="3.8"/><circle cx="-3" cy="-11" r="3.8"/><circle cx="4" cy="-11" r="3.8"/><circle cx="10" cy="-5" r="3.8"/></g>`;
function art(p) {
  const c = p.c, k = "#16203a";
  const A = {
    bag: `<path d="M30 30h60l6 72a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6z" fill="${c}"/><rect x="28" y="18" width="64" height="16" rx="4" fill="${k}"/><path d="M36 18v16M48 18v16M60 18v16M72 18v16M84 18v16" stroke="#fff" stroke-opacity=".2"/><circle cx="60" cy="70" r="19" fill="#fff"/>${paw(60, 70, 1, c)}`,
    can: `<rect x="28" y="40" width="64" height="58" fill="${c}"/><ellipse cx="60" cy="98" rx="32" ry="9" fill="${c}"/><rect x="28" y="56" width="64" height="24" fill="#fff" opacity=".9"/><ellipse cx="60" cy="40" rx="32" ry="9" fill="#cfd6e4" stroke="${k}" stroke-opacity=".15"/><ellipse cx="60" cy="40" rx="22" ry="5" fill="none" stroke="${k}" stroke-opacity=".2"/>${paw(60, 68, .7, c)}`,
    litter: `<path d="M26 34 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 q8 -8 17 0 L92 104 H28z" fill="${c}"/><rect x="38" y="52" width="44" height="34" rx="6" fill="#fff"/><path d="M46 76 q14 -20 28 0" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="52" cy="64" r="3" fill="${c}"/><circle cx="66" cy="62" r="3" fill="${c}"/>`,
    drop: `<rect x="34" y="34" width="52" height="72" rx="8" fill="#fff" stroke="${k}" stroke-opacity=".12"/><rect x="34" y="34" width="52" height="18" rx="8" fill="${c}"/><path d="M60 62 c-10 14 -12 18 -12 23 a12 12 0 0 0 24 0 c0 -5 -2 -9 -12 -23z" fill="${c}"/><path d="M60 18v16" stroke="${k}" stroke-width="8" stroke-linecap="round"/>`,
    leash: `<path d="M30 40 C 30 20, 60 18, 62 38 L 70 84" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="62" y="80" width="18" height="12" rx="3" fill="${k}"/><path d="M42 74 h44 l6 22 h-56z" fill="#ff8a3d"/><path d="M48 80 h32" stroke="#fff" stroke-width="4" stroke-dasharray="6 5"/>`,
    bed: `<ellipse cx="60" cy="80" rx="46" ry="22" fill="${c}"/><ellipse cx="60" cy="72" rx="34" ry="13" fill="#fff" opacity=".85"/><path d="M14 80 q0 -26 46 -26 q46 0 46 26" fill="none" stroke="${k}" stroke-opacity=".12" stroke-width="3"/>${paw(60, 72, .6, c)}`,
    ball: `<circle cx="60" cy="64" r="34" fill="${c}"/><path d="M30 50 q30 14 60 0 M30 78 q30 -14 60 0" stroke="#fff" stroke-width="5" fill="none" opacity=".85"/><circle cx="48" cy="48" r="6" fill="#fff" opacity=".35"/><ellipse cx="60" cy="104" rx="26" ry="4" fill="${k}" opacity=".12"/>`,
  };
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${A[p.art]}</svg>`;
}

let cat = "Tất cả";
const held = new Set();
try { JSON.parse(localStorage.getItem("bbc-held") || "[]").forEach(id => held.add(id)) } catch (e) {}
const saveHeld = () => { try { localStorage.setItem("bbc-held", JSON.stringify([...held])) } catch (e) {} };

$("chips").innerHTML = CATS.map(c => `<button class="chip" aria-pressed="${c === cat}" data-c="${c}">${c}</button>`).join("");
$("chips").onclick = e => {
  const b = e.target.closest(".chip"); if (!b) return;
  cat = b.dataset.c; $("chips").querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderShop();
};
function renderShop() {
  $("shop").innerHTML = SHOP.filter(p => cat === "Tất cả" || p.cat === cat).map(p => `
    <article class="item">
      <div class="art" style="background:${p.bg}"><span class="for">${p.for}</span>${art(p)}</div>
      <div class="body">
        <h3>${p.name}</h3>
        <span class="meta">${p.size}</span>
        <div class="row"><b>${fmt(p.price)}</b><button class="hold" data-id="${p.id}" aria-pressed="${held.has(p.id)}">${held.has(p.id) ? "Đã giữ ✓" : "Giữ tại quầy"}</button></div>
      </div>
    </article>`).join("");
  $("held").textContent = held.size;
}
$("shop").onclick = e => {
  const b = e.target.closest(".hold"); if (!b) return;
  const id = +b.dataset.id, p = SHOP.find(x => x.id === id);
  held.has(id) ? held.delete(id) : held.add(id); saveHeld(); renderShop();
  toast(held.has(id) ? `Đã giữ “${p.name}”, nhận tại quầy khi đến khám` : `Đã bỏ giữ “${p.name}”`);
};

/* đặt lịch: khung giờ theo ngày, một số giờ đã kín */
const SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:30", "17:30", "18:30", "19:30"];
let slot = null;
function fillServices() {
  const sp = $("b-sp").value, cur = $("b-sv").value;
  $("b-sv").innerHTML = SV.map(s => `<option value="${s.id}">${s.name} · ${price(s, sp)}</option>`).join("");
  if (cur) $("b-sv").value = cur;
}
function busy(dateStr, branch) {
  let seed = [...dateStr + branch].reduce((s, ch) => s * 31 + ch.charCodeAt(0), 7) % 233280;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return new Set(SLOTS.filter(() => rnd() < .3));
}
function renderSlots() {
  const d = $("b-date").value, full = busy(d, $("b-branch").value);
  const now = new Date(), isToday = d === iso(today);
  const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  let free = 0;
  $("slots").innerHTML = SLOTS.map(t => {
    const off = full.has(t) || (isToday && t <= nowStr);
    if (!off) free++;
    if (off && slot === t) slot = null;
    return `<button type="button" class="slot" data-t="${t}" ${off ? "disabled" : ""} aria-pressed="${slot === t}">${t}</button>`;
  }).join("");
  $("b-free").textContent = free ? `còn ${free} giờ trống` : "đã kín, chọn ngày khác";
}
$("slots").onclick = e => {
  const b = e.target.closest(".slot"); if (!b || b.disabled) return;
  slot = b.dataset.t; $("slots").querySelectorAll(".slot").forEach(x => x.setAttribute("aria-pressed", x === b));
};
$("b-date").min = iso(today); $("b-date").value = iso(today);
$("b-date").onchange = $("b-branch").onchange = renderSlots;
$("b-sp").onchange = fillServices;

$("bookForm").onsubmit = e => {
  e.preventDefault();
  const ok = $("bookOk"), v = id => $(id).value.trim();
  const missing = ["b-owner", "b-phone", "b-pet", "b-date"].filter(id => !v(id));
  if (missing.length || !slot) {
    ok.className = "ok err"; ok.hidden = false;
    ok.innerHTML = `<strong>Còn thiếu thông tin</strong>${!slot ? "Bạn chọn giúp một giờ khám còn trống nhé." : "Điền đủ tên, số điện thoại, tên bé và ngày khám."}`;
    return;
  }
  const s = SV.find(x => x.id === v("b-sv")), sp = v("b-sp");
  const date = new Date(v("b-date") + "T00:00:00");
  ok.className = "ok"; ok.hidden = false;
  ok.innerHTML = `<strong>Đã nhận lịch mẫu cho bé ${esc(v("b-pet"))}</strong>${s.name} (${SP[sp].toLowerCase()}) lúc ${slot}, ngày ${vn(date)} tại cơ sở ${v("b-branch")}. Chi phí dự kiến ${price(s, sp)}.<br>Đây là website mẫu nên lịch không được gửi đi. Khi chạy thật, form này sẽ nối với Zalo OA, SMS nhắc lịch hoặc phần mềm quản lý phòng khám.`;
  slot = null; renderSlots();
  ok.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 2200) }

renderServices(); renderVac(); renderShop(); fillServices(); renderSlots();
