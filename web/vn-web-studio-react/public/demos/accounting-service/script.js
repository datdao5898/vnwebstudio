const fmt = n => n.toLocaleString("vi-VN") + "₫";
const $ = id => document.getElementById(id);

/* ---------- fee calculator ---------- */
const TYPES = {
  ho: { name: "Hộ kinh doanh", base: 500000 },
  dv: { name: "Công ty dịch vụ", base: 800000 },
  tm: { name: "Công ty thương mại", base: 1200000 },
  sx: { name: "Sản xuất, xây dựng", base: 1800000 },
};
const INCLUDED_INVOICES = 20, PER_INVOICE = 5000, PER_STAFF = 40000;
const YEAR_END = 250000, REPORT = 400000, CLEANUP = 2500000;

const form = $("calcForm"), invoices = $("invoices"), staff = $("staff");
let quoteText = "";

function setFill(range) {
  const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
  range.style.setProperty("--fill", pct + "%");
}

function updateQuote() {
  const type = TYPES[form.elements.type.value];
  const inv = +invoices.value, ppl = +staff.value;
  const extraInv = Math.max(0, inv - INCLUDED_INVOICES);
  const lines = [
    [`Gói ${type.name.toLowerCase()}`, type.base],
    [`${extraInv} hóa đơn vượt gói`, extraInv * PER_INVOICE],
    [`Lương và BHXH ${ppl} người`, ppl * PER_STAFF],
  ];
  if ($("exYear").checked) lines.push(["Quyết toán cuối năm", YEAR_END]);
  if ($("exReport").checked) lines.push(["Báo cáo lãi lỗ", REPORT]);

  const monthly = lines.reduce((sum, [, v]) => sum + v, 0);
  const shown = lines.filter(([, v]) => v > 0);
  const once = $("exClean").checked;

  $("invoicesOut").textContent = `${inv} hóa đơn`;
  $("staffOut").textContent = ppl ? `${ppl} người` : "Không có";
  setFill(invoices); setFill(staff);

  const list = $("lines");
  list.replaceChildren();
  shown.forEach(([label, value]) => list.append(line(label, fmt(value))));
  if (once) list.append(line("Dọn sổ, trả một lần", fmt(CLEANUP), "once"));

  $("total").textContent = fmt(monthly);
  $("yearNote").textContent = `Trả theo năm: ${fmt(monthly * 11)}, tặng một tháng phí.`;

  quoteText = `${type.name}, ${inv} hóa đơn mỗi tháng, ${ppl} nhân viên. Tạm tính ${fmt(monthly)} mỗi tháng`
    + (once ? `, dọn sổ một năm ${fmt(CLEANUP)}.` : ".");
}

function line(label, value, cls) {
  const li = document.createElement("li");
  if (cls) li.className = cls;
  const name = document.createElement("span");
  name.textContent = label;
  const amount = document.createElement("b");
  amount.textContent = value;
  li.append(name, amount);
  return li;
}

form.addEventListener("input", updateQuote);
form.addEventListener("submit", e => e.preventDefault());
updateQuote();

$("useQuote").addEventListener("click", () => {
  $("note").value = quoteText;
  $("lien-he").scrollIntoView();
  $("contactForm").elements.name.focus({ preventScroll: true });
});

/* ---------- deadline tabs ---------- */
const DEADLINES = {
  thang: [
    ["Ngày 5", "Chốt chứng từ tháng trước", "Sổ Gọn nhắc qua Zalo những hóa đơn và sao kê còn thiếu."],
    ["Ngày 20", "Tờ khai thuế GTGT", "Áp dụng khi đơn vị kê khai theo tháng, nộp tờ khai cùng tiền thuế của tháng trước."],
    ["Ngày 20", "Tờ khai thuế TNCN", "Áp dụng khi đơn vị có khấu trừ và kê khai theo tháng."],
    ["Cuối tháng", "Đóng BHXH", "Hạn đóng cho tiền lương của tháng liền trước."],
  ],
  quy: [
    ["30/4 · 31/7", "Tờ khai GTGT và TNCN quý", "Quý 1 và quý 2. Đơn vị kê khai theo quý nộp chậm nhất ngày cuối của tháng đầu quý sau."],
    ["31/10 · 31/1", "Tờ khai GTGT và TNCN quý", "Quý 3 và quý 4, thời hạn tính giống hai quý đầu năm."],
    ["Ngày 30", "Tạm nộp thuế TNDN", "Tháng đầu của quý sau: 30/4, 30/7, 30/10 và 30/1 năm kế tiếp."],
  ],
  nam: [
    ["31/3", "Báo cáo tài chính năm", "Công ty có năm tài chính theo năm dương lịch nộp cùng hồ sơ quyết toán."],
    ["31/3", "Quyết toán thuế TNDN", "Nộp tờ khai quyết toán và phần thuế còn thiếu của năm trước."],
    ["31/3", "Quyết toán thuế TNCN của tổ chức", "Đơn vị trả lương tổng hợp thu nhập và số đã khấu trừ của nhân viên."],
    ["30/4", "Cá nhân tự quyết toán TNCN", "Dành cho người tự quyết toán, Sổ Gọn nhận làm thay cho nhân viên của khách."],
  ],
};

const tabs = [...document.querySelectorAll("[data-tab]")];

function showTab(key) {
  tabs.forEach(tab => tab.setAttribute("aria-selected", String(tab.dataset.tab === key)));
  const list = $("deadlines");
  list.replaceChildren();
  DEADLINES[key].forEach(([when, title, detail]) => {
    const li = document.createElement("li");
    const time = document.createElement("time");
    time.textContent = when;
    const body = document.createElement("div");
    const b = document.createElement("b");
    b.textContent = title;
    const span = document.createElement("span");
    span.textContent = detail;
    body.append(b, span);
    li.append(time, body);
    list.append(li);
  });
}

tabs.forEach(tab => tab.addEventListener("click", () => showTab(tab.dataset.tab)));
showTab("thang");

/* ---------- contact form (demo) ---------- */
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target.elements.name.value.trim();
  const msg = $("formMsg");
  msg.textContent = `Cảm ơn ${name}. Đây là bản demo nên yêu cầu chưa được gửi đi. Trên website thật, kế toán sẽ gọi lại trong giờ làm việc.`;
  msg.hidden = false;
});
