const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = s => document.querySelector(s);

const FACES = { tron: "Mặt tròn", vuong: "Mặt vuông", xoan: "Mặt trái xoan", dai: "Mặt dài" };
const MATS = ["Tất cả", "Nhựa acetate", "Titan", "Kim loại", "Nhựa dẻo TR90"];

const FRAMES = [
  { id: 1, name: "Mộc Tròn", shape: "round", mat: "Nhựa acetate", color: "#7a4322", tint: "#f3e3d3", size: "48□21-145", price: 890000, face: ["vuong", "dai"], badge: "Bán chạy" },
  { id: 2, name: "Phố Cổ Vuông", shape: "square", mat: "Nhựa acetate", color: "#16182a", tint: "#e8eaf2", size: "52□18-145", price: 750000, face: ["tron", "xoan"] },
  { id: 3, name: "Mắt Mèo Hồng Sen", shape: "cateye", mat: "Nhựa acetate", color: "#c9466b", tint: "#fbe3ea", size: "51□17-140", price: 1050000, face: ["tron", "vuong"], badge: "Mới về" },
  { id: 4, name: "Phi Công Titan", shape: "aviator", mat: "Titan", color: "#b0904f", tint: "#f6eedc", size: "56□15-145", price: 1890000, face: ["vuong", "xoan"] },
  { id: 5, name: "Nửa Viền Cổ Điển", shape: "browline", mat: "Kim loại", color: "#2e2219", tint: "#efe8e0", size: "50□20-145", price: 1250000, face: ["tron", "xoan"] },
  { id: 6, name: "Lá Liễu Siêu Nhẹ", shape: "oval", mat: "Titan", color: "#6f7b8a", tint: "#e9eef4", size: "50□19-140", price: 2450000, face: ["vuong", "dai"], badge: "8 gram" },
  { id: 7, name: "Học Trò Bền Bỉ", shape: "rect", mat: "Nhựa dẻo TR90", color: "#2747e0", tint: "#e3e9ff", size: "47□16-130", price: 590000, face: ["tron", "xoan"], badge: "Cho trẻ em" },
  { id: 8, name: "Pha Lê Trong", shape: "round", mat: "Nhựa acetate", color: "#9fc3dc", tint: "#eef6fb", size: "49□20-145", price: 820000, face: ["vuong", "dai", "xoan"] },
];

/* draw a pair of glasses as SVG, one path per lens shape */
function lensPath(shape, cx) {
  const x = cx;
  switch (shape) {
    case "round": return `M${x - 34} 50 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0`;
    case "square": return `M${x - 38} 22 h76 q4 0 4 4 v44 q0 12 -12 12 h-60 q-12 0 -12 -12 v-44 q0 -4 4 -4z`;
    case "rect": return `M${x - 38} 28 h76 q6 0 6 6 v28 q0 14 -14 14 h-60 q-14 0 -14 -14 v-28 q0 -6 6 -6z`;
    case "cateye": return `M${x - 40} 26 Q${x} 16 ${x + 40} 20 Q${x + 44} 52 ${x + 22} 74 Q${x} 82 ${x - 22} 72 Q${x - 42} 56 ${x - 40} 26z`;
    case "aviator": return `M${x - 38} 26 Q${x} 18 ${x + 38} 26 Q${x + 42} 60 ${x + 14} 80 Q${x - 6} 88 ${x - 26} 72 Q${x - 42} 56 ${x - 38} 26z`;
    case "oval": return `M${x - 38} 50 a38 26 0 1 0 76 0 a38 26 0 1 0 -76 0`;
    case "browline": return `M${x - 38} 30 Q${x} 24 ${x + 38} 30 Q${x + 40} 62 ${x + 18} 76 Q${x} 82 ${x - 18} 76 Q${x - 40} 62 ${x - 38} 30z`;
  }
}
function glasses(f) {
  const thin = f.mat === "Titan" || f.mat === "Kim loại";
  const sw = thin ? 3.5 : 7;
  const L = lensPath(f.shape, 52), R = lensPath(f.shape, 148);
  const brow = f.shape === "browline"
    ? `<path d="M12 31 Q52 18 90 30 M110 30 Q148 18 188 31" stroke="${f.color}" stroke-width="10" fill="none" stroke-linecap="round"/>`
    : "";
  const bridge = f.shape === "aviator"
    ? `<path d="M86 34 Q100 26 114 34 M84 26 H116" stroke="${f.color}" stroke-width="3" fill="none"/>`
    : `<path d="M88 42 Q100 30 112 42" stroke="${f.color}" stroke-width="${thin ? 3 : 6}" fill="none" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 200 100" aria-hidden="true">
    <path d="M10 34 L0 30 M190 34 L200 30" stroke="${f.color}" stroke-width="${thin ? 3 : 6}" stroke-linecap="round"/>
    <path d="${L}" fill="${f.tint}" fill-opacity=".55" stroke="${f.color}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="${R}" fill="${f.tint}" fill-opacity=".55" stroke="${f.color}" stroke-width="${sw}" stroke-linejoin="round"/>
    ${brow}${bridge}
    <path d="M30 36 q8 -8 18 -8 M126 36 q8 -8 18 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
  </svg>`;
}

/* ---------- frame filter ---------- */
let mat = "Tất cả";
const chips = $("#chips"), grid = $("#grid"), face = $("#face");
chips.innerHTML = MATS.map(m => `<button class="chip" role="tab" aria-selected="${m === mat}" data-m="${m}">${m}</button>`).join("");
chips.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  mat = b.dataset.m;
  chips.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-selected", c === b));
  renderFrames();
});
face.addEventListener("change", renderFrames);

function renderFrames() {
  const fc = face.value;
  const list = FRAMES.filter(f => (mat === "Tất cả" || f.mat === mat) && (fc === "all" || f.face.includes(fc)));
  grid.innerHTML = list.map(f => `
    <article class="card">
      <div class="pic">${f.badge ? `<span class="badge">${f.badge}</span>` : ""}${glasses(f)}</div>
      <h3>${f.name}</h3>
      <div class="meta">${f.mat} · ${f.size}</div>
      <div class="fit">${f.face.map(k => `<span>${FACES[k]}</span>`).join("")}</div>
      <div class="foot"><span class="price">${fmt(f.price)}</span><button class="try" data-id="${f.id}">Ghép tròng →</button></div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
grid.addEventListener("click", e => {
  const b = e.target.closest(".try"); if (!b) return;
  $("#cFrame").value = b.dataset.id;
  calc();
  $("#lenses").scrollIntoView({ behavior: "smooth" });
  toast("Đã chọn gọng, giờ chọn loại tròng nhé");
});
renderFrames();

/* ---------- lens calculator ---------- */
const TYPES = [
  { id: "basic", name: "Đơn tròng", note: "Nhìn xa rõ, chống tia UV", price: 350000, days: 0 },
  { id: "blue", name: "Lọc ánh sáng xanh", note: "Cho người ngồi máy tính", price: 650000, days: 0 },
  { id: "photo", name: "Đổi màu khi ra nắng", note: "Trong nhà trong, ngoài trời sẫm", price: 1150000, days: 1 },
  { id: "prog", name: "Đa tròng", note: "Lão thị, nhìn xa và gần", price: 2400000, days: 4 },
];
const IDX = [
  { n: 1.56, add: 0, note: "Tiêu chuẩn" },
  { n: 1.60, add: 300000, note: "Mỏng hơn" },
  { n: 1.67, add: 750000, note: "Rất mỏng" },
  { n: 1.74, add: 1500000, note: "Siêu mỏng", days: 3 },
];
const ADDS = [
  { id: "coat", name: "Phủ chống bám nước và vân tay", price: 150000 },
  { id: "care", name: "Bảo hành vỡ tròng 12 tháng", price: 120000 },
  { id: "case", name: "Hộp da và khăn lau sợi nhỏ", price: 90000 },
];

const cFrame = $("#cFrame"), cDeg = $("#cDeg");
cFrame.innerHTML = `<option value="0">Dùng gọng của tôi (0₫)</option>` + FRAMES.map(f => `<option value="${f.id}">${f.name} – ${fmt(f.price)}</option>`).join("");
cFrame.value = "1";
$("#cType").innerHTML = TYPES.map((t, i) => `<div class="opt"><input type="radio" name="type" id="t-${t.id}" value="${t.id}" ${i === 1 ? "checked" : ""}/><label for="t-${t.id}"><b>${t.name}</b><small>${t.note}</small><em>từ ${fmt(t.price)}</em></label></div>`).join("");
let idx = 0;
const seg = $("#cIdx");
seg.innerHTML = IDX.map((x, i) => `<button type="button" data-i="${i}" aria-pressed="${i === idx}">${x.n.toFixed(2)}<small>${x.add ? "+" + fmt(x.add) : x.note}</small></button>`).join("");
seg.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  idx = +b.dataset.i;
  seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  calc();
});
$("#cAdd").innerHTML = ADDS.map(a => `<label><input type="checkbox" value="${a.id}" ${a.id === "coat" ? "checked" : ""}/><span>${a.name}</span><em>+${fmt(a.price)}</em></label>`).join("");
$("#calc").addEventListener("input", calc);
$("#calc").addEventListener("change", calc);

const num = (n, d = 1) => n.toFixed(d).replace(".", ",");

function drawLens(edge, center) {
  const s = 9, T = 30, y = T + edge * s;
  const ctrl = 2 * (T - 5 + center * s) - y;
  $("#thickSvg").innerHTML = `
    <path d="M10 ${T} Q120 ${T - 10} 230 ${T} L230 ${y} Q120 ${ctrl} 10 ${y} Z" fill="rgba(160,182,255,.35)" stroke="#a0b6ff" stroke-width="2"/>
    <line x1="10" y1="${T - 18}" x2="10" y2="${T - 8}" stroke="#ffcf3f" stroke-width="2"/>
    <line x1="230" y1="${T - 18}" x2="230" y2="${T - 8}" stroke="#ffcf3f" stroke-width="2"/>
    <text x="120" y="14" fill="#c8cee3" font-size="11" text-anchor="middle" font-family="Fira Sans, sans-serif">Mặt cắt tròng nhìn ngang</text>
    <text x="236" y="${Math.min(y + 14, 108)}" fill="#ffcf3f" font-size="11" text-anchor="end" font-family="Fira Sans, sans-serif">${num(edge)} mm</text>`;
}

function calc() {
  const f = FRAMES.find(x => x.id === +cFrame.value);
  const t = TYPES.find(x => x.id === document.querySelector('input[name="type"]:checked').value);
  const ix = IDX[idx], deg = +cDeg.value;
  $("#degOut").textContent = num(deg, 2);
  const adds = ADDS.filter(a => document.querySelector(`#cAdd input[value="${a.id}"]`).checked);

  const lens = t.price + ix.add;
  const total = (f ? f.price : 0) + lens + adds.reduce((s, a) => s + a.price, 0);
  const lines = [
    [f ? `Gọng ${f.name}` : "Gọng của bạn", f ? f.price : 0],
    [`Cặp tròng ${t.name.toLowerCase()} ${ix.n.toFixed(2)}`, lens],
    ...adds.map(a => [a.name, a.price]),
  ];
  $("#lines").innerHTML = lines.map(([n, p]) => `<li><span>${n}</span><b>${p ? fmt(p) : "0₫"}</b></li>`).join("");
  $("#total").textContent = fmt(total);

  /* edge thickness of a minus lens, 50 mm wide */
  const center = 1.6;
  const edge = center + deg * 625 / (2000 * (ix.n - 1));
  drawLens(edge, center);
  const base = center + deg * 625 / (2000 * .56);
  $("#thickText").innerHTML = deg === 0
    ? "Không độ: tròng phẳng, dày khoảng <b>1,6 mm</b>."
    : `Viền tròng dày khoảng <b>${num(edge)} mm</b>${ix.n > 1.56 ? `, mỏng hơn tròng 1.56 khoảng <b>${Math.round((1 - edge / base) * 100)}%</b>` : ""}.`;

  let hint = "";
  if (deg >= 6 && ix.n < 1.67) hint = "Cận từ 6 độ nên dùng chiết suất 1.67 trở lên để tròng không bị dày và nặng mũi.";
  else if (deg >= 3.5 && ix.n < 1.6) hint = "Cận trên 3,5 độ, chiết suất 1.60 giúp tròng mỏng hơn đáng kể.";
  else if (t.id === "prog" && deg > 0) hint = "Đa tròng cần đo thêm độ cộng nhìn gần, kỹ thuật viên sẽ đo khi bạn đến.";
  $("#hint").textContent = hint;

  const days = Math.max(t.days, ix.days || 0);
  $("#eta").textContent = days === 0
    ? "Có sẵn tròng tại cửa hàng · lấy kính sau 45 phút"
    : `Đặt tròng theo độ · nhận kính sau ${days === 1 ? "1 ngày" : days + " ngày làm việc"}, giao tận nhà miễn phí`;
}
calc();
$("#holdBtn").addEventListener("click", () => toast("Đã giữ giá báo cho bạn trong 7 ngày"));

/* ---------- booking ---------- */
const DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const SLOTS = ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "19:30", "20:00", "20:30"];
let day = 0, slot = null;
const daysEl = $("#days"), slotsEl = $("#slots");
const today = new Date();
const dates = Array.from({ length: 6 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; });
daysEl.innerHTML = dates.map((d, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}">${i === 0 ? "Hôm nay" : DOW[d.getDay()]}<small>${d.getDate()}/${d.getMonth() + 1}</small></button>`).join("");
daysEl.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  day = +b.dataset.i; slot = null;
  daysEl.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderSlots();
});
$("#store").addEventListener("change", () => { slot = null; renderSlots(); });
function renderSlots() {
  const seed = day * 7 + $("#store").selectedIndex * 3;
  const nowH = today.getHours() + today.getMinutes() / 60;
  slotsEl.innerHTML = SLOTS.map((s, i) => {
    const [h, m] = s.split(":").map(Number);
    const past = day === 0 && h + m / 60 <= nowH + 0.5;
    const full = (i * 5 + seed) % 7 === 0;
    return `<button type="button" data-s="${s}" ${past || full ? "disabled" : ""} aria-pressed="${s === slot}">${s}</button>`;
  }).join("");
}
slotsEl.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b || b.disabled) return;
  slot = b.dataset.s;
  slotsEl.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
});
renderSlots();

$("#book").addEventListener("submit", e => {
  e.preventDefault();
  const msg = $("#bookMsg");
  if (!slot) { toast("Bạn chọn giúp một khung giờ nhé"); return; }
  const fd = new FormData(e.target), d = dates[day];
  msg.hidden = false;
  msg.textContent = `Cảm ơn ${fd.get("name")}! Tinh Tường đã giữ lịch ${slot} ngày ${d.getDate()}/${d.getMonth() + 1} tại cửa hàng ${fd.get("store").split(" – ")[0]}. Chúng tôi sẽ gọi số ${fd.get("phone")} để xác nhận.`;
  e.target.querySelector('button[type="submit"]').textContent = "Đã đặt lịch ✓";
});

/* ---------- toast ---------- */
let tt;
function toast(t) {
  const el = $("#toast");
  el.textContent = t; el.hidden = false;
  clearTimeout(tt); tt = setTimeout(() => (el.hidden = true), 2600);
}
