const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

/* ---------- SVG scenes: each package gets its own illustrated "photo" ---------- */
let uid = 0;
const grad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;

function couple(x, y, s = 1, suit = "#1f2740") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="2" cy="0" rx="38" ry="4" fill="rgba(0,0,0,.14)"/>
    <path d="M12 -76 Q32 -58 36 -4 L22 -4 Q20 -40 10 -66Z" fill="#fff" opacity=".7"/>
    <path d="M-22 -58 Q-12 -63 -2 -58 L0 -30 L-2 0 L-9 0 L-12 -26 L-15 0 L-22 0 L-24 -30Z" fill="${suit}"/>
    <path d="M-15 -58 L-12 -47 L-9 -58Z" fill="#fff"/>
    <circle cx="-12" cy="-67" r="7" fill="#e6c2a4"/>
    <path d="M-19.5 -67 Q-12 -80 -4.5 -67 Q-12 -72 -19.5 -67Z" fill="#2b2420"/>
    <path d="M6 -59 Q12 -62 18 -59 L19 -42 Q32 -14 40 0 L-8 0 Q2 -16 5 -42Z" fill="#fff" stroke="rgba(24,32,58,.12)" stroke-width=".8"/>
    <path d="M5 -42 Q12 -38 19 -42" stroke="rgba(24,32,58,.12)" fill="none"/>
    <circle cx="12" cy="-66" r="6.5" fill="#efcdb2"/>
    <circle cx="16" cy="-71" r="4.2" fill="#3a2a22"/>
    <path d="M-3 -52 Q2 -46 4 -44" stroke="${suit}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <circle cx="4" cy="-44" r="4.6" fill="#c25c72"/><circle cx="7.5" cy="-41" r="3" fill="#f3b7c4"/><circle cx="1" cy="-40.5" r="2.6" fill="#fff"/>
  </g>`;
}
const pine = (x, y, h, c) => `<path d="M${x} ${y - h} L${x + h * .32} ${y} L${x - h * .32} ${y}Z" fill="${c}"/>`;

const SCENES = {
  studio(i) {
    return { defs: grad(`a${i}`, [[0, "#edf1f7"], [1, "#d5deea"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <path d="M38 300 L38 128 A62 62 0 0 1 162 128 L162 300Z" fill="#fff" opacity=".9"/>
      <path d="M52 300 L52 130 A48 48 0 0 1 148 130 L148 300" stroke="#c9d3e2" stroke-width="1.5" fill="none"/>
      <rect y="258" width="200" height="42" fill="#cdd6e3"/>
      ${[0, 1, 2, 3, 4].map(k => `<path d="M24 262 Q${18 + k * 4} ${226 - k * 6} ${10 + k * 7} ${200 + k * 4}" stroke="#b79457" stroke-width="1.6" fill="none"/>`).join("")}
      <rect x="16" y="255" width="16" height="12" rx="3" fill="#fff"/>
      ${[0, 1, 2, 3].map(k => `<path d="M178 262 Q${182 - k * 3} ${230 - k * 5} ${186 - k * 6} ${206 + k * 3}" stroke="#b79457" stroke-width="1.6" fill="none"/>`).join("")}
      <rect x="170" y="255" width="16" height="12" rx="3" fill="#fff"/>
      ${couple(100, 280, 1.15)}` };
  },
  set(i) {
    const col = x => `<rect x="${x}" y="96" width="24" height="170" fill="#fff"/><rect x="${x - 4}" y="88" width="32" height="10" fill="#fff"/><rect x="${x - 4}" y="262" width="32" height="8" fill="#fff"/>${[5, 11, 17].map(d => `<line x1="${x + d}" y1="100" x2="${x + d}" y2="260" stroke="#ead9de"/>`).join("")}`;
    return { defs: grad(`a${i}`, [[0, "#f7e9ec"], [1, "#eed4db"]]) + grad(`b${i}`, [[0, "#bcd2ea"], [1, "#e8eff7"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <path d="M64 262 L64 120 A36 36 0 0 1 136 120 L136 262Z" fill="url(#b${i})" stroke="#fff" stroke-width="5"/>
      <line x1="100" y1="86" x2="100" y2="262" stroke="#fff" stroke-width="3"/><line x1="64" y1="170" x2="136" y2="170" stroke="#fff" stroke-width="3"/>
      ${col(22)}${col(154)}
      ${[0, 1, 2, 3, 4, 5].map(k => `<circle cx="${30 + k * 3}" cy="${92 - k * 2 + (k % 2) * 6}" r="5" fill="${k % 2 ? "#7aa07c" : "#f3b7c4"}"/>`).join("")}
      <rect x="0" y="266" width="200" height="34" fill="#fff"/><rect x="10" y="276" width="180" height="1" fill="#ead9de"/><rect x="0" y="288" width="200" height="1" fill="#ead9de"/>
      ${couple(100, 276, 1.1)}` };
  },
  dalat(i) {
    let pines = "";
    [[14, 236, 46], [34, 240, 62], [52, 236, 40], [150, 238, 58], [170, 236, 44], [188, 240, 66], [128, 236, 34]].forEach(([x, y, h]) => pines += pine(x, y, h, "#2f5546"));
    return { defs: grad(`a${i}`, [[0, "#c6dcef"], [.7, "#f4e4e8"], [1, "#f7ece9"]]) + grad(`b${i}`, [[0, "#9dc08f"], [1, "#6f9a6c"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <circle cx="146" cy="98" r="18" fill="#fff" opacity=".85"/>
      <path d="M0 190 Q40 150 80 176 Q120 140 160 168 Q185 156 200 164 L200 240 L0 240Z" fill="#a7bfd0"/>
      <path d="M0 214 Q50 186 100 206 Q150 184 200 204 L200 240 L0 240Z" fill="#6f9089"/>
      <rect y="226" width="200" height="18" fill="#bcd3e3"/><rect x="40" y="232" width="60" height="1.5" fill="#fff" opacity=".7"/><rect x="120" y="237" width="40" height="1.5" fill="#fff" opacity=".7"/>
      ${pines}
      <path d="M0 252 Q100 238 200 252 L200 300 L0 300Z" fill="url(#b${i})"/>
      ${[20, 44, 160, 182].map((x, k) => `<circle cx="${x}" cy="${266 + k % 2 * 10}" r="2.4" fill="${k % 2 ? "#fff" : "#f3b7c4"}"/>`).join("")}
      ${couple(98, 286, 1.05)}` };
  },
  hoian(i) {
    const L = [[22, 108, "#d8343f"], [62, 120, "#f08a24"], [102, 124, "#c23a5e"], [142, 119, "#e9b021"], [180, 108, "#d8343f"]];
    return { defs: grad(`a${i}`, [[0, "#f7d683"], [1, "#eab457"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <rect y="40" width="200" height="34" fill="#9c4a32"/>${Array.from({ length: 11 }, (_, k) => `<path d="M${k * 20} 74 q10 8 20 0" fill="#7f3a27"/>`).join("")}
      <rect x="122" y="140" width="56" height="84" fill="#3d7a6b"/>${[0, 1, 2, 3, 4, 5].map(k => `<line x1="126" y1="${148 + k * 13}" x2="174" y2="${148 + k * 13}" stroke="#2c5c50" stroke-width="2"/>`).join("")}<line x1="150" y1="140" x2="150" y2="224" stroke="#2c5c50" stroke-width="3"/>
      <path d="M20 170 q8 -4 6 10 M36 200 l10 6" stroke="#d29a45" stroke-width="1.5" fill="none"/>
      <path d="M0 96 Q100 134 200 96" stroke="#6b3b26" stroke-width="1.4" fill="none"/>
      ${L.map(([x, y, c]) => `<line x1="${x}" y1="${y - 14}" x2="${x}" y2="${y - 9}" stroke="#6b3b26"/><rect x="${x - 4}" y="${y - 11}" width="8" height="3" fill="#5a3020"/><ellipse cx="${x}" cy="${y}" rx="8" ry="10" fill="${c}"/><ellipse cx="${x}" cy="${y}" rx="3.5" ry="10" fill="rgba(255,255,255,.18)"/><rect x="${x - 3}" y="${y + 9}" width="6" height="3" fill="#5a3020"/><line x1="${x}" y1="${y + 12}" x2="${x}" y2="${y + 20}" stroke="${c}"/>`).join("")}
      <rect y="250" width="200" height="50" fill="#c48f55"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<line x1="${k * 28}" y1="250" x2="${k * 28 - 12}" y2="300" stroke="#b07d47"/>`).join("")}
      <rect y="232" width="200" height="18" fill="#d9a560"/>
      ${couple(78, 284, 1.05)}` };
  },
  phuquoc(i) {
    return { defs: grad(`a${i}`, [[0, "#93c3de"], [.55, "#f7c9b6"], [1, "#fbdcaa"]]) + grad(`b${i}`, [[0, "#4b93b8"], [1, "#86bcd3"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <circle cx="104" cy="204" r="28" fill="#fff3cf"/>
      <rect y="204" width="200" height="52" fill="url(#b${i})"/>
      ${[0, 1, 2, 3].map(k => `<rect x="${90 - k * 3}" y="${212 + k * 9}" width="${28 + k * 6}" height="2" rx="1" fill="#fff3cf" opacity="${.8 - k * .15}"/>`).join("")}
      <path d="M0 252 Q100 242 200 254 L200 300 L0 300Z" fill="#f1dab9"/>
      <path d="M26 300 Q20 226 46 158" stroke="#6b4a32" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${[[-50, 14], [-20, 10], [10, 6], [40, 14], [75, 22], [120, 26]].map(([a, d]) => `<path d="M46 158 q${Math.cos(a * Math.PI / 180) * 26} ${-12 + Math.sin(a * Math.PI / 180) * 8} ${Math.cos(a * Math.PI / 180) * 44} ${d}" stroke="#2f6b4f" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("")}
      <path d="M140 60 q6 -4 12 0 q6 -4 12 0" stroke="#fff" stroke-width="1.4" fill="none"/><path d="M60 88 q4 -3 8 0 q4 -3 8 0" stroke="#fff" stroke-width="1.2" fill="none"/>
      ${couple(120, 286, 1.05)}` };
  },
  gate(i) {
    let fl = "";
    for (let k = 0; k <= 26; k++) {
      const t = Math.PI * (k / 26), x = 100 - Math.cos(t) * 66, y = 150 - Math.sin(t) * 66;
      fl += `<circle cx="${x + (k % 3 - 1) * 4}" cy="${y + (k % 2) * 4}" r="${6 + k % 3 * 2}" fill="${["#f3b7c4", "#fff", "#c25c72", "#e9d6a8"][k % 4]}"/>`;
      if (k % 2) fl += `<ellipse cx="${x}" cy="${y - 7}" rx="3" ry="7" fill="#7aa07c" transform="rotate(${k * 7} ${x} ${y})"/>`;
    }
    for (let y = 160; y < 270; y += 13) fl += `<circle cx="34" cy="${y}" r="6" fill="${y % 2 ? "#fff" : "#f3b7c4"}"/><circle cx="166" cy="${y + 6}" r="6" fill="${y % 2 ? "#f3b7c4" : "#fff"}"/>`;
    return { defs: grad(`a${i}`, [[0, "#f3f5fa"], [1, "#e2e8f2"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <path d="M34 280 L34 150 A66 66 0 0 1 166 150 L166 280" stroke="#d7dfeb" stroke-width="12" fill="none"/>
      ${fl}
      <path d="M78 300 L88 240 L112 240 L122 300Z" fill="#c25c72" opacity=".22"/>
      ${couple(100, 282, 1.1)}` };
  },
  film(i) {
    return { defs: grad(`a${i}`, [[0, "#2a4675"], [1, "#18203a"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <rect y="62" width="200" height="66" fill="#10162a"/>
      ${Array.from({ length: 13 }, (_, k) => `<rect x="${k * 16 + 4}" y="66" width="8" height="6" rx="1.5" fill="#3b4b70"/><rect x="${k * 16 + 4}" y="118" width="8" height="6" rx="1.5" fill="#3b4b70"/>`).join("")}
      ${[0, 1, 2, 3].map(k => `<rect x="${6 + k * 50}" y="78" width="42" height="34" rx="2" fill="${["#f7c9b6", "#bcd3e3", "#f3b7c4", "#9dc08f"][k]}" opacity=".85"/>`).join("")}
      <circle cx="100" cy="180" r="28" fill="#fff" opacity=".95"/><path d="M93 166 L115 180 L93 194Z" fill="#c25c72"/>
      <circle cx="26" cy="40" r="5" fill="#e0475f"/><text x="36" y="44" font-size="11" font-family="Montserrat, sans-serif" font-weight="700" fill="#fff">REC</text>
      <rect y="268" width="200" height="32" fill="#10162a" opacity=".6"/>
      ${couple(100, 284, .85, "#4a5c86")}` };
  },
  dress(i) {
    return { defs: grad(`a${i}`, [[0, "#f8eaee"], [1, "#ece3f0"]]), body: `
      <rect width="200" height="300" fill="url(#a${i})"/>
      <line x1="0" y1="58" x2="200" y2="58" stroke="#b79457" stroke-width="3"/>
      ${[[22, "#f3b7c4"], [44, "#bcd3e3"], [176, "#fff"]].map(([x, c]) => `<path d="M${x} 58 l0 8 M${x - 10} 74 l10 -8 l10 8" stroke="#8a7a6a" fill="none"/><path d="M${x - 8} 74 L${x + 8} 74 L${x + 14} 150 L${x - 14} 150Z" fill="${c}"/>`).join("")}
      <ellipse cx="160" cy="180" rx="26" ry="44" fill="#e6eef7" stroke="#b79457" stroke-width="4"/>
      <path d="M150 156 l14 -12 M146 176 l22 -18" stroke="#fff" stroke-width="3" opacity=".8"/>
      <line x1="94" y1="96" x2="94" y2="276" stroke="#8a7a6a" stroke-width="3"/><path d="M80 284 L108 284 L94 272Z" fill="#8a7a6a"/>
      <ellipse cx="94" cy="96" rx="11" ry="6" fill="#d6c7b8"/>
      <path d="M82 104 Q94 98 106 104 L108 140 Q96 146 80 140Z" fill="#fff" stroke="rgba(24,32,58,.12)"/>
      <path d="M80 140 Q96 146 108 140 Q132 200 144 262 Q94 274 44 262 Q58 200 80 140Z" fill="#fff" stroke="rgba(24,32,58,.12)"/>
      ${[0, 1, 2, 3, 4].map(k => `<path d="M${62 + k * 16} 258 Q${70 + k * 14} 200 ${88 + k * 3} 146" stroke="#ebe6ef" fill="none"/>`).join("")}
      <path d="M84 124 Q94 132 104 124" stroke="#f3b7c4" stroke-width="3" fill="none"/>
      <rect x="20" y="236" width="40" height="40" rx="6" fill="#fff"/><circle cx="32" cy="250" r="5" fill="#c25c72"/><rect x="42" y="244" width="10" height="20" rx="2" fill="#f3b7c4"/>` };
  },
};
function scene(key, label) {
  const i = ++uid, s = SCENES[key](i);
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`;
  return `<svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMax slice" ${a11y}><defs>${s.defs}</defs>${s.body}</svg>`;
}

/* ---------- data ---------- */
const TABS = [["pre", "Chụp pre-wedding"], ["day", "Ngày cưới"], ["look", "Váy & make-up"]];
const PKG = [
  { id: "tinh-khoi", tab: "pre", name: "Studio Tinh Khôi", where: "Studio Quận 1", price: 6900000, scene: "studio", items: ["1 concept studio, 4 giờ chụp", "2 váy cưới + 2 vest", "30 ảnh chỉnh, toàn bộ file gốc", "1 ảnh phóng 60×90 khung gỗ"] },
  { id: "phim-truong", tab: "pre", name: "Phim Trường Sài Gòn", where: "Phim trường Q.2 & Q.7", price: 9500000, scene: "set", tag: "Chọn nhiều nhất", items: ["2 bối cảnh: châu Âu & sân vườn", "3 váy + 2 vest + 1 áo dài", "50 ảnh chỉnh, album 25×35 20 trang", "Make-up & làm tóc cả buổi"] },
  { id: "da-lat", tab: "pre", name: "Ngoại Cảnh Đà Lạt", where: "Đồi thông · Hồ Tuyền Lâm", price: 18900000, scene: "dalat", items: ["2 ngày 1 đêm, xe đưa đón trọn chuyến", "Chụp sương sớm & hoàng hôn", "70 ảnh chỉnh, album 30×30 30 trang", "Video teaser 60 giây"] },
  { id: "hoi-an", tab: "pre", name: "Hội An – Đà Nẵng", where: "Phố cổ · Cầu Rồng · Sơn Trà", price: 21500000, scene: "hoian", items: ["2 ngày, ê-kíp bay cùng hai bạn", "Phố cổ lúc 5h sáng, vắng khách", "80 ảnh chỉnh, album 30×30 30 trang", "Áo dài cưới thêu tay + nón lá"] },
  { id: "phu-quoc", tab: "pre", name: "Hoàng Hôn Phú Quốc", where: "Bãi Sao · Sunset Town", price: 24900000, scene: "phuquoc", tag: "Mới", items: ["3 ngày 2 đêm, resort 4 sao cho ê-kíp", "Chụp biển lúc hoàng hôn, có flycam", "90 ảnh chỉnh, album bìa da 30×30", "Video pre-wedding 2–3 phút"] },
  { id: "pts-1", tab: "day", name: "Phóng sự 1 buổi", where: "Lễ gia tiên hoặc tiệc", price: 4500000, scene: "gate", items: ["1 nhiếp ảnh, 4 giờ", "300+ ảnh đã chỉnh màu", "Giao ảnh online sau 7 ngày"] },
  { id: "pts-full", tab: "day", name: "Phóng sự cả ngày", where: "Gia tiên · rước dâu · tiệc", price: 7900000, scene: "gate", tag: "Đủ khoảnh khắc", items: ["2 nhiếp ảnh, từ 6h đến 21h", "600+ ảnh, album 25×25", "Ảnh nhanh trình chiếu tại tiệc"] },
  { id: "film", tab: "day", name: "Quay phim phóng sự", where: "Ngày cưới", price: 9800000, scene: "film", items: ["2 máy quay + flycam", "Phim highlight 3–5 phút", "Phim đầy đủ 45–60 phút"] },
  { id: "makeup", tab: "look", name: "Make-up ngày cưới", where: "Tại nhà cô dâu", price: 2200000, scene: "dress", items: ["Make-up & làm tóc lễ + tiệc", "Dặm lại giữa buổi", "Mi giả, hoa cài tóc"] },
  { id: "dress", tab: "look", name: "Thuê váy cưới thiết kế", where: "Kho hơn 300 mẫu", price: 3500000, scene: "dress", items: ["1 váy cưới + 1 váy tiệc", "Sửa vừa người miễn phí", "Giặt hấp sau khi trả"] },
  { id: "look-combo", tab: "look", name: "Combo váy, vest & make-up", where: "Trọn ngày cưới", price: 5900000, scene: "dress", tag: "Tiết kiệm nhất", items: ["Váy cưới + váy tiệc + vest chú rể", "Make-up & làm tóc cô dâu", "Hoa cầm tay hoa tươi"] },
];
const EXTRA = [
  { id: "concept", tab: "extra", name: "Thêm 1 concept / trang phục", where: "Chụp thêm trong buổi", price: 1500000 },
  { id: "album", tab: "extra", name: "Nâng cấp album bìa da 30×30", where: "Thêm 10 trang, hộp gỗ", price: 2800000 },
  { id: "bts", tab: "extra", name: "Video hậu trường 60–90 giây", where: "Dựng dọc cho Reels, TikTok", price: 3200000 },
];
// items that cannot be picked together
const CONFLICT = { "pts-1": ["pts-full"], "pts-full": ["pts-1"], "look-combo": ["makeup", "dress"], makeup: ["look-combo"], dress: ["look-combo"] };
const DAY_DISCOUNT = .1, GIFT_FROM = 9500000, DEPOSIT = .3, ALBUM_DAYS = 21;
const ALL = [...PKG, ...EXTRA], byId = id => ALL.find(p => p.id === id);

let tab = "pre", base = "phim-truong";
const picked = new Set(["album"]);

/* ---------- hero ---------- */
$("heroFrames").innerHTML = [["Studio", "studio"], ["Hội An", "hoian"], ["Đà Lạt", "dalat"], ["Phú Quốc", "phuquoc"], ["Phim trường", "set"]]
  .map(([t, k]) => `<figure class="frame"><div class="pic">${scene(k, "Minh họa ảnh cưới " + t)}</div><figcaption>${t}</figcaption></figure>`).join("");

/* ---------- packages ---------- */
$("tabs").innerHTML = TABS.map(([id, t]) => `<button class="tab" role="tab" data-t="${id}" aria-selected="${id === tab}">${t}</button>`).join("");
$("tabs").onclick = e => {
  const b = e.target.closest(".tab"); if (!b) return;
  tab = b.dataset.t;
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x === b));
  renderPackages();
};
const isOn = p => p.tab === "pre" ? base === p.id : picked.has(p.id);
function renderPackages() {
  $("pkGrid").innerHTML = PKG.filter(p => p.tab === tab).map(p => `
    <article class="pk">
      <div class="art">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}${scene(p.scene, "Minh họa " + p.name)}</div>
      <div class="body">
        <span class="where">${p.where}</span>
        <h3>${p.name}</h3>
        <ul>${p.items.map(i => `<li>${i}</li>`).join("")}</ul>
        <div class="foot">
          <span class="price">${fmt(p.price)}</span>
          <button class="pick${isOn(p) ? " on" : ""}" data-id="${p.id}">${isOn(p) ? "Đã chọn ✓" : p.tab === "pre" ? "Chọn gói này" : "Thêm vào dự toán"}</button>
        </div>
      </div>
    </article>`).join("");
}
$("pkGrid").onclick = e => {
  const b = e.target.closest(".pick"); if (!b) return;
  const p = byId(b.dataset.id);
  if (p.tab === "pre") base = p.id; else toggle(p.id, true);
  renderAll();
  $("estimate").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};

/* ---------- estimate ---------- */
function toggle(id, on) {
  if (on) { picked.add(id); (CONFLICT[id] || []).forEach(c => picked.delete(c)) }
  else picked.delete(id);
}
function renderCalc() {
  $("baseOpts").innerHTML = PKG.filter(p => p.tab === "pre").map(p => `
    <button class="opt" type="button" data-id="${p.id}" aria-pressed="${p.id === base}">
      <span class="mini">${scene(p.scene, "")}</span>
      <span><b>${p.name}</b><span>${fmt(p.price)}</span></span>
    </button>`).join("");
  const group = (title, list, note) => `<h4>${title}</h4>` + list.map(p => `
    <label class="addon"><input type="checkbox" data-id="${p.id}" ${picked.has(p.id) ? "checked" : ""}/>
      <span><b>${p.name}</b><small>${p.where}</small></span>
      <span class="p">+${fmt(p.price)}</span></label>`).join("") + (note ? `<p class="group-note">${note}</p>` : "");
  $("addons").innerHTML =
    group("Chụp thêm", EXTRA) +
    group("Ngày cưới", PKG.filter(p => p.tab === "day"), "Giảm 10% khi đặt cùng gói pre-wedding. Chỉ chọn 1 trong 2 gói phóng sự.") +
    group("Váy & make-up", PKG.filter(p => p.tab === "look"), "Combo đã gồm make-up và váy nên không cần chọn lẻ.");
}
$("baseOpts").onclick = e => { const b = e.target.closest(".opt"); if (!b) return; base = b.dataset.id; renderAll() };
$("addons").onchange = e => { const c = e.target.closest("input[data-id]"); if (!c) return; toggle(c.dataset.id, c.checked); renderAll() };

const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x };
const iso = d => d.toISOString().slice(0, 10);
const vn = d => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

function totals() {
  const b = byId(base), extras = [...picked].map(byId);
  const day = extras.filter(p => p.tab === "day").reduce((s, p) => s + p.price, 0);
  const sub = b.price + extras.reduce((s, p) => s + p.price, 0);
  const disc = Math.round(day * DAY_DISCOUNT);
  return { b, extras, sub, disc, total: sub - disc, gift: b.price >= GIFT_FROM };
}
function renderBill() {
  const t = totals(), date = $("f-date").value;
  $("billArt").innerHTML = scene(t.b.scene, "Minh họa " + t.b.name);
  $("billLines").innerHTML = `
    <div class="line"><span>${t.b.name}</span><span>${fmt(t.b.price)}</span></div>
    ${t.extras.map(p => `<div class="line"><span>${p.name}</span><span>${fmt(p.price)}</span></div>`).join("")}
    ${t.disc ? `<div class="line disc"><span>Ưu đãi combo ngày cưới −10%</span><span>−${fmt(t.disc)}</span></div>` : ""}
    ${t.gift ? `<div class="line gift"><span>Tặng ảnh cổng 120×180 (cọc trước 30/11)</span><span>0₫</span></div>` : ""}
    <div class="total"><span>Tổng trọn gói</span><b>${fmt(t.total)}</b></div>
    <div class="deposit"><span>Cọc giữ lịch 30%: <b>${fmt(Math.round(t.total * DEPOSIT / 1000) * 1000)}</b></span>
      <span>Nhận album: <b>${date ? vn(addDays(date, ALBUM_DAYS)) : ALBUM_DAYS + " ngày sau buổi chụp"}</b></span></div>`;
}
function renderAll() { renderPackages(); renderCalc(); renderBill() }

const today = new Date();
$("f-date").min = iso(addDays(today, 7));
$("f-date").value = iso(addDays(today, 30));
$("f-date").oninput = renderBill;

$("book").onsubmit = e => {
  e.preventDefault();
  const t = totals(), d = $("f-date").value;
  $("ok").innerHTML = `<strong>Đã giữ lịch tư vấn</strong>${$("f-name").value} · ${t.b.name}, dự kiến chụp ngày ${vn(new Date(d))}, tổng ${fmt(t.total)}.<br>Đây là website mẫu nên thông tin không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA, email hoặc lịch làm việc của studio.`;
  $("ok").hidden = false;
};

renderAll();
