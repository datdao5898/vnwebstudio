const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

const C = {
  cobalt: ["Xanh cobalt", "#2f4bd1"], black: ["Đen", "#1d1e24"], blush: ["Hồng phấn", "#eeb3bf"],
  white: ["Trắng", "#fafafa"], ice: ["Xanh băng", "#bfd5f0"], grey: ["Xám ghi", "#7f838d"],
  navy: ["Navy", "#1f2a4f"], silver: ["Xám nhạt", "#b3b7c0"], green: ["Xanh lá", "#3f7a5a"], plum: ["Đỏ mận", "#8c2240"],
};
const CATS = ["Tất cả", "Đầm", "Áo", "Blazer", "Chân váy", "Quần"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const P = [
  { id: 1, name: "Đầm midi Sương", type: "dress", cat: "Đầm", price: 690000, fabric: "Lụa Hàn, có lớp lót", colors: [C.cobalt, C.black, C.blush], badge: "Bán chạy", pop: 1, fresh: 4 },
  { id: 2, name: "Sơ mi lụa Lan", type: "blouse", cat: "Áo", price: 420000, fabric: "Lụa satin chống nhăn", colors: [C.white, C.ice, C.blush], pop: 2, fresh: 6 },
  { id: 3, name: "Blazer Phố", type: "blazer", cat: "Blazer", price: 1150000, fabric: "Tuytsi dày, lót lụa", colors: [C.navy, C.grey, C.black], badge: "Mới", pop: 3, fresh: 1 },
  { id: 4, name: "Chân váy xếp ly Mây", type: "skirt", cat: "Chân váy", price: 450000, fabric: "Voan Hàn 2 lớp", colors: [C.blush, C.silver, C.cobalt], pop: 4, fresh: 3 },
  { id: 5, name: "Quần ống rộng Gió", type: "wide", cat: "Quần", price: 520000, fabric: "Tuytsi co giãn 4 chiều", colors: [C.black, C.white, C.navy], pop: 5, fresh: 7 },
  { id: 6, name: "Đầm suông Hạ", type: "shift", cat: "Đầm", price: 590000, old: 750000, fabric: "Linen Nhật, thoáng mát", colors: [C.green, C.plum, C.black], badge: "−21%", pop: 6, fresh: 5 },
  { id: 7, name: "Áo kiểu cổ nơ Vy", type: "bow", cat: "Áo", price: 380000, fabric: "Voan lụa mềm", colors: [C.blush, C.white, C.black], badge: "Mới", pop: 7, fresh: 2 },
  { id: 8, name: "Quần âu Thanh", type: "slim", cat: "Quần", price: 490000, fabric: "Tuyết mưa ít nhăn", colors: [C.grey, C.black, C.navy], pop: 8, fresh: 8 },
];

/* flat garment illustrations on a hanger, recolored per swatch */
const DARK = "rgba(0,0,0,.14)", SOFT = "rgba(0,0,0,.07)", EDGE = `stroke="rgba(0,0,0,.14)" stroke-width="1"`;
const HANGER = `<path d="M100 38V29a9 9 0 1 1 9-9" fill="none" stroke="#6f727c" stroke-width="3" stroke-linecap="round"/><path d="M100 38 42 60h116Z" fill="none" stroke="#6f727c" stroke-width="3" stroke-linejoin="round"/>`;
const CLIP = `<path d="M100 32V24a9 9 0 1 1 9-9" fill="none" stroke="#6f727c" stroke-width="3" stroke-linecap="round"/><path d="M44 38h112" stroke="#6f727c" stroke-width="4" stroke-linecap="round"/><rect x="62" y="36" width="10" height="20" rx="2" fill="#565962"/><rect x="128" y="36" width="10" height="20" rx="2" fill="#565962"/>`;
const SHAPES = {
  dress: c => `${HANGER}<path d="M80 50Q100 64 120 50L138 58 150 90 134 96 124 76 122 108 150 224H50L78 108 76 76 66 96 50 90 62 58Z" fill="${c}" ${EDGE}/>
    <path d="M100 112 92 224H70Z M112 112 126 224H108Z" fill="${SOFT}"/><rect x="77" y="104" width="46" height="8" fill="${DARK}"/><path d="M80 50Q100 64 120 50Q100 76 80 50Z" fill="${DARK}"/>`,
  shift: c => `${HANGER}<path d="M80 50Q100 62 120 50L136 58 142 78 128 82 126 94 142 222H58L74 94 72 82 58 78 64 58Z" fill="${c}" ${EDGE}/>
    <path d="M100 62 88 222H70Z" fill="${SOFT}"/><path d="M80 50Q100 62 120 50Q100 70 80 50Z" fill="${DARK}"/><path d="M76 150h48" stroke="${DARK}" stroke-width="1.5" stroke-dasharray="3 3"/>`,
  blouse: c => `${HANGER}<path d="M80 50Q100 60 120 50L146 62 162 132 146 136 132 92 134 166H66L68 92 54 136 38 132 54 62Z" fill="${c}" ${EDGE}/>
    <path d="M80 50 100 72 92 50ZM120 50 100 72 108 50Z" fill="${DARK}"/><path d="M100 72V166" stroke="${DARK}" stroke-width="1.5"/>
    ${[90, 110, 130, 150].map(y => `<circle cx="104" cy="${y}" r="2.2" fill="rgba(0,0,0,.25)"/>`).join("")}<path d="M134 92 132 166H120Z" fill="${SOFT}"/>`,
  bow: c => `${HANGER}<path d="M80 50Q100 60 120 50L146 62 158 120 144 124 132 92 132 162H68L68 92 56 124 42 120 54 62Z" fill="${c}" ${EDGE}/>
    <path d="M42 120l14 4-2 10-14-4ZM158 120l-14 4 2 10 14-4Z" fill="${DARK}"/><path d="M134 92 132 162H120Z" fill="${SOFT}"/>
    <path d="M100 62 82 52 82 74ZM100 62 118 52 118 74Z" fill="${c}" ${EDGE}/><path d="M98 64 90 96M102 64 112 94" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="63" r="5" fill="${c}" ${EDGE}/>`,
  blazer: c => `${HANGER}<path d="M78 50Q100 56 122 50L148 62 162 150 146 154 134 98 136 186H64L66 98 54 154 38 150 52 62Z" fill="${c}" ${EDGE}/>
    <path d="M88 50 100 118 112 50Q100 56 88 50Z" fill="#f2f3f5"/><path d="M78 50 100 118 84 62 92 52ZM122 50 100 118 116 62 108 52Z" fill="${DARK}"/>
    <circle cx="100" cy="134" r="3" fill="rgba(0,0,0,.35)"/><circle cx="100" cy="154" r="3" fill="rgba(0,0,0,.35)"/>
    <path d="M70 158h22M108 158h22" stroke="${DARK}" stroke-width="2"/><path d="M136 98 136 186H122Z" fill="${SOFT}"/>`,
  skirt: c => `${CLIP}<path d="M68 50H132L154 214H46Z" fill="${c}" ${EDGE}/><rect x="68" y="48" width="64" height="10" fill="${DARK}"/>
    ${[1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${68 + i * 8} 58 ${46 + i * 13.5} 214" stroke="rgba(0,0,0,.13)" stroke-width="1.4"/>`).join("")}`,
  wide: c => `${CLIP}<path d="M66 50H134L148 216H108L100 106 92 216H52Z" fill="${c}" ${EDGE}/><rect x="66" y="48" width="68" height="10" fill="${DARK}"/>
    <path d="M82 64 72 216M118 64 128 216" stroke="${DARK}" stroke-width="1.4"/><path d="M100 58V106" stroke="${DARK}" stroke-width="1.4"/>`,
  slim: c => `${CLIP}<path d="M70 50H130L136 216H106L100 100 94 216H64Z" fill="${c}" ${EDGE}/><rect x="70" y="48" width="60" height="10" fill="${DARK}"/>
    <path d="M84 64 80 216M116 64 120 216" stroke="${DARK}" stroke-width="1.4"/><path d="M100 58V100" stroke="${DARK}" stroke-width="1.4"/>`,
};
const garment = (type, hex, label) => `<svg viewBox="0 0 200 236" role="img" aria-label="${label}">${SHAPES[type](hex)}</svg>`;

/* hero lookbook */
const LOOK = { dress: C.cobalt[1], blazer: C.navy[1], skirt: C.blush[1] };
document.querySelectorAll("#look .panel").forEach(p => p.innerHTML = garment(p.dataset.g, LOOK[p.dataset.g], "Minh họa trang phục"));

/* size advisor */
const CHART = [
  ["S", "80–84", "62–66", "86–90", "40–47 kg"], ["M", "84–88", "66–70", "90–94", "47–53 kg"],
  ["L", "88–92", "70–74", "94–98", "53–59 kg"], ["XL", "92–96", "74–78", "98–102", "59–66 kg"], ["XXL", "96–102", "78–84", "102–108", "66–80 kg"],
];
let fit = 0, suggested = "M";
function calcSize() {
  const h = +$("h").value, w = +$("w").value;
  $("hOut").textContent = h + " cm"; $("wOut").textContent = w + " kg";
  let i = w <= 47 ? 0 : w <= 53 ? 1 : w <= 59 ? 2 : w <= 66 ? 3 : 4;
  if (h >= 170) i++;
  i = Math.max(0, Math.min(4, i + fit));
  suggested = SIZES[i];
  $("sizeOut").textContent = suggested;
  const notes = [];
  notes.push(fit < 0 ? "Size này ôm sát eo và vai, hợp với đầm và chân váy." : fit > 0 ? "Size này rộng rãi, mặc thêm áo len bên trong vẫn thoải mái." : "Vừa vặn với đầm, sơ mi và chân váy. Blazer có thể thử thêm một size lớn hơn.");
  if (h <= 152) notes.push("Đầm midi và quần âu được lên gấu miễn phí 3–5 cm.");
  if (h >= 170) notes.push("Chọn bản dài thêm 4 cm cho quần và đầm, nhắn nhân viên khi giữ đồ.");
  $("sizeNote").textContent = notes.join(" ");
  $("chart").innerHTML = CHART.map(r => `<tr${r[0] === suggested ? ' class="on"' : ""}>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
  renderGrid();
}
$("h").oninput = $("w").oninput = calcSize;
$("fit").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  fit = +b.dataset.f;
  $("fit").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  calcSize();
};
$("sizeForm").onsubmit = e => e.preventDefault();

/* catalogue */
let cat = "Tất cả", sort = "pop";
const sel = {};
P.forEach(p => sel[p.id] = { c: 0, s: null });
$("tabs").innerHTML = CATS.map(c => `<button class="tab" aria-pressed="${c === cat}" data-c="${c}">${c}</button>`).join("");
$("tabs").onclick = e => {
  const b = e.target.closest(".tab"); if (!b) return;
  cat = b.dataset.c;
  document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-pressed", t === b));
  renderGrid();
};
$("sort").onchange = e => { sort = e.target.value; renderGrid() };

function renderGrid() {
  const list = P.filter(p => cat === "Tất cả" || p.cat === cat)
    .sort((a, b) => sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : sort === "new" ? a.fresh - b.fresh : a.pop - b.pop);
  $("grid").innerHTML = list.map(p => {
    const s = sel[p.id], col = p.colors[s.c], size = s.s || suggested;
    return `
    <article class="card" data-id="${p.id}">
      <div class="art">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${garment(p.type, col[1], `${p.name} màu ${col[0]}`)}</div>
      <div class="info">
        <div class="sw" role="group" aria-label="Chọn màu">${p.colors.map((c, i) => `<button class="dot" style="--c:${c[1]}" data-c="${i}" aria-pressed="${i === s.c}" aria-label="${c[0]}" title="${c[0]}"></button>`).join("")}<span class="meta">${col[0]}</span></div>
        <h3>${p.name}</h3>
        <span class="meta">${p.fabric}</span>
        <div class="sizes" role="group" aria-label="Chọn size">${SIZES.map(z => `<button data-s="${z}" aria-pressed="${z === size}">${z}</button>`).join("")}</div>
        <div class="row">
          <span class="price">${fmt(p.price)}${p.old ? `<s>${fmt(p.old)}</s>` : ""}</span>
          <button class="add">Thêm vào túi</button>
        </div>
      </div>
    </article>`;
  }).join("");
}
$("grid").onclick = e => {
  const card = e.target.closest(".card"); if (!card) return;
  const id = +card.dataset.id, p = P.find(x => x.id === id);
  const dot = e.target.closest(".dot"), sz = e.target.closest("[data-s]"), add = e.target.closest(".add");
  if (dot) { sel[id].c = +dot.dataset.c; renderGrid() }
  else if (sz) { sel[id].s = sz.dataset.s; renderGrid() }
  else if (add) {
    bag.push({ id, c: sel[id].c, s: sel[id].s || suggested }); save(); renderBag();
    add.textContent = "Đã thêm ✓"; add.classList.add("done");
    setTimeout(() => { add.textContent = "Thêm vào túi"; add.classList.remove("done") }, 1200);
    toast(`Đã thêm ${p.name} · ${p.colors[sel[id].c][0]} · size ${sel[id].s || suggested}`);
  }
};

/* bag + hold-in-store form */
let bag = [];
try { bag = JSON.parse(localStorage.getItem("halam-bag") || "[]") } catch (e) {}
const save = () => { try { localStorage.setItem("halam-bag", JSON.stringify(bag)) } catch (e) {} };
function renderBag() {
  $("count").textContent = bag.length;
  if (!bag.length) { $("bag").innerHTML = `<div class="empty">Túi đồ đang trống. Thêm vài món ở phần Bộ sưu tập, hoặc cứ giữ lịch, nhân viên sẽ gợi ý đồ theo size của bạn.</div>`; return }
  const total = bag.reduce((t, b) => t + P.find(p => p.id === b.id).price, 0);
  $("bag").innerHTML = bag.map((b, i) => {
    const p = P.find(x => x.id === b.id), col = p.colors[b.c];
    return `<div class="item"><i style="--c:${col[1]}"></i><div><div class="nm">${p.name}</div><div class="meta">${col[0]} · size ${b.s}</div></div><span class="price">${fmt(p.price)}</span><button class="x" data-i="${i}" aria-label="Bỏ ${p.name}">×</button></div>`;
  }).join("") + `<div class="tot"><span>Tạm tính ${bag.length} món</span><span>${fmt(total)}</span></div>`;
}
$("bag").onclick = e => {
  const b = e.target.closest(".x"); if (!b) return;
  bag.splice(+b.dataset.i, 1); save(); renderBag();
};

const d = new Date(); d.setDate(d.getDate() + 1);
const iso = x => x.toISOString().slice(0, 10);
$("f-date").min = iso(new Date()); $("f-date").value = iso(d);
$("book").onsubmit = e => {
  e.preventDefault();
  const f = id => $(id).value;
  $("ok").hidden = false;
  $("ok").innerHTML = `<strong>Đã giữ đồ (bản demo)</strong>${f("f-name")} ghé ${f("f-store")} lúc ${f("f-slot")}, ngày ${f("f-date").split("-").reverse().join("/")}${bag.length ? `, ${bag.length} món được treo sẵn trong phòng thử` : ""}.<br>Đây là website mẫu nên yêu cầu không được gửi đi. Khi chạy thật, form sẽ nối với Zalo OA hoặc phần mềm bán hàng của shop.`;
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 1900) }

calcSize(); renderBag();

// #tui-do: điền sẵn túi đồ để demo cho khách
if (location.hash === "#tui-do" && !bag.length) { bag = [{ id: 1, c: 0, s: "M" }, { id: 3, c: 0, s: "M" }]; renderBag(); $("booking").scrollIntoView() }
