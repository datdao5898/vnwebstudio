const fmt = n => Math.round(n).toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);
const DAYS = 22, ADMISSION = 2500000;

const CLASSES = [
  { id: "tre", name: "Nhà trẻ", age: "18–36 tháng", fee: 6800000, ratio: "1 cô : 5 bé", size: "15 bé/lớp", year: "2024", color: "#ff6b5e", tint: "#ffe9e6",
    focus: ["Tập tự xúc ăn, đi vệ sinh đúng chỗ", "Xâu hạt, nặn đất để luyện ngón tay", "Hát và vận động theo bài tiếng Anh"] },
  { id: "mam", name: "Lớp Mầm", age: "3–4 tuổi", fee: 6200000, ratio: "1 cô : 8 bé", size: "20 bé/lớp", year: "2023", color: "#e5a400", tint: "#fff4d1",
    focus: ["Kể chuyện, đóng vai bác sĩ, đầu bếp", "Gieo hạt và chăm vườn rau của lớp", "Tiếng Anh tích hợp 4 tiết/tuần"] },
  { id: "choi", name: "Lớp Chồi", age: "4–5 tuổi", fee: 6200000, ratio: "1 cô : 9 bé", size: "22 bé/lớp", year: "2022", color: "#3a9ff0", tint: "#e3f2ff",
    focus: ["STEAM: thí nghiệm nổi chìm, nam châm", "Vẽ, cắt dán, làm đồ chơi tái chế", "Tiếng Anh tích hợp 5 tiết/tuần"] },
  { id: "la", name: "Lớp Lá", age: "5–6 tuổi", fee: 6500000, ratio: "1 cô : 10 bé", size: "24 bé/lớp", year: "2021", color: "#2f9e5b", tint: "#e2f5e8",
    focus: ["Làm quen chữ cái, số, tư thế ngồi viết", "Kỹ năng tự phục vụ, an toàn giao thông", "Chuẩn bị tâm thế vào lớp 1"] },
];
const SESSIONS = {
  full: { label: "cả ngày", rate: 1, meal: 45000, meals: "4 bữa" },
  half: { label: "buổi sáng", rate: .65, meal: 28000, meals: "2 bữa" },
};
const ADDONS = [
  { id: "bus", name: "Xe đưa đón", desc: "Bán kính 5km, có cô đi kèm", price: 1200000 },
  { id: "native", name: "Tiếng Anh bản ngữ", desc: "3 tiết/tuần, lớp 10 bé", price: 900000 },
  { id: "swim", name: "Bơi nước ấm", desc: "8 buổi/tháng, từ 3 tuổi", price: 550000 },
  { id: "art", name: "Năng khiếu múa hoặc vẽ", desc: "2 buổi/tuần sau 16:00", price: 400000 },
  { id: "late", name: "Trông muộn đến 18:30", desc: "Chỉ áp dụng học cả ngày", price: 600000, fullOnly: true },
];
const TERMS = [
  { id: "m", name: "Theo tháng", months: 1, off: 0 },
  { id: "k", name: "Theo kỳ 5 tháng", months: 5, off: .03 },
  { id: "y", name: "Cả năm 10 tháng", months: 10, off: .07 },
];

/* class cards */
const blocks = c => `<svg viewBox="0 0 120 80" aria-hidden="true">
  <rect x="10" y="44" width="30" height="30" rx="6" fill="${c.color}"/><text x="25" y="65" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">${c.age[0]}</text>
  <rect x="44" y="44" width="30" height="30" rx="6" fill="#fff" stroke="${c.color}" stroke-width="3"/><circle cx="59" cy="59" r="7" fill="${c.color}"/>
  <path d="M30 40 L45 14 L60 40 Z" fill="${c.color}" opacity=".55"/>
  <rect x="78" y="22" width="32" height="52" rx="16" fill="${c.color}" opacity=".3"/><circle cx="94" cy="38" r="6" fill="${c.color}"/></svg>`;

$("classGrid").innerHTML = CLASSES.map(c => `
  <article class="class-card" style="--c:${c.color};--t:${c.tint}">
    <div class="cc-art">${blocks(c)}<span class="age">${c.age}</span></div>
    <h3>${c.name}</h3>
    <div class="cc-meta"><span>${c.ratio}</span><span>${c.size}</span></div>
    <ul>${c.focus.map(f => `<li>${f}</li>`).join("")}</ul>
    <div class="cc-foot">
      <div class="fee"><small>Học phí cả ngày</small>${fmt(c.fee)}<small>/tháng</small></div>
      <button class="btn line" data-class="${c.id}">Tính học phí</button>
    </div>
  </article>`).join("");

/* calculator */
const state = { cls: "mam", session: "full", addons: new Set(["native"]), term: "k", sibling: false, newKid: true };

$("segClass").innerHTML = CLASSES.map(c => `<label class="opt"><input type="radio" name="cls" value="${c.id}" ${c.id === state.cls ? "checked" : ""}><span><b>${c.name}</b>${c.age}</span></label>`).join("");
$("segTerm").innerHTML = TERMS.map(t => `<label class="opt"><input type="radio" name="term" value="${t.id}" ${t.id === state.term ? "checked" : ""}><span><b>${t.name}</b>${t.off ? `Giảm ${t.off * 100}% học phí` : "Linh hoạt"}</span></label>`).join("");
$("addons").innerHTML = ADDONS.map(a => `<label class="chk" data-id="${a.id}"><input type="checkbox" value="${a.id}" ${state.addons.has(a.id) ? "checked" : ""}><span class="box"></span><span class="txt"><b>${a.name}</b>${a.desc}</span><span class="pr">+${fmt(a.price)}</span></label>`).join("");

$("calcForm").addEventListener("change", e => {
  const t = e.target;
  if (t.name === "cls") state.cls = t.value;
  else if (t.name === "session") state.session = t.value;
  else if (t.name === "term") state.term = t.value;
  else if (t.id === "sibling") state.sibling = t.checked;
  else if (t.id === "newKid") state.newKid = t.checked;
  else if (t.type === "checkbox") t.checked ? state.addons.add(t.value) : state.addons.delete(t.value);
  renderBill();
});

function renderBill() {
  const c = CLASSES.find(x => x.id === state.cls), s = SESSIONS[state.session], term = TERMS.find(x => x.id === state.term);
  if (state.session === "half") state.addons.delete("late");
  document.querySelectorAll("#addons .chk").forEach(l => {
    const a = ADDONS.find(x => x.id === l.dataset.id), off = a.fullOnly && state.session === "half";
    l.classList.toggle("disabled", off); l.querySelector("input").disabled = off; l.querySelector("input").checked = state.addons.has(a.id);
  });

  const base = c.fee * s.rate;
  const sib = state.sibling ? base * .1 : 0;
  const termOff = (base - sib) * term.off;
  const meal = s.meal * DAYS;
  const extras = ADDONS.filter(a => state.addons.has(a.id));
  const month = base - sib - termOff + meal + extras.reduce((n, a) => n + a.price, 0);

  $("billTitle").textContent = `${c.name} · ${s.label}`;
  $("billLines").innerHTML = [
    [`Học phí ${s.label}`, fmt(base)],
    sib && ["Giảm anh/chị em 10%", "−" + fmt(sib), "minus"],
    termOff && [`Giảm đóng ${term.name.toLowerCase()}`, "−" + fmt(termOff), "minus"],
    [`Tiền ăn ${s.meals} (${DAYS} ngày × ${fmt(s.meal)})`, fmt(meal)],
    ...extras.map(a => [a.name, fmt(a.price)]),
  ].filter(Boolean).map(([k, v, cls]) => `<div class="line ${cls || ""}"><span>${k}</span><span>${v}</span></div>`).join("");
  $("billMonth").textContent = fmt(month);

  const termTotal = month * term.months, first = termTotal + (state.newKid ? ADMISSION : 0);
  $("billTerm").innerHTML = `
    ${term.months > 1 ? `<div class="line"><span>Đóng mỗi lần (${term.months} tháng)</span><span>${fmt(termTotal)}</span></div>` : ""}
    ${state.newKid ? `<div class="line"><span>Phí nhập học một lần<br><small>4 bộ đồng phục, balo, học liệu cả năm</small></span><span>${fmt(ADMISSION)}</span></div>` : ""}
    <div class="line first"><span>Lần đóng đầu tiên</span><span>${fmt(first)}</span></div>`;
}
renderBill();

$("classGrid").addEventListener("click", e => {
  const b = e.target.closest("[data-class]"); if (!b) return;
  state.cls = b.dataset.class;
  document.querySelector(`input[name="cls"][value="${state.cls}"]`).checked = true;
  renderBill();
  $("hoc-phi").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
$("billCta").addEventListener("click", () => { $("visitYear").value = CLASSES.find(x => x.id === state.cls).year });

/* one day timeline */
const DAY = {
  tre: [
    ["7:00", "Đón bé", "Cô đón tại cửa lớp, kiểm tra thân nhiệt, ghi chú ba mẹ dặn vào app.", "#ffc83d"],
    ["7:45", "Ăn sáng", "Cháo, súp hoặc phở mềm. Cô ghi lại bé ăn hết bao nhiêu.", "#ff6b5e"],
    ["8:30", "Chơi ngoài sân", "Bò, leo cầu thang mềm, chơi bể cát và tưới cây cùng cô.", "#2f9e5b"],
    ["9:30", "Hoạt động giác quan", "Xâu hạt, bóc dán, nghe nhạc và tập nói theo tranh.", "#3a9ff0"],
    ["10:30", "Ăn trưa", "Cơm nát, canh rau củ, thịt cá xay. Bé tập tự xúc với thìa nhỏ.", "#ff6b5e"],
    ["11:30", "Ngủ trưa", "Phòng ngủ riêng, đèn dịu, cô trực suốt giấc ngủ.", "#8a7cf0"],
    ["14:30", "Bữa chiều & chơi tự do", "Sữa chua, hoa quả. Chơi khu đồ chơi gỗ trong lớp.", "#ffc83d"],
    ["16:15", "Chuẩn bị về", "Lau mặt, thay đồ sạch, nhận nhật ký ngày qua app.", "#2f9e5b"],
  ],
  mg: [
    ["7:00", "Đón bé & thể dục sáng", "Bé tự cất balo, chào cô, tập bài thể dục theo nhạc.", "#ffc83d"],
    ["7:45", "Ăn sáng", "Bếp nấu tại trường, thực đơn dán ở bảng tin mỗi tuần.", "#ff6b5e"],
    ["8:30", "Giờ học chủ đề", "Montessori, STEAM hoặc làm quen chữ số theo giáo án tuần.", "#3a9ff0"],
    ["9:30", "Tiếng Anh & ngoài trời", "Tiết tiếng Anh 30 phút, sau đó ra vườn rau hoặc sân vận động.", "#2f9e5b"],
    ["10:45", "Ăn trưa", "Cơm, món mặn, canh và tráng miệng. Bé tự lấy và dọn khay.", "#ff6b5e"],
    ["11:45", "Ngủ trưa", "Giấc ngủ khoảng 2 tiếng, cô ghi giờ bé ngủ và dậy.", "#8a7cf0"],
    ["14:30", "Bữa chiều", "Bánh, sữa hoặc chè ít đường kèm trái cây theo mùa.", "#ffc83d"],
    ["15:00", "Năng khiếu & góc chơi", "Múa, vẽ, bơi hoặc chơi góc xây dựng, góc bác sĩ.", "#3a9ff0"],
    ["16:30", "Ba mẹ đón", "Cô kể nhanh một điều bé làm được trong ngày.", "#2f9e5b"],
  ],
};
function renderDay(k) {
  $("timeline").innerHTML = DAY[k].map(([t, h, p, c]) => `<li style="--c:${c}"><time>${t}</time><div><b>${h}</b><p>${p}</p></div></li>`).join("");
}
document.querySelector(".tabs").addEventListener("click", e => {
  const b = e.target.closest("[role=tab]"); if (!b) return;
  document.querySelectorAll(".tabs [role=tab]").forEach(x => x.setAttribute("aria-selected", x === b));
  renderDay(b.dataset.k);
});
renderDay("tre");

/* visit form: default to next day the school receives visitors (Mon–Sat) */
const d = new Date(); d.setDate(d.getDate() + 1);
if (d.getDay() === 0) d.setDate(d.getDate() + 1);
const iso = x => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
$("visitDate").min = iso(new Date()); $("visitDate").value = iso(d);

$("visitForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const f = { get: k => String(data.get(k)).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]) };
  const day = new Date(f.get("date") + "T00:00");
  if (day.getDay() === 0) { $("visitDate").setCustomValidity("Trường không đón khách vào Chủ nhật, ba mẹ chọn ngày khác nhé."); $("visitDate").reportValidity(); return }
  const wd = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][day.getDay()];
  $("visitFields").hidden = true;
  $("visitOk").hidden = false;
  $("visitOk").innerHTML = `<strong>Đã nhận đăng ký!</strong>
    Hẹn ${f.get("parent")} và ${f.get("kid")} lúc ${f.get("slot")}, ${wd} ${f.get("date").split("-").reverse().join("/")}. Cô tuyển sinh sẽ gọi số ${f.get("phone")} để xác nhận trong 2 giờ làm việc.
    <small>Đây là website mẫu nên thông tin không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA, email hoặc phần mềm quản lý tuyển sinh.</small>
    <button type="button" class="btn line" id="again">Đăng ký thêm</button>`;
  $("again").onclick = () => { $("visitOk").hidden = true; $("visitFields").hidden = false };
});
$("visitDate").addEventListener("input", e => e.target.setCustomValidity(""));
