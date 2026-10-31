const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

const COLORS = [
  { name: "Hồng Mơ", hex: "#ef6f97" }, { name: "Đỏ Cherry", hex: "#d3213b" }, { name: "Đỏ Rượu", hex: "#8e1b32" },
  { name: "Nude Sữa", hex: "#e9c3ae" }, { name: "Nude Hồng", hex: "#d99f97" }, { name: "Cam San Hô", hex: "#ff7a59" },
  { name: "Vàng Bơ", hex: "#f3d36b" }, { name: "Xanh Bạc Hà", hex: "#8fd8c3" }, { name: "Tím Khoai", hex: "#a98ad6" },
  { name: "Xanh Navy", hex: "#22345e" }, { name: "Trắng Sữa", hex: "#f7f3ee" }, { name: "Đen Bóng", hex: "#1d1a1f" },
];
const SHAPES = [
  { id: "round", name: "Tròn" }, { id: "square", name: "Vuông" }, { id: "oval", name: "Oval" },
  { id: "almond", name: "Almond" }, { id: "coffin", name: "Coffin" },
];
const LENGTHS = [
  { id: "real", name: "Móng thật", price: 0, min: 0, ext: 0 },
  { id: "tip", name: "Nối úp keo", price: 150000, min: 25, ext: 26 },
  { id: "gel", name: "Đắp gel", price: 350000, min: 50, ext: 40 },
];
const FINISHES = [
  { id: "plain", name: "Sơn thường", price: 90000, min: 35 },
  { id: "gel", name: "Sơn gel", price: 180000, min: 50 },
  { id: "cat", name: "Mắt mèo", price: 250000, min: 60 },
  { id: "chrome", name: "Tráng gương", price: 280000, min: 65 },
];
const ARTS = [
  { id: "none", name: "Trơn", price: 0, min: 0 },
  { id: "french", name: "Đầu French", price: 60000, min: 15 },
  { id: "flower", name: "Hoa nhí", price: 80000, min: 20 },
  { id: "draw", name: "Vẽ nghệ thuật", price: 150000, min: 35 },
];
const STONE = 10000;

/* ---------- colour helpers ---------- */
function mix(hex, to, t) {
  const a = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const b = [1, 3, 5].map(i => parseInt(to.slice(i, i + 2), 16));
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
const light = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)); return r * .3 + g * .59 + b * .11 > 170 };

/* ---------- hand drawing ---------- */
const FINGERS = [
  { x: 120, top: 236, w: 58, rot: -32 }, // thumb
  { x: 168, top: 118, w: 52, rot: -6 },
  { x: 224, top: 94, w: 53, rot: 0 },
  { x: 278, top: 118, w: 50, rot: 5 },
  { x: 330, top: 168, w: 44, rot: 9 },
];
const SKIN = "#f6cdb6", SKIN_LINE = "#e6a98f";

function nailGeo(f, shape, ext) {
  const nw = f.w * .72, x = f.x, L = x - nw / 2, R = x + nw / 2;
  const y0 = f.top + f.w * .98, yT = f.top + f.w * .16 - ext;
  let tipH, tip;
  if (shape === "round") { tipH = nw / 2; tip = `L${L} ${yT + tipH} A${nw / 2} ${nw / 2} 0 0 1 ${R} ${yT + tipH}`; }
  else if (shape === "square") { tipH = 5; tip = `L${L} ${yT + 5} Q${L} ${yT} ${L + 5} ${yT} L${R - 5} ${yT} Q${R} ${yT} ${R} ${yT + 5}`; }
  else if (shape === "oval") { tipH = nw * .7; const c = yT + tipH - tipH * 1.333; tip = `L${L} ${yT + tipH} C${L} ${c} ${R} ${c} ${R} ${yT + tipH}`; }
  else if (shape === "almond") { tipH = nw * 1.05; tip = `L${L} ${yT + tipH} Q${L + nw * .04} ${yT + tipH * .28} ${x} ${yT} Q${R - nw * .04} ${yT + tipH * .28} ${R} ${yT + tipH}`; }
  else { tipH = nw * .62; tip = `L${L} ${yT + tipH} L${x - nw * .27} ${yT} L${x + nw * .27} ${yT} L${R} ${yT + tipH}`; }
  const d = `M${L} ${y0} ${tip} L${R} ${y0} Q${x} ${y0 + nw * .36} ${L} ${y0} Z`;
  return { d, nw, x, L, R, y0, yT, yS: yT + tipH, mid: (yT + tipH * .5 + y0) / 2 };
}

let uid = 0;
function drawHand(svg, o) {
  const id = "h" + (++uid), col = COLORS[o.color].hex, ext = LENGTHS.find(l => l.id === o.length).ext;
  const dark = mix(col, "#000000", .38), lite = mix(col, "#ffffff", .55);
  const fill = o.finish === "cat" ? `url(#${id}cat)` : o.finish === "chrome" ? `url(#${id}chr)` : col;
  const gloss = { plain: .28, gel: .6, cat: .35, chrome: .75 }[o.finish];
  const accent = light(col) ? "#e8457a" : "#ffffff";

  let defs = `<linearGradient id="${id}cat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark}"/><stop offset=".42" stop-color="${col}"/><stop offset=".55" stop-color="${lite}"/><stop offset=".68" stop-color="${col}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`
    + `<linearGradient id="${id}chr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(col, "#ffffff", .7)}"/><stop offset=".35" stop-color="${col}"/><stop offset=".5" stop-color="#ffffff"/><stop offset=".65" stop-color="${col}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`
    + `<radialGradient id="${id}st" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e4f1ff"/><stop offset="1" stop-color="#a9bfd6"/></radialGradient>`;

  // stones handed out round-robin: ring, middle, index, thumb, pinky
  const per = [0, 0, 0, 0, 0], order = [3, 2, 1, 0, 4];
  for (let s = 0; s < o.stones; s++) per[order[s % 5]]++;

  let fingers = "", thumb = "";
  FINGERS.forEach((f, i) => {
    const g = nailGeo(f, o.shape, ext), cid = `${id}c${i}`;
    defs += `<clipPath id="${cid}"><path d="${g.d}"/></clipPath>`;
    let art = "";
    if (o.art === "french") {
      const sm = Math.max(g.yT + g.nw * .55, g.yS);
      art = `<path d="M${g.L - 6} ${g.yT - 70} L${g.R + 6} ${g.yT - 70} L${g.R + 6} ${sm - g.nw * .3} Q${g.x} ${sm + g.nw * .3} ${g.L - 6} ${sm - g.nw * .3} Z" fill="${col === "#f7f3ee" ? "#e8457a" : "#ffffff"}"/>`;
    } else if (o.art === "flower" && (i === 0 || i === 3)) {
      art = flower(g.x, g.mid, 3.6, accent);
    } else if (o.art === "draw") {
      if (i === 1 || i === 4) art = heart(g.x, g.mid, g.nw * .24, accent);
      else if (i === 2) art = `<path d="M${g.L} ${g.mid + 6} q${g.nw / 4} -12 ${g.nw / 2} 0 t${g.nw / 2} 0" stroke="#e2b443" stroke-width="2.6" fill="none"/><path d="M${g.L} ${g.mid - 6} q${g.nw / 4} -12 ${g.nw / 2} 0 t${g.nw / 2} 0" stroke="${accent}" stroke-width="2" fill="none"/>`;
      else if (i === 3) art = flower(g.x, g.mid, 3.6, accent);
      else art = [0, 1, 2].map(k => `<circle cx="${g.x - 6 + k * 6}" cy="${g.mid + (k % 2 ? -5 : 2)}" r="2.2" fill="#e2b443"/>`).join("");
    }
    let stones = "";
    for (let k = 0; k < per[i]; k++) stones += `<circle cx="${g.x + (k % 2 ? 4.5 : -4.5) * (per[i] > 1 ? 1 : 0)}" cy="${g.y0 - 7 - k * 7}" r="3.3" fill="url(#${id}st)" stroke="#8ea6bf" stroke-width=".5"/>`;
    const hl = `<rect x="${g.L + g.nw * .16}" y="${g.yS - (o.shape === "almond" ? 0 : 4)}" width="${g.nw * .14}" height="${Math.max(10, g.y0 - g.yS - 6)}" rx="${g.nw * .07}" fill="#ffffff" opacity="${gloss}"/>`;
    const fin = `<g transform="rotate(${f.rot} ${f.x} 392)">
      <rect x="${f.x - f.w / 2}" y="${f.top}" width="${f.w}" height="${430 - f.top}" rx="${f.w / 2}" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="1.2"/>
      <path d="M${f.x - f.w * .28} ${f.top + f.w * 2} q${f.w * .28} 6 ${f.w * .56} 0" stroke="${SKIN_LINE}" stroke-width="1.4" fill="none" opacity=".7"/>
      <path d="${g.d}" fill="${fill}" stroke="${dark}" stroke-opacity=".35" stroke-width="1"/>
      <g clip-path="url(#${cid})">${art}${hl}</g>${stones}
    </g>`;
    if (i === 0) thumb = fin; else fingers += fin;
  });

  svg.innerHTML = `<defs>${defs}</defs>
    <ellipse cx="225" cy="392" rx="170" ry="16" fill="#2b1a33" opacity=".08"/>
    ${fingers}
    <path d="M100 410 C96 336 120 274 162 252 L330 250 C362 262 368 310 364 410 Z" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="1.2"/>
    <path d="M200 300 q30 14 70 4" stroke="${SKIN_LINE}" stroke-width="1.3" fill="none" opacity=".5"/>
    ${thumb}
    <path d="M92 400 L100 360 Q232 342 372 360 L382 400 Z" fill="#1d9b84"/>
    <path d="M100 360 Q232 342 372 360" stroke="#ffffff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-dasharray="2 6"/>`;
}
function flower(cx, cy, r, c) {
  let s = "";
  for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.5708; s += `<circle cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="${r * .8}" fill="${c}"/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * .6}" fill="#f2c94c"/>`;
}
function heart(cx, cy, s, c) {
  return `<path d="M${cx} ${cy + s} C${cx - s * 1.6} ${cy - s * .2} ${cx - s * .7} ${cy - s * 1.4} ${cx} ${cy - s * .45} C${cx + s * .7} ${cy - s * 1.4} ${cx + s * 1.6} ${cy - s * .2} ${cx} ${cy + s} Z" fill="${c}"/>`;
}

function price(o) {
  const L = LENGTHS.find(l => l.id === o.length), F = FINISHES.find(f => f.id === o.finish), A = ARTS.find(a => a.id === o.art);
  return { L, F, A, total: F.price + L.price + A.price + o.stones * STONE, min: F.min + L.min + A.min + o.stones };
}
const fmtMin = m => m >= 60 ? `${Math.floor(m / 60)} giờ${m % 60 ? " " + (m % 60) + " phút" : ""}` : m + " phút";

/* ---------- hero ---------- */
const hero = { color: 0, shape: "almond", length: "tip", finish: "gel", art: "flower", stones: 4 };
const HERO_COLORS = [0, 1, 3, 7, 8, 9];
function renderHero() {
  drawHand($("heroHand"), hero);
  $("heroName").textContent = COLORS[hero.color].name;
  $("heroInfo").textContent = `Gel nối úp · hoa nhí · 4 đá — ${fmt(price(hero).total)}`;
  $("heroSwatches").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.c === hero.color));
}
$("heroSwatches").innerHTML = HERO_COLORS.map(c => `<button type="button" data-c="${c}" style="background:${COLORS[c].hex}" aria-label="${COLORS[c].name}" title="${COLORS[c].name}"></button>`).join("");
$("heroSwatches").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { hero.color = +b.dataset.c; renderHero(); } });
renderHero();

/* ---------- price menu ---------- */
const MENU = {
  "Móng tay": [
    { n: "Cắt da, dũa form, sơn thường", d: "Sơn OPI, khô tự nhiên 15 phút", p: 90000, t: "35 phút" },
    { n: "Sơn gel trơn", d: "Base – màu – top, giữ màu 3 tuần", p: 180000, t: "50 phút", b: "Bán chạy" },
    { n: "Sơn gel mắt mèo", d: "Nam châm tạo vệt sáng, 20 tông màu", p: 250000, t: "60 phút" },
    { n: "Tráng gương / ombre", d: "Bột chrome Nhật, loang 2–3 màu", p: 280000, t: "65 phút" },
    { n: "Phá gel cũ", d: "Ủ foil, không cạo mỏng móng thật", p: 30000, t: "15 phút" },
    { n: "Dưỡng tay paraffin", d: "Sáp nóng, mặt nạ tay, massage 10 phút", p: 120000, t: "25 phút" },
  ],
  "Móng chân": [
    { n: "Chăm sóc chân cơ bản", d: "Ngâm muối khoáng, cắt da, sơn thường", p: 120000, t: "40 phút" },
    { n: "Sơn gel chân", d: "Gồm chăm sóc cơ bản", p: 200000, t: "55 phút" },
    { n: "Spa chân thảo dược", d: "Ngâm gừng sả, tẩy tế bào chết, đắp ủ", p: 250000, t: "60 phút", b: "Thư giãn" },
    { n: "Chữa khóe, móng quặp", d: "Thợ chân chính, dụng cụ riêng", p: 80000, t: "20 phút" },
  ],
  "Nối móng": [
    { n: "Nối móng úp keo", d: "Móng úp Hàn, 5 dáng, giữ 2–3 tuần", p: 150000, t: "+25 phút" },
    { n: "Đắp gel tạo form", d: "Mỏng nhẹ, tự nhiên, ít hại móng thật", p: 350000, t: "+50 phút", b: "Bền nhất" },
    { n: "Đắp bột acrylic", d: "Cứng chắc, hợp móng dài trên 2cm", p: 400000, t: "+60 phút" },
    { n: "Fill / dặm móng nối", d: "Sau 3–4 tuần, giữ form cũ", p: 200000, t: "45 phút" },
  ],
  "Combo": [
    { n: "Gel tay + gel chân", d: "Hai thợ làm cùng lúc, tiết kiệm 30.000₫", p: 350000, t: "60 phút", b: "Tiết kiệm" },
    { n: "Combo cô dâu", d: "Thử màu trước, gel tay chân, đá, paraffin", p: 690000, t: "2 giờ" },
    { n: "Combo mẹ & bé", d: "Gel tay mẹ, sơn nước an toàn cho bé", p: 260000, t: "50 phút" },
    { n: "Thẻ 5 lần sơn gel", d: "Dùng trong 6 tháng, tặng 1 lần phá gel", p: 800000, t: "5 buổi" },
  ],
};
const MENU_ICON = ["#ef6f97", "#1d9b84", "#a98ad6", "#e2b443"];
const tabNames = Object.keys(MENU);
let tab = tabNames[0];
function renderMenu() {
  $("tabs").innerHTML = tabNames.map(t => `<button type="button" role="tab" aria-selected="${t === tab}">${t}</button>`).join("");
  const c = MENU_ICON[tabNames.indexOf(tab)];
  $("priceList").innerHTML = MENU[tab].map(m => `<div class="price-item">
      <span class="ic"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 22V11a6 6 0 0 1 12 0v11" fill="${SKIN}"/><path d="M8 13V8.5a4 4 0 0 1 8 0V13q-4 2.4-8 0z" fill="${c}"/></svg></span>
      <div class="txt"><h3>${m.n}${m.b ? `<span class="badge">${m.b}</span>` : ""}</h3><p>${m.d}</p></div>
      <div class="pr"><strong>${fmt(m.p)}</strong><span>${m.t}</span></div>
    </div>`).join("");
}
$("tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { tab = b.textContent; renderMenu(); } });
renderMenu();

/* ---------- nail studio ---------- */
const st = { color: 0, shape: "oval", length: "real", finish: "gel", art: "none", stones: 0 };
function opts(el, list, key, sub) {
  el.innerHTML = list.map(x => `<button type="button" data-v="${x.id}">${x.name}${sub ? `<small>${sub(x)}</small>` : ""}</button>`).join("");
  el.addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st[key] = b.dataset.v; renderStudio(); } });
}
opts($("optShape"), SHAPES, "shape");
opts($("optLength"), LENGTHS, "length", x => x.price ? "+" + fmt(x.price) : "Miễn phí");
opts($("optFinish"), FINISHES, "finish", x => fmt(x.price));
opts($("optArt"), ARTS, "art", x => x.price ? "+" + fmt(x.price) : "0₫");
$("optColor").innerHTML = COLORS.map((c, i) => `<button type="button" data-c="${i}" style="background:${c.hex}" aria-label="${c.name}" title="${c.name}"></button>`).join("");
$("optColor").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st.color = +b.dataset.c; renderStudio(); } });
$("stones").addEventListener("input", e => { st.stones = +e.target.value; renderStudio(); });

function describe(o) {
  const p = price(o);
  return `${p.F.name} màu ${COLORS[o.color].name}, dáng ${SHAPES.find(s => s.id === o.shape).name.toLowerCase()}, ${p.L.name.toLowerCase()}${o.art !== "none" ? ", " + p.A.name.toLowerCase() : ""}${o.stones ? `, ${o.stones} viên đá` : ""} (${fmt(p.total)})`;
}
function renderStudio() {
  drawHand($("studioHand"), st);
  [["optShape", "shape"], ["optLength", "length"], ["optFinish", "finish"], ["optArt", "art"]].forEach(([el, k]) =>
    $(el).querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === st[k])));
  $("optColor").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.c === st.color));
  $("colorName").textContent = "· " + COLORS[st.color].name;
  $("stoneCount").textContent = st.stones;
  const p = price(st);
  $("total").textContent = fmt(p.total);
  $("duration").textContent = fmtMin(p.min);
  const rows = [[p.F.name, p.F.price], [p.L.name, p.L.price]];
  if (st.art !== "none") rows.push([p.A.name, p.A.price]);
  if (st.stones) rows.push([`Đá × ${st.stones}`, st.stones * STONE]);
  $("summary").innerHTML = rows.map(([n, v]) => `<div><span>${n}</span><b>${v ? fmt(v) : "0₫"}</b></div>`).join("");
}
renderStudio();

$("useSet").addEventListener("click", () => {
  $("note").value = "Bộ móng đã phối: " + describe(st);
  toast("Đã gửi mẫu vào phiếu đặt lịch bên dưới");
});

/* ---------- booking ---------- */
const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const now = new Date();
const first = new Date(now);
if (now.getHours() * 60 + now.getMinutes() > 19 * 60 + 30) first.setDate(first.getDate() + 1);
const last = new Date(now); last.setDate(last.getDate() + 30);
$("date").min = ymd(now); $("date").max = ymd(last); $("date").value = ymd(first);

let slot = null;
function renderSlots() {
  const v = $("date").value, seed = v.split("-").reduce((a, b) => a * 31 + +b, 7);
  const isToday = v === ymd(new Date()), nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const out = [];
  for (let m = 9 * 60; m <= 20 * 60; m += 30) {
    const booked = ((seed * (m + 13)) % 97) < 30 || (isToday && m <= nowMin + 30);
    const label = `${Math.floor(m / 60)}:${pad(m % 60)}`;
    out.push(`<button type="button" data-t="${label}" ${booked ? "disabled aria-label=\"" + label + " đã kín\"" : ""} aria-pressed="${label === slot && !booked}">${label}</button>`);
  }
  $("slots").innerHTML = out.join("");
  if (slot && !$("slots").querySelector(`[data-t="${slot}"]:not(:disabled)`)) slot = null;
}
$("slots").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b || b.disabled) return;
  slot = b.dataset.t;
  $("slots").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
});
$("date").addEventListener("change", renderSlots);
renderSlots();

$("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, el = f.elements, msg = $("formMsg");
  const name = el.name.value.trim(), phone = el.phone.value.replace(/[\s.]/g, "");
  el.name.classList.toggle("invalid", !name);
  el.phone.classList.toggle("invalid", !/^0\d{9}$/.test(phone));
  let err = "";
  if (!name) err = "Bạn nhập giúp tiệm họ tên nhé.";
  else if (!/^0\d{9}$/.test(phone)) err = "Số điện thoại cần đủ 10 số, bắt đầu bằng 0.";
  else if (!el.date.value) err = "Bạn chọn ngày muốn đến nhé.";
  else if (!slot) err = "Bạn chọn một khung giờ còn trống nhé.";
  msg.hidden = false;
  msg.classList.toggle("err", !!err);
  if (err) { msg.textContent = err; return; }
  const [y, mo, d] = el.date.value.split("-");
  msg.textContent = `Cảm ơn ${name}! Mơ đã giữ chỗ ${slot} ngày ${d}/${mo}/${y} và sẽ gọi số ${phone} để xác nhận trong 10 phút. (Đây là bản demo, chưa gửi dữ liệu thật.)`;
  f.reset(); $("date").value = ymd(first); slot = null; renderSlots();
});

let tt;
function toast(t) {
  const el = $("toast"); el.textContent = t; el.hidden = false;
  clearTimeout(tt); tt = setTimeout(() => (el.hidden = true), 2600);
}
