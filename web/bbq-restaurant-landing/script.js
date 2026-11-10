(() => {
  const vnd = (n) => n.toLocaleString("vi-VN") + "₫";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Thực đơn có tab ---------- */
  const MENU = {
    nuong: [
      { n: "Ba chỉ bò Mỹ cuộn nấm kim châm", d: "Bò Mỹ thái mỏng 2mm, cuộn nấm, quét sốt mè rang", p: 159000, b: "Bán chạy" },
      { n: "Sườn non heo sốt mật ong", d: "Ướp 12 tiếng với mật ong rừng, tỏi và tiêu Phú Quốc", p: 129000 },
      { n: "Mực trứng nướng sa tế", d: "Mực trứng Phan Thiết, sa tế tôm nhà làm", p: 149000, b: "Cay", hot: true },
      { n: "Cánh gà muối ớt", d: "Cánh gà góc tư, muối ớt xanh, lá chanh", p: 99000, b: "Bán chạy" },
      { n: "Nạc vai heo Iberico", d: "Heo Iberico nhập khẩu, nướng tái giữ độ mọng", p: 219000 },
      { n: "Tôm sú nướng bơ tỏi", d: "6 con tôm sú cỡ 30, bơ lạt, tỏi phi", p: 179000 }
    ],
    lau: [
      { n: "Lẩu Thái chua cay hải sản", d: "Tôm, mực, nghêu, cá basa, nấm, rau muống. Nồi 3–4 người", p: 329000, b: "Cay", hot: true },
      { n: "Lẩu nấm thiên nhiên", d: "7 loại nấm, nước dùng ngọt từ rau củ và xương gà", p: 289000 },
      { n: "Lẩu bò nhúng giấm", d: "Bắp bò, gầu bò, giấm gạo, sả, hành tây", p: 349000 },
      { n: "Lẩu kim chi đậu hũ", d: "Kim chi lên men 21 ngày, ba chỉ heo, đậu hũ non", p: 299000 },
      { n: "Nồi uyên ương", d: "Chọn 2 vị trong cùng một nồi, phụ thu", p: 39000, b: "Gợi ý" }
    ],
    kem: [
      { n: "Cơm chiên tỏi bơ", d: "Ăn kèm đồ nướng, rắc hành lá phi", p: 59000 },
      { n: "Kim chi cải thảo", d: "Làm tại bếp, chua vừa, giòn", p: 35000 },
      { n: "Bắp nướng mỡ hành", d: "Bắp Mỹ ngọt, mỡ hành, đậu phộng rang", p: 45000 },
      { n: "Đĩa rau nướng thập cẩm", d: "Đậu bắp, cà tím, nấm đùi gà, ớt chuông", p: 69000 },
      { n: "Mì udon thêm cho lẩu", d: "Một phần 200g", p: 25000 }
    ],
    uong: [
      { n: "Trà tắc mật ong", d: "Ly 500ml, ít ngọt theo yêu cầu", p: 29000 },
      { n: "Nước sâm bí đao", d: "Nấu mỗi sáng, giải nhiệt sau đồ nướng", p: 25000 },
      { n: "Tháp bia tươi 3 lít", d: "Bia tươi ướp lạnh, đủ cho 5–6 người", p: 159000, b: "Nhóm bạn" },
      { n: "Soda chanh dây", d: "Chanh dây tươi, soda, lá bạc hà", p: 35000 }
    ]
  };
  const menuList = $("#menuList");
  const renderMenu = (cat) => {
    menuList.innerHTML = MENU[cat].map((m, i) => `
      <li style="animation-delay:${i * 40}ms">
        <h3>${m.n}${m.b ? `<span class="badge${m.hot ? " hot" : ""}">${m.b}</span>` : ""}</h3>
        <p>${m.d}</p>
        <span class="price">${vnd(m.p)}</span>
      </li>`).join("");
  };
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => {
    $$(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
    renderMenu(b.dataset.cat);
  }));
  renderMenu("nuong");

  /* ---------- Chọn nước lẩu ---------- */
  const BROTHS = [
    { id: "thai", n: "Thái chua cay", c: "#e8562a", c2: "#e8562a", spice: 3, d: "Sả, riềng, lá chanh, ớt hiểm và me chua. Nước đỏ cam, chua cay đậm đà, hợp hải sản.", base: "Xương ống heo 8 tiếng", hop: "Tôm, mực, nghêu", top: ["#f6b9a3", "#7fb069", "#f4d35e"] },
    { id: "nam", n: "Nấm thiên nhiên", c: "#c7a26a", c2: "#c7a26a", spice: 0, d: "Bảy loại nấm cùng củ cải, bắp ngọt và táo đỏ. Vị thanh, ngọt tự nhiên, hợp trẻ em và người ăn chay.", base: "Rau củ và nấm hương", hop: "Bò Mỹ, đậu hũ, rau", top: ["#8a6a3f", "#f2e6c9", "#7fb069"] },
    { id: "tuxuyen", n: "Uyên ương Tứ Xuyên", c: "#c3261c", c2: "#f1e6d2", spice: 4, d: "Một nửa cay tê với tiêu Tứ Xuyên và ớt khô, một nửa xương hầm trắng ngọt dịu. Cả bàn ai cũng có vị mình thích.", base: "Bò hầm và xương gà", hop: "Ba chỉ bò, lòng bò", top: ["#7a1610", "#f4d35e", "#7fb069"] },
    { id: "kimchi", n: "Kim chi", c: "#ea6b48", c2: "#ea6b48", spice: 2, d: "Kim chi cải thảo lên men 21 ngày, chua nhẹ, cay vừa, thêm ba chỉ heo và đậu hũ non.", base: "Xương heo và cá cơm", hop: "Ba chỉ heo, chả cá", top: ["#f7efe0", "#c3261c", "#7fb069"] },
    { id: "suon", n: "Sườn hầm ngô", c: "#ecc46e", c2: "#ecc46e", spice: 0, d: "Sườn non hầm cùng ngô ngọt, cà rốt và hạt sen. Nước trong, béo nhẹ, rất dễ ăn.", base: "Sườn non heo", hop: "Gà, nấm, rau cải", top: ["#f4f1de", "#e07a5f", "#7fb069"] }
  ];
  const chili = (on) => `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13 3c1 0 2 1 1.6 2 2 1 2.6 3.4 1 6-2 3.4-6 6-10 6.5-1.2.1-1.6-1-.7-1.6C9 13.5 11 10 11.5 7 12 5.5 12.3 4 13 3Z" fill="${on ? "#d62b1f" : "#d9dbe0"}"/></svg>`;
  const btnWrap = $("#brothBtns");
  const card = $("#brothCard");
  const toppings = $("#toppings");
  // vị trí topping cố định cho đẹp, không ngẫu nhiên
  const SPOTS = [[140, 150, 16], [250, 130, 13], [290, 220, 15], [180, 260, 14], [120, 230, 11], [230, 290, 12], [205, 175, 10], [270, 170, 9], [160, 205, 9], [250, 250, 10], [150, 300, 8], [300, 280, 8]];
  const setBroth = (id) => {
    const b = BROTHS.find((x) => x.id === id);
    $("#brothA").setAttribute("fill", b.c);
    $("#brothB").setAttribute("fill", b.c2);
    $("#divider").setAttribute("opacity", b.c !== b.c2 ? "1" : "0");
    toppings.innerHTML = SPOTS.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${b.top[i % 3]}" opacity=".95"/>`).join("") +
      `<path d="M120 180 q 12 -10 24 0" stroke="#4f7a3a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M240 320 q 12 -10 24 0" stroke="#4f7a3a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    $$("button", btnWrap).forEach((x) => x.setAttribute("aria-checked", x.dataset.id === id ? "true" : "false"));
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    card.innerHTML = `
      <h3>${b.n}</h3>
      <div class="spice"><span class="chilis">${[1, 2, 3, 4].map((n) => chili(n <= b.spice)).join("")}</span>${b.spice === 0 ? "Không cay" : b.spice >= 4 ? "Rất cay" : b.spice === 3 ? "Cay nhiều" : "Cay vừa"}</div>
      <p>${b.d}</p>
      <div class="row"><span>Nước cốt: <b>${b.base}</b></span><span>Hợp nhất với: <b>${b.hop}</b></span></div>`;
  };
  btnWrap.innerHTML = BROTHS.map((b) => `<button type="button" role="radio" data-id="${b.id}" aria-checked="false"><i style="background:linear-gradient(90deg, ${b.c} 50%, ${b.c2} 50%)"></i>${b.n}</button>`).join("");
  $$("button", btnWrap).forEach((x) => x.addEventListener("click", () => setBroth(x.dataset.id)));
  setBroth("thai");

  /* ---------- Tính tiền buffet ---------- */
  const PKGS = [
    { id: "nuong", n: "Nướng", full: "Buffet Nướng", p: 239000, d: "40 món nướng, quầy chấm tự chọn" },
    { id: "launuong", n: "Lẩu Nướng", full: "Buffet Lẩu Nướng", p: 299000, d: "60 món, 2 vị lẩu nồi uyên ương", tag: "Chọn nhiều nhất" },
    { id: "premium", n: "Bò Mỹ Thượng Hạng", full: "Buffet Bò Mỹ Thượng Hạng", p: 399000, d: "75 món, lõi vai bò Úc, hàu nướng" }
  ];
  const state = { pkg: "launuong", adult: 4, kid: 1, day: "weekday" };
  const pkgWrap = $("#pkgs");
  pkgWrap.innerHTML = PKGS.map((k) => `
    <button type="button" class="pkg" role="radio" data-id="${k.id}" aria-checked="false">
      ${k.tag ? `<span class="tag">${k.tag}</span>` : ""}
      <span class="name">${k.n}</span>
      <span class="pp">${vnd(k.p)} <small>/ người lớn</small></span>
      <span class="desc">${k.d}</span>
    </button>`).join("");
  $$(".pkg").forEach((b) => b.addEventListener("click", () => { state.pkg = b.dataset.id; calc(); }));
  $$(".stepper").forEach((s) => {
    const key = s.dataset.key;
    $$("button", s).forEach((b) => b.addEventListener("click", () => {
      const min = key === "adult" ? 1 : 0;
      state[key] = Math.max(min, Math.min(40, state[key] + Number(b.dataset.d)));
      calc();
    }));
  });
  $$(".seg-btns button").forEach((b) => b.addEventListener("click", () => {
    state.day = b.dataset.day;
    $$(".seg-btns button").forEach((x) => x.classList.toggle("on", x === b));
    calc();
  }));
  ["drink", "beer", "early"].forEach((id) => $("#" + id).addEventListener("change", calc));

  function calc() {
    const k = PKGS.find((x) => x.id === state.pkg);
    $$(".pkg").forEach((b) => b.setAttribute("aria-checked", b.dataset.id === state.pkg ? "true" : "false"));
    $$(".stepper").forEach((s) => { $("output", s).textContent = state[s.dataset.key]; });
    const lines = [];
    const adultPrice = k.p + (state.day === "weekend" ? 20000 : 0);
    const kidPrice = Math.round(adultPrice / 2);
    let food = state.adult * adultPrice + state.kid * kidPrice;
    lines.push([`${state.adult} người lớn × ${vnd(adultPrice)}`, state.adult * adultPrice]);
    if (state.kid) lines.push([`${state.kid} trẻ em × ${vnd(kidPrice)}`, state.kid * kidPrice]);
    if (state.day === "weekend") lines.push(["Đã gồm phụ thu cuối tuần 20.000₫ mỗi người lớn", null]);
    if ($("#early").checked) { const off = Math.round(food * 0.15); food -= off; lines.push(["Vào bàn trước 17:30 · giảm 15%", -off]); }
    if (state.adult >= 8) { const off = Math.round(food * 0.05); food -= off; lines.push(["Nhóm từ 8 người lớn · giảm 5%", -off]); }
    let total = food;
    const heads = state.adult + state.kid;
    if ($("#drink").checked) { lines.push([`Nước ngọt không giới hạn × ${heads}`, heads * 29000]); total += heads * 29000; }
    if ($("#beer").checked) { lines.push(["Tháp bia tươi 3 lít", 159000]); total += 159000; }
    $("#billLines").innerHTML = lines.map(([t, v]) => `<li class="${v < 0 ? "minus" : ""}"><span>${t}</span><span>${v === null ? "" : (v < 0 ? "−" + vnd(-v) : vnd(v))}</span></li>`).join("");
    $("#billTotal").textContent = vnd(total);
    $("#billPkg").textContent = k.full;
    $("#billPer").textContent = `Trung bình ${vnd(Math.round(total / heads / 1000) * 1000)} mỗi khách.`;
  }
  calc();

  $("#bookPkg").addEventListener("click", () => {
    $("#bookPkgSel").value = state.pkg;
    const n = state.adult + state.kid;
    const g = $("#bookGuests");
    g.selectedIndex = n <= 2 ? 0 : n <= 4 ? 1 : n <= 6 ? 2 : n <= 8 ? 3 : n <= 16 ? 4 : 5;
  });

  /* ---------- Con số chạy ---------- */
  const counters = $$("[data-count]");
  const run = (el) => {
    const end = Number(el.dataset.count); const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString("vi-VN");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else counters.forEach((c) => (c.textContent = Number(c.dataset.count).toLocaleString("vi-VN")));

  /* ---------- Đặt bàn ---------- */
  const SLOTS = [["17:00", "Còn nhiều"], ["17:30", "Còn nhiều"], ["18:00", "Còn 2 bàn", "few"], ["18:30", "Hết bàn", "off"], ["19:00", "Còn 1 bàn", "few"], ["19:30", "Còn 4 bàn"], ["20:00", "Còn nhiều"], ["20:30", "Còn nhiều"], ["21:00", "Còn nhiều"], ["21:30", "Bàn cuối"]];
  const slotWrap = $("#slots");
  let slot = "";
  slotWrap.innerHTML = SLOTS.map(([t, s, c]) => `<button type="button" class="slot ${c || ""}" data-t="${t}" ${c === "off" ? "disabled" : ""}><b>${t}</b><small>${s}</small></button>`).join("");
  $$(".slot", slotWrap).forEach((b) => b.addEventListener("click", () => {
    slot = b.dataset.t;
    $$(".slot", slotWrap).forEach((x) => x.classList.toggle("on", x === b));
  }));
  const dateInput = $("#bookDate");
  const today = new Date();
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  dateInput.min = iso(today);
  dateInput.value = iso(today);

  const form = $("#bookForm");
  const msg = $("#formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    const name = f["name"].value.trim();
    const phone = f["phone"].value.replace(/\D/g, "");
    f["name"].classList.toggle("err", !name);
    f["phone"].classList.toggle("err", phone.length < 9);
    msg.hidden = false;
    if (!name || phone.length < 9 || !slot) {
      msg.className = "form-msg bad";
      msg.textContent = !slot && name && phone.length >= 9 ? "Bạn chọn giúp Than Hồng một khung giờ đến nhé." : "Vui lòng nhập họ tên, số điện thoại hợp lệ và chọn giờ đến.";
      return;
    }
    const [y, m, d] = dateInput.value.split("-");
    msg.className = "form-msg";
    msg.textContent = `Cảm ơn ${name}! Than Hồng đã giữ bàn ${f["guests"].value} lúc ${slot} ngày ${d}/${m}/${y}. Nhân viên sẽ gọi xác nhận trong 10 phút. (Bản demo, chưa gửi dữ liệu.)`;
    form.reset();
    dateInput.value = iso(today);
    slot = "";
    $$(".slot", slotWrap).forEach((x) => x.classList.remove("on"));
  });
})();
