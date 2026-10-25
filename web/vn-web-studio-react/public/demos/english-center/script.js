const fmt = n => n.toLocaleString("vi-VN") + "₫";

const GROUPS = [
  { id: "kids", name: "Thiếu nhi", age: "6 – 11 tuổi" },
  { id: "teens", name: "Thiếu niên", age: "12 – 17 tuổi" },
  { id: "ielts", name: "Luyện thi IELTS", age: "Từ 15 tuổi" },
  { id: "work", name: "Giao tiếp đi làm", age: "Người lớn" },
];

const COURSES = [
  { id: "k1", g: "kids", lvl: "Pre-A1 → A1 Movers", name: "Kids Explorer", desc: "Làm quen tiếng Anh qua bài hát, trò chơi và phonics. Cô bản ngữ đứng lớp cùng trợ giảng Việt.", feats: ["48 buổi · 16 tuần", "Tối đa 10 bé / lớp", "Giáo trình Cambridge Kid's Box"], price: 7200000 },
  { id: "k2", g: "kids", lvl: "A1 → A2 Flyers", name: "Kids Discovery", desc: "Đọc truyện, thuyết trình nhỏ và làm dự án nhóm. Thi thử Cambridge Flyers cuối khóa.", feats: ["48 buổi · 16 tuần", "Báo cáo tiến độ qua Zalo", "Thi thử Flyers miễn phí"], price: 7900000, hot: "Phụ huynh chọn nhiều" },
  { id: "k3", g: "kids", lvl: "Hè · mọi trình độ", name: "Summer Camp Tiếng Anh", desc: "Trại hè 4 tuần, học buổi sáng, chiều làm thủ công, nấu ăn và dã ngoại bằng tiếng Anh.", feats: ["20 ngày · 8:00 – 16:00", "Gồm ăn trưa và xe đưa đón", "Khai giảng 15/06 hằng năm"], price: 9500000 },
  { id: "t1", g: "teens", lvl: "A2 → B1 PET", name: "Teen Foundation", desc: "Củng cố ngữ pháp và từ vựng chương trình THCS, luyện 4 kỹ năng theo format Cambridge PET.", feats: ["48 buổi · 16 tuần", "Tối đa 12 học viên", "Bám sát chương trình trên lớp"], price: 8400000 },
  { id: "t2", g: "teens", lvl: "B1 · thi vào 10", name: "Luyện thi vào lớp 10", desc: "Giải đề tuyển sinh Đà Nẵng các năm, chữa từng câu sai. Thi thử 3 lần theo đề chuẩn Sở.", feats: ["36 buổi · 12 tuần", "Đề thi thử có chấm chữa", "Cam kết từ 8.0 điểm"], price: 6900000, hot: "Mùa thi 2027" },
  { id: "t3", g: "teens", lvl: "B1 → B2", name: "Teen Debate Club", desc: "Tranh biện và thuyết trình bằng tiếng Anh. Phù hợp học sinh muốn thi chuyên hoặc du học.", feats: ["24 buổi · 12 tuần", "Thuyết trình cuối khóa", "Giáo viên bản ngữ 100%"], price: 6200000 },
  { id: "i1", g: "ielts", lvl: "Mục tiêu 5.0 – 5.5", name: "IELTS Foundation", desc: "Xây nền 4 kỹ năng và làm quen dạng bài. Dành cho bạn đang ở khoảng 3.5 – 4.5.", feats: ["48 buổi · 16 tuần", "Thi thử giữa và cuối khóa", "Cam kết đầu ra 5.0"], price: 9800000 },
  { id: "i2", g: "ielts", lvl: "Mục tiêu 6.5", name: "IELTS Intensive", desc: "Chiến thuật từng dạng câu hỏi, chữa Writing 1-1 mỗi tuần, Speaking với giám khảo bản ngữ.", feats: ["48 buổi · 16 tuần", "Chấm Writing 1-1 hằng tuần", "Cam kết đầu ra 6.5"], price: 12500000, hot: "Đăng ký nhiều nhất" },
  { id: "i3", g: "ielts", lvl: "Mục tiêu 7.0+", name: "IELTS Master", desc: "Lớp tối đa 8 người cho bạn đã có 6.0 trở lên, tập trung Writing Task 2 và Speaking Part 3.", feats: ["36 buổi · 12 tuần", "Tối đa 8 học viên", "Cam kết đầu ra 7.0"], price: 14900000 },
  { id: "w1", g: "work", lvl: "A1 → A2", name: "Giao tiếp cơ bản", desc: "Dành cho người mất gốc: phát âm chuẩn, mẫu câu hằng ngày, tự giới thiệu và hỏi đường.", feats: ["36 buổi · 12 tuần", "Lớp tối 18:00 hoặc 19:30", "Học bù online nếu vắng"], price: 5900000 },
  { id: "w2", g: "work", lvl: "A2 → B1", name: "Giao tiếp công sở", desc: "Email, họp, thuyết trình và small talk với đối tác. Tình huống lấy từ công việc thật của học viên.", feats: ["36 buổi · 12 tuần", "Tối đa 10 học viên", "Lớp tối và sáng thứ 7"], price: 6900000, hot: "Lớp tối còn chỗ" },
  { id: "w3", g: "work", lvl: "Doanh nghiệp", name: "Đào tạo tại công ty", desc: "Giáo viên đến văn phòng, giáo trình theo ngành: IT, khách sạn, logistics. Báo cáo cho HR mỗi tháng.", feats: ["Từ 8 nhân viên / lớp", "Lịch học theo ca làm", "Xuất hóa đơn VAT"], price: 450000, unit: "/ học viên / buổi" },
];

/* tabs + course cards */
const tabs = document.getElementById("tabs");
const grid = document.getElementById("courseGrid");
const courseSelect = document.getElementById("courseSelect");
let current = "ielts";

function renderTabs() {
  tabs.innerHTML = GROUPS.map(g => `<button class="tab" role="tab" aria-selected="${g.id === current}" data-g="${g.id}">${g.name}<small>${g.age}</small></button>`).join("");
}
function renderCourses() {
  grid.innerHTML = COURSES.filter(c => c.g === current).map((c, i) => `
    <article class="course${c.hot ? " hot" : ""}" style="animation-delay:${i * 60}ms">
      ${c.hot ? `<span class="badge">${c.hot}</span>` : ""}
      <span class="lvl">${c.lvl}</span>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <ul>${c.feats.map(f => `<li>${f}</li>`).join("")}</ul>
      <div class="price"><strong>${fmt(c.price)}</strong><span>${c.unit || "/ trọn khóa"}</span></div>
      <button class="btn pick" data-pick="${c.id}">Học thử khóa này</button>
    </article>`).join("");
}
tabs.addEventListener("click", e => {
  const b = e.target.closest(".tab");
  if (!b) return;
  current = b.dataset.g;
  renderTabs(); renderCourses();
});
grid.addEventListener("click", e => {
  const b = e.target.closest("[data-pick]");
  if (b) chooseCourse(b.dataset.pick);
});
courseSelect.innerHTML = GROUPS.map(g => `<optgroup label="${g.name}">${COURSES.filter(c => c.g === g.id).map(c => `<option value="${c.id}">${c.name}</option>`).join("")}</optgroup>`).join("");
function chooseCourse(id) {
  courseSelect.value = id;
  document.getElementById("signup").scrollIntoView({ behavior: "smooth" });
}
renderTabs(); renderCourses();
courseSelect.value = "i2";

/* placement quiz */
const QS = [
  { q: "She ___ to school by bus every day.", o: ["go", "goes", "going", "gone"], a: 1 },
  { q: "I have lived in Da Nang ___ 2019.", o: ["for", "since", "from", "at"], a: 1 },
  { q: "If it ___ tomorrow, we will cancel the trip.", o: ["rains", "rained", "will rain", "is raining"], a: 0 },
  { q: "Chọn từ gần nghĩa nhất với <u>reluctant</u>.", o: ["eager", "unwilling", "careful", "angry"], a: 1 },
  { q: "The report ___ by the time the manager arrived.", o: ["has finished", "was finishing", "had been finished", "finishes"], a: 2 },
  { q: "Hardly ___ the station when the train left.", o: ["I had reached", "had I reached", "I reached", "did I reached"], a: 1 },
];
const LEVELS = [
  { min: 0, code: "A1", title: "Mới bắt đầu", text: "Bạn nên xây lại nền phát âm và ngữ pháp cơ bản trước khi luyện kỹ năng.", rec: ["w1", "t1", "k1"] },
  { min: 2, code: "A2", title: "Sơ cấp", text: "Bạn nắm được câu đơn giản, cần mở rộng vốn từ và luyện nói phản xạ.", rec: ["w2", "t1", "k2"] },
  { min: 4, code: "B1", title: "Trung cấp", text: "Nền ngữ pháp khá ổn. Đây là lúc phù hợp để bắt đầu luyện IELTS hoặc giao tiếp công việc.", rec: ["i1", "t2", "w2"] },
  { min: 6, code: "B2", title: "Trung cao cấp", text: "Bạn xử lý tốt cấu trúc khó. Lớp luyện đề chuyên sâu sẽ giúp bạn lên band nhanh.", rec: ["i2", "t3", "i3"] },
];
const quiz = document.getElementById("quiz");
let step = 0, score = 0;

function renderQ() {
  const q = QS[step], L = "ABCD";
  quiz.innerHTML = `
    <div class="q-top"><span>Câu ${step + 1} / ${QS.length}</span><span>Ngữ pháp & từ vựng</span></div>
    <div class="bar"><i style="width:${(step / QS.length) * 100}%"></i></div>
    <p class="q-text">${q.q}</p>
    <div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}"><b>${L[i]}</b>${o}</button>`).join("")}</div>`;
}
function renderResult() {
  const lv = [...LEVELS].reverse().find(l => score >= l.min);
  const recs = lv.rec.map(id => COURSES.find(c => c.id === id));
  quiz.innerHTML = `
    <div class="bar"><i style="width:100%"></i></div>
    <div class="result">
      <div class="level"><strong>${lv.code}</strong><div><h3>${lv.title}</h3><p>Đúng ${score}/${QS.length} câu</p></div></div>
      <p>${lv.text}</p>
      ${recs.map(c => `<div class="rec"><div><b>${c.name}</b><br><span>${GROUPS.find(g => g.id === c.g).name} · ${c.lvl}</span></div><button class="btn small primary" data-pick="${c.id}">${fmt(c.price)}</button></div>`).join("")}
      <div class="actions"><button class="btn small ghost" id="retry">Làm lại</button></div>
    </div>`;
}
quiz.addEventListener("click", e => {
  const opt = e.target.closest(".opt");
  if (opt) {
    if (+opt.dataset.i === QS[step].a) score++;
    step++;
    step < QS.length ? renderQ() : renderResult();
    return;
  }
  const pick = e.target.closest("[data-pick]");
  if (pick) return chooseCourse(pick.dataset.pick);
  if (e.target.id === "retry") { step = 0; score = 0; renderQ(); }
});
renderQ();

/* count-up numbers */
const counters = document.querySelectorAll("[data-count]");
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, dec = +(el.dataset.dec || 0), t0 = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - t0) / 1200), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = dec ? v.toFixed(dec).replace(".", ",") : Math.round(v).toLocaleString("vi-VN");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    io.unobserve(el);
  });
}, { threshold: .4 });
counters.forEach(c => io.observe(c));

/* demo form */
const form = document.getElementById("form");
const msg = document.getElementById("formMsg");
form.addEventListener("submit", e => {
  e.preventDefault();
  const f = form.elements;
  const name = f.name.value.trim(), phone = f.phone.value.replace(/\D/g, "");
  f.name.classList.toggle("err", !name);
  f.phone.classList.toggle("err", phone.length < 9);
  if (!name || phone.length < 9) {
    msg.className = "form-msg bad";
    msg.textContent = "Vui lòng nhập họ tên và số điện thoại hợp lệ.";
    return;
  }
  const c = COURSES.find(x => x.id === f.course.value);
  msg.className = "form-msg ok";
  msg.textContent = `Đã giữ chỗ học thử “${c.name}” lúc ${f.slot.value} cho ${name}. Tầm Xa sẽ gọi xác nhận qua số ${f.phone.value.trim()}. (Bản demo, chưa gửi dữ liệu)`;
  form.reset();
  courseSelect.value = c.id;
});
