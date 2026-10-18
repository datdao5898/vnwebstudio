const fmt = n => n.toLocaleString("vi-VN") + "₫";
const mil = n => Math.round(n / 1e6).toLocaleString("vi-VN");
const $ = id => document.getElementById(id);

const STYLES = {
  "hien-dai": { name: "Hiện đại", k: 1, desc: "Đường nét gọn, gam xám khói điểm vàng mù tạt. Tủ kịch trần, tay nắm âm, đèn LED hắt trần.", sw: [["#e6eaed", "Sơn xám khói"], ["#c9a77c", "Gỗ sồi"], ["#2f4858", "Nỉ xanh than"], ["#e3a21a", "Điểm nhấn"]] },
  "japandi": { name: "Japandi", k: 1.05, desc: "Giao thoa Nhật Bản và Bắc Âu: gỗ sáng, vải lanh, nhiều cây xanh, đồ đạc thấp và ít chi tiết.", sw: [["#ebe6dc", "Sơn vôi"], ["#b88b5e", "Gỗ tần bì"], ["#a8a493", "Vải lanh"], ["#55663f", "Xanh rêu"]] },
  "indochine": { name: "Indochine", k: 1.15, desc: "Đông Dương hoài cổ: gạch bông, gỗ tối màu, mây tre đan và sắc xanh ngọc, vàng đồng.", sw: [["#eef0ea", "Sơn trắng ngà"], ["#5c3b26", "Gỗ gụ"], ["#1f5e5b", "Nhung xanh ngọc"], ["#c99a2e", "Đồng thau"]] },
  "toi-gian": { name: "Tối giản", k: 0.95, desc: "Ít mà đủ: mặt phẳng trắng, đồ nội thất đa năng, giấu hết thiết bị để căn phòng luôn thoáng.", sw: [["#f4f4f2", "Trắng tuyết"], ["#d2b48c", "Gỗ thông"], ["#dcdcd8", "Bố xám"], ["#1d1d1d", "Đen mờ"]] },
};
const PKG = {
  design: { name: "Thiết kế 3D", unit: 180000 },
  build: { name: "Thiết kế + thi công", unit: 3200000 },
  premium: { name: "Trọn gói cao cấp", unit: 5500000 },
};

/* living room drawn once per scene; colours come from CSS variables on .scene[data-style] */
function room(uid) {
  const boards = [338, 358, 384, 418].map(y => `M0 ${y}H800`).join("");
  return `<svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Minh họa phòng khách">
  <defs>
    <pattern id="tile-${uid}" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" class="r-floor"/><path d="M15 2 28 15 15 28 2 15Z" class="r-tile"/><circle cx="15" cy="15" r="3.5" class="r-tile2"/><circle cx="0" cy="0" r="4" class="r-tile2"/><circle cx="30" cy="0" r="4" class="r-tile2"/><circle cx="0" cy="30" r="4" class="r-tile2"/><circle cx="30" cy="30" r="4" class="r-tile2"/></pattern>
    <linearGradient id="beam-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <rect x="120" y="0" width="680" height="322" class="r-wall"/>
  <polygon points="0,404 120,322 800,322 800,460 0,460" class="r-floor"/>
  <polygon points="0,404 120,322 800,322 800,460 0,460" fill="url(#tile-${uid})" class="r-tilelayer"/>
  <path d="${boards}" class="r-boards"/>
  <polygon points="0,0 120,0 120,322 0,404" class="r-wall2"/>
  <rect x="120" y="314" width="680" height="8" class="r-trim"/>
  <polygon points="28,84 92,72 92,232 28,254" class="r-glass"/>
  <path d="M28 84 92 72 92 232 28 254Z M60 78V243 M28 168 92 152" class="r-frame"/>
  <path d="M182 300V128a60 60 0 0 1 120 0v172Z" class="r-glass"/>
  <path d="M182 300V128a60 60 0 0 1 120 0v172Z M242 68V300 M182 190H302" class="r-frame"/>
  <polygon points="182,322 302,322 400,460 140,460" fill="url(#beam-${uid})" opacity=".55"/>
  <rect x="436" y="54" width="186" height="116" rx="3" class="r-mat"/>
  <rect x="448" y="66" width="162" height="92" class="r-art"/>
  <circle cx="500" cy="108" r="24" class="r-accent"/>
  <path d="M448 140q40-30 80-6t82-14v38H448Z" class="r-art2"/>
  <path d="M690 0V108" class="r-line"/>
  <path d="M662 142q28-50 56 0Z" class="r-accent"/>
  <ellipse cx="690" cy="143" rx="18" ry="4" fill="#fff6cf"/>
  <rect x="730" y="118" width="64" height="204" class="r-wood-d" opacity=".35"/>
  <g class="r-wood"><rect x="730" y="118" width="64" height="6"/><rect x="730" y="184" width="64" height="6"/><rect x="730" y="250" width="64" height="6"/><rect x="730" y="118" width="5" height="204"/><rect x="789" y="118" width="5" height="204"/></g>
  <rect x="740" y="156" width="8" height="28" class="r-accent"/><rect x="750" y="150" width="9" height="34" class="r-sofa"/><rect x="761" y="160" width="7" height="24" class="r-cushion"/>
  <path d="M770 250c-6-14 22-14 16 0Z" class="r-pot"/><circle cx="752" cy="240" r="9" class="r-leaf"/>
  <path d="M352 284h44l-6 38h-32Z" class="r-pot"/>
  <g class="r-leaf"><ellipse cx="374" cy="240" rx="9" ry="34" transform="rotate(-4 374 240)"/><ellipse cx="356" cy="252" rx="8" ry="28" transform="rotate(-32 356 252)"/><ellipse cx="394" cy="250" rx="8" ry="30" transform="rotate(30 394 250)"/><ellipse cx="346" cy="270" rx="6" ry="18" transform="rotate(-60 346 270)"/></g>
  <ellipse cx="555" cy="400" rx="236" ry="42" class="r-rug"/>
  <ellipse cx="555" cy="400" rx="212" ry="33" class="r-rugline"/>
  <rect x="420" y="210" width="270" height="64" rx="18" class="r-sofa-d"/>
  <rect x="410" y="262" width="290" height="48" rx="12" class="r-sofa"/>
  <rect x="400" y="236" width="36" height="78" rx="14" class="r-sofa-d"/>
  <rect x="674" y="236" width="36" height="78" rx="14" class="r-sofa-d"/>
  <rect x="446" y="226" width="62" height="46" rx="12" class="r-cushion" transform="rotate(-7 477 249)"/>
  <rect x="606" y="226" width="58" height="44" rx="12" class="r-accent" transform="rotate(6 635 248)"/>
  <rect x="420" y="312" width="7" height="12" class="r-wood-d"/><rect x="684" y="312" width="7" height="12" class="r-wood-d"/>
  <path d="M498 378 492 414M612 378 618 414M555 386V418" class="r-woodline"/>
  <ellipse cx="555" cy="376" rx="90" ry="18" class="r-wood-d"/>
  <ellipse cx="555" cy="371" rx="90" ry="18" class="r-wood"/>
  <rect x="520" y="358" width="42" height="9" rx="2" class="r-accent"/><rect x="524" y="352" width="34" height="7" rx="2" class="r-cushion"/>
  <path d="M584 352h16v12a8 8 0 0 1-16 0Z" class="r-mat"/>
</svg>`;
}
$("heroScene").innerHTML = room("h");
$("styleScene").innerHTML = room("s");

let style = "japandi";
$("styleChips").innerHTML = Object.entries(STYLES).map(([k, s]) => `<button type="button" class="chip" data-s="${k}" aria-pressed="${k === style}">${s.name}</button>`).join("");
$("styleChips").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; style = b.dataset.s; update() };
["type", "area"].forEach(id => $(id).oninput = update);
$("pkg").onchange = update;

let summary = "";
function update() {
  const s = STYLES[style], area = +$("area").value, type = +$("type").value;
  const pk = document.querySelector("[name=pkg]:checked").value, p = PKG[pk];
  document.querySelectorAll("#styleChips .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.s === style));
  $("styleScene").dataset.style = style;
  $("styleName").textContent = s.name;
  $("styleDesc").textContent = s.desc;
  $("swatches").innerHTML = s.sw.map(([c, n]) => `<span><i style="background:${c}"></i>${n}</span>`).join("");
  $("areaOut").textContent = area + " m²";

  const designDays = Math.round(7 + area / 12);
  let totalText, rows;
  if (pk === "design") {
    const t = Math.round(area * p.unit / 1e5) * 1e5;
    totalText = fmt(t);
    rows = [["Đơn giá", fmt(p.unit) + "/m²"], ["Thời gian thiết kế", designDays + " ngày"], ["Hồ sơ", "3D + bản vẽ kỹ thuật"]];
    summary = `${s.name}, ${area} m², gói ${p.name}: ${totalText}`;
  } else {
    const t = area * p.unit * type * s.k, lo = t * 0.92, hi = t * 1.08;
    const weeks = Math.ceil(4 + area / 28 + (pk === "premium" ? 2 : 0));
    totalText = `${mil(lo)} – ${mil(hi)} triệu₫`;
    rows = [["Đơn giá quy đổi", fmt(Math.round(p.unit * type * s.k / 1e4) * 1e4) + "/m²"], ["Thiết kế", designDays + " ngày"], ["Sản xuất & thi công", "khoảng " + weeks + " tuần"], ["Thanh toán", "4 đợt theo tiến độ"]];
    summary = `${s.name}, ${area} m², gói ${p.name}: ${totalText}`;
  }
  $("total").textContent = totalText;
  $("break").innerHTML = rows.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join("");
}
update();

$("calc").onsubmit = e => e.preventDefault();
$("toBook").onclick = () => { $("b-note").value = "Dự toán: " + summary + ". " + $("type").selectedOptions[0].text + "." };

const d = new Date(); d.setDate(d.getDate() + 2);
$("b-date").min = new Date().toISOString().slice(0, 10);
$("b-date").value = d.toISOString().slice(0, 10);
$("b-note").value = "Căn hộ 2PN mới nhận, muốn làm phong cách Japandi, có góc làm việc cho chồng.";

$("booking").onsubmit = e => {
  e.preventDefault();
  const v = id => $(id).value;
  $("ok").innerHTML = `<strong>Đã ghi nhận lịch hẹn mẫu</strong>Kiến trúc sư sẽ gọi ${v("b-name")} qua số ${v("b-phone")} để xác nhận buổi ${v("b-slot").toLowerCase()}, ngày ${v("b-date").split("-").reverse().join("/")}.<br>Đây là website mẫu nên yêu cầu không được gửi đi. Khi chạy thật, form sẽ nối với Zalo, email hoặc CRM của công ty.`;
  $("ok").hidden = false;
};
