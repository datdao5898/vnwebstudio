const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

/* stick-figure poses drawn in a 120×120 box */
const POSE = {
  tree: `<circle cx="60" cy="20" r="8" fill="currentColor"/><path d="M60 32 V66 M54 36 C44 26 50 12 59 6 M66 36 C76 26 70 12 61 6 M58 66 V108 M62 66 L82 82 L61 88"/>`,
  warrior: `<circle cx="58" cy="28" r="8" fill="currentColor"/><path d="M58 40 V70 M16 46 H100 M58 70 L84 84 L86 108 M58 70 L24 108"/>`,
  child: `<circle cx="26" cy="92" r="8" fill="currentColor"/><path d="M34 90 C46 64 82 62 94 94 M28 102 L6 104 M94 94 L68 104 L100 106"/>`,
  aerial: `<path d="M38 4 L50 58 M82 4 L70 58 M50 58 Q60 70 70 58" stroke-width="3"/><circle cx="60" cy="104" r="8" fill="currentColor"/><path d="M60 62 V92 M60 62 L40 42 M60 62 L80 42 M60 72 L46 90 M60 72 L74 90"/>`,
  prenatal: `<circle cx="60" cy="24" r="8" fill="currentColor"/><path d="M58 36 C58 46 76 54 72 70 C70 78 62 80 60 82 M58 44 L42 66 L50 80 M24 96 Q60 78 96 96 M30 100 H90"/>`,
  sit: `<circle cx="60" cy="26" r="8" fill="currentColor"/><path d="M60 38 V76 M54 44 L40 66 L30 80 M66 44 L80 66 L90 80 M26 88 Q60 70 94 88 M32 94 H88"/>`,
};
const glyph = (pose, color) => `<svg viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" style="color:${color}">${POSE[pose]}</svg>`;

const C = {
  hatha: { name: "Hatha cơ bản", pose: "tree", lv: "Mới bắt đầu", int: 2, min: 60, teacher: "Cô Mai Anh", room: "Phòng Mây", cap: 14, bg: "#e3f0ef", col: "#1f7a72",
    desc: "Giữ tư thế lâu, học thở đúng, nền tảng cho mọi lớp khác." },
  vinyasa: { name: "Vinyasa Flow", pose: "warrior", lv: "Trung cấp", int: 4, min: 75, teacher: "Thầy Khang", room: "Phòng Gió", cap: 14, bg: "#fde6cf", col: "#b4570b",
    desc: "Chuỗi động tác nối theo nhịp thở, ra mồ hôi, tăng sức bền." },
  yin: { name: "Yin Yoga", pose: "child", lv: "Mọi trình độ", int: 1, min: 60, teacher: "Cô Thảo Vy", room: "Phòng Mây", cap: 14, bg: "#e6edf7", col: "#3c5a8a",
    desc: "Thả lỏng 3–5 phút mỗi tư thế, giãn sâu cân mạc và khớp hông." },
  aerial: { name: "Yoga bay", pose: "aerial", lv: "Trung cấp", int: 3, min: 75, teacher: "Cô Linh", room: "Phòng Bay", cap: 8, bg: "#fbe3e1", col: "#b23b3b",
    desc: "Tập với võng lụa treo trần, giải nén cột sống, đảo ngược an toàn." },
  prenatal: { name: "Yoga bầu", pose: "prenatal", lv: "Mẹ bầu", int: 1, min: 60, teacher: "Cô Hạnh", room: "Phòng Gió", cap: 10, bg: "#f6efd9", col: "#7a6214",
    desc: "Từ tuần 13 thai kỳ, giảm đau lưng, tập thở cho ngày vượt cạn." },
  meditate: { name: "Thiền & hít thở", pose: "sit", lv: "Mọi trình độ", int: 1, min: 45, teacher: "Thầy Bảo", room: "Phòng Mây", cap: 14, bg: "#e8f2e3", col: "#3f6b2e",
    desc: "Pranayama và thiền có hướng dẫn, dễ ngủ hơn sau giờ làm." },
};
const DROP_IN = 220000;

/* weekly timetable: Monday → Sunday */
const WEEKDAY = ["05:45", "07:00", "09:30", "12:15", "17:45", "19:15", "20:30"];
const DAYS = [
  { s: "T2", l: "Thứ Hai", times: WEEKDAY, k: ["hatha", "vinyasa", "prenatal", "yin", "vinyasa", "aerial", "meditate"] },
  { s: "T3", l: "Thứ Ba", times: WEEKDAY, k: ["vinyasa", "hatha", "yin", "hatha", "aerial", "vinyasa", "yin"] },
  { s: "T4", l: "Thứ Tư", times: WEEKDAY, k: ["hatha", "vinyasa", "prenatal", "vinyasa", "hatha", "aerial", "meditate"] },
  { s: "T5", l: "Thứ Năm", times: WEEKDAY, k: ["vinyasa", "yin", "hatha", "yin", "aerial", "vinyasa", "yin"] },
  { s: "T6", l: "Thứ Sáu", times: WEEKDAY, k: ["hatha", "vinyasa", "prenatal", "vinyasa", "yin", "aerial", "meditate"] },
  { s: "T7", l: "Thứ Bảy", times: ["06:30", "08:00", "09:30", "16:00", "17:30"], k: ["vinyasa", "aerial", "prenatal", "hatha", "yin"] },
  { s: "CN", l: "Chủ nhật", times: ["06:30", "08:00", "09:45"], k: ["hatha", "meditate", "aerial"] },
];
/* seeded so the same class always shows the same booked count */
function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280 }
const SESSIONS = [];
DAYS.forEach((d, di) => d.times.forEach((t, i) => {
  const c = C[d.k[i]], r = rng(di * 31 + i * 7 + 5)();
  SESSIONS.push({ id: `${di}-${i}`, day: di, time: t, key: d.k[i], booked: Math.min(c.cap, Math.round(c.cap * (.35 + r * .75))), mine: false });
}));
const endTime = s => { const [h, m] = s.time.split(":").map(Number), e = h * 60 + m + C[s.key].min; return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}` };

/* week dates starting this Monday */
const now = new Date();
const todayIdx = (now.getDay() + 6) % 7;
const monday = new Date(now); monday.setDate(now.getDate() - todayIdx);
const dateOf = i => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d };
const dm = d => `${d.getDate()}/${d.getMonth() + 1}`;

/* class cards */
$("classList").innerHTML = Object.values(C).map(c => `
  <article class="cls">
    <div class="glyph" style="background:${c.bg}">${glyph(c.pose, c.col)}</div>
    <div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <div class="tags"><span class="lv">${c.lv}</span><span>${c.min} phút</span><span>Cường độ <span class="intensity">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= c.int ? "on" : ""}"></i>`).join("")}</span></span></div>
    </div>
  </article>`).join("");

/* schedule */
const LEVELS = ["Tất cả", "Mới bắt đầu", "Trung cấp", "Mọi trình độ", "Mẹ bầu"];
let day = todayIdx, level = "Tất cả";
$("days").innerHTML = DAYS.map((d, i) => `<button class="day" role="tab" data-d="${i}" aria-selected="${i === day}"><b>${d.s}</b><span>${dm(dateOf(i))}</span></button>`).join("");
$("days").onclick = e => { const b = e.target.closest(".day"); if (!b) return; day = +b.dataset.d; document.querySelectorAll(".day").forEach(x => x.setAttribute("aria-selected", x === b)); renderSlots() };
$("levels").innerHTML = LEVELS.map(l => `<button class="chip" data-l="${l}" aria-pressed="${l === level}">${l}</button>`).join("");
$("levels").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; level = b.dataset.l; document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderSlots() };

function renderSlots() {
  const list = SESSIONS.filter(s => s.day === day && (level === "Tất cả" || C[s.key].lv === level));
  $("slots").innerHTML = list.length ? list.map(s => {
    const c = C[s.key], left = c.cap - s.booked;
    return `
    <div class="slot" style="--c:${c.col}">
      <div class="t">${s.time}<small>đến ${endTime(s)}</small></div>
      <div class="what"><h3>${c.name}</h3><div class="meta">${c.lv} · ${c.min} phút</div></div>
      <div class="who meta">${c.teacher} · ${c.room}</div>
      <div class="cap ${left <= 3 ? "low" : ""}">${left ? `Còn ${left}/${c.cap} chỗ` : "Đã kín lớp"}<div class="bar"><i style="width:${s.booked / c.cap * 100}%"></i></div></div>
      <button class="book ${s.mine ? "mine" : ""}" data-id="${s.id}" ${!left && !s.mine ? "disabled" : ""}>${s.mine ? "Đã giữ chỗ ✓" : left ? "Giữ chỗ" : "Hết chỗ"}</button>
    </div>` }).join("")
    : `<div class="empty">${DAYS[day].l} không có lớp ${level.toLowerCase()}. Thử chọn ngày khác nhé.</div>`;
}
$("slots").onclick = e => { const b = e.target.closest(".book"); if (b && !b.disabled) openSheet(b.dataset.id) };

/* hero card: next class with free spots, today or later this week */
function renderNext() {
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = SESSIONS.find(s => (s.day > todayIdx || (s.day === todayIdx && +s.time.slice(0, 2) * 60 + +s.time.slice(3) > mins)) && s.booked < C[s.key].cap && !s.mine)
    || SESSIONS.find(s => s.booked < C[s.key].cap && !s.mine);
  if (!s) { $("next").hidden = true; return }
  const c = C[s.key];
  $("next").innerHTML = `<div class="time">${s.time}</div><div><b>${c.name}</b>${s.day === todayIdx ? "Hôm nay" : DAYS[s.day].l} · ${c.teacher} · còn ${c.cap - s.booked} chỗ</div><button class="btn sun" data-id="${s.id}">Giữ chỗ</button>`;
}
$("next").onclick = e => { const b = e.target.closest("[data-id]"); if (b) openSheet(b.dataset.id) };

/* booking sheet */
function openSheet(id) {
  const s = SESSIONS.find(x => x.id === id), c = C[s.key];
  const when = `${DAYS[s.day].l} ${dm(dateOf(s.day))} · ${s.time}–${endTime(s)}`;
  if (s.mine) {
    $("sheetBody").innerHTML = `<span class="kicker">Lịch của bạn</span><h2 id="sheetTitle">${c.name}</h2><p class="meta">${when} · ${c.room}</p>
      <div class="ok"><strong>Bạn đã giữ chỗ lớp này</strong>Hủy miễn phí trước giờ học 3 tiếng.</div>
      <button class="btn ghost" id="cancel" style="margin-top:14px">Hủy giữ chỗ</button>`;
    $("cancel").onclick = () => { s.mine = false; s.booked--; refresh(); closeSheet(); toast(`Đã hủy chỗ lớp ${c.name}`) };
  } else {
    $("sheetBody").innerHTML = `<span class="kicker">Giữ chỗ</span><h2 id="sheetTitle">${c.name}</h2><p class="meta">${when} · ${c.teacher} · ${c.room}</p>
      <form class="bk" id="bk">
        <div class="two">
          <label>Họ tên<input id="f-name" required value="Nguyễn Thu Trang"></label>
          <label>Số điện thoại<input id="f-phone" required inputmode="tel" value="0938 512 774"></label>
        </div>
        <label>Hình thức<select id="f-pay">
          <option value="0">Học thử miễn phí (lần đầu)</option>
          <option value="${DROP_IN}">Vé lẻ · ${fmt(DROP_IN)}</option>
          <option value="-1">Trừ vào gói tập đang có</option>
        </select></label>
        ${s.key === "prenatal" ? `<label>Thai được bao nhiêu tuần?<input id="f-week" type="number" min="13" max="40" value="20" required></label>` : ""}
        <label class="check"><input type="checkbox" id="f-mat" checked> Mượn thảm & khăn tại studio (miễn phí)</label>
        <label>Tình trạng sức khỏe cần lưu ý<input id="f-note" placeholder="Ví dụ: thoát vị đĩa đệm nhẹ, đau cổ tay"></label>
        <button class="btn primary" type="submit">Xác nhận giữ chỗ</button>
      </form>`;
    $("bk").onsubmit = e => {
      e.preventDefault();
      if (s.booked >= c.cap) { toast("Lớp vừa kín chỗ, bạn chọn giờ khác nhé"); return }
      s.mine = true; s.booked++; refresh();
      const pay = +$("f-pay").value;
      $("sheetBody").innerHTML = `<span class="kicker">Đã giữ chỗ</span><h2 id="sheetTitle">Hẹn gặp ${$("f-name").value.split(" ").pop()} ở lớp!</h2>
        <div class="ok"><strong>${c.name} · ${s.time}</strong>${when}, ${c.room}. ${pay > 0 ? `Thanh toán ${fmt(pay)} tại quầy.` : pay === 0 ? "Buổi học thử miễn phí." : "Trừ 1 buổi trong gói tập."} Nhớ đến sớm 15 phút để trao đổi với ${c.teacher}.<br><br>Đây là website mẫu nên lịch không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA hoặc phần mềm quản lý studio.</div>
        <button class="btn ghost" id="done" style="margin-top:14px">Xong</button>`;
      $("done").onclick = closeSheet;
      toast(`Đã giữ chỗ ${c.name} lúc ${s.time}`);
    };
  }
  $("sheet").hidden = $("scrim").hidden = false;
  $("sheet").querySelector("input, button.btn")?.focus();
}
function closeSheet() { $("sheet").hidden = $("scrim").hidden = true }
$("closeSheet").onclick = $("scrim").onclick = closeSheet;
document.addEventListener("keydown", e => e.key === "Escape" && closeSheet());
function refresh() { renderSlots(); renderNext() }

/* pricing */
const PLANS = [
  { name: "Nhịp nhẹ", sub: "8 buổi mỗi tháng, hợp người mới", price: { 1: 990000, 3: 2690000, 12: 9490000 },
    perks: ["Lớp Hatha, Yin, Thiền", "Giữ chỗ trước 7 ngày", "Mượn thảm miễn phí"] },
  { name: "Không giới hạn", sub: "Tập mọi lớp, mọi khung giờ", price: { 1: 1390000, 3: 3690000, 12: 12900000 }, hot: true,
    perks: ["Tất cả lớp trừ Yoga bay", "Giữ chỗ trước 14 ngày", "Đo độ linh hoạt mỗi tháng", "Bảo lưu tối đa 30 ngày"] },
  { name: "Trọn vẹn", sub: "Gồm Yoga bay và lớp riêng", price: { 1: 1890000, 3: 4990000, 12: 17900000 },
    perks: ["Tất cả lớp kể cả Yoga bay", "2 buổi 1:1 mỗi tháng", "Tủ đồ riêng & khăn sạch", "Bảo lưu tối đa 60 ngày"] },
];
let months = 1;
function renderPlans() {
  $("plans").innerHTML = PLANS.map(p => {
    const total = p.price[months], save = p.price[1] * months - total;
    return `
    <div class="plan ${p.hot ? "hot" : ""}">
      ${p.hot ? `<span class="ribbon">Được chọn nhiều nhất</span>` : ""}
      <h3>${p.name}</h3><p class="sub">${p.sub}</p>
      <div class="amount">${fmt(total)}</div>
      <div class="per">${months === 1 ? "mỗi tháng" : `cho ${months} tháng · ≈ ${fmt(Math.round(total / months / 1000) * 1000)}/tháng`}</div>
      ${save > 0 ? `<span class="save">Tiết kiệm ${fmt(save)}</span>` : `<span class="save" style="visibility:hidden">–</span>`}
      <ul>${p.perks.map(x => `<li>${x}</li>`).join("")}</ul>
      <a class="btn ${p.hot ? "primary" : "ghost"}" href="#schedule">Học thử trước, mua sau</a>
    </div>` }).join("");
}
$("period").onclick = e => { const b = e.target.closest("button"); if (!b) return; months = +b.dataset.m; $("period").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); renderPlans() };

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 2000) }

renderSlots(); renderNext(); renderPlans();
