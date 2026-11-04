const $ = id => document.getElementById(id);

const AREAS = [
  { id: "dat-dai", name: "Đất đai", cases: [
    { t: "Tranh chấp ranh giới với hàng xóm", time: "4 – 8 tháng nếu phải ra tòa", fee: "từ 15.000.000₫",
      note: "Tranh chấp đất đai thường phải hòa giải tại ủy ban cấp xã trước khi khởi kiện. Hãy giữ lại biên bản hòa giải.",
      docs: ["Sổ đỏ hoặc giấy tờ nguồn gốc đất", "Bản vẽ, trích đo thửa đất", "Biên bản hòa giải tại ủy ban cấp xã", "Ảnh chụp hiện trạng ranh giới"] },
    { t: "Mua đất giấy tay, chưa sang tên được", time: "1 – 3 tháng", fee: "từ 8.000.000₫",
      note: "Nên để luật sư đọc giấy mua bán và tình trạng thửa đất trước khi trả thêm tiền cho bên bán.",
      docs: ["Giấy mua bán hoặc giấy đặt cọc", "Bản sao sổ đỏ của thửa đất", "Biên nhận chuyển tiền", "Căn cước của bên mua và bên bán"] }
  ] },
  { id: "hon-nhan", name: "Hôn nhân", cases: [
    { t: "Ly hôn thuận tình", time: "2 – 3 tháng", fee: "từ 5.000.000₫",
      note: "Hai bên cần thống nhất về việc ly hôn, người nuôi con và cách chia tài sản nếu có yêu cầu chia.",
      docs: ["Giấy chứng nhận kết hôn bản chính", "Căn cước của hai vợ chồng", "Giấy khai sinh của con", "Giấy tờ tài sản chung"] },
    { t: "Ly hôn đơn phương, tranh chấp quyền nuôi con", time: "4 – 9 tháng", fee: "từ 12.000.000₫",
      note: "Khi giành quyền nuôi con, chứng minh thu nhập và điều kiện chăm sóc con thường rất quan trọng.",
      docs: ["Giấy chứng nhận kết hôn bản chính", "Giấy khai sinh của con", "Giấy xác nhận thu nhập", "Giấy tờ về chỗ ở và việc học của con", "Chứng cứ về mâu thuẫn vợ chồng"] }
  ] },
  { id: "doanh-nghiep", name: "Doanh nghiệp", cases: [
    { t: "Thành lập công ty mới", time: "3 – 5 ngày làm việc", fee: "2.500.000₫",
      note: "Nên chốt ngành nghề, vốn điều lệ và tỉ lệ góp vốn trước khi nộp hồ sơ để tránh phải sửa đổi sau này.",
      docs: ["Căn cước của các thành viên góp vốn", "Hai đến ba phương án tên công ty", "Giấy tờ địa chỉ trụ sở", "Danh sách ngành nghề và vốn góp"] },
    { t: "Khách hàng nợ tiền, không trả theo hợp đồng", time: "1 – 6 tháng", fee: "từ 7.000.000₫",
      note: "Thời hiệu khởi kiện tranh chấp hợp đồng dân sự thường là 3 năm, nên đừng để công nợ quá lâu.",
      docs: ["Hợp đồng và phụ lục", "Hóa đơn, biên bản giao nhận", "Biên bản đối chiếu công nợ", "Tin nhắn, email đòi nợ"] }
  ] },
  { id: "lao-dong", name: "Lao động", cases: [
    { t: "Bị cho thôi việc không đúng luật", time: "1 – 5 tháng", fee: "từ 6.000.000₫",
      note: "Thời hiệu yêu cầu tòa án giải quyết việc này thường là 1 năm, nên cần xử lý sớm.",
      docs: ["Hợp đồng lao động", "Quyết định hoặc thông báo thôi việc", "Bảng lương, sao kê nhận lương", "Tin nhắn, email với công ty"] },
    { t: "Công ty nợ lương, chưa đóng bảo hiểm", time: "1 – 4 tháng", fee: "từ 5.000.000₫",
      note: "Bạn có thể tra quá trình đóng bảo hiểm trên ứng dụng của cơ quan bảo hiểm xã hội rồi lưu lại ảnh chụp.",
      docs: ["Hợp đồng lao động", "Bảng lương các tháng bị nợ", "Ảnh chụp quá trình đóng bảo hiểm", "Văn bản đã gửi cho công ty"] }
  ] },
  { id: "thua-ke", name: "Thừa kế", cases: [
    { t: "Chia di sản khi không có di chúc", time: "1 – 6 tháng", fee: "từ 8.000.000₫",
      note: "Thời hiệu yêu cầu chia di sản là 30 năm với bất động sản và 10 năm với động sản, tính từ lúc mở thừa kế.",
      docs: ["Giấy chứng tử của người mất", "Giấy tờ chứng minh quan hệ gia đình", "Sổ đỏ, giấy tờ tài sản", "Văn bản thỏa thuận giữa những người thừa kế"] },
    { t: "Lập di chúc cho đúng và chắc chắn", time: "3 – 7 ngày làm việc", fee: "2.000.000₫",
      note: "Công chứng di chúc không bắt buộc trong mọi trường hợp nhưng giúp hạn chế tranh chấp về sau.",
      docs: ["Căn cước của người lập di chúc", "Giấy tờ tài sản muốn để lại", "Danh sách người được hưởng", "Mong muốn về cách chia tài sản"] }
  ] }
];

let area = AREAS[0], caseIndex = 0;
const ticked = {};

$("routeChips").innerHTML = AREAS.map(a => `<button type="button" data-area="${a.id}">${a.name}</button>`).join("");
$("areaTabs").innerHTML = AREAS.map(a => `<button type="button" role="tab" data-area="${a.id}" aria-selected="false" aria-controls="result">${a.name}</button>`).join("");
$("f-area").innerHTML = AREAS.map(a => `<option value="${a.name}">${a.name}</option>`).join("") + `<option value="Hợp đồng">Hợp đồng</option><option value="Việc khác">Việc khác</option>`;

function selectArea(id) {
  area = AREAS.find(a => a.id === id);
  caseIndex = 0;
  document.querySelectorAll("#areaTabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.area === id));
  renderCases();
  renderResult();
}

function renderCases() {
  $("caseList").innerHTML = area.cases.map((c, i) =>
    `<button type="button" data-i="${i}" aria-pressed="${i === caseIndex}">${c.t}</button>`).join("");
}

function renderResult() {
  const c = area.cases[caseIndex];
  const key = `${area.id}-${caseIndex}`;
  const done = ticked[key] || (ticked[key] = new Set());
  $("result").innerHTML = `
    <h3>${c.t}</h3>
    <div class="metrics">
      <div><span>Thời gian dự kiến</span><strong>${c.time}</strong></div>
      <div><span>Phí luật sư tham khảo</span><strong>${c.fee}</strong></div>
    </div>
    <p class="note">${c.note}</p>
    <div class="checks-head">Giấy tờ cần chuẩn bị <span id="progressText"></span></div>
    <div class="bar"><i id="progressBar"></i></div>
    <ul class="checks">
      ${c.docs.map((d, i) => `<li><label><input type="checkbox" data-doc="${i}" ${done.has(i) ? "checked" : ""}><span>${d}</span></label></li>`).join("")}
    </ul>
    <a class="btn" id="useCase" href="#dat-lich">Đặt lịch với hồ sơ này</a>`;
  updateProgress();
}

function updateProgress() {
  const c = area.cases[caseIndex];
  const done = ticked[`${area.id}-${caseIndex}`];
  $("progressText").textContent = `Đã có ${done.size} trên ${c.docs.length}`;
  $("progressBar").style.width = `${done.size / c.docs.length * 100}%`;
}

$("areaTabs").onclick = e => {
  const b = e.target.closest("[data-area]");
  if (b) selectArea(b.dataset.area);
};

$("routeChips").onclick = e => {
  const b = e.target.closest("[data-area]");
  if (!b) return;
  selectArea(b.dataset.area);
  $("tinh-huong").scrollIntoView();
};

$("caseList").onclick = e => {
  const b = e.target.closest("[data-i]");
  if (!b) return;
  caseIndex = +b.dataset.i;
  renderCases();
  renderResult();
};

$("result").addEventListener("change", e => {
  if (!e.target.matches("[data-doc]")) return;
  const done = ticked[`${area.id}-${caseIndex}`], i = +e.target.dataset.doc;
  e.target.checked ? done.add(i) : done.delete(i);
  updateProgress();
});

$("result").addEventListener("click", e => {
  if (!e.target.closest("#useCase")) return;
  const c = area.cases[caseIndex];
  const done = ticked[`${area.id}-${caseIndex}`];
  $("f-area").value = area.name;
  $("f-note").value = `${c.t}. Đã có ${done.size} trên ${c.docs.length} giấy tờ.`;
});

/* booking date: from tomorrow, in local time */
const pad = n => String(n).padStart(2, "0");
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
$("f-date").min = minDate;
$("f-date").value = minDate;

$("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const date = $("f-date").value.split("-").reverse().join("/");
  const ok = $("bookOk");
  ok.innerHTML = "<strong></strong><span></span>";
  ok.querySelector("strong").textContent = `Đã nhận yêu cầu của ${$("f-name").value.trim()}`;
  ok.querySelector("span").textContent = `Lịch tư vấn ${mode} về ${$("f-area").value.toLowerCase()}, ngày ${date}, khung ${$("f-slot").value}. Đây là website mẫu nên yêu cầu không được gửi đi.`;
  ok.hidden = false;
});

selectArea(AREAS[0].id);
