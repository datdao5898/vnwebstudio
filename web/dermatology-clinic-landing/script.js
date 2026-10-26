const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

/* bảng giá theo nhóm; concern = lựa chọn tương ứng trong form đặt lịch */
const MENU = [
  { key: "mun", label: "Mụn & sẹo", concern: 0, items: [
    { name: "Lấy nhân mụn y khoa", desc: "Làm sạch, lấy nhân bằng dụng cụ vô khuẩn, chiếu đèn LED xanh diệt khuẩn.", price: 450000, unit: "/ buổi 60 phút", tags: ["Mọi loại da"] },
    { name: "Peel da BHA trị mụn", desc: "Peel salicylic 20–30% giảm bít tắc lỗ chân lông, hỗ trợ mụn ẩn và mụn đầu đen.", price: 800000, unit: "/ buổi", tags: ["Bác sĩ chỉ định nồng độ"] },
    { name: "Liệu trình mụn viêm 8 tuần", desc: "4 buổi lấy nhân + peel, thuốc bôi và thuốc uống theo đơn, tái khám 2 tuần/lần.", price: 5900000, unit: "trọn liệu trình", tags: ["Bán chạy", "Gồm thuốc"], hot: true },
    { name: "Laser Fractional CO2 trị sẹo rỗ", desc: "Kích thích tăng sinh collagen, cải thiện sẹo đáy nhọn và sẹo lòng chảo. Ủ tê 45 phút.", price: 2500000, unit: "/ buổi toàn mặt", tags: ["3–5 buổi"] },
  ]},
  { key: "nam", label: "Nám & sắc tố", concern: 1, items: [
    { name: "Laser Pico toàn mặt", desc: "Phá vỡ hắc tố ở thượng bì và trung bì, ít đau, không bong vảy, đi làm ngay sau khi chiếu.", price: 2800000, unit: "/ buổi", tags: ["Nám, tàn nhang"] },
    { name: "Điện di Tranexamic acid", desc: "Đưa hoạt chất ức chế sắc tố vào da, phù hợp nám mảng do nội tiết.", price: 1500000, unit: "/ buổi", tags: ["Kết hợp laser"] },
    { name: "Liệu trình nám 6 buổi", desc: "3 buổi Pico + 3 buổi điện di, kem chống nắng y khoa và kem bôi tối dùng 3 tháng.", price: 14900000, unit: "trọn liệu trình", tags: ["Tiết kiệm 3,4 triệu", "Gồm thuốc"], hot: true },
    { name: "Xóa đốm nâu, đồi mồi", desc: "Laser Q-switched điều trị từng đốm, bác sĩ đánh giá số đốm khi khám.", price: 300000, unit: "/ đốm, từ", tags: ["1–2 buổi"] },
  ]},
  { key: "laser", label: "Laser & trẻ hóa", concern: 6, items: [
    { name: "HIFU nâng cơ trẻ hóa", desc: "Sóng siêu âm hội tụ tác động lớp SMAS, nâng cơ hàm và cổ. Hiệu quả rõ sau 6–8 tuần.", price: 6500000, unit: "/ lần toàn mặt", tags: ["Duy trì 12 tháng"] },
    { name: "Tiêm Botox xóa nhăn trán", desc: "Thuốc nhập khẩu chính hãng, mở hộp trước mặt khách, bác sĩ trực tiếp tiêm.", price: 3000000, unit: "/ vùng, từ", tags: ["Có tem chống giả"] },
    { name: "Triệt lông Diode Laser", desc: "Vùng nách, mép, tay hoặc chân. Bác sĩ khám da trước buổi đầu để chọn mức năng lượng.", price: 300000, unit: "/ buổi vùng nách", tags: ["Gói 10 buổi giảm 25%"], hot: true },
    { name: "Laser CO2 đốt nốt ruồi, mụn thịt", desc: "Kiểm tra nốt bằng soi da trước khi đốt, nốt nghi ngờ sẽ được gửi sinh thiết.", price: 200000, unit: "/ nốt, từ", tags: ["Lành sau 5–7 ngày"] },
  ]},
  { key: "benh", label: "Bệnh da liễu", concern: 3, items: [
    { name: "Khám da liễu với bác sĩ", desc: "Khám, soi da 3D và tư vấn phác đồ. Tái khám trong liệu trình không thu phí.", price: 250000, unit: "/ lượt khám", tags: ["Miễn phí soi da"], hot: true },
    { name: "Viêm da cơ địa, chàm, mề đay", desc: "Điều trị theo mức độ, hướng dẫn chăm sóc da tại nhà cho người lớn và trẻ em.", price: 250000, unit: "phí khám + thuốc theo đơn", tags: ["Khám cả trẻ em"] },
    { name: "Xét nghiệm nấm soi tươi", desc: "Cạo vảy da hoặc móng soi kính hiển vi, có kết quả sau 20 phút.", price: 150000, unit: "/ mẫu", tags: ["Lấy kết quả trong ngày"] },
    { name: "Test áp dị ứng (patch test)", desc: "Tìm chất gây dị ứng mỹ phẩm, kim loại, hương liệu. Đọc kết quả sau 48 và 72 giờ.", price: 900000, unit: "/ bộ 30 chất", tags: ["Cần 3 lần đến"] },
  ]},
];

const DOCS = [
  { id: "hm", short: "HM", name: "BS.CKI Nguyễn Hà My", role: "Mụn, sẹo & laser", bio: "11 năm khám da liễu, chuyên điều trị mụn trứng cá và sẹo rỗ bằng laser. Từng công tác tại Bệnh viện Da liễu Trung ương.", hair: "#2b1d18", skin: "#f3c9ad", long: true, off: [] },
  { id: "dk", short: "ĐK", name: "ThS.BS Lê Đăng Khoa", role: "Nám, sắc tố & lão hóa", bio: "Thạc sĩ Da liễu Đại học Y Hà Nội, tu nghiệp laser thẩm mỹ tại Seoul. Phụ trách các ca nám khó, nám hỗn hợp.", hair: "#1c1c22", skin: "#e8b693", long: false, off: [0] },
  { id: "tn", short: "TN", name: "BS.CKII Phạm Thu Ngân", role: "Bệnh da & da trẻ em", bio: "Hơn 20 năm điều trị viêm da cơ địa, vảy nến, nấm da. Được phụ huynh tin chọn cho các ca da trẻ em.", hair: "#4a2f25", skin: "#f1c3a5", long: true, glasses: true, off: [3] },
];

const portrait = d => `<svg viewBox="0 0 200 170" aria-hidden="true">
  <circle cx="100" cy="66" r="${d.long ? 44 : 38}" fill="${d.hair}" ${d.long ? "" : 'transform="translate(0 -6)"'}/>
  ${d.long ? `<rect x="56" y="64" width="88" height="62" rx="20" fill="${d.hair}"/>` : ""}
  <rect x="88" y="94" width="24" height="26" rx="8" fill="${d.skin}"/>
  <ellipse cx="100" cy="72" rx="30" ry="35" fill="${d.skin}"/>
  <path d="M70 62 C74 36 126 36 130 62 C118 50 92 46 70 62Z" fill="${d.hair}"/>
  <circle cx="89" cy="74" r="3" fill="#2a1d18"/><circle cx="111" cy="74" r="3" fill="#2a1d18"/>
  <path d="M92 90 Q100 96 108 90" stroke="#b5604b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${d.glasses ? `<g fill="none" stroke="#2a1d18" stroke-width="2"><circle cx="89" cy="74" r="9"/><circle cx="111" cy="74" r="9"/><path d="M98 74h4"/></g>` : ""}
  <path d="M30 170 C34 132 60 116 100 116 C140 116 166 132 170 170Z" fill="#ffffff" stroke="#d6def3" stroke-width="2"/>
  <path d="M88 116 L100 140 L112 116Z" fill="#2747c9"/>
  <path d="M74 122 C70 146 80 156 92 150" stroke="#14213d" stroke-width="3" fill="none"/><circle cx="93" cy="150" r="5" fill="#14213d"/>
  <rect x="122" y="140" width="26" height="6" rx="3" fill="#ff6b57"/>
</svg>`;

/* ---- tabs bảng giá ---- */
let tab = 0;
function renderTabs() {
  $("tabs").innerHTML = MENU.map((m, i) => `<button class="tab" role="tab" aria-selected="${i === tab}" data-i="${i}">${m.label}</button>`).join("");
  const m = MENU[tab];
  $("priceList").innerHTML = m.items.map(s => `
    <article class="svc">
      <h3>${s.name}</h3>
      <div class="p">${fmt(s.price)}<small>${s.unit}</small></div>
      <p>${s.desc}</p>
      <div class="tags">${s.tags.map((t, j) => `<span class="${s.hot && j === 0 ? "hot" : ""}">${t}</span>`).join("")}</div>
      <button class="pick" data-c="${m.concern}" data-n="${s.name}">Đặt lịch tư vấn dịch vụ này →</button>
    </article>`).join("");
}
$("tabs").onclick = e => { const b = e.target.closest(".tab"); if (!b) return; tab = +b.dataset.i; renderTabs() };
$("priceList").onclick = e => {
  const b = e.target.closest(".pick"); if (!b) return;
  $("concern").selectedIndex = +b.dataset.c; picked = b.dataset.n; renderSum();
  $("dat-lich").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};

/* ---- đặt lịch ---- */
const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const AM = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30"];
const PM = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];
const now = new Date();
const DAYS = Array.from({ length: 6 }, (_, i) => { const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d });

let doc = DOCS[0].id, day = 0, slot = null, picked = null;

const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 9973; return h };
function slotsFor(d, di) {
  const dt = DAYS[di], dow = dt.getDay();
  const doctor = DOCS.find(x => x.id === d);
  if (doctor.off.includes(dow)) return null;
  const list = dow === 0 ? AM : AM.concat(PM);
  return list.map(t => {
    const [h, m] = t.split(":").map(Number);
    const past = di === 0 && (h * 60 + m) <= now.getHours() * 60 + now.getMinutes() + 30;
    const busy = hash(d + dt.getDate() + t) % 10 < 4;
    return { t, free: !past && !busy };
  });
}

function renderDocs() {
  $("docs").innerHTML = DOCS.map(d => `<button type="button" class="dchip" aria-pressed="${d.id === doc}" data-id="${d.id}">
    <span class="ava">${d.short}</span><span><b>${d.name.split(" ").slice(-2).join(" ")}</b>${d.role}</span></button>`).join("");
}
function renderDays() {
  $("days").innerHTML = DAYS.map((d, i) => `<button type="button" class="day" aria-pressed="${i === day}" data-i="${i}">
    <small>${i === 0 ? "Hôm nay" : WD[d.getDay()]}</small><b>${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}</b></button>`).join("");
}
function renderSlots() {
  const list = slotsFor(doc, day);
  if (!list) { $("slots").innerHTML = `<div class="none">Bác sĩ nghỉ ngày này. Chọn ngày khác hoặc bác sĩ khác nhé.</div>`; slot = null; renderSum(); return }
  if (slot && !list.find(s => s.t === slot && s.free)) slot = null;
  if (!list.some(s => s.free)) { $("slots").innerHTML = `<div class="none">Đã kín lịch. Chọn ngày khác hoặc bác sĩ khác nhé.</div>`; renderSum(); return }
  $("slots").innerHTML = list.map(s => `<button type="button" class="slot" data-t="${s.t}" ${s.free ? "" : "disabled"} aria-pressed="${s.t === slot}">${s.t}</button>`).join("");
  renderSum();
}
function renderSum() {
  const d = DOCS.find(x => x.id === doc), dt = DAYS[day];
  $("sum").innerHTML = `
    <div><span>Vấn đề</span><b>${picked || $("concern").value}</b></div>
    <div><span>Bác sĩ</span><b>${d.name}</b></div>
    <div><span>Thời gian</span><b>${slot ? `${slot}, ${WD[dt.getDay()]} ${dt.toLocaleDateString("vi-VN")}` : "Chưa chọn giờ"}</b></div>
    <div><span>Phí khám (gồm soi da)</span><b class="fee">${fmt(250000)}</b></div>`;
}

$("docs").onclick = e => { const b = e.target.closest(".dchip"); if (!b) return; doc = b.dataset.id; renderDocs(); renderSlots() };
$("days").onclick = e => { const b = e.target.closest(".day"); if (!b) return; day = +b.dataset.i; renderDays(); renderSlots() };
$("slots").onclick = e => { const b = e.target.closest(".slot"); if (!b || b.disabled) return; slot = b.dataset.t; renderSlots() };
$("concern").onchange = () => { picked = null; renderSum() };

$("bookForm").onsubmit = e => {
  e.preventDefault();
  if (!slot) { $("ok").hidden = false; $("ok").innerHTML = `<strong>Bạn chưa chọn giờ khám</strong>Chọn một khung giờ còn trống ở trên rồi bấm xác nhận lại nhé.`; return }
  const d = DOCS.find(x => x.id === doc), dt = DAYS[day];
  $("ok").hidden = false;
  $("ok").innerHTML = `<strong>Đã giữ lịch ${slot}, ${WD[dt.getDay()]} ${dt.toLocaleDateString("vi-VN")}</strong>
    ${$("fName").value} khám với ${d.name}. Mã hẹn MK-${String(hash(doc + slot + day)).padStart(4, "0")}.<br>
    Đây là website mẫu nên lịch không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA, Google Sheets hoặc phần mềm quản lý phòng khám.`;
  $("bookBtn").textContent = "Đặt thêm lịch khác";
};

/* ---- đội ngũ ---- */
$("team").innerHTML = DOCS.map(d => `
  <article class="person">
    <div class="portrait">${portrait(d)}</div>
    <div class="info"><h3>${d.name}</h3><div class="role">${d.role}</div><p>${d.bio}</p></div>
  </article>`).join("");

renderTabs(); renderDocs(); renderDays();
/* chọn sẵn giờ trống đầu tiên để khung đặt lịch không bị trống khi demo */
(() => {
  for (let i = 0; i < DAYS.length; i++) {
    const s = (slotsFor(doc, i) || []).find(x => x.free);
    if (s) { day = i; slot = s.t; break }
  }
  renderDays(); renderSlots();
})();
