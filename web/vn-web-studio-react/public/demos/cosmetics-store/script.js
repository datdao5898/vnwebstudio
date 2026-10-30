const fmt = n => n.toLocaleString("vi-VN") + "₫";
const FREE = 399000, SHIP = 25000;

const CATS = [["all", "Tất cả"], ["clean", "Làm sạch"], ["toner", "Toner"], ["serum", "Serum & đặc trị"], ["moist", "Dưỡng ẩm"], ["sun", "Chống nắng"]];
const CAT = Object.fromEntries(CATS);
/* tags: loại da (dau, kho, honhop, nhaycam) + vấn đề (mun, tham, am, do) */
const P = [
  { id: 1, brand: "Bioderma", name: "Sensibio H2O nước tẩy trang", size: "500ml", cat: "clean", price: 495000, old: 560000, tags: ["kho", "nhaycam", "honhop", "do", "am"], type: "pump", c: ["#ffd9e2", "#f4f6f7", "#ffffff", "#e8476a"], short: "H2O", rate: 4.9, sold: "8,2k", pop: 1, badge: "-12%" },
  { id: 2, brand: "Cerave", name: "Sữa rửa mặt tạo bọt cho da dầu", size: "236ml", cat: "clean", price: 345000, tags: ["dau", "honhop", "mun"], type: "pump", c: ["#e9f3fb", "#1e5a9c", "#ffffff", "#1e5a9c"], short: "FOAM", rate: 4.8, sold: "6,1k", pop: 3 },
  { id: 3, brand: "Cocoon", name: "Nước bí đao cân bằng da", size: "310ml", cat: "toner", price: 195000, tags: ["dau", "honhop", "mun"], type: "bottle", c: ["#cfe9b8", "#3f7a2a", "#f7fbef", "#3f7a2a"], short: "BÍ ĐAO", rate: 4.8, sold: "9,4k", pop: 2, badge: "Made in VN" },
  { id: 4, brand: "Klairs", name: "Supple Preparation Toner không mùi", size: "180ml", cat: "toner", price: 289000, tags: ["kho", "nhaycam", "do", "am"], type: "bottle", c: ["#eef2f1", "#2b2f33", "#ffffff", "#2b2f33"], short: "SUPPLE", rate: 4.7, sold: "3,3k", pop: 7 },
  { id: 5, brand: "Paula's Choice", name: "2% BHA Liquid Exfoliant", size: "118ml", cat: "serum", price: 890000, old: 990000, tags: ["dau", "honhop", "mun"], type: "bottle", c: ["#f4f4f4", "#1d1d1f", "#ffffff", "#c8102e"], short: "2% BHA", rate: 4.9, sold: "4,7k", pop: 4 },
  { id: 6, brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", size: "30ml", cat: "serum", price: 265000, tags: ["dau", "honhop", "mun", "tham"], type: "dropper", c: ["#f1f1ee", "#2a2a2a", "#ffffff", "#2a2a2a"], short: "NIA 10%", rate: 4.7, sold: "7,8k", pop: 5 },
  { id: 7, brand: "Klairs", name: "Freshly Juiced Vitamin Drop", size: "35ml", cat: "serum", price: 345000, tags: ["kho", "honhop", "nhaycam", "tham"], type: "dropper", c: ["#ffd27a", "#ffffff", "#fff7e3", "#d07a00"], short: "VIT C 5%", rate: 4.8, sold: "2,9k", pop: 8, badge: "Mới" },
  { id: 8, brand: "La Roche-Posay", name: "Cicaplast Baume B5+ phục hồi", size: "40ml", cat: "moist", price: 365000, tags: ["nhaycam", "kho", "do", "honhop"], type: "tube", c: ["#ffffff", "#2f6fb5", "#e8f1fb", "#2f6fb5"], short: "B5+", rate: 4.9, sold: "5,6k", pop: 6 },
  { id: 9, brand: "Cerave", name: "Kem dưỡng ẩm Moisturising Cream", size: "340g", cat: "moist", price: 465000, tags: ["kho", "nhaycam", "am"], type: "jar", c: ["#ffffff", "#1e5a9c", "#e9f3fb", "#1e5a9c"], short: "CREAM", rate: 4.8, sold: "4,0k", pop: 9 },
  { id: 10, brand: "Cerave", name: "PM Facial Lotion dưỡng ẩm nhẹ", size: "52ml", cat: "moist", price: 385000, tags: ["dau", "honhop", "mun", "am"], type: "pump", c: ["#ffffff", "#2f7fc1", "#eaf4fb", "#2f7fc1"], short: "PM", rate: 4.7, sold: "3,1k", pop: 10 },
  { id: 11, brand: "Anessa", name: "Perfect UV Sunscreen Milk SPF50+", size: "60ml", cat: "sun", price: 545000, old: 625000, tags: ["dau", "honhop", "mun", "tham"], type: "tube", c: ["#ffe27a", "#c9a227", "#fffaf0", "#9c7a00"], short: "SPF50+", rate: 4.9, sold: "11k", pop: 2.5, badge: "Bán chạy" },
  { id: 12, brand: "La Roche-Posay", name: "Anthelios UVMune 400 Fluid", size: "50ml", cat: "sun", price: 520000, tags: ["kho", "nhaycam", "do", "tham", "honhop"], type: "tube", c: ["#ffffff", "#f39200", "#fff3e2", "#e06d00"], short: "UV 400", rate: 4.8, sold: "3,8k", pop: 11 },
];

/* vẽ bao bì bằng SVG: mỗi loại chai có khung riêng, màu lấy theo sản phẩm [thân, nắp, nhãn, chữ] */
const LABEL = { pump: [72, 122, 56, 58], dropper: [76, 134, 48, 48], bottle: [72, 116, 56, 64], tube: [74, 88, 52, 62], jar: [60, 152, 80, 38] };
function shape(p) {
  const [body, cap, label, ink] = p.c, line = "rgba(15,40,40,.14)";
  let g = "";
  if (p.type === "pump") g = `<rect x="96" y="40" width="8" height="24" fill="${cap}"/><path d="M104 42h26v7h-26z" fill="${cap}"/><rect x="80" y="58" width="40" height="18" rx="5" fill="${cap}" stroke="${line}"/><rect x="88" y="74" width="24" height="20" fill="${cap}" stroke="${line}"/><rect x="64" y="92" width="72" height="113" rx="16" fill="${body}" stroke="${line}"/>`;
  if (p.type === "dropper") g = `<path d="M87 94V70q0-24 13-24t13 24v24z" fill="${cap}" stroke="${line}"/><rect x="82" y="90" width="36" height="22" rx="4" fill="${cap === "#ffffff" ? "#e9e9e4" : cap}" stroke="${line}"/><rect x="70" y="110" width="60" height="95" rx="14" fill="${body}" stroke="${line}"/>`;
  if (p.type === "bottle") g = `<rect x="82" y="46" width="36" height="32" rx="6" fill="${cap}" stroke="${line}"/><rect x="87" y="76" width="26" height="14" fill="${cap}" opacity=".85"/><rect x="64" y="88" width="72" height="117" rx="20" fill="${body}" stroke="${line}"/>`;
  if (p.type === "tube") g = `<path d="M70 178L60 54q40-6 80 0L130 178z" fill="${body}" stroke="${line}"/><rect x="57" y="42" width="86" height="13" rx="2" fill="${body}" stroke="${line}"/><path d="M62 46h76M62 50h76" stroke="${line}"/><rect x="74" y="176" width="52" height="29" rx="7" fill="${cap}" stroke="${line}"/>`;
  if (p.type === "jar") g = `<rect x="48" y="132" width="104" height="73" rx="14" fill="${body}" stroke="${line}"/><rect x="44" y="106" width="112" height="32" rx="8" fill="${cap}" stroke="${line}"/><path d="M52 114h96M52 122h96M52 130h96" stroke="rgba(255,255,255,.25)"/>`;
  const [x, y, w, h] = LABEL[p.type], cx = x + w / 2;
  const brand = p.brand.toUpperCase().replace("LA ROCHE-POSAY", "LRP").replace("THE ORDINARY", "ORDINARY").replace("PAULA'S CHOICE", "PAULA'S");
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${label}" stroke="${line}"/>
    <text x="${cx}" y="${y + 15}" text-anchor="middle" font-size="7" letter-spacing="1" fill="${ink}" opacity=".75">${brand}</text>
    <text x="${cx}" y="${y + h / 2 + 8}" text-anchor="middle" font-size="${p.short.length > 6 ? 9.5 : 12}" font-weight="800" fill="${ink}">${p.short}</text>
    <rect x="${cx - 12}" y="${y + h - 10}" width="24" height="2.5" rx="1" fill="${ink}" opacity=".35"/>`;
  g += `<rect x="${p.type === "jar" ? 54 : p.type === "tube" ? 68 : 70}" y="${p.type === "jar" ? 140 : p.type === "tube" ? 64 : 104}" width="6" height="${p.type === "jar" ? 52 : 90}" rx="3" fill="#fff" opacity=".45"/>`;
  return g;
}
const pack = p => `<svg viewBox="0 0 200 220" role="img" aria-label="Minh họa ${p.brand} ${p.name}"><ellipse cx="100" cy="207" rx="62" ry="7" fill="rgba(14,42,43,.1)"/>${shape(p)}</svg>`;
const at = (p, cx, floor, s) => `<g transform="translate(${cx - 100 * s} ${floor - 205 * s}) scale(${s})">${shape(p)}</g>`;

function heroArt() {
  const byId = id => P.find(p => p.id === id);
  let drops = "";
  [[92, 120, 9], [438, 96, 6], [470, 210, 11], [70, 300, 5], [120, 70, 4], [402, 160, 4]].forEach(([x, y, r]) => {
    drops += `<path d="M${x} ${y - r * 1.6}q${r} ${r * 1.3} ${r} ${r * 1.9}a${r} ${r} 0 0 1-${r * 2} 0q0-${r * .6} ${r}-${r * 1.9}z" fill="#fff" stroke="#9fd8d1" stroke-width="1.2"/>`;
  });
  $("heroArt").innerHTML = `<svg viewBox="0 0 520 480" role="img" aria-label="Bộ sản phẩm chăm sóc da trên bục trưng bày">
    <circle cx="262" cy="236" r="196" fill="#d6f0ec"/>
    <path d="M90 180a172 172 0 0 1 250-136" fill="none" stroke="#e3f56a" stroke-width="22" stroke-linecap="round"/>
    <circle cx="414" cy="86" r="34" fill="#ff5a76" opacity=".9"/>
    ${drops}
    <path d="M48 402h428v34a214 26 0 0 1-428 0z" fill="#ffffff"/><ellipse cx="262" cy="402" rx="214" ry="26" fill="#f6fbfa" stroke="#cfe7e3"/>
    ${at(byId(7), 140, 404, 1.2)}
    ${at(byId(1), 262, 404, 1.5)}
    ${at(byId(11), 386, 404, 1.15)}
    <ellipse cx="196" cy="449" rx="50" ry="6" fill="rgba(14,42,43,.12)"/>
    ${at(byId(9), 196, 448, .82)}
  </svg>`;
}

let cat = "all", sort = "pop", cart = {}, bonus = false;
try { cart = JSON.parse(localStorage.getItem("suong-cart") || "{}"); bonus = localStorage.getItem("suong-bonus") === "1" } catch (e) {}
const save = () => { try { localStorage.setItem("suong-cart", JSON.stringify(cart)); localStorage.setItem("suong-bonus", bonus ? "1" : "0") } catch (e) {} };
const $ = id => document.getElementById(id);
const byId = id => P.find(p => p.id == id);

heroArt();
$("chips").innerHTML = CATS.map(([k, v]) => `<button class="chip" aria-pressed="${k === cat}" data-c="${k}">${v}</button>`).join("");
$("chips").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; cat = b.dataset.c; document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b)); renderGrid() };
$("sort").onchange = e => { sort = e.target.value; renderGrid() };

function renderGrid() {
  const list = P.filter(p => cat === "all" || p.cat === cat);
  list.sort((a, b) => sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : a.pop - b.pop);
  $("grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="art">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}<span class="cat">${CAT[p.cat]}</span>${pack(p)}</div>
      <div class="info">
        <span class="brand">${p.brand}</span>
        <h3>${p.name}</h3>
        <span class="meta">${p.size} · <span class="star">★ ${p.rate.toString().replace(".", ",")}</span> · đã bán ${p.sold}</span>
        <div class="row">
          <span class="price">${fmt(p.price)}${p.old ? `<s>${fmt(p.old)}</s>` : ""}</span>
          <button class="add" data-id="${p.id}" aria-label="Thêm ${p.name} vào giỏ">+ Giỏ</button>
        </div>
      </div>
    </article>`).join("");
}
$("grid").onclick = e => {
  const b = e.target.closest(".add"); if (!b) return;
  const id = +b.dataset.id; cart[id] = (cart[id] || 0) + 1; save(); renderCart();
  b.textContent = "✓ Đã thêm"; b.classList.add("done");
  setTimeout(() => { b.textContent = "+ Giỏ"; b.classList.remove("done") }, 1200);
  toast(`Đã thêm ${byId(id).brand} ${byId(id).size} vào giỏ`);
};

/* tìm routine: chấm điểm theo loại da (+2) và vấn đề da (+3) cho từng bước */
const SKIN = { dau: "da dầu", kho: "da khô", honhop: "da hỗn hợp", nhaycam: "da nhạy cảm" };
const CONC = { mun: "mụn", tham: "thâm", am: "thiếu ẩm", do: "kích ứng" };
const STEPS = {
  clean: ["Làm sạch", "Sáng & tối, massage 60 giây"],
  toner: ["Cân bằng", "Thấm nhẹ bằng tay, không chà bông"],
  serum: ["Đặc trị", "Tối, bắt đầu cách ngày"],
  moist: ["Dưỡng ẩm", "Lượng bằng hạt đậu, sáng & tối"],
  sun: ["Chống nắng", "Sáng, thoa lại sau 3–4 giờ"],
};
const q = { skin: "dau", concern: "mun", level: "3" };
let routine = [];
document.querySelectorAll(".opts").forEach(box => box.onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  q[box.dataset.k] = b.dataset.v;
  box.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderRoutine();
});
function setOpt(k, v) {
  q[k] = v;
  document.querySelectorAll(`.opts[data-k="${k}"] button`).forEach(x => x.setAttribute("aria-pressed", x.dataset.v === v));
  renderRoutine();
}
document.querySelector(".concerns").onclick = e => { const a = e.target.closest("[data-c]"); if (a) setOpt("concern", a.dataset.c) };

function renderRoutine() {
  const steps = q.level === "3" ? ["clean", "moist", "sun"] : ["clean", "toner", "serum", "moist", "sun"];
  const score = p => (p.tags.includes(q.skin) ? 2 : 0) + (p.tags.includes(q.concern) ? 3 : 0);
  routine = steps.map(s => P.filter(p => p.cat === s).sort((a, b) => score(b) - score(a) || (q.level === "3" ? a.price - b.price : a.pop - b.pop))[0]);
  const total = routine.reduce((s, p) => s + p.price, 0);
  $("rTitle").textContent = `Cho ${SKIN[q.skin]}, lo ${CONC[q.concern]}`;
  $("rList").innerHTML = routine.map((p, i) => `
    <li><div class="r-thumb">${pack(p)}</div>
      <div><span class="r-step">Bước ${i + 1} · ${STEPS[p.cat][0]}</span><b>${p.brand} ${p.name}</b><span class="meta">${STEPS[p.cat][1]}</span></div>
      <span class="price">${fmt(p.price)}</span></li>`).join("");
  $("rTotal").textContent = fmt(total);
  $("rDays").textContent = q.level === "3" ? "Dùng được khoảng 2–3 tháng" : "Dùng được khoảng 2–3 tháng · tặng bộ mẫu thử";
}
$("rAdd").onclick = () => {
  routine.forEach(p => cart[p.id] = (cart[p.id] || 0) + 1);
  if (q.level === "5") bonus = true;
  save(); renderCart(); openCart(true);
};

let placed = false;
function renderCart() {
  const ids = Object.keys(cart).filter(k => cart[k] > 0);
  const n = ids.reduce((s, k) => s + cart[k], 0);
  const sub = ids.reduce((s, k) => s + byId(k).price * cart[k], 0);
  $("count").textContent = n;
  if (placed) return;
  if (!ids.length) bonus = false;
  $("items").innerHTML = ids.length ? ids.map(k => { const p = byId(k); return `
    <div class="item"><div class="thumb">${pack(p)}</div>
      <div><div class="nm">${p.brand} · ${p.size}</div><div class="meta">${p.name}</div>
        <div class="qty"><button data-d="-1" data-id="${k}" aria-label="Bớt">−</button><span>${cart[k]}</span><button data-d="1" data-id="${k}" aria-label="Thêm">+</button></div></div>
      <div class="price">${fmt(p.price * cart[k])}</div></div>` }).join("") + (bonus ? `<div class="gift">🎁 Tặng bộ mẫu thử 5 món cho routine 5 bước</div>` : "")
    : `<div class="empty">Giỏ đang trống.<br>Thử phần “Tìm routine” để được gợi ý nhé.</div>`;
  if (!ids.length) { $("checkout").innerHTML = ""; return }
  const ship = sub >= FREE ? 0 : SHIP;
  $("checkout").innerHTML = `
    <div class="ship">${ship ? `Thêm ${fmt(FREE - sub)} để được miễn phí giao` : "Đơn được miễn phí giao hàng"}</div>
    <div class="bar"><i style="width:${Math.min(100, sub / FREE * 100)}%"></i></div>
    <div class="tot"><span>Tổng (ship ${ship ? fmt(ship) : "0₫"})</span><span>${fmt(sub + ship)}</span></div>
    <form class="order" id="order">
      <div class="two">
        <label>Họ tên<input id="f-name" required value="Nguyễn Thu Trang"></label>
        <label>Số điện thoại<input id="f-phone" required inputmode="tel" value="0912 345 678"></label>
      </div>
      <label>Địa chỉ giao<input id="f-addr" required value="18 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội"></label>
      <label>Hình thức giao<select id="f-ship"><option>Giao nhanh 2 giờ (nội thành Hà Nội)</option><option>Giao tiêu chuẩn 1–3 ngày (toàn quốc)</option><option>Nhận tại cửa hàng Chùa Bộc</option></select></label>
      <label>Ghi chú cho dược sĩ<textarea id="f-msg" rows="2">Da mình dầu vùng chữ T, đang dùng thử BHA lần đầu.</textarea></label>
      <button class="btn primary" type="submit">Đặt hàng · ${fmt(sub + ship)}</button>
    </form>`;
  $("order").onsubmit = e => {
    e.preventDefault(); placed = true;
    const f = id => $(id).value;
    $("items").innerHTML = "";
    $("checkout").innerHTML = `<div class="ok"><strong>Đơn mẫu đã tạo</strong>Cảm ơn ${f("f-name")}! Hình thức: ${f("f-ship").toLowerCase()}. Dược sĩ sẽ gọi số ${f("f-phone")} để xác nhận.<br>Đây là website mẫu nên đơn không được gửi đi. Khi chạy thật, form này sẽ nối với Zalo, email hoặc phần mềm bán hàng.</div>
      <button class="btn ghost" id="again" style="margin-top:12px">Tiếp tục mua</button>`;
    cart = {}; bonus = false; save(); $("count").textContent = 0;
    $("again").onclick = () => { placed = false; renderCart() };
  };
}
$("items").onclick = e => {
  const b = e.target.closest("[data-d]"); if (!b) return;
  cart[b.dataset.id] = Math.max(0, cart[b.dataset.id] + +b.dataset.d); if (!cart[b.dataset.id]) delete cart[b.dataset.id];
  save(); renderCart();
};

function openCart(v) {
  $("drawer").classList.toggle("open", v); $("drawer").setAttribute("aria-hidden", !v); $("scrim").hidden = !v;
}
$("openCart").onclick = () => openCart(true);
$("closeCart").onclick = $("scrim").onclick = () => openCart(false);
document.addEventListener("keydown", e => e.key === "Escape" && openCart(false));

$("sub").onsubmit = e => {
  e.preventDefault();
  $("subMsg").textContent = `Đã ghi nhận số ${$("subPhone").value}. Đây là website mẫu nên mã chưa được gửi đi thật.`;
  $("subMsg").hidden = false; e.target.reset();
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 1800) }

renderGrid(); renderRoutine(); renderCart();

// #gio-hang: mở sẵn giỏ với vài món để demo cho khách
if (location.hash === "#gio-hang") {
  if (!Object.keys(cart).length) { cart = { 2: 1, 3: 1, 11: 1 }; renderCart() }
  openCart(true);
}
