// Estimator: car class × odometer → maintenance tier, plus optional extras → receipt ticket + demo booking
const CARS = [
  { id: "sedan", name: "Sedan / Hatchback", note: "Vios, City, Mazda 3" },
  { id: "suv", name: "SUV / MPV 7 chỗ", note: "Fortuner, CR-V, Xpander" },
  { id: "pickup", name: "Bán tải", note: "Ranger, Hilux, Triton" }
];

// prices indexed by CARS order
const TIERS = [
  { every: 40000, name: "Bảo dưỡng cấp 4 (40.000 km)", detail: "thay dầu, lọc dầu, lọc gió, dầu phanh, nước làm mát, bugi", price: [3650000, 4300000, 4650000], min: 240 },
  { every: 20000, name: "Bảo dưỡng cấp 3 (20.000 km)", detail: "thay dầu, lọc dầu, lọc gió điều hòa, vệ sinh phanh", price: [1890000, 2250000, 2390000], min: 150 },
  { every: 10000, name: "Bảo dưỡng cấp 2 (10.000 km)", detail: "thay dầu, lọc dầu, vệ sinh lọc gió động cơ", price: [1150000, 1390000, 1480000], min: 90 },
  { every: 5000, name: "Bảo dưỡng cấp 1 (5.000 km)", detail: "thay dầu máy, kiểm tra tổng quát", price: [690000, 850000, 920000], min: 60 }
];

const EXTRAS = [
  { id: "ac", name: "Vệ sinh dàn lạnh điều hòa", price: [650000, 800000, 850000], min: 60 },
  { id: "align", name: "Cân chỉnh độ chụm 3D", price: [350000, 400000, 450000], min: 45 },
  { id: "brake", name: "Thay má phanh trước", price: [850000, 1050000, 1150000], min: 60 },
  { id: "inject", name: "Vệ sinh kim phun, buồng đốt", price: [950000, 1100000, 1200000], min: 60 },
  { id: "battery", name: "Thay ắc quy GS 60Ah", price: [1950000, 2350000, 2350000], min: 15 },
  { id: "tyre", name: "Đảo lốp + cân bằng động", price: [240000, 280000, 320000], min: 30 }
];

const SLOTS = ["07:30", "09:00", "10:30", "13:30", "15:00", "16:30"];

const $ = (s) => document.querySelector(s);
const vnd = (n) => n.toLocaleString("vi-VN") + "₫";
const km = (n) => n.toLocaleString("vi-VN");
const dur = (m) => {
  const h = Math.floor(m / 60), r = m % 60;
  return (h ? h + " giờ" : "") + (h && r ? " " : "") + (r ? r + " phút" : "");
};

const state = { car: 0, km: 40000, extras: new Set(["ac"]) };

function tierFor(n) {
  return TIERS.find((t) => n % t.every === 0);
}

function renderCars() {
  $("#carType").innerHTML = CARS.map((c, i) =>
    `<button type="button" data-i="${i}" aria-pressed="${i === state.car}"><b>${c.name}</b><span>${c.note}</span></button>`
  ).join("");
}

function renderExtras() {
  $("#extras").innerHTML = EXTRAS.map((e) =>
    `<label class="extra"><input type="checkbox" value="${e.id}" ${state.extras.has(e.id) ? "checked" : ""} />` +
    `<span>${e.name}</span><small>${vnd(e.price[state.car])} · ${dur(e.min)}</small></label>`
  ).join("");
}

function renderTicket() {
  const tier = tierFor(state.km);
  const picked = EXTRAS.filter((e) => state.extras.has(e.id));
  let total = tier.price[state.car];
  let minutes = tier.min;

  const rows = [
    `<li><span>${tier.name}</span><b>${vnd(tier.price[state.car])}</b></li>`,
    ...picked.map((e) => {
      total += e.price[state.car];
      minutes += e.min;
      return `<li><span>${e.name}</span><b>${vnd(e.price[state.car])}</b></li>`;
    }),
    `<li class="free"><span>Kiểm tra 32 hạng mục + rửa xe</span><b>Miễn phí</b></li>`
  ];

  $("#lines").innerHTML = rows.join("");
  $("#total").textContent = vnd(total);
  $("#eta").textContent = dur(minutes) + (minutes <= 120 ? " · có thể ngồi chờ" : " · nhận xe trong ngày");
  $("#ticketCar").textContent = `${CARS[state.car].name} · ${km(state.km)} km`;
  $("#kmOut").textContent = km(state.km);
  $("#suggest").innerHTML = `Ở mốc ${km(state.km)} km nên làm <b>${tier.name}</b>: ${tier.detail}.`;
}

$("#carType").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.car = +b.dataset.i;
  renderCars();
  renderExtras();
  renderTicket();
});

$("#km").addEventListener("input", (e) => {
  state.km = +e.target.value;
  renderTicket();
});

$("#extras").addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;
  e.target.checked ? state.extras.add(e.target.value) : state.extras.delete(e.target.value);
  renderTicket();
});

// booking (demo)
const dateInput = $("#date");
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = iso(new Date());
dateInput.value = iso(tomorrow);
$("#slot").innerHTML = SLOTS.map((s) => `<option>${s}</option>`).join("");

$("#book").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const [y, m, d] = f.get("date").split("-");
  const code = "DT-" + Math.floor(1000 + Math.random() * 9000);
  const ok = $("#ok");
  ok.innerHTML = `<strong>Đã giữ chỗ ${f.get("slot")} ngày ${d}/${m}/${y}</strong>` +
    `Mã lịch hẹn <b>${code}</b> cho xe ${escapeHtml(f.get("plate"))}. Cố vấn dịch vụ sẽ gọi số ${escapeHtml(f.get("phone"))} để xác nhận trong 15 phút. Tạm tính: ${$("#total").textContent}.`;
  ok.hidden = false;
  e.target.reset();
  dateInput.value = iso(tomorrow);
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

renderCars();
renderExtras();
renderTicket();
