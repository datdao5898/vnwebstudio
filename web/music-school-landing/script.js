(function () {
  const fmt = (n) => Math.round(n).toLocaleString("vi-VN") + "₫";

  /* ---------- Khóa học ---------- */
  const icons = {
    piano: '<svg viewBox="0 0 32 32"><rect x="3" y="8" width="26" height="16" rx="2" fill="#fff"/><g fill="#172554"><rect x="8" y="8" width="2.6" height="9"/><rect x="13" y="8" width="2.6" height="9"/><rect x="19.5" y="8" width="2.6" height="9"/><rect x="24" y="8" width="2.6" height="9"/></g><g stroke="#c7cfe2" stroke-width=".8"><line x1="9.3" y1="17" x2="9.3" y2="24"/><line x1="14.3" y1="17" x2="14.3" y2="24"/><line x1="17.5" y1="8" x2="17.5" y2="24"/><line x1="20.8" y1="17" x2="20.8" y2="24"/><line x1="25.3" y1="17" x2="25.3" y2="24"/></g></svg>',
    orff: '<svg viewBox="0 0 32 32"><g fill="#f08a24"><rect x="5" y="11" width="4" height="12" rx="1.5"/><rect x="11" y="9" width="4" height="16" rx="1.5"/><rect x="17" y="7" width="4" height="20" rx="1.5"/><rect x="23" y="5" width="4" height="24" rx="1.5"/></g><circle cx="8" cy="6" r="2" fill="#fff"/><line x1="9.5" y1="7.5" x2="14" y2="12" stroke="#fff" stroke-width="1.6"/></svg>',
    guitar: '<svg viewBox="0 0 32 32"><path d="M13 15c-3-1-7 0-8 3.5S6 26 9.5 27s7.5-1 8.5-4c1-2.5-.5-3.5 0-5" fill="#f08a24"/><circle cx="11.5" cy="21" r="2" fill="#172554"/><path d="M13 20 26 7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M25 5l3 3" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
    violin: '<svg viewBox="0 0 32 32"><path d="M16 9c-3 0-4 2-3.5 4s-2 2.5-2 5.5c0 4 2.5 6.5 5.5 6.5s5.5-2.5 5.5-6.5c0-3-2.5-3.5-2-5.5S19 9 16 9z" fill="#f08a24"/><line x1="16" y1="3" x2="16" y2="21" stroke="#fff" stroke-width="1.6"/><line x1="6" y1="27" x2="27" y2="10" stroke="#fff" stroke-width="1.2"/></svg>',
    voice: '<svg viewBox="0 0 32 32"><rect x="12" y="4" width="8" height="14" rx="4" fill="#f08a24"/><path d="M8 15a8 8 0 0 0 16 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="23" x2="16" y2="28" stroke="#fff" stroke-width="2"/><line x1="11" y1="28" x2="21" y2="28" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  const courses = [
    { icon: "piano", name: "Piano cho bé", age: ["kid"], tag: "5 – 12 tuổi · 1 kèm 1", desc: "Đọc nốt bằng thẻ màu, tập ngón qua trò chơi, kết thúc kỳ với 6 bài hoàn chỉnh.", items: ["45 phút mỗi buổi", "Giáo trình Alfred, Bastien", "Báo cáo tiến độ hằng tuần"], price: 1600000 },
    { icon: "orff", name: "Cảm thụ âm nhạc", age: ["kid"], tag: "3 – 5 tuổi · nhóm 6 bé", desc: "Phương pháp Orff: vỗ tiết tấu, hát, gõ mộc cầm. Bước đệm trước khi chọn nhạc cụ.", items: ["40 phút mỗi buổi", "Phụ huynh dự giờ tháng đầu", "Đạo cụ có sẵn tại lớp"], price: 990000 },
    { icon: "piano", name: "Piano người lớn", age: ["adult"], tag: "Từ 16 tuổi · 1 kèm 1", desc: "Học theo bài hát bạn thích, đệm hợp âm và đọc bản nhạc, không ép thi cử.", items: ["60 phút mỗi buổi", "Lịch tối và cuối tuần", "Đổi giờ linh hoạt"], price: 1900000 },
    { icon: "guitar", name: "Guitar đệm hát", age: ["kid", "adult"], tag: "Từ 10 tuổi · nhóm 4", desc: "Bấm hợp âm, quạt chả, rải Slow Rock và Bolero. Ba tháng đệm trọn một bài.", items: ["60 phút mỗi buổi", "Mượn đàn tại lớp", "Tặng sổ hợp âm 120 bài"], price: 1200000 },
    { icon: "violin", name: "Violin cơ bản", age: ["kid", "adult"], tag: "Từ 6 tuổi · 1 kèm 1", desc: "Tư thế cầm đàn và vĩ, âm chuẩn trên dây buông, giáo trình Suzuki quyển 1 và 2.", items: ["45 phút mỗi buổi", "Cho thuê đàn 1/4 đến 4/4", "Luyện thi ABRSM"], price: 1800000 },
    { icon: "voice", name: "Thanh nhạc", age: ["kid", "adult"], tag: "Từ 8 tuổi · 1 kèm 1", desc: "Luyện hơi thở, khẩu hình, mở rộng âm vực. Thu âm bài tốt nghiệp trong phòng thu.", items: ["45 phút mỗi buổi", "Phòng thu cách âm", "Biểu diễn cuối kỳ"], price: 1500000 }
  ];
  const grid = document.getElementById("courseGrid");
  function renderCourses(age) {
    grid.innerHTML = courses
      .filter((c) => age === "all" || c.age.includes(age))
      .map((c) => `
        <article class="course">
          <div class="ic">${icons[c.icon]}</div>
          <span class="tag">${c.tag}</span>
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
          <ul>${c.items.map((i) => `<li>${i}</li>`).join("")}</ul>
          <div class="price"><b>${fmt(c.price)}</b><span>/ tháng · 8 buổi</span></div>
        </article>`)
      .join("");
  }
  renderCourses("all");
  document.querySelectorAll("#courseChips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#courseChips .chip").forEach((c) => {
        c.classList.toggle("on", c === chip);
        c.setAttribute("aria-selected", c === chip ? "true" : "false");
      });
      renderCourses(chip.dataset.age);
    });
  });

  /* ---------- Bàn phím thử đàn ---------- */
  const keys = [
    { id: "G3", name: "Son", low: true, f: 196.0 },
    { id: "A3", name: "La", low: true, f: 220.0 },
    { id: "B3", name: "Si", low: true, f: 246.94 },
    { id: "C4", name: "Đô", f: 261.63 },
    { id: "D4", name: "Rê", f: 293.66 },
    { id: "E4", name: "Mi", f: 329.63 },
    { id: "F4", name: "Fa", f: 349.23 },
    { id: "G4", name: "Son", f: 392.0 },
    { id: "A4", name: "La", f: 440.0 }
  ];
  const kb = document.getElementById("keyboard");
  keys.forEach((k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "wk";
    b.dataset.id = k.id;
    b.setAttribute("aria-label", k.name + (k.low ? " thấp" : ""));
    b.innerHTML = `${k.name}${k.low ? "<small>thấp</small>" : "<small>&nbsp;</small>"}`;
    kb.appendChild(b);
  });
  [1, 2, 4, 5, 7, 8].forEach((i) => {
    const bk = document.createElement("span");
    bk.className = "bk";
    bk.style.left = `calc(${(i / keys.length) * 100}% - 3.5%)`;
    kb.appendChild(bk);
  });

  // Kìa con bướm vàng — [nốt, phách]
  const song = [
    ["C4", 1], ["D4", 1], ["E4", 1], ["C4", 1],
    ["C4", 1], ["D4", 1], ["E4", 1], ["C4", 1],
    ["E4", 1], ["F4", 1], ["G4", 2],
    ["E4", 1], ["F4", 1], ["G4", 2],
    ["G4", .5], ["A4", .5], ["G4", .5], ["F4", .5], ["E4", 1], ["C4", 1],
    ["G4", .5], ["A4", .5], ["G4", .5], ["F4", .5], ["E4", 1], ["C4", 1],
    ["C4", 1], ["G3", 1], ["C4", 2],
    ["C4", 1], ["G3", 1], ["C4", 2]
  ];
  let ctx = null;
  let step = 0;
  let autoplay = false;
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const keyBy = (id) => keys.find((k) => k.id === id);
  const btnBy = (id) => kb.querySelector(`.wk[data-id="${id}"]`);

  function tone(freq, dur) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle"; o2.type = "sine";
      o.frequency.value = freq; o2.frequency.value = freq * 2;
      const g2 = ctx.createGain(); g2.gain.value = 0.25;
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.5, dur));
      o.start(t); o2.start(t); o.stop(t + dur + 0.6); o2.stop(t + dur + 0.6);
    } catch (e) { /* trình duyệt không hỗ trợ âm thanh */ }
  }
  function flash(id) {
    const b = btnBy(id);
    if (!b) return;
    b.classList.add("down");
    setTimeout(() => b.classList.remove("down"), 180);
  }
  function showNext() {
    kb.querySelectorAll(".wk").forEach((b) => b.classList.remove("next"));
    const pct = (step / song.length) * 100;
    progressBar.style.width = pct + "%";
    if (step >= song.length) {
      progressText.textContent = "Tuyệt vời! Bạn vừa chơi trọn bài Kìa con bướm vàng.";
      return;
    }
    const k = keyBy(song[step][0]);
    btnBy(k.id).classList.add("next");
    progressText.textContent = `Nốt tiếp theo: ${k.name}${k.low ? " thấp" : ""} · ${step}/${song.length} nốt`;
  }
  kb.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".wk");
    if (!b || autoplay) return;
    const k = keyBy(b.dataset.id);
    tone(k.f, 0.6);
    flash(k.id);
    if (step < song.length && song[step][0] === k.id) {
      step++;
      showNext();
    }
  });
  kb.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("wk")) {
      e.preventDefault();
      e.target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    }
  });
  document.getElementById("resetSong").addEventListener("click", () => {
    if (autoplay) return;
    step = 0;
    showNext();
  });
  const playBtn = document.getElementById("playSong");
  playBtn.addEventListener("click", () => {
    if (autoplay) return;
    autoplay = true;
    playBtn.textContent = "Đang phát…";
    const beat = 0.42;
    let t = 0;
    song.forEach(([id, d], i) => {
      setTimeout(() => {
        tone(keyBy(id).f, d * beat);
        flash(id);
        step = i + 1;
        showNext();
      }, t * 1000);
      t += d * beat;
    });
    setTimeout(() => {
      autoplay = false;
      playBtn.textContent = "Nghe cả bài";
      step = 0;
      showNext();
    }, t * 1000 + 600);
  });
  showNext();

  /* ---------- Tính học phí ---------- */
  const perSession = {
    piano: { solo: 200000, group: 140000, label: "Piano" },
    guitar: { solo: 190000, group: 150000, label: "Guitar" },
    violin: { solo: 225000, group: 160000, label: "Violin" },
    voice: { solo: 187500, group: 120000, label: "Thanh nhạc" }
  };
  const discount = { 1: 0, 3: 0.05, 6: 0.1 };
  const form = document.getElementById("calcForm");
  function calc() {
    const fd = new FormData(form);
    const ins = fd.get("ins"), mode = fd.get("mode");
    const freq = +fd.get("freq"), pack = +fd.get("pack");
    const price = perSession[ins][mode];
    const sessions = freq * 4 * pack;
    const gross = price * sessions;
    const off = gross * discount[pack];
    const total = gross - off;
    document.getElementById("crTotal").textContent = fmt(total);
    document.getElementById("crSub").textContent = off > 0 ? `Tiết kiệm ${fmt(off)} so với đóng từng tháng` : "Đóng 3 hoặc 6 tháng để được giảm thêm";
    document.getElementById("crList").innerHTML = `
      <li><span>Lớp</span><b>${perSession[ins].label} · ${mode === "solo" ? "1 kèm 1" : "nhóm 4"}</b></li>
      <li><span>Học phí mỗi buổi</span><b>${fmt(price)}</b></li>
      <li><span>Tổng số buổi</span><b>${sessions} buổi / ${pack} tháng</b></li>
      <li><span>Trung bình mỗi tháng</span><b>${fmt(total / pack)}</b></li>`;
    const sel = document.getElementById("trialIns");
    if (sel) sel.value = perSession[ins].label;
  }
  form.addEventListener("change", calc);
  calc();

  /* ---------- Đăng ký học thử ---------- */
  const slotData = [
    ["Thứ Ba", "17:30"], ["Thứ Tư", "18:00"], ["Thứ Năm", "19:00", true],
    ["Thứ Sáu", "17:30"], ["Thứ Bảy", "09:00"], ["Chủ nhật", "15:00"]
  ];
  const slotsEl = document.getElementById("slots");
  let chosen = null;
  slotData.forEach(([d, h, full]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "slot";
    b.innerHTML = `${d}<small>${full ? "Hết suất" : h}</small>`;
    if (full) b.disabled = true;
    b.addEventListener("click", () => {
      slotsEl.querySelectorAll(".slot").forEach((s) => s.classList.remove("on"));
      b.classList.add("on");
      chosen = `${d} ${h}`;
    });
    slotsEl.appendChild(b);
  });
  const trialForm = document.getElementById("trialForm");
  const msg = document.getElementById("formMsg");
  trialForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const field = (n) => trialForm.elements.namedItem(n);
    const name = field("name").value.trim();
    const phone = field("phone").value.replace(/\s/g, "");
    if (!name || !/^0\d{9}$/.test(phone)) {
      msg.className = "form-msg err";
      msg.textContent = "Vui lòng nhập họ tên và số điện thoại 10 số.";
      return;
    }
    if (!chosen) {
      msg.className = "form-msg err";
      msg.textContent = "Bạn chọn giúp một khung giờ học thử nhé.";
      return;
    }
    msg.className = "form-msg ok";
    msg.textContent = `Cảm ơn ${name}! Cung Đàn đã giữ suất ${field("ins").value} lúc ${chosen}, sẽ gọi xác nhận trong 2 giờ làm việc.`;
    trialForm.reset();
    slotsEl.querySelectorAll(".slot").forEach((s) => s.classList.remove("on"));
    chosen = null;
  });

  /* ---------- Đếm số ---------- */
  const nums = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const end = +el.dataset.count, suf = el.dataset.suffix || "";
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / 1200);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("vi-VN") + suf;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  }
})();
