const fmt = n => Math.round(n).toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const BRANDS = ["Tất cả", "Apple", "Samsung", "Xiaomi", "OPPO"];
const P = [
  { id: 1, brand: "Apple", name: "iPhone 17 Pro Max", cam: "pro", spec: "6,9 inch · A19 Pro · 3 camera 48MP", badge: "Bán chạy", cut: 2000000, pop: 1,
    colors: [["Cam Vũ Trụ", "#e5733a"], ["Xanh Đậm", "#2f3b52"], ["Bạc", "#dcdde0"]], vars: [["256GB", 37990000], ["512GB", 44490000], ["1TB", 50990000]] },
  { id: 2, brand: "Apple", name: "iPhone 17", cam: "duo", spec: "6,3 inch · màn 120Hz · camera kép 48MP", badge: "Mới", pop: 2,
    colors: [["Xanh Xô Thơm", "#b9c9b0"], ["Oải Hương", "#cdbfdc"], ["Trắng", "#f1f1ef"], ["Đen", "#2a2b2e"]], vars: [["256GB", 24990000], ["512GB", 31490000]] },
  { id: 3, brand: "Apple", name: "iPhone 17 Pro", cam: "pro", spec: "6,3 inch · A19 Pro · zoom quang 8x", cut: 1500000, pop: 3,
    colors: [["Cam Vũ Trụ", "#e5733a"], ["Xanh Đậm", "#2f3b52"], ["Bạc", "#dcdde0"]], vars: [["256GB", 34490000], ["512GB", 40990000]] },
  { id: 4, brand: "Samsung", name: "Galaxy S25 Ultra", cam: "vert", spec: "6,9 inch · bút S Pen · zoom 100x", badge: "Giảm 5 triệu", cut: 5000000, pop: 4,
    colors: [["Xám Titan", "#8d9096"], ["Bạc Titan", "#c9ccd1"], ["Đen Titan", "#2b2c30"]], vars: [["256GB", 27990000], ["512GB", 31990000]] },
  { id: 5, brand: "Apple", name: "iPhone 16", cam: "duo", spec: "6,1 inch · A18 · nút Camera Control", cut: 3000000, pop: 5,
    colors: [["Hồng", "#f2c3cf"], ["Xanh Mòng Két", "#6fa8a6"], ["Đen", "#2a2b2e"]], vars: [["128GB", 19290000], ["256GB", 22290000]] },
  { id: 6, brand: "Samsung", name: "Galaxy A56 5G", cam: "vert", spec: "6,7 inch · pin 5.000mAh · 6 năm cập nhật", pop: 6,
    colors: [["Xám Đậm", "#4a4c52"], ["Hồng", "#e9c7cf"], ["Xanh Mint", "#bfe3d4"]], vars: [["128GB", 9490000], ["256GB", 10490000]] },
  { id: 7, brand: "Xiaomi", name: "Xiaomi 15T Pro", cam: "square", spec: "6,83 inch · ống kính Leica · sạc 90W", pop: 7,
    colors: [["Vàng Mocha", "#c8ab83"], ["Xám", "#6d7076"], ["Đen", "#232427"]], vars: [["256GB", 17990000], ["512GB", 19990000]] },
  { id: 8, brand: "OPPO", name: "OPPO Reno14 5G", cam: "round", spec: "6,59 inch · AI chỉnh ảnh · sạc 80W", badge: "Tặng tai nghe", pop: 8,
    colors: [["Xanh Mint", "#b7dfd2"], ["Trắng Ngọc Trai", "#eeeae6"], ["Đen", "#1f2124"]], vars: [["256GB", 15990000], ["512GB", 17990000]] },
  { id: 9, brand: "Xiaomi", name: "Redmi Note 14 Pro 5G", cam: "square", spec: "6,67 inch · camera 200MP · IP68", pop: 9,
    colors: [["Xanh Lá", "#9cc7a4"], ["Tím", "#b6a2d6"], ["Đen", "#232427"]], vars: [["256GB", 7990000], ["512GB", 8990000]] },
  { id: 10, brand: "OPPO", name: "OPPO A5 Pro", cam: "round", spec: "6,67 inch · chống nước IP69 · pin 5.800mAh", pop: 10,
    colors: [["Nâu Đá", "#8b6e5a"], ["Xanh Đá", "#6e8ea6"]], vars: [["128GB", 5490000], ["256GB", 6290000]] },
];
const byId = id => P.find(p => p.id === id);

/* drawn phones: back view varies by camera layout, front view is the hero lock screen */
function shade(hex, t) {
  const n = parseInt(hex.slice(1), 16), m = t < 0 ? 0 : 255, k = Math.abs(t);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (m - v) * k));
  return `rgb(${c.join(" ")})`;
}
const lens = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1b1d22" stroke="rgba(255,255,255,.4)" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="#2a3a52"/><circle cx="${x - r * .22}" cy="${y - r * .22}" r="${r * .16}" fill="rgba(255,255,255,.65)"/>`;
const flash = (x, y, r = 3.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f0dc"/>`;
function back(p, ci, attrs = "") {
  const [cname, col] = p.colors[ci], d = shade(col, -.12), e = shade(col, -.32);
  const cam = {
    pro: `<rect x="14" y="12" width="92" height="50" rx="16" fill="${d}"/>${lens(33, 27, 9)}${lens(33, 48, 9)}${lens(54, 37.5, 9)}${flash(87, 27)}<circle cx="87" cy="47" r="3" fill="#15171b"/>`,
    duo: `<rect x="16" y="14" width="30" height="58" rx="15" fill="${d}"/>${lens(31, 29, 9)}${lens(31, 56, 9)}${flash(56, 24)}`,
    vert: `${lens(27, 26, 8)}${lens(27, 48, 8)}${lens(27, 70, 8)}${flash(45, 26)}`,
    round: `<circle cx="60" cy="46" r="31" fill="${d}" stroke="${e}" stroke-width="1.5"/>${lens(47, 34, 8.5)}${lens(73, 34, 8.5)}${lens(47, 58, 8.5)}${flash(73, 58, 4)}`,
    square: `<rect x="14" y="14" width="52" height="52" rx="13" fill="${d}"/>${lens(30, 30, 9)}${lens(50, 30, 9)}${lens(30, 50, 9)}${flash(50, 50, 3.6)}`,
  }[p.cam];
  const logo = p.brand === "Apple" ? `<circle cx="60" cy="122" r="9" fill="${d}"/>`
    : `<text x="60" y="206" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-size="7" font-weight="700" letter-spacing="1.2" fill="${e}">${p.brand.toUpperCase()}</text>`;
  return `<svg ${attrs} viewBox="0 0 120 230" role="img" aria-label="Minh họa ${p.name} màu ${cname}">
    <rect x="5" y="58" width="4" height="22" rx="2" fill="${e}"/><rect x="111" y="66" width="4" height="34" rx="2" fill="${e}"/>
    <rect x="8" y="4" width="104" height="222" rx="20" fill="${col}" stroke="${e}" stroke-width="1.2"/>
    <rect x="8" y="4" width="104" height="222" rx="20" fill="url(#sheen)"/>${cam}${logo}</svg>`;
}
function front(attrs) {
  const icons = ["#c8f03c", "#ff5b2e", "#ffffff", "#4cc38a", "#ffd23f", "#ff8fab", "#7dd3fc", "#f2f3f5"];
  let apps = "";
  icons.forEach((c, i) => apps += `<rect x="${22 + (i % 4) * 20}" y="${134 + Math.floor(i / 4) * 22}" width="14" height="14" rx="4" fill="${c}"/>`);
  for (let i = 0; i < 4; i++) apps += `<rect x="${24 + i * 20}" y="197" width="13" height="13" rx="4" fill="${icons[(i * 3 + 1) % 8]}"/>`;
  return `<svg ${attrs} viewBox="0 0 120 230" role="img" aria-label="Màn hình khóa điện thoại">
    <defs><clipPath id="scr"><rect x="12" y="8" width="96" height="214" rx="16"/></clipPath></defs>
    <rect x="8" y="4" width="104" height="222" rx="20" fill="#1a1c21"/>
    <g clip-path="url(#scr)">
      <rect x="12" y="8" width="96" height="214" fill="#15171c"/>
      <circle cx="96" cy="62" r="44" fill="#ff5b2e"/><circle cx="20" cy="176" r="52" fill="#c8f03c"/><circle cx="104" cy="196" r="26" fill="#fff" opacity=".22"/>
      <rect x="12" y="8" width="96" height="214" fill="rgba(15,17,21,.18)"/>
    </g>
    <rect x="47" y="13" width="26" height="8" rx="4" fill="#000"/>
    <text x="60" y="56" text-anchor="middle" font-family="Unbounded, sans-serif" font-weight="600" font-size="22" fill="#fff">09:41</text>
    <text x="60" y="68" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="600" font-size="5.6" fill="rgba(255,255,255,.88)">Thứ Tư, 28 tháng 10</text>
    <rect x="20" y="84" width="38" height="40" rx="9" fill="rgba(255,255,255,.2)"/>
    <text x="26" y="104" font-family="Unbounded, sans-serif" font-weight="600" font-size="11" fill="#fff">28°</text>
    <text x="26" y="116" font-family="Be Vietnam Pro, sans-serif" font-size="5.4" fill="rgba(255,255,255,.85)">Hà Nội · nắng</text>
    <rect x="62" y="84" width="38" height="40" rx="9" fill="rgba(255,255,255,.2)"/>
    <circle cx="81" cy="104" r="11" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3"/>
    <circle cx="81" cy="104" r="11" fill="none" stroke="#c8f03c" stroke-width="3" stroke-dasharray="59.4 69.1" stroke-linecap="round" transform="rotate(-90 81 104)"/>
    <text x="81" y="106" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="700" font-size="6" fill="#fff">86%</text>
    <rect x="18" y="192" width="84" height="23" rx="10" fill="rgba(255,255,255,.22)"/>${apps}</svg>`;
}

document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
</defs></svg>`);
$("heroArt").insertAdjacentHTML("beforeend", `<svg viewBox="0 0 500 520" aria-hidden="true">
  <ellipse cx="260" cy="496" rx="190" ry="14" fill="rgba(15,17,21,.18)"/>
  <g transform="rotate(-12 165 270)">${back(P[0], 0, 'x="50" y="44" width="230" height="440"')}</g>
  ${front('x="214" y="38" width="244" height="466"')}</svg>`);

/* product grid */
let brand = "Tất cả", seg = "all", sort = "pop";
const sel = Object.fromEntries(P.map(p => [p.id, [0, 0]]));
const priceOf = p => p.vars[sel[p.id][1]][1];
const inSeg = v => seg === "all" || (seg === "lo" ? v < 10e6 : seg === "mid" ? v >= 10e6 && v <= 20e6 : v > 20e6);
const perMonth = v => Math.ceil(v / 12 / 1000) * 1000;

$("chips").innerHTML = BRANDS.map(b => `<button class="chip" aria-pressed="${b === brand}" data-b="${b}">${b}</button>`).join("");
$("chips").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; brand = b.dataset.b; document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b)); renderGrid() };
$("seg").onchange = e => { seg = e.target.value; renderGrid() };
$("sort").onchange = e => { sort = e.target.value; renderGrid() };

function card(p) {
  const [ci, vi] = sel[p.id], price = priceOf(p);
  return `<article class="card" data-id="${p.id}">
    <div class="art">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${back(p, ci)}</div>
    <div class="head"><h3>${p.name}</h3><span class="brand">${p.brand}</span></div>
    <p class="spec">${p.spec}</p>
    <div class="opts">
      <div class="dots">${p.colors.map(([n, c], i) => `<button class="dot" style="background:${c}" aria-label="Màu ${n}" title="${n}" aria-pressed="${i === ci}" data-c="${i}"></button>`).join("")}</div>
      <div class="caps">${p.vars.map(([n], i) => `<button class="cap" aria-pressed="${i === vi}" data-v="${i}">${n}</button>`).join("")}</div>
    </div>
    <div class="cname">Màu ${p.colors[ci][0]}</div>
    <div class="buy">
      <span class="price">${p.cut ? `<s>${fmt(price + p.cut)}</s>` : ""}${fmt(price)}</span>
      <button class="go" data-go="1">Tính trả góp</button>
    </div>
    <div class="month">Góp thẻ 0%: <b>${fmt(perMonth(price))}</b>/tháng × 12</div>
  </article>`;
}
function renderGrid() {
  const list = P.filter(p => (brand === "Tất cả" || p.brand === brand) && inSeg(priceOf(p)));
  list.sort((a, b) => sort === "asc" ? priceOf(a) - priceOf(b) : sort === "desc" ? priceOf(b) - priceOf(a) : a.pop - b.pop);
  $("grid").innerHTML = list.length ? list.map(card).join("") : `<div class="empty">Chưa có máy ở mức giá này. Thử chọn hãng khác hoặc gọi 0968 189 189 để hỏi hàng về.</div>`;
}
$("grid").onclick = e => {
  const el = e.target.closest("button"); if (!el) return;
  const art = el.closest(".card"), p = byId(+art.dataset.id);
  if (el.dataset.c) sel[p.id][0] = +el.dataset.c;
  if (el.dataset.v) sel[p.id][1] = +el.dataset.v;
  if (el.dataset.go) {
    $("c-new").value = `${p.id}-${sel[p.id][1]}`; renderCalc();
    $("len-doi").scrollIntoView({ behavior: "smooth" });
    return;
  }
  art.outerHTML = card(p);
};

/* trade-in + installment calculator */
const OLD = [["Không thu máy cũ", 0], ["iPhone 13 · 128GB", 6800000], ["iPhone 14 Pro · 128GB", 11500000], ["iPhone 15 · 128GB", 11000000], ["iPhone 15 Pro Max · 256GB", 17800000],
  ["Galaxy S23 Ultra · 256GB", 9200000], ["Galaxy A54 · 128GB", 3600000], ["Xiaomi 13T · 256GB", 5200000], ["OPPO Reno10 · 256GB", 3300000]];
const COND = [["Như mới", 1, "Không trầy xước, pin từ 90%, đủ hộp"], ["Trầy nhẹ", .88, "Xước dăm ở viền hoặc lưng, pin từ 85%"], ["Cấn móp", .72, "Móp viền, nứt lưng hoặc pin dưới 85%"]];
const METHODS = {
  card: { name: "Thẻ tín dụng", note: "Lãi 0%, phí chuyển đổi 0₫ với thẻ Visa, Mastercard, JCB của 26 ngân hàng.", min: 0, terms: [3, 6, 9, 12], rate: () => 0, fee: 0 },
  cccd: { name: "Góp bằng CCCD", note: "Qua Home Credit, FE Credit. Trả trước từ 20%. Kỳ 6 tháng lãi 0%, từ 9 tháng lãi phẳng 1,2%/tháng. Phí thu hộ 11.000₫/tháng.", min: 20, terms: [6, 9, 12, 18], rate: t => t <= 6 ? 0 : .012, fee: 11000 },
};
let cond = 0, method = "card", pre = 0, term = 12, last = null;

$("c-new").innerHTML = P.map(p => p.vars.map(([n, v], i) => `<option value="${p.id}-${i}">${p.name} ${n} — ${fmt(v)}</option>`).join("")).join("");
$("c-old").innerHTML = OLD.map(([n, v], i) => `<option value="${i}">${n}${v ? ` — thu đến ${fmt(v)}` : ""}</option>`).join("");
$("c-old").value = "2";
$("rDate").textContent = new Date().toLocaleDateString("vi-VN");

const segBtns = (items, cur) => items.map(([v, label]) => `<button type="button" data-v="${v}" aria-pressed="${v == cur}">${label}</button>`).join("");
function renderCalc() {
  const [id, vi] = $("c-new").value.split("-").map(Number), p = byId(id), [cap, price] = p.vars[vi];
  const oldVal = OLD[+$("c-old").value][1], M = METHODS[method];
  if (pre < M.min) pre = M.min;
  if (!M.terms.includes(term)) term = 12;
  $("c-pre").min = M.min; $("c-pre").value = pre; $("preOut").textContent = pre + "%";
  $("condWrap").hidden = !oldVal;
  $("c-cond").innerHTML = segBtns(COND.map(([n], i) => [i, n]), cond);
  $("condNote").textContent = COND[cond][2];
  $("c-method").innerHTML = segBtns(Object.entries(METHODS).map(([k, m]) => [k, m.name]), method);
  $("methodNote").textContent = M.note;
  $("c-term").innerHTML = segBtns(M.terms.map(t => [t, t + " tháng"]), term);

  const trade = Math.round(oldVal * COND[cond][1] / 10000) * 10000;
  const bonus = oldVal ? (price >= 15e6 ? 1000000 : 500000) : 0;
  const need = Math.max(0, price - trade - bonus);
  const preAmt = Math.round(need * pre / 100 / 100000) * 100000;
  const loan = need - preAmt, rate = M.rate(term);
  const monthly = loan ? Math.ceil((loan / term + loan * rate + M.fee) / 1000) * 1000 : 0;
  const extra = preAmt + monthly * term - need;

  $("rModel").textContent = `${p.name} ${cap}`;
  $("rRows").innerHTML = `
    <div><span>Giá máy</span><span>${fmt(price)}</span></div>
    ${oldVal ? `<div class="minus"><span>Thu máy cũ (${COND[cond][0].toLowerCase()})</span><span>−${fmt(trade)}</span></div>
    <div class="minus"><span>Trợ giá lên đời</span><span>−${fmt(bonus)}</span></div>` : ""}
    <div class="sum"><span>Cần thanh toán</span><span>${fmt(need)}</span></div>
    <div><span>Trả trước ${pre}%</span><span>${fmt(preAmt)}</span></div>
    <div><span>Số tiền góp</span><span>${fmt(loan)}</span></div>
    <div><span>Chênh lệch so với trả thẳng</span><span>${extra > 0 ? fmt(extra) : "0₫"}</span></div>`;
  $("rMonth").textContent = fmt(monthly);
  $("rTerm").textContent = `× ${term} tháng · ${M.name} · ${rate ? "lãi 1,2%/tháng" : "lãi 0%"}`;
  last = { p, cap, monthly, term, ci: sel[p.id][0] };
}
$("c-new").onchange = $("c-old").onchange = renderCalc;
$("c-pre").oninput = e => { pre = +e.target.value; renderCalc() };
$("c-cond").onclick = e => { const b = e.target.closest("button"); if (b) { cond = +b.dataset.v; renderCalc() } };
$("c-method").onclick = e => { const b = e.target.closest("button"); if (b) { method = b.dataset.v; renderCalc() } };
$("c-term").onclick = e => { const b = e.target.closest("button"); if (b) { term = +b.dataset.v; renderCalc() } };
$("takeDeal").onclick = () => {
  const { p, cap, monthly, term, ci } = last;
  $("r-model").value = `${p.name} ${cap} · ${p.colors[ci][0]} · góp ${fmt(monthly)} × ${term} tháng`;
  toast("Đã chép gói vào form giữ máy");
};

/* reserve form (demo) */
$("r-model").value = "iPhone 17 Pro Max 256GB · Cam Vũ Trụ";
$("reserve").onsubmit = e => {
  e.preventDefault();
  const v = id => esc($(id).value.trim());
  $("okMsg").innerHTML = `<strong>Đã giữ máy cho ${v("r-name")}</strong>${v("r-model")} · ${v("r-store")}. Nhân viên sẽ gọi số ${v("r-phone")} trong 10 phút.<br>Đây là website mẫu nên yêu cầu không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA hoặc phần mềm bán hàng của cửa hàng.`;
  $("okMsg").hidden = false;
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 1800) }

renderGrid(); renderCalc();
