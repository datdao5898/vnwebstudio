const $ = id => document.getElementById(id);
const ty = n => (n / 1e9).toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " tỷ";
const vnd = n => (Math.round(n / 1000) * 1000).toLocaleString("vi-VN") + "₫";

const VIEW = { "Nội khu": 1, "Công viên": 1.03, "Sông": 1.06 };
const FLOOR_STEP = 0.006;

/* rooms in a 320×240 plan: [x, y, w, h, kind, label]; kind: live | bed | wet | out */
const TYPES = [
  { id: "1pn", tab: "1PN+", title: "Căn 1 phòng ngủ +", area: 52, beds: "1 + 1", wc: 1, base: 3.6e9, floors: [5, 32], views: ["Nội khu", "Công viên"],
    note: "Tháp Mây · phòng đa năng làm phòng làm việc hoặc phòng cho bé",
    rooms: [[10, 10, 180, 120, "live", "Phòng khách"], [190, 10, 120, 120, "bed", "Phòng ngủ"], [10, 130, 80, 70, "wet", "Bếp"], [90, 130, 60, 70, "wet", "WC"], [150, 130, 160, 70, "live", "Đa năng"], [10, 200, 180, 30, "out", "Ban công"]] },
  { id: "2pn", tab: "2PN", title: "Căn 2 phòng ngủ", area: 72, beds: 2, wc: 2, base: 4.9e9, floors: [5, 32], views: ["Nội khu", "Công viên", "Sông"],
    note: "Hai tháp · phòng ngủ master có WC riêng, bếp tách logia phơi đồ",
    rooms: [[10, 10, 170, 120, "live", "Khách + ăn"], [180, 10, 130, 95, "bed", "PN master"], [180, 105, 130, 95, "bed", "PN 2"], [10, 130, 80, 70, "wet", "Bếp"], [90, 130, 45, 70, "wet", "WC"], [135, 130, 45, 70, "wet", "WC"], [10, 200, 170, 30, "out", "Ban công"], [180, 200, 130, 30, "out", "Logia"]] },
  { id: "3pn", tab: "3PN", title: "Căn 3 phòng ngủ", area: 98, beds: 3, wc: 2, base: 6.7e9, floors: [5, 32], views: ["Công viên", "Sông"],
    note: "Căn góc tháp Sông · hai mặt thoáng, phòng khách 4,8 m",
    rooms: [[10, 10, 150, 120, "live", "Phòng khách"], [160, 10, 150, 80, "bed", "PN master"], [160, 90, 75, 110, "bed", "PN 2"], [235, 90, 75, 110, "bed", "PN 3"], [10, 130, 80, 70, "wet", "Bếp"], [90, 130, 70, 70, "wet", "WC"], [10, 200, 150, 30, "out", "Ban công"], [160, 200, 150, 30, "out", "Logia"]] },
  { id: "duplex", tab: "Duplex", title: "Căn Duplex thông tầng", area: 145, beds: 4, wc: 3, base: 11.2e9, floors: [29, 31], views: ["Sông"],
    note: "Chỉ 12 căn · trần phòng khách 6 m, tầng trên có 3 phòng ngủ",
    rooms: [[10, 10, 170, 190, "live", "Khách thông tầng"], [180, 10, 130, 70, "wet", "Bếp + ăn"], [180, 80, 60, 50, "wet", "WC"], [240, 80, 70, 50, "live", "Thang"], [180, 130, 130, 70, "bed", "PN khách"], [10, 200, 300, 30, "out", "Sân vườn trên cao"]] },
];
const FILL = { live: "#ffffff", bed: "#cfe6ec", wet: "#f7e3b3", out: "#cfe8d4" };

function furniture([x, y, w, h, kind, label]) {
  const cx = x + w / 2, cy = y + h / 2 + 6;
  if (kind === "bed" && w > 60) {
    const bw = Math.min(w * .5, 56), bh = Math.min(h * .55, 62);
    return `<rect x="${cx - bw / 2}" y="${cy - bh / 2}" width="${bw}" height="${bh}" rx="4" fill="#ffffff" stroke="#8fb3bd"/><rect x="${cx - bw / 2 + 5}" y="${cy - bh / 2 + 5}" width="${bw / 2 - 8}" height="10" rx="3" fill="#e8f1f3"/><rect x="${cx + 3}" y="${cy - bh / 2 + 5}" width="${bw / 2 - 8}" height="10" rx="3" fill="#e8f1f3"/>`;
  }
  if (kind === "live" && /Khách/.test(label)) {
    return `<path d="M${cx - 40} ${cy + 10} h80 v-14 h-10 v8 h-60 v-34 h-10 z" fill="#e8f1f3" stroke="#8fb3bd"/><rect x="${cx - 14}" y="${cy - 26}" width="30" height="18" rx="3" fill="none" stroke="#8fb3bd"/>`;
  }
  if (kind === "out") {
    return Array.from({ length: Math.max(0, Math.floor((w - 110) / 34)) }, (_, i) => `<circle cx="${x + w - 18 - i * 34}" cy="${y + h / 2}" r="6" fill="#7db98d"/>`).join("");
  }
  return "";
}
function planSvg(t) {
  const rooms = t.rooms.map(r => {
    const [x, y, w, h, kind, label] = r;
    const small = w < 60;
    return `<g class="room"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${FILL[kind]}" stroke="#0e2433" stroke-width="${kind === "out" ? 1.5 : 3}"/>${furniture(r)}
      <text x="${small ? x + w / 2 : x + 8}" y="${y + (kind === "out" ? h / 2 + 4 : 18)}" font-size="${small ? 9 : 11}" font-weight="600" fill="#0e2433" ${small ? 'text-anchor="middle"' : ""}>${label}</text></g>`;
  }).join("");
  const glass = `<g stroke="#5aa9b8" stroke-width="4"><path d="M10 200 H310" stroke-dasharray="26 8"/></g>`;
  const compass = `<text x="310" y="248" font-size="10" fill="#52697a" text-anchor="end">Ban công hướng Đông Nam · ${t.area} m² tim tường</text>`;
  return `<svg viewBox="0 0 320 254"role="img" aria-label="Mặt bằng ${t.title}, ${t.area} m²"><rect x="10" y="10" width="300" height="190" fill="none" stroke="#0e2433" stroke-width="6"/>${rooms}${glass}${compass}</svg>`;
}

let cur = TYPES[1], view = "Sông";

$("types").innerHTML = TYPES.map(t => `<button class="type" role="tab" aria-selected="${t === cur}" data-id="${t.id}"><b>${t.tab}</b><span>${t.area} m² · ${t.beds} PN · ${t.wc} WC</span><em>từ ${ty(t.base)}</em></button>`).join("");
$("types").onclick = e => {
  const b = e.target.closest(".type"); if (!b) return;
  cur = TYPES.find(t => t.id === b.dataset.id);
  document.querySelectorAll(".type").forEach(x => x.setAttribute("aria-selected", x === b));
  if (!cur.views.includes(view)) view = cur.views[cur.views.length - 1];
  const f = $("floor"); f.min = cur.floors[0]; f.max = cur.floors[1];
  f.value = Math.min(cur.floors[1], Math.max(cur.floors[0], +f.value));
  renderUnit();
};
$("floor").oninput = renderUnit;
$("views").onclick = e => { const b = e.target.closest("button"); if (!b) return; view = b.dataset.v; renderUnit() };

function unitPrice() {
  const fl = +$("floor").value;
  return cur.base * (1 + FLOOR_STEP * (fl - cur.floors[0])) * VIEW[view];
}
function renderUnit() {
  const fl = +$("floor").value, price = unitPrice();
  $("plan").innerHTML = planSvg(cur);
  $("uName").textContent = cur.title;
  $("uMeta").textContent = cur.note;
  $("uSpecs").innerHTML = `<div><b>${cur.area} m²</b>tim tường</div><div><b>${cur.beds} PN</b>phòng ngủ</div><div><b>${cur.wc} WC</b>vệ sinh</div>`;
  $("floorOut").textContent = fl;
  $("views").innerHTML = cur.views.map(v => `<button type="button" aria-pressed="${v === view}" data-v="${v}">View ${v.toLowerCase()}</button>`).join("");
  $("uPrice").textContent = ty(price);
  $("uPerM2").textContent = `≈ ${(price / cur.area / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu/m² · tầng ${fl}, view ${view.toLowerCase()}`;
}

$("toLoan").onclick = () => {
  $("cPrice").value = Math.round(unitPrice() / 5e7) * 5e7;
  renderLoan();
  $("loan").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  toast(`Đã điền giá ${ty(unitPrice())} vào bảng tính vay`);
};
$("toVisit").onclick = () => { $("v-type").value = cur.tab };

/* loan: 18 months with 0% interest and no principal, then annuity over the remaining term */
const GRACE = 18;
function renderLoan() {
  const price = +$("cPrice").value, ratio = +$("cRatio").value, years = +$("cYears").value, rate = +$("cRate").value;
  const loan = price * ratio / 100, own = price - loan, n = years * 12 - GRACE, r = rate / 100 / 12;
  const monthly = loan ? loan * r / (1 - Math.pow(1 + r, -n)) : 0;
  $("oPrice").textContent = ty(price);
  $("oRatio").textContent = ratio + "%";
  $("oYears").textContent = years + " năm";
  $("oRate").textContent = rate.toLocaleString("vi-VN") + "%/năm";
  $("barOwn").style.width = (100 - ratio) + "%";
  $("barLoan").style.width = ratio + "%";
  $("rOwn").textContent = ty(own);
  $("rLoan").textContent = ty(loan);
  $("rMonthly").textContent = vnd(monthly);
  $("rNote").textContent = loan ? `Gốc + lãi đều trong ${n} tháng còn lại` : "Không vay ngân hàng";
  $("rTotal").textContent = loan
    ? `Tổng lãi ước tính ${ty(monthly * n - loan)}. Để trả nhẹ nhàng, thu nhập gia đình nên từ ${vnd(Math.ceil(monthly * 2 / 1e6) * 1e6)}/tháng.`
    : "Thanh toán bằng vốn tự có theo tiến độ, được chiết khấu thêm 3% khi trả 95% trong 60 ngày.";
}
$("calc").oninput = renderLoan;
$("calc").onsubmit = e => e.preventDefault();

/* visit form */
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const now = new Date(), sat = new Date(now);
sat.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
$("v-date").min = iso(now);
$("v-date").value = iso(sat);
$("v-type").innerHTML = TYPES.map(t => `<option value="${t.tab}"${t === cur ? " selected" : ""}>${t.title} · ${t.area} m²</option>`).join("");
$("visitForm").onsubmit = e => {
  e.preventDefault();
  const d = $("v-date").value.split("-").reverse().join("/");
  const ok = $("visitOk");
  ok.innerHTML = `<strong>Đã giữ lịch xem nhà mẫu</strong>${$("v-name").value} · ${d}, ${$("v-slot").value} · ${$("v-type").selectedOptions[0].text}.<br>Đây là website mẫu nên lịch không được gửi đi. Khi chạy thật, form sẽ nối với Zalo, email hoặc CRM của sàn.`;
  ok.hidden = false;
};

let tt;
function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 2200) }

renderUnit();
renderLoan();
