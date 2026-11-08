const fmt = n => Math.round(n).toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

/* Đội xe: giá theo ngày 24 giờ */
const CARS = [
  { id: 1, name: "Hatchback Phố", type: "5", shape: "hatch", seats: 4, auto: true, fuel: "Xăng · 5,2 lít/100 km", price: 600000, color: "#e94b3c", badge: "Rẻ nhất", note: "Gọn, dễ đỗ phố cổ Hội An" },
  { id: 2, name: "Sedan Biển Xanh", type: "5", shape: "sedan", seats: 5, auto: true, fuel: "Xăng · 5,8 lít/100 km", price: 750000, color: "#2f6fd6", badge: "Thuê nhiều", note: "Cốp 500 lít, vừa 3 vali lớn" },
  { id: 3, name: "Sedan Số Sàn", type: "5", shape: "sedan", seats: 5, auto: false, fuel: "Xăng · 5,4 lít/100 km", price: 680000, color: "#9aa5b4", note: "Cho tài xế quen số sàn" },
  { id: 4, name: "Crossover Sơn Trà", type: "5", shape: "suv", seats: 5, auto: true, fuel: "Xăng · 6,9 lít/100 km", price: 950000, color: "#f2f4f7", note: "Gầm cao, leo dốc Sơn Trà nhẹ" },
  { id: 5, name: "MPV Gia Đình", type: "7", shape: "mpv", seats: 7, auto: true, fuel: "Xăng · 7,4 lít/100 km", price: 1100000, color: "#c9d3df", badge: "Đi cả nhà", note: "Hàng ghế ba gập phẳng" },
  { id: 6, name: "SUV Hải Vân", type: "7", shape: "suv", seats: 7, auto: true, fuel: "Dầu · 7,8 lít/100 km", price: 1450000, color: "#1f2a3c", note: "Máy dầu khỏe, đi đèo êm" },
  { id: 7, name: "Bán tải Trường Sơn", type: "pickup", shape: "pickup", seats: 5, auto: false, fuel: "Dầu · 8,2 lít/100 km", price: 1200000, color: "#d8892a", note: "Thùng chở ván lướt, xe đạp" },
  { id: 8, name: "Điện Mini", type: "ev", shape: "hatch", seats: 4, auto: true, fuel: "Điện · đi 210 km mỗi lần sạc", price: 650000, color: "#3bb38a", badge: "Xe điện", note: "Sạc miễn phí tại văn phòng" },
  { id: 9, name: "SUV Điện", type: "ev", shape: "suv", seats: 5, auto: true, fuel: "Điện · đi 420 km mỗi lần sạc", price: 1250000, color: "#4a5a70", note: "Êm, không tốn xăng ra Huế" },
];
const TYPES = [["all", "Tất cả"], ["5", "4 – 5 chỗ"], ["7", "7 chỗ"], ["pickup", "Bán tải"], ["ev", "Xe điện"]];
const PLACES = [
  { id: "airport", name: "Sân bay", fee: 0 },
  { id: "center", name: "Văn phòng", fee: 0 },
  { id: "hotel", name: "Khách sạn", fee: 100000 },
  { id: "hoian", name: "Hội An", fee: 250000 },
];
const EXTRAS = {
  ins: { name: "Bảo hiểm thân vỏ mở rộng", day: 120000 },
  kid: { name: "Ghế an toàn trẻ em", day: 50000 },
  wifi: { name: "Bộ phát Wi-Fi 4G", day: 40000 },
  driver: { name: "Người lái thứ hai", once: 150000 },
};

/* Minh họa xe nhìn ngang, vẽ bằng SVG */
const SHAPES = {
  hatch: { body: "M216 80 Q218 64 202 60 L168 56 Q148 33 122 31 L68 31 Q48 33 40 56 L34 62 Q28 68 30 80 Z", win: ["M160 56 Q144 38 122 37 L106 37 L105 56 Z", "M99 37 L70 37 Q54 39 47 55 L99 55 Z"], w: [70, 180], ends: [28, 218] },
  sedan: { body: "M228 80 Q230 64 214 60 L170 55 Q148 34 120 32 L90 32 Q68 34 48 55 L22 60 Q12 64 14 80 Z", win: ["M162 55 Q144 39 120 37 L106 37 L105 55 Z", "M99 37 L90 37 Q72 39 56 55 L99 55 Z"], w: [60, 186], ends: [12, 230] },
  suv: { body: "M228 82 Q232 60 214 56 L180 52 Q162 27 134 25 L44 25 Q26 27 20 52 L16 58 Q10 64 12 82 Z", win: ["M170 52 Q156 32 134 31 L102 31 L102 52 Z", "M95 31 L46 31 Q31 33 28 52 L95 52 Z"], w: [56, 182], ends: [10, 232] },
  mpv: { body: "M230 82 Q232 62 216 57 L188 52 Q166 25 130 23 L36 23 Q20 25 16 50 L14 58 Q10 64 12 82 Z", win: ["M178 52 Q160 30 130 29 L110 29 L110 52 Z", "M104 29 L72 29 L72 52 L104 52 Z", "M66 29 L38 29 Q26 31 23 50 L66 50 Z"], w: [52, 186], ends: [10, 232] },
  pickup: { body: "M232 82 Q234 62 218 58 L184 54 Q168 30 142 28 L102 28 Q92 30 90 52 L12 52 Q8 54 10 82 Z", win: ["M174 54 Q160 34 140 33 L124 33 L124 54 Z", "M118 33 L104 33 Q97 35 96 54 L118 54 Z"], w: [54, 186], ends: [8, 234] },
};
function car(c) {
  const s = SHAPES[c.shape];
  const light = ["#f2f4f7", "#c9d3df", "#9aa5b4"].includes(c.color);
  const wheel = x => `<g><circle cx="${x}" cy="82" r="17" fill="#141b26"/><circle cx="${x}" cy="82" r="9" fill="#cfd6df"/><circle cx="${x}" cy="82" r="3" fill="#141b26"/></g>`;
  return `<svg viewBox="0 0 240 110" role="img" aria-label="Minh họa ${c.name}">
    <ellipse cx="121" cy="99" rx="104" ry="6" fill="rgba(14,27,46,.12)"/>
    <path d="${s.body}" fill="${c.color}" stroke="${light ? "#8a96a8" : "rgba(0,0,0,.25)"}" stroke-width="1.2"/>
    <path d="${s.body}" fill="url(#sheen)" opacity=".5"/>
    ${s.win.map(d => `<path d="${d}" fill="#24344c" opacity=".88"/>`).join("")}
    <rect x="${s.ends[1] - 15}" y="63" width="12" height="5" rx="2" fill="#ffcf8a"/>
    <rect x="${s.ends[0] + 3}" y="65" width="8" height="5" rx="2" fill="#e5484d"/>
    ${c.type === "ev" ? `<path d="M118 66 l-6 9 h5 l-3 8 l9 -11 h-5 l3 -6z" fill="#fff" opacity=".9"/>` : ""}
    ${s.w.map(wheel).join("")}
    <defs><linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  </svg>`;
}

/* Bộ lọc đội xe */
let filter = "all", autoOnly = false;
$("chips").innerHTML = TYPES.map(([v, t]) => `<button class="chip" data-t="${v}" aria-pressed="${v === filter}">${t}</button>`).join("");
$("chips").onclick = e => { const b = e.target.closest(".chip"); if (b) { searchMsg = ""; setFilter(b.dataset.t) } };
$("autoOnly").onchange = e => { autoOnly = e.target.checked; searchMsg = ""; renderGrid() };
function setFilter(v) {
  filter = v;
  document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.t === v));
  renderGrid();
}
function renderGrid() {
  const list = CARS.filter(c => (filter === "all" || c.type === filter) && (!autoOnly || c.auto));
  $("grid").innerHTML = list.map(c => `
    <article class="card">
      <div class="art">${c.badge ? `<span class="badge">${c.badge}</span>` : ""}${car(c)}</div>
      <div class="info">
        <h3>${c.name}</h3>
        <p class="meta">${c.note}</p>
        <ul class="specs"><li>${c.seats} chỗ</li><li>${c.auto ? "Số tự động" : "Số sàn"}</li><li>${c.fuel}</li></ul>
        <div class="row">
          <span class="price">${fmt(c.price)}<small>/ngày</small></span>
          <button class="pick" data-id="${c.id}">Chọn xe này</button>
        </div>
      </div>
    </article>`).join("") || `<p class="empty">Chưa có xe phù hợp bộ lọc. Bỏ chọn “Chỉ xe số tự động” để xem thêm.</p>`;
  if (!searchMsg) $("resultNote").textContent = `${list.length} mẫu xe sẵn sàng`;
}
$("grid").onclick = e => {
  const b = e.target.closest(".pick"); if (!b) return;
  state.car = +b.dataset.id; $("c-car").value = state.car; renderBill();
  $("bang-gia").scrollIntoView({ behavior: "smooth" });
  toast(`Đã chọn ${CARS.find(c => c.id === state.car).name}`);
};

/* Tìm xe ở hero */
const iso = d => d.toISOString().slice(0, 10);
const today = new Date(), d1 = new Date(Date.now() + 864e5 * 3), d2 = new Date(Date.now() + 864e5 * 6);
$("s-from").min = $("s-to").min = iso(today);
$("s-from").value = iso(d1); $("s-to").value = iso(d2);
$("s-from").onchange = () => { $("s-to").min = $("s-from").value; if ($("s-to").value <= $("s-from").value) $("s-to").value = iso(new Date(new Date($("s-from").value).getTime() + 864e5)) };
let searchMsg = "";
const vn = s => s.split("-").reverse().slice(0, 2).join("/");
$("search").onsubmit = e => {
  e.preventDefault();
  const days = Math.max(1, Math.round((new Date($("s-to").value) - new Date($("s-from").value)) / 864e5));
  state.days = Math.min(30, days); state.place = $("s-place").value;
  searchMsg = "";
  setFilter($("s-type").value);
  const n = $("grid").querySelectorAll(".card").length;
  searchMsg = `Còn ${n} mẫu xe trống từ ${vn($("s-from").value)} đến ${vn($("s-to").value)} (${days} ngày). Giá đã tính sẵn ở phần bên dưới.`;
  $("resultNote").textContent = searchMsg;
  renderPlaces(); renderBill();
  $("doi-xe").scrollIntoView({ behavior: "smooth" });
};

/* Tính giá */
const state = { car: 2, days: 3, place: "airport", extras: new Set() };
$("c-car").innerHTML = CARS.map(c => `<option value="${c.id}">${c.name} · ${c.seats} chỗ · ${fmt(c.price)}/ngày</option>`).join("");
$("c-car").value = state.car;
$("c-car").onchange = e => { state.car = +e.target.value; renderBill() };
$("dayMinus").onclick = () => { state.days = Math.max(1, state.days - 1); renderBill() };
$("dayPlus").onclick = () => { state.days = Math.min(30, state.days + 1); renderBill() };
function renderPlaces() {
  $("c-place").innerHTML = PLACES.map(p => `<button type="button" role="radio" aria-checked="${p.id === state.place}" data-p="${p.id}">${p.name}<small>${p.fee ? "+" + fmt(p.fee) : "Miễn phí"}</small></button>`).join("");
}
$("c-place").onclick = e => { const b = e.target.closest("[data-p]"); if (!b) return; state.place = b.dataset.p; renderPlaces(); renderBill() };
document.querySelectorAll(".extras input").forEach(i => i.onchange = () => { i.checked ? state.extras.add(i.value) : state.extras.delete(i.value); renderBill() });

const discountRate = d => d >= 15 ? .2 : d >= 7 ? .12 : d >= 3 ? .05 : 0;
function renderBill() {
  const c = CARS.find(x => x.id === state.car), d = state.days, place = PLACES.find(p => p.id === state.place);
  const rent = c.price * d, rate = discountRate(d), disc = rent * rate;
  const lines = [[`Tiền thuê ${fmt(c.price)} × ${d} ngày`, rent]];
  if (disc) lines.push([`Giảm ${Math.round(rate * 100)}% thuê dài ngày`, -disc]);
  lines.push([`Giao nhận tại ${place.name.toLowerCase()}`, place.fee]);
  state.extras.forEach(k => { const x = EXTRAS[k]; lines.push([x.day ? `${x.name} × ${d} ngày` : x.name, x.day ? x.day * d : x.once]) });
  const total = lines.reduce((s, l) => s + l[1], 0);
  $("c-days").textContent = d;
  $("c-tier").textContent = rate ? `Đang được giảm ${Math.round(rate * 100)}%` : d < 3 ? `Thuê thêm ${3 - d} ngày để giảm 5%` : "";
  $("billCar").innerHTML = `${car(c)}<div><b>${c.name}</b><span>${c.seats} chỗ · ${c.auto ? "Số tự động" : "Số sàn"} · ${d * 300} km đã gồm</span></div>`;
  $("lines").innerHTML = lines.map(([t, v]) => `<div class="line${v < 0 ? " minus" : ""}"><span>${t}</span><span>${v < 0 ? "−" + fmt(-v) : v ? fmt(v) : "0₫"}</span></div>`).join("");
  $("total").textContent = fmt(total);
  const dep = c.price >= 1000000 ? 10000000 : 5000000;
  $("deposit").innerHTML = `Cọc xe <b>${fmt(dep)}</b>, hoàn trong 3 ngày sau khi trả xe. Vượt km tính 3.000₫ mỗi km.`;
}

$("hold").onsubmit = e => {
  e.preventDefault();
  const c = CARS.find(x => x.id === state.car);
  $("holdOk").innerHTML = `<strong>Đã ghi nhận yêu cầu giữ xe</strong>${c.name}, ${state.days} ngày, cho ${$("h-name").value}. Nhân viên sẽ gọi số ${$("h-phone").value} trong 15 phút.<br><small>Đây là website mẫu nên yêu cầu không được gửi đi. Khi chạy thật, form sẽ nối với Zalo hoặc phần mềm quản lý đội xe.</small>`;
  $("holdOk").hidden = false;
};

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 1800) }

renderPlaces(); renderGrid(); renderBill();
