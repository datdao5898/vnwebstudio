const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString("vi-VN") + "₫";

/* ---------- Dữ liệu dịch vụ: dùng chung cho bảng giá và bảng tính ---------- */
const ICON = {
  office: '<path d="M5 21V5l9-2v18M14 9l5 1.5V21M3 21h18M8.5 8h2M8.5 12h2M8.5 16h2"/>',
  build: '<path d="M4 20h16M6 20v-5h12v5M9 15V9h6v6M12 9V4M8 4h8"/>',
  factory: '<path d="M3 21V10l6 4v-4l6 4V4h6v17zM7 17h2M12 17h2M17 17h1"/>',
  glass: '<path d="M4 3h16v18H4zM12 3v18M4 12h16M7 9l3-3M15 17l3-3"/>',
  floor: '<path d="M3 20h18M12 3v4M5.5 6l2.5 2.5M18.5 6L16 8.5M7 16a5 5 0 0 1 10 0"/>',
  carpet: '<path d="M4 5h13v14H4zM17 8h3M17 12h3M17 16h3M8 9h5M8 13h5"/>'
};
const SERVICES = [
  { id: "office", name: "Tổng vệ sinh văn phòng", desc: "Hút bụi thảm, lau sàn và kính nội thất, khử khuẩn pantry và nhà vệ sinh.", price: 9000, rate: 120, tag: "Phổ biến" },
  { id: "build", name: "Vệ sinh sau xây dựng", desc: "Cạo sơn, tẩy xi măng, làm sạch khung kính, hút bụi mịn trước khi bàn giao.", price: 15000, rate: 60 },
  { id: "factory", name: "Vệ sinh nhà xưởng", desc: "Chà sàn epoxy bằng máy ngồi lái, tẩy dầu, làm sạch dầm kèo và khu máy.", price: 7000, rate: 220 },
  { id: "glass", name: "Lau kính mặt ngoài tòa nhà", desc: "Đu dây hoặc xe nâng, thợ có chứng chỉ an toàn lao động và bảo hiểm.", price: 18000, rate: 40 },
  { id: "floor", name: "Đánh bóng sàn đá", desc: "Mài pad kim cương, phủ tinh thể cho sàn marble và granite, bóng lâu hơn.", price: 35000, rate: 25 },
  { id: "carpet", name: "Giặt thảm văn phòng", desc: "Giặt phun hút nóng, sấy nhanh trong 4 giờ, khử mùi, làm trong đêm.", price: 14000, rate: 70 }
];
const FREQ = [
  { id: "once", name: "Một lần", off: 0, visits: 1, label: "" },
  { id: "month", name: "Hằng tháng", off: .06, visits: 1, label: "Giảm 6%" },
  { id: "week", name: "Hằng tuần", off: .12, visits: 4, label: "Giảm 12%" }
];
const SLOT = [
  { id: "night", name: "Ca đêm", up: .15, label: "Thêm 15%" },
  { id: "day", name: "Giờ hành chính", up: 0, label: "" },
  { id: "sun", name: "Chủ nhật, ngày lễ", up: .2, label: "Thêm 20%" }
];
const ADDONS = [
  { id: "disinfect", name: "Khử khuẩn toàn bộ", perM2: 2000, note: "2.000₫ mỗi m²" },
  { id: "pest", name: "Phun diệt côn trùng", perM2: 1500, note: "1.500₫ mỗi m²" },
  { id: "chairs", name: "Giặt 30 ghế văn phòng", fixed: 1200000, note: "Trọn gói 1.200.000₫" },
  { id: "grout", name: "Chà ron nhà vệ sinh", fixed: 900000, note: "Trọn gói 900.000₫" }
];
const MIN_VISIT = 1500000;
const scaleOff = a => a >= 6000 ? .15 : a >= 3000 ? .1 : a >= 1000 ? .05 : 0;

/* ---------- Bảng giá ---------- */
$("rates").innerHTML = SERVICES.map(s => `
  <article class="rate">
    <span class="ico"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[s.id]}</svg></span>
    <h3>${s.name}${s.tag ? `<span class="tag">${s.tag}</span>` : ""}</h3>
    <p>${s.desc}</p>
    <div class="pr">${fmt(s.price)}<small>từ, mỗi m²</small></div>
  </article>`).join("");

/* ---------- Bảng tính chi phí ---------- */
const state = { svc: "office", area: 800, freq: "month", slot: "night", add: new Set() };

$("svcChips").innerHTML = SERVICES.map(s => `<button type="button" class="chip" data-id="${s.id}" aria-pressed="${s.id === state.svc}">${s.name}</button>`).join("");
const segHtml = (list, cur) => list.map(o => `<button type="button" data-id="${o.id}" aria-pressed="${o.id === cur}"><span>${o.name}</span>${o.label ? `<em>${o.label}</em>` : ""}</button>`).join("");
$("freq").innerHTML = segHtml(FREQ, state.freq);
$("slot").innerHTML = segHtml(SLOT, state.slot);
$("addons").innerHTML = ADDONS.map(a => `<label><input type="checkbox" value="${a.id}" /><span>${a.name}<small>${a.note}</small></span></label>`).join("");

function press(group, id) {
  group.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.id === id));
}
$("svcChips").onclick = e => { const b = e.target.closest("button"); if (!b) return; state.svc = b.dataset.id; press($("svcChips"), state.svc); render() };
$("freq").onclick = e => { const b = e.target.closest("button"); if (!b) return; state.freq = b.dataset.id; press($("freq"), state.freq); render() };
$("slot").onclick = e => { const b = e.target.closest("button"); if (!b) return; state.slot = b.dataset.id; press($("slot"), state.slot); render() };
$("addons").onchange = e => { e.target.checked ? state.add.add(e.target.value) : state.add.delete(e.target.value); render() };

function setArea(v, fromInput) {
  const a = Math.min(10000, Math.max(100, Number(v) || 100));
  state.area = a;
  $("areaRange").value = a;
  if (!fromInput) $("areaNum").value = a;
  render();
}
$("areaRange").oninput = e => setArea(e.target.value);
$("areaNum").oninput = e => setArea(e.target.value, true);
$("areaNum").onblur = e => setArea(e.target.value);

function render() {
  const s = SERVICES.find(x => x.id === state.svc);
  const f = FREQ.find(x => x.id === state.freq);
  const t = SLOT.find(x => x.id === state.slot);
  const a = state.area, sc = scaleOff(a);
  const chosen = ADDONS.filter(x => state.add.has(x.id));

  const base = a * s.price;
  const scaleCut = base * sc;
  const freqCut = (base - scaleCut) * f.off;
  const slotUp = (base - scaleCut - freqCut) * t.up;
  const addSum = chosen.reduce((n, x) => n + (x.fixed || x.perM2 * a), 0);
  const raw = base - scaleCut - freqCut + slotUp + addSum;
  const visit = Math.max(MIN_VISIT, Math.round(raw / 1000) * 1000);

  const crew = Math.max(2, Math.ceil(a / (s.rate * 6)));
  const hours = Math.max(1, Math.ceil(a / (s.rate * crew) * 2) / 2);

  $("tSvc").textContent = s.name;
  $("tLabel").textContent = f.id === "once" ? "Chi phí một lần làm" : "Chi phí mỗi lần làm";
  $("tTotal").textContent = fmt(visit);
  $("tMonth").textContent = f.id === "week" ? `Khoảng ${fmt(visit * f.visits)} mỗi tháng (4 lần)` : f.id === "month" ? "Mỗi tháng làm 1 lần" : "";

  const lines = [[`${a.toLocaleString("vi-VN")} m² × ${fmt(s.price)}`, fmt(base)]];
  if (scaleCut) lines.push([`Giảm ${Math.round(sc * 100)}% theo diện tích`, "−" + fmt(scaleCut)]);
  if (freqCut) lines.push([`Hợp đồng ${f.name.toLowerCase()}`, "−" + fmt(freqCut)]);
  if (slotUp) lines.push([t.name, "+" + fmt(slotUp)]);
  chosen.forEach(x => lines.push([x.name, "+" + fmt(x.fixed || x.perM2 * a)]));
  if (raw < MIN_VISIT) lines.push(["Áp mức tối thiểu mỗi lần", fmt(MIN_VISIT)]);
  $("tLines").innerHTML = lines.map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join("");

  $("tCrew").textContent = `Dự kiến ${crew} nhân sự, làm trong ${String(hours).replace(".", ",")} giờ`;

  const next = a < 1000 ? "Từ 1.000 m² giảm 5%" : a < 3000 ? "Đã giảm 5%. Từ 3.000 m² giảm 10%" : a < 6000 ? "Đã giảm 10%. Từ 6.000 m² giảm 15%" : "Đã giảm 15%, mức cao nhất";
  $("scaleHint").textContent = next;
}

$("leadForm").onsubmit = e => {
  e.preventDefault();
  const s = SERVICES.find(x => x.id === state.svc);
  const ok = $("leadOk");
  ok.innerHTML = "";
  const head = document.createElement("strong");
  head.textContent = "Đã ghi nhận yêu cầu mẫu";
  const body = document.createElement("span");
  body.textContent = `${$("fName").value} (${$("fCompany").value}): ${s.name.toLowerCase()}, ${state.area.toLocaleString("vi-VN")} m². Đây là website mẫu nên yêu cầu không được gửi đi. Khi chạy thật, form sẽ nối với Zalo, email hoặc hệ thống quản lý khách hàng.`;
  ok.append(head, body);
  ok.hidden = false;
};

render();

/* ---------- Khung so sánh trước và sau ---------- */
function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280 }
const star = (x, y, r, fill) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${fill}"/>`;

function scene(dirty) {
  const u = dirty ? "d" : "c";
  const towers = [[36, 62, 150, "#7fc7d4"], [100, 46, 210, "#5fb2c4"], [150, 72, 120, "#93d4de"], [226, 54, 190, "#6bbccb"], [284, 84, 140, "#8accd8"], [372, 50, 225, "#58a9bc"], [426, 70, 160, "#86ccd8"], [500, 44, 200, "#68b8c8"], [548, 60, 130, "#94d6df"]];
  let sky = towers.map(([x, w, h, c]) => {
    let w2 = `<rect x="${x}" y="${336 - h}" width="${w}" height="${h}" fill="${c}"/>`;
    for (let yy = 336 - h + 12; yy < 326; yy += 20) for (let xx = x + 8; xx < x + w - 8; xx += 14)
      w2 += `<rect x="${xx}" y="${yy}" width="7" height="10" fill="#fff" opacity=".42"/>`;
    return w2;
  }).join("");

  let film = "";
  if (dirty) {
    const r = rng(41);
    film = `<rect x="32" y="36" width="576" height="300" fill="#8b7450" opacity=".55"/>`;
    for (let i = 0; i < 16; i++) {
      const x = 44 + r() * 550, y = 44 + r() * 80, len = 90 + r() * 170;
      film += `<path d="M${x} ${y}q${(r() - .5) * 16} ${len / 2} ${(r() - .5) * 10} ${len}" stroke="#5e4c2f" stroke-width="${2 + r() * 5}" opacity=".32" fill="none" stroke-linecap="round"/>`;
    }
    for (let i = 0; i < 7; i++) film += `<ellipse cx="${60 + r() * 520}" cy="${60 + r() * 250}" rx="${26 + r() * 34}" ry="${16 + r() * 24}" fill="#efe4c8" opacity=".24"/>`;
  }

  const panes = [32, 176, 320, 464, 608];
  const frame = panes.map(x => `<rect x="${x - 3}" y="36" width="6" height="300" fill="${dirty ? "#7c7664" : "#06303a"}"/>`).join("")
    + `<rect x="29" y="33" width="582" height="6" fill="${dirty ? "#7c7664" : "#06303a"}"/><rect x="29" y="333" width="582" height="6" fill="${dirty ? "#7c7664" : "#06303a"}"/>`;

  /* sàn phối cảnh */
  let tiles = "";
  for (let i = -8; i <= 8; i++) tiles += `<line x1="${320 + i * 34}" y1="350" x2="${320 + i * 150}" y2="620" stroke="${dirty ? "#8c8570" : "#b6dde2"}" stroke-width="1.5"/>`;
  [372, 402, 444, 502, 580].forEach(y => tiles += `<line x1="0" y1="${y}" x2="640" y2="${y}" stroke="${dirty ? "#8c8570" : "#b6dde2"}" stroke-width="1.5"/>`);

  const shine = dirty ? "" : `
    <polygon points="60,350 170,350 96,620 -80,620" fill="#fff" opacity=".7"/>
    <polygon points="196,350 306,350 300,620 130,620" fill="#fff" opacity=".6"/>
    <polygon points="334,350 444,350 510,620 340,620" fill="#fff" opacity=".6"/>
    <polygon points="470,350 580,350 720,620 546,620" fill="#fff" opacity=".7"/>`;

  /* quầy lễ tân và chậu cây */
  const desk = `
    <rect x="190" y="282" width="260" height="88" rx="8" fill="${dirty ? "#a89f88" : "#ffffff"}"/>
    <rect x="190" y="282" width="260" height="14" rx="6" fill="${dirty ? "#7c7664" : "#06303a"}"/>
    <rect x="212" y="312" width="216" height="6" rx="3" fill="${dirty ? "#8f8772" : "#00a3ae"}"/>
    <path d="M70 372h52l-8 44H78z" fill="${dirty ? "#6f6650" : "#06303a"}"/>
    <path d="M96 372c-4-48-30-62-44-66 6 22 16 46 44 66zM96 372c0-56 14-78 30-90 4 30-4 66-30 90zM96 372c-2-40-4-74-2-104-16 26-20 70 2 104z" fill="${dirty ? "#6d7a4e" : "#159a6c"}"/>`;

  let mess = "";
  if (dirty) {
    const r = rng(7);
    for (let i = 0; i < 11; i++) {
      const x = 20 + r() * 600, y = 396 + r() * 200;
      mess += `<ellipse cx="${x}" cy="${y}" rx="${26 + r() * 42}" ry="${7 + r() * 13}" fill="${i % 3 ? "#6e6146" : "#d9d5c6"}" opacity="${.4 + r() * .35}"/>`;
    }
    /* dấu giày */
    for (let i = 0; i < 7; i++) {
      const x = 60 + i * 38, y = 590 - i * 28 + (i % 2 ? 11 : 0), s = .55 + i * -.03 + .35;
      mess += `<ellipse cx="${x}" cy="${y}" rx="${15 * s}" ry="${6.5 * s}" fill="#463c29" opacity=".55" transform="rotate(-34 ${x} ${y})"/>`;
    }
    /* thùng sơn, thùng carton, thang */
    mess += `
      <rect x="196" y="452" width="66" height="74" rx="6" fill="#d2d0c5"/><ellipse cx="229" cy="452" rx="33" ry="9" fill="#a7a493"/><path d="M198 454c8 16 4 30 12 36s8-26 20-30 8 22 18 18 8-18 13-24z" fill="#5b8ea0"/><path d="M196 450q33-40 66 0" fill="none" stroke="#6e6a58" stroke-width="3"/>
      <path d="M50 470l74-14 26 62-82 18z" fill="#a98757"/><path d="M50 470l74-14 8 18-74 16z" fill="#bf9c69"/><path d="M92 462l10 58" stroke="#d6c28f" stroke-width="7"/>
      <path d="M298 590l26-190M352 590l-6-190M305 546l42-2M311 502l36-2M318 458l29-2" stroke="#7a6a48" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  }

  /* nhân viên và máy chà sàn */
  const worker = dirty ? "" : `
    <ellipse cx="430" cy="592" rx="134" ry="15" fill="#06303a" opacity=".16"/>
    <rect x="344" y="540" width="130" height="38" rx="17" fill="#06303a"/>
    <rect x="344" y="553" width="130" height="8" fill="#c9f22e"/>
    <ellipse cx="409" cy="583" rx="72" ry="11" fill="#00a3ae"/>
    <path d="M422 542l58-68" stroke="#3f5d65" stroke-width="7" stroke-linecap="round"/>
    <rect x="486" y="510" width="17" height="72" rx="6" fill="#06303a"/><rect x="510" y="510" width="17" height="72" rx="6" fill="#0a4552"/>
    <rect x="482" y="578" width="26" height="11" rx="5" fill="#1b1f22"/><rect x="507" y="578" width="26" height="11" rx="5" fill="#1b1f22"/>
    <rect x="478" y="426" width="58" height="94" rx="15" fill="#007581"/>
    <rect x="478" y="458" width="58" height="9" fill="#c9f22e"/><rect x="478" y="480" width="58" height="9" fill="#c9f22e"/>
    <path d="M488 442l-16 34" stroke="#007581" stroke-width="14" stroke-linecap="round"/>
    <circle cx="507" cy="400" r="22" fill="#f1c29c"/>
    <path d="M483 398a24 24 0 0 1 48 0z" fill="#06303a"/><rect x="479" y="394" width="40" height="7" rx="3.5" fill="#06303a"/>
    <path d="M575 575l22-72 22 72z" fill="#ffd21f"/><path d="M597 523v28" stroke="#06303a" stroke-width="5" stroke-linecap="round"/><circle cx="597" cy="562" r="3.6" fill="#06303a"/>
    ${star(372, 470, 19, "#fff")}${star(346, 432, 11, "#c9f22e")}${star(590, 430, 15, "#fff")}${star(560, 92, 20, "#fff")}${star(404, 110, 12, "#fff")}${star(464, 210, 9, "#fff")}`;

  return `<svg viewBox="0 0 640 620" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${dirty ? "Sảnh văn phòng đầy bụi, vết bẩn và đồ thi công trước khi vệ sinh" : "Sảnh văn phòng sạch bóng với nhân viên đang chạy máy chà sàn"}">
    <defs>
      <linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdeaf2"/><stop offset="1" stop-color="#f0fbfd"/></linearGradient>
      <linearGradient id="fl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dirty ? "#a8a08a" : "#d9f1f4"}"/><stop offset="1" stop-color="${dirty ? "#958c74" : "#f4fcfd"}"/></linearGradient>
    </defs>
    <rect width="640" height="350" fill="${dirty ? "#c6c0ae" : "#eef9fa"}"/>
    <rect x="32" y="36" width="576" height="300" fill="url(#sky${u})"/>
    ${sky}${film}${frame}
    <rect y="350" width="640" height="270" fill="url(#fl${u})"/>
    ${tiles}${shine}${desk}${mess}${worker}
  </svg>`;
}
$("layerAfter").innerHTML = scene(false);
$("layerBefore").innerHTML = scene(true);

const cmp = $("compare"), rangeEl = $("compareRange");
const setX = pct => {
  const v = Math.min(100, Math.max(0, pct));
  cmp.style.setProperty("--x", v + "%");
  rangeEl.value = Math.round(v);
};
const fromEvent = e => { const r = cmp.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100) };
let dragging = false;
cmp.addEventListener("pointerdown", e => { dragging = true; cmp.setPointerCapture(e.pointerId); fromEvent(e) });
cmp.addEventListener("pointermove", e => { if (dragging) fromEvent(e) });
["pointerup", "pointercancel"].forEach(t => cmp.addEventListener(t, () => { dragging = false }));
rangeEl.addEventListener("input", () => setX(+rangeEl.value));
