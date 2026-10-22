const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280 }

/* ---------- pastry illustrations (viewBox 120×90) ---------- */
const PASTRY = {
  croissant: (c = "#e3a047", d = "#c77b2a", nuts) => {
    const seg = [[26, 58, 11, 15, -55], [92, 58, 11, 15, 55], [41, 48, 14, 20, -28], [79, 48, 14, 20, 28], [60, 44, 17, 23, 0]];
    let s = `<ellipse cx="60" cy="74" rx="40" ry="5" fill="rgb(0 0 0 / .08)"/>`;
    seg.forEach(([x, y, rx, ry, r], i) => s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="${i % 2 ? c : d}" stroke="#a9611c" stroke-width="1.4"/><path d="M${x - rx * .5} ${y - ry * .35} q${rx * .5} -4 ${rx} 0" stroke="#fff3d6" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`);
    if (nuts) for (let i = 0; i < 9; i++) s += `<rect x="${36 + i * 6}" y="${36 + (i % 3) * 7}" width="6" height="3" rx="1.5" fill="#f6e2b8" transform="rotate(${i * 23} ${39 + i * 6} ${37 + (i % 3) * 7})"/>`;
    return s;
  },
  brioche: () => `<ellipse cx="60" cy="76" rx="38" ry="5" fill="rgb(0 0 0 / .08)"/><rect x="24" y="44" width="72" height="30" rx="10" fill="#b8681f"/>
    <circle cx="36" cy="46" r="16" fill="#cf8132"/><circle cx="60" cy="40" r="19" fill="#d98c3a"/><circle cx="84" cy="46" r="16" fill="#cf8132"/>
    <ellipse cx="33" cy="40" rx="7" ry="4" fill="#f2c27a" opacity=".7"/><ellipse cx="56" cy="31" rx="8" ry="4" fill="#f2c27a" opacity=".7"/><ellipse cx="81" cy="40" rx="7" ry="4" fill="#f2c27a" opacity=".7"/>
    <path d="M48 44l-8 4M70 44l8 4" stroke="#a65c1a" stroke-width="1.4"/>`,
  baguette: () => {
    let s = `<ellipse cx="60" cy="72" rx="48" ry="5" fill="rgb(0 0 0 / .08)"/><rect x="10" y="38" width="100" height="28" rx="14" fill="#d38c3c" transform="rotate(-8 60 52)"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${30 + i * 18} ${50 - i * 2.6} q6 -8 13 -6" stroke="#f7d79a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return s;
  },
  choux: () => `<ellipse cx="60" cy="76" rx="32" ry="5" fill="rgb(0 0 0 / .08)"/><path d="M30 62c-6-14 6-26 16-24 4-10 24-10 28 0 12-2 22 10 16 24z" fill="#d6964b"/>
    <path d="M30 58h60c0 8-6 14-14 14H44c-8 0-14-6-14-14z" fill="#c37f37"/><path d="M33 58c8-5 46-5 54 0" stroke="#fff4cc" stroke-width="7" stroke-linecap="round" fill="none"/>
    ${[40, 52, 63, 72, 80, 47, 68].map((x, i) => `<circle cx="${x}" cy="${36 + (i * 7) % 12}" r="1.6" fill="#fff"/>`).join("")}`,
  tart: () => {
    let s = `<ellipse cx="60" cy="68" rx="40" ry="8" fill="rgb(0 0 0 / .08)"/><ellipse cx="60" cy="58" rx="40" ry="16" fill="#c98339"/><ellipse cx="60" cy="54" rx="40" ry="15" fill="#e3a352"/>`;
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; s += `<circle cx="${60 + Math.cos(a) * 37}" cy="${54 + Math.sin(a) * 13.5}" r="3.4" fill="#d18c3e"/>` }
    return s + `<ellipse cx="60" cy="52" rx="31" ry="10.5" fill="#ffd458"/><ellipse cx="50" cy="49" rx="9" ry="3" fill="#ffe89a"/><circle cx="70" cy="53" r="4" fill="#d9822b" opacity=".55"/>`;
  },
  roll: () => {
    let s = `<ellipse cx="60" cy="76" rx="44" ry="5" fill="rgb(0 0 0 / .08)"/><rect x="16" y="26" width="58" height="48" rx="24" fill="#8cbf5a"/><circle cx="74" cy="50" r="24" fill="#a6d273"/>`;
    s += `<path d="M74 50m0 -4a4 4 0 1 1 -4 4a9 9 0 1 1 9 9a14 14 0 1 1 -14 -14a19 19 0 1 1 19 19" stroke="#fffbe8" stroke-width="4" fill="none"/>`;
    return s + `<ellipse cx="38" cy="30" rx="14" ry="3" fill="#c9e7a0" opacity=".8"/>`;
  },
  macaron: () => {
    const m = (x, y, c, f) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="10" rx="20" ry="8" fill="${c}"/><rect x="-18" y="2" width="36" height="6" rx="3" fill="${f}"/><ellipse cx="0" cy="-1" rx="20" ry="8" fill="${c}"/><ellipse cx="-5" cy="-4" rx="8" ry="2.4" fill="#fff" opacity=".45"/></g>`;
    return `<ellipse cx="60" cy="74" rx="46" ry="5" fill="rgb(0 0 0 / .08)"/>${m(38, 56, "#f4a7c0", "#fff")}${m(82, 56, "#b9d98f", "#fff6cf")}${m(60, 38, "#c7b6ec", "#fff")}`;
  },
  slice: (top = "#fff", layer = "#f7dc9c", fruit = "#e0354b") => `<ellipse cx="60" cy="76" rx="40" ry="5" fill="rgb(0 0 0 / .08)"/>
    <path d="M22 44 L92 32 L98 44 L98 72 L22 72Z" fill="${layer}"/><path d="M22 44 L98 44 L98 72 L22 72Z" fill="${layer}"/>
    <rect x="22" y="52" width="76" height="5" fill="${top}"/><rect x="22" y="62" width="76" height="5" fill="${top}"/>
    <path d="M22 44 L92 30 L98 40 L98 44Z" fill="${top}"/><rect x="22" y="40" width="76" height="5" fill="${top}"/>
    <path d="M70 30c-5-8 5-12 8-6 3-6 13-2 8 6l-8 8z" fill="${fruit}"/>`,
  cupcake: () => `<ellipse cx="60" cy="80" rx="28" ry="4" fill="rgb(0 0 0 / .08)"/><path d="M38 48h44l-6 31H44z" fill="#f2a5bf"/>
    ${[44, 52, 60, 68, 76].map(x => `<path d="M${x} 49l-1.4 30" stroke="#e07f9f" stroke-width="2"/>`).join("")}
    <ellipse cx="60" cy="47" rx="26" ry="9" fill="#6b4030"/><ellipse cx="60" cy="38" rx="20" ry="8" fill="#7d4c39"/><ellipse cx="60" cy="29" rx="13" ry="6.5" fill="#8f5a45"/>
    <circle cx="61" cy="20" r="5.5" fill="#d32f4a"/><path d="M61 15q2-6 7-7" stroke="#4f7a32" stroke-width="1.6" fill="none"/>`,
  cookies: () => {
    let s = `<rect x="14" y="40" width="92" height="38" rx="8" fill="#c92f63"/><rect x="14" y="40" width="92" height="9" rx="4" fill="#a72452"/><rect x="56" y="40" width="8" height="38" fill="#ffd36e"/>`;
    const r = rng(7);
    [[36, 34], [60, 28], [84, 34]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="15" fill="#e4ad62" stroke="#c98a3c" stroke-width="1.5"/>`; for (let i = 0; i < 5; i++) s += `<circle cx="${x - 8 + r() * 16}" cy="${y - 8 + r() * 16}" r="2" fill="#5a3324"/>` });
    return s;
  },
};
const pastry = (t, ...a) => `<svg viewBox="0 0 120 90" aria-hidden="true">${PASTRY[t](...a)}</svg>`;

/* ---------- menu ---------- */
const CATS = ["Tất cả", "Bánh mì & ngàn lớp", "Bánh ngọt", "Bánh kem miếng", "Hộp quà"];
const MENU = [
  { n: "Croissant bơ Pháp", c: 1, p: 35000, d: "27 lớp bơ lạt Elle & Vire", b: ["06:30", "15:00"], art: () => pastry("croissant") },
  { n: "Bánh mì hoa cúc", c: 1, p: 85000, d: "Ổ 400g, mật ong và cam vàng", b: ["06:30"], art: () => pastry("brioche") },
  { n: "Bánh mì baguette", c: 1, p: 22000, d: "Lên men tự nhiên 18 giờ", b: ["06:30", "15:00"], art: () => pastry("baguette") },
  { n: "Sừng bò hạnh nhân", c: 1, p: 45000, d: "Nhân kem hạnh nhân nướng", b: ["06:30"], art: () => pastry("croissant", "#d99a52", "#bf7a34", true) },
  { n: "Su kem vani", c: 2, p: 15000, d: "Kem trứng vani Madagascar", b: ["15:00"], art: () => pastry("choux") },
  { n: "Tart trứng", c: 2, p: 22000, d: "Vỏ ngàn lớp, nhân trứng sữa", b: ["15:00"], art: () => pastry("tart") },
  { n: "Bông lan cuộn lá dứa", c: 2, p: 145000, d: "Cuộn 22 cm, kem tươi dừa non", b: ["15:00"], art: () => pastry("roll") },
  { n: "Tiramisu miếng", c: 3, p: 55000, d: "Mascarpone Ý, cà phê Robusta", b: [], art: () => pastry("slice", "#f5ead7", "#8a5a3a", "#5a3324") },
  { n: "Bánh kem dâu miếng", c: 3, p: 48000, d: "Dâu tây Đà Lạt, kem tươi", b: [], art: () => pastry("slice") },
  { n: "Cupcake socola", c: 3, p: 38000, d: "Socola Bỉ 54%, anh đào", b: ["15:00"], art: () => pastry("cupcake") },
  { n: "Hộp macaron 6 chiếc", c: 4, p: 150000, d: "Mâm xôi, pistachio, việt quất", b: [], art: () => pastry("macaron") },
  { n: "Hộp cookie bơ 12 chiếc", c: 4, p: 180000, d: "Hộp thiếc, giữ giòn 30 ngày", b: [], art: () => pastry("cookies") },
];

const mins = t => { const [h, m] = t.split(":"); return +h * 60 + +m };
function batchLabel(b) {
  if (!b.length) return { t: "Làm sẵn trong ngày" };
  const now = new Date(), cur = now.getHours() * 60 + now.getMinutes();
  const fresh = b.find(t => cur >= mins(t) && cur - mins(t) < 75);
  if (fresh) return { t: `Vừa ra lò ${fresh}`, hot: true };
  const next = b.find(t => mins(t) > cur);
  return { t: next ? `Mẻ kế: ${next}` : `Mẻ sau: ${b[0]} sáng mai` };
}

let cat = 0;
$("tabs").innerHTML = CATS.map((c, i) => `<button class="tab" role="tab" aria-selected="${i === cat}" data-i="${i}">${c}</button>`).join("");
$("tabs").onclick = e => { const b = e.target.closest(".tab"); if (!b) return; cat = +b.dataset.i; document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-selected", t === b)); renderMenu() };
function renderMenu() {
  $("grid").innerHTML = MENU.map((m, i) => [m, i]).filter(([m]) => !cat || m.c === cat).map(([m, i]) => {
    const l = batchLabel(m.b);
    return `<article class="card">
      <div class="art"><span class="batch${l.hot ? " hot" : ""}">${l.t}</span>${m.art()}</div>
      <h3>${m.n}</h3><span class="meta">${m.d}</span>
      <div class="row"><span class="price">${fmt(m.p)}</span><button class="hold" data-i="${i}">Giữ bánh</button></div>
    </article>`;
  }).join("");
}
$("grid").onclick = e => {
  const b = e.target.closest(".hold"); if (!b) return;
  b.textContent = "Đã giữ ✓"; b.classList.add("done");
  toast(`Đã giữ “${MENU[b.dataset.i].n}” tại quầy trong 2 giờ (demo)`);
};

const tick = MENU.flatMap(m => m.b.map(t => [t, m.n])).sort((a, b) => mins(a[0]) - mins(b[0]))
  .concat([["20:30", "Giảm 30% toàn bộ bánh trong ngày"], ["21:30", "Đóng lò, hẹn bạn 6:00 sáng mai"]]);
const tickHTML = tick.map(([t, n]) => `<span><b>${t}</b>${n}</span>`).join("");
$("ticker").innerHTML = tickHTML + tickHTML;

/* ---------- cake builder ---------- */
const SIZES = [
  { v: 14, p: 320000, s: "4–6 người" }, { v: 16, p: 420000, s: "6–8 người" }, { v: 18, p: 520000, s: "8–10 người" },
  { v: 20, p: 650000, s: "10–14 người" }, { v: 24, p: 890000, s: "16–20 người" },
];
const FLAVORS = [
  { id: "vani", n: "Vani", add: 0, sponge: "#f3d48e", drip: "#e2a443" },
  { id: "socola", n: "Socola Bỉ", add: 30000, sponge: "#6b4030", drip: "#4a2a1e" },
  { id: "matcha", n: "Matcha Uji", add: 40000, sponge: "#9fbe6c", drip: "#6f9440" },
  { id: "red", n: "Red velvet", add: 40000, sponge: "#b3283f", drip: "#8e1f33" },
];
const CREAMS = [
  { id: "tuoi", n: "Kem tươi", add: 0, c: "#ffffff", sh: "#e9e6ef" },
  { id: "bo", n: "Kem bơ Pháp", add: 50000, c: "#fbe6b0", sh: "#ecd08a" },
  { id: "pho", n: "Cream cheese", add: 60000, c: "#fde3ea", sh: "#f2c3d1" },
];
const TOPS = [
  { id: "dau", n: "Dâu tây Đà Lạt", add: 45000 }, { id: "viet", n: "Việt quất", add: 55000 },
  { id: "choc", n: "Socola chip", add: 25000 }, { id: "hoa", n: "Hoa kem bắt tay", add: 35000 },
  { id: "nen", n: "Nến & thiệp", add: 15000 },
];

let uid = 0;
function cake(o) {
  const id = "ck" + (uid++), r = rng(o.size * 31 + 7);
  const cx = 160, yb = 214, w = 128 + (o.size - 14) * 10, h = 74 + (o.size - 14) * 2.6, ry = w * .17, yt = yb - h, x1 = cx - w / 2, x2 = cx + w / 2;
  const edge = x => yt + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / (w / 2)) ** 2));
  const F = o.flavor, C = o.cream;
  let s = `<defs><linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="${C.sh}"/><stop offset=".35" stop-color="${C.c}"/><stop offset=".8" stop-color="${C.c}"/><stop offset="1" stop-color="${C.sh}"/></linearGradient></defs>`;
  // stand
  s += `<ellipse cx="${cx}" cy="258" rx="${w / 2 + 6}" ry="8" fill="rgb(43 31 51 / .1)"/><path d="M${cx - 16} ${yb + 14} L${cx - 26} 254 H${cx + 26} L${cx + 16} ${yb + 14}Z" fill="#e3e9f2"/>`;
  s += `<ellipse cx="${cx}" cy="${yb + 8}" rx="${w / 2 + 22}" ry="${ry * .55 + 9}" fill="#d5deea"/><ellipse cx="${cx}" cy="${yb + 4}" rx="${w / 2 + 22}" ry="${ry * .55 + 8}" fill="#f4f7fb"/>`;
  // body
  s += `<path d="M${x1} ${yt} V${yb} A${w / 2} ${ry} 0 0 0 ${x2} ${yb} V${yt}Z" fill="url(#${id}g)"/>`;
  for (let i = 0; i <= 22; i++) { const x = x1 + 3 + (w - 6) * i / 22; s += `<circle cx="${x}" cy="${yb + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / (w / 2)) ** 2)) - 2}" r="4.6" fill="${F.sponge}"/>` }
  // drips + top
  const nd = Math.round(w / 15);
  for (let i = 0; i < nd; i++) { const x = x1 + 7 + (w - 14) * i / (nd - 1), y = edge(x), len = 8 + r() * (h * .32); s += `<rect x="${x - 4.2}" y="${y - 6}" width="8.4" height="${len + 6}" rx="4.2" fill="${F.drip}"/>` }
  s += `<ellipse cx="${cx}" cy="${yt}" rx="${w / 2}" ry="${ry}" fill="${F.drip}"/><ellipse cx="${cx}" cy="${yt + 1.5}" rx="${w / 2 - 7}" ry="${ry - 5}" fill="${C.c}"/>`;
  // toppings, sorted back to front
  const items = [], ring = (k, a) => [cx + Math.cos(a) * (w / 2) * k, yt + Math.sin(a) * ry * k];
  if (o.tops.has("hoa")) for (let i = 0; i < 12; i++) items.push(["hoa", ...ring(.86, i / 12 * Math.PI * 2)]);
  if (o.tops.has("nen")) [-.32, 0, .32].forEach((k, i) => items.push(["nen", cx + k * w / 2, yt - ry * .35 + (i % 2) * 3]));
  if (o.tops.has("dau")) for (let i = 0; i < 6; i++) items.push(["dau", ...ring(.6, Math.PI * (1.05 + i * .18))]);
  if (o.tops.has("viet")) for (let i = 0; i < 9; i++) items.push(["viet", ...ring(.35 + r() * .35, r() * Math.PI * 2)]);
  if (o.tops.has("choc")) for (let i = 0; i < 12; i++) items.push(["choc", ...ring(.2 + r() * .6, r() * Math.PI * 2)]);
  if (o.msg) items.push(["msg", cx, yt + ry * .25]);
  items.sort((a, b) => a[2] - b[2]);
  for (const [t, x, y] of items) {
    if (t === "hoa") s += `<circle cx="${x}" cy="${y - 4}" r="7.5" fill="#f5a9c1"/><path d="M${x - 4} ${y - 4}a4 4 0 1 1 4 4a2 2 0 1 1 -2 -2" stroke="#de6f95" stroke-width="1.6" fill="none"/>`;
    if (t === "nen") s += `<rect x="${x - 3}" y="${y - 34}" width="6" height="32" rx="2" fill="#7fae5c"/><path d="M${x - 3} ${y - 26}l6 -4M${x - 3} ${y - 16}l6 -4M${x - 3} ${y - 6}l6 -4" stroke="#fff" stroke-width="1.6"/><path d="M${x} ${y - 50}c5 6 5 12 0 13c-5 -1 -5 -7 0 -13z" fill="#ffc444"/><ellipse cx="${x}" cy="${y - 41}" rx="1.6" ry="3" fill="#fff6d0"/>`;
    if (t === "dau") s += `<g transform="translate(${x} ${y - 9})"><path d="M-8 -4Q0 -10 8 -4Q7 8 0 12Q-7 8 -8 -4Z" fill="#e0354b"/><path d="M-6 -6l3 3 3 -4 3 4 3 -3" stroke="#4f8a3a" stroke-width="2.6" fill="none" stroke-linejoin="round"/>${[[-3, 1], [3, 0], [0, 5], [-2, 8], [3, 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="#ffd36e"/>`).join("")}</g>`;
    if (t === "viet") s += `<circle cx="${x}" cy="${y - 4}" r="4.6" fill="#3d4f93"/><circle cx="${x - 1.4}" cy="${y - 5.6}" r="1.3" fill="#8d9be0"/>`;
    if (t === "choc") s += `<path d="M${x} ${y - 7}l4 6h-8z" fill="#4a2a1e"/>`;
    if (t === "msg") {
      const tw = Math.min(w * .86, Math.max(64, o.msg.length * 6.6 + 22));
      s += `<g transform="rotate(-3 ${x} ${y})"><rect x="${x - tw / 2}" y="${y - 26}" width="${tw}" height="25" rx="7" fill="#fffaf0" stroke="#ecdcbf" stroke-width="1.5"/><text x="${x}" y="${y - 9.5}" text-anchor="middle" font-family="Josefin Sans, sans-serif" font-weight="700" font-size="12" fill="#c92f63">${esc(o.msg)}</text></g>`;
    }
  }
  if (o.hero) s += [[44, 70, 9], [282, 96, 7], [262, 40, 5], [64, 150, 5]].map(([x, y, k]) => `<path d="M${x} ${y - k}L${x + k * .3} ${y - k * .3}L${x + k} ${y}L${x + k * .3} ${y + k * .3}L${x} ${y + k}L${x - k * .3} ${y + k * .3}L${x - k} ${y}L${x - k * .3} ${y - k * .3}Z" fill="#ffd36e"/>`).join("");
  return `<svg viewBox="0 0 320 270" role="img" aria-label="Xem trước bánh kem ${o.size} cm, cốt ${F.n}, ${C.n}">${s}</svg>`;
}

$("heroArt").insertAdjacentHTML("beforeend", cake({ size: 19, flavor: FLAVORS[0], cream: CREAMS[2], tops: new Set(["dau", "hoa", "nen"]), msg: "Mừng sinh nhật", hero: true }));
$("miniCroissant").innerHTML = pastry("croissant");

const st = { size: 1, flavor: 0, cream: 0, tops: new Set(["dau", "hoa"]) };
const optHTML = (list, key, multi) => list.map((o, i) => {
  const on = multi ? st.tops.has(o.id) : st[key] === i;
  const sw = key === "flavor" ? `<span class="sw" style="background:${o.sponge}"></span>` : key === "cream" ? `<span class="sw" style="background:${o.c}"></span>` : "";
  const sub = key === "size" ? o.s : o.add ? "+" + fmt(o.add) : key === "size" ? "" : "Đã gồm";
  const label = key === "size" ? `${o.v} cm · ${fmt(o.p)}` : o.n;
  return `<button type="button" class="opt" aria-pressed="${on}" data-k="${key}" data-i="${i}">${sw}<span>${label}<small>${sub}</small></span></button>`;
}).join("");
function renderOpts() {
  $("optSize").innerHTML = optHTML(SIZES, "size");
  $("optFlavor").innerHTML = optHTML(FLAVORS, "flavor");
  $("optCream").innerHTML = optHTML(CREAMS, "cream");
  $("optTop").innerHTML = optHTML(TOPS, "tops", true);
}
$("cakeForm").addEventListener("click", e => {
  const b = e.target.closest(".opt"); if (!b) return;
  const k = b.dataset.k, i = +b.dataset.i;
  if (k === "tops") { const id = TOPS[i].id; st.tops.has(id) ? st.tops.delete(id) : st.tops.add(id) } else st[k] = i;
  renderOpts(); renderCake();
});

function price() {
  return SIZES[st.size].p + FLAVORS[st.flavor].add + CREAMS[st.cream].add + TOPS.filter(t => st.tops.has(t.id)).reduce((a, t) => a + t.add, 0) + +$("ship").value;
}
function renderCake() {
  const msg = $("msg").value.trim();
  $("msgCount").textContent = `${$("msg").value.length}/24`;
  $("cakeStage").innerHTML = cake({ size: SIZES[st.size].v, flavor: FLAVORS[st.flavor], cream: CREAMS[st.cream], tops: st.tops, msg });
  $("sumLine").textContent = `${SIZES[st.size].v} cm · ${FLAVORS[st.flavor].n} · ${CREAMS[st.cream].n}${$("ship").value > 0 ? " · Giao tận nơi" : ""}`;
  $("serve").textContent = SIZES[st.size].s;
  $("total").textContent = fmt(price());
  $("submitBtn").textContent = `Đặt bánh · ${fmt(price())}`;
  $("ok").hidden = true;
}
$("msg").oninput = $("ship").onchange = renderCake;

const iso = d => new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const tmr = new Date(Date.now() + 864e5);
$("date").min = iso(tmr); $("date").value = iso(new Date(Date.now() + 2 * 864e5));

$("cakeForm").onsubmit = e => {
  e.preventDefault();
  const d = $("date").value.split("-").reverse().join("/");
  const how = $("ship").value > 0 ? "giao tận nơi" : "nhận tại tiệm 18 Phan Đình Phùng";
  $("ok").innerHTML = `<strong>Đã ghi nhận đơn bánh mẫu</strong>${esc($("name").value)} · bánh ${SIZES[st.size].v} cm cốt ${FLAVORS[st.flavor].n}, ${how} ngày ${d}. Tạm tính ${fmt(price())}, cọc 50% qua chuyển khoản.<br><span class="meta">Đây là website mẫu nên đơn không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA hoặc phần mềm quản lý đơn của tiệm.</span>`;
  $("ok").hidden = false;
  toast("Mây sẽ gọi xác nhận trong 15 phút (demo)");
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 2200) }

renderMenu(); renderOpts(); renderCake();
