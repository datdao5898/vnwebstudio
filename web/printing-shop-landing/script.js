(() => {
  /* ---------- Menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Product tabs ---------- */
  const tabs = document.querySelectorAll("#catTabs button");
  const cards = document.querySelectorAll("#productGrid .card");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.toggle("on", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      const cat = tab.dataset.cat;
      cards.forEach((c) => c.classList.toggle("hide", cat !== "all" && c.dataset.cat !== cat));
    })
  );

  /* ---------- Quote calculator ---------- */
  const P = {
    namecard: {
      name: "Danh thiếp", unitLabel: "cái", setup: 60000, unit: 220, days: 2, rushDays: "Trong 24 giờ",
      qty: [200, 500, 1000, 2000, 5000], def: 1,
      paper: [["Couche 300gsm", 1], ["Couche 350gsm", 1.15], ["Giấy mỹ thuật Kraft, Linen", 1.6]],
      finish: [["Cán màng mờ", "chống trầy, sang tay", 0.12, 0], ["Ép kim logo", "vàng, bạc, đồng", 0.35, 250000], ["Phủ UV định hình", "nổi bóng chi tiết", 0.25, 200000]],
    },
    flyer: {
      name: "Tờ rơi A5", unitLabel: "tờ", setup: 250000, unit: 650, days: 2, rushDays: "Trong 24 giờ",
      qty: [500, 1000, 3000, 5000, 10000], def: 1,
      paper: [["Couche 150gsm", 1], ["Couche 200gsm", 1.2], ["Fort 100gsm, viết được", 0.9]],
      finish: [["Gấp đôi hoặc gấp ba", "máy gấp tự động", 0.12, 0], ["Cán màng bóng", "màu tươi hơn", 0.18, 0], ["Bế lỗ treo", "khuôn tròn sẵn có", 0.08, 120000]],
    },
    catalogue: {
      name: "Catalogue A4 12 trang", unitLabel: "cuốn", setup: 1200000, unit: 24000, days: 5, rushDays: "Sau 3 ngày làm việc",
      qty: [100, 200, 500, 1000], def: 1,
      paper: [["Bìa C250, ruột C150", 1], ["Bìa C300, ruột C200", 1.18], ["Bìa mỹ thuật, ruột Ford", 1.35]],
      finish: [["Cán màng mờ bìa", "chống bám vân tay", 0.06, 0], ["Ép kim tên công ty", "trên bìa trước", 0.12, 400000], ["Đóng keo gáy vuông", "thay cho đóng ghim", 0.1, 0]],
    },
    box: {
      name: "Hộp giấy Ivory", unitLabel: "hộp", setup: 1500000, unit: 3000, days: 5, rushDays: "Sau 3 ngày làm việc",
      qty: [500, 1000, 3000, 5000], def: 1,
      paper: [["Ivory 300gsm", 0.9], ["Ivory 350gsm", 1], ["Duplex lưng xám 400gsm", 1.1]],
      finish: [["Cán màng mờ", "chống ẩm, chống trầy", 0.1, 0], ["Ép kim logo", "khuôn đồng riêng", 0.2, 500000], ["Dán hộp sẵn", "giao là dùng ngay", 0.12, 0]],
    },
    sticker: {
      name: "Tem nhãn decal", unitLabel: "tem", setup: 120000, unit: 230, days: 2, rushDays: "Trong 24 giờ",
      qty: [500, 1000, 3000, 10000], def: 1,
      paper: [["Decal giấy", 1], ["Decal nhựa sữa chống nước", 1.5], ["Decal trong suốt", 1.7]],
      finish: [["Bế demi theo hình", "bóc từng tem dễ", 0.15, 150000], ["Cán màng bóng", "chống trầy, chống nước", 0.12, 0], ["Ép kim viền", "nổi bật trên kệ", 0.3, 250000]],
    },
    bag: {
      name: "Túi giấy kraft", unitLabel: "túi", setup: 1000000, unit: 6000, days: 6, rushDays: "Sau 4 ngày làm việc",
      qty: [300, 500, 1000, 3000], def: 1,
      paper: [["Kraft nâu 120gsm", 1], ["Kraft trắng 120gsm", 1.08], ["Ivory 250gsm cán màng", 1.45]],
      finish: [["In 2 mặt", "logo cả hai mặt túi", 0.12, 0], ["Quai dây dù", "thay quai giấy xoắn", 0.15, 0], ["Ép kim logo", "khuôn đồng riêng", 0.18, 400000]],
    },
    envelope: {
      name: "Phong bì A4", unitLabel: "cái", setup: 300000, unit: 800, days: 3, rushDays: "Trong 24 giờ",
      qty: [500, 1000, 3000, 5000], def: 1,
      paper: [["Ford 100gsm", 1], ["Ford 120gsm", 1.12], ["Giấy mỹ thuật vân", 1.5]],
      finish: [["Băng keo dán sẵn", "bóc là dán", 0.15, 0], ["Cửa sổ trong", "nhìn thấy địa chỉ", 0.2, 200000], ["Kèm giấy tiêu đề", "số lượng bằng phong bì", 0.6, 100000]],
    },
    standee: {
      name: "Standee 60 × 160 cm", unitLabel: "bộ", setup: 0, unit: 220000, days: 1, rushDays: "Trong 4 giờ",
      qty: [1, 2, 5, 10], def: 0,
      paper: [["PP mực dầu, khung chữ X", 1], ["PP cán màng, khung cuốn nhôm", 1.9], ["Hiflex ngoài trời, khung sắt", 1.4]],
      finish: [["Cán màng mờ", "chống chói đèn", 0.12, 0], ["Túi đựng có quai", "mang đi sự kiện", 0.1, 0], ["Thiết kế giúp", "1 lần chỉnh sửa", 0, 150000]],
    },
  };

  const productSel = document.getElementById("product");
  const qtyChips = document.getElementById("qtyChips");
  const paperSeg = document.getElementById("paperSeg");
  const finishBox = document.getElementById("finishBox");
  const out = {
    unit: document.getElementById("unitOut"),
    setup: document.getElementById("setupOut"),
    day: document.getElementById("dayOut"),
    total: document.getElementById("totalOut"),
    note: document.getElementById("noteOut"),
  };
  const money = (n) => Math.round(n).toLocaleString("vi-VN") + "₫";
  const state = { key: "flyer", qty: 1000, paper: 0 };

  Object.entries(P).forEach(([k, p]) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = p.name;
    productSel.appendChild(o);
  });

  function build() {
    const p = P[state.key];
    productSel.value = state.key;
    if (!p.qty.includes(state.qty)) state.qty = p.qty[p.def];
    state.paper = 0;

    qtyChips.innerHTML = "";
    p.qty.forEach((q) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = q.toLocaleString("vi-VN") + " " + p.unitLabel;
      b.classList.toggle("on", q === state.qty);
      b.addEventListener("click", () => {
        state.qty = q;
        qtyChips.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
        calc();
      });
      qtyChips.appendChild(b);
    });

    paperSeg.innerHTML = p.paper
      .map((pp, i) => `<label><input type="radio" name="paper" value="${i}" ${i === 0 ? "checked" : ""}/><span>${pp[0]}</span></label>`)
      .join("");
    finishBox.innerHTML = p.finish
      .map((f, i) => `<label><input type="checkbox" name="finish" value="${i}"/><span>${f[0]}<small>${f[1]}</small></span></label>`)
      .join("");
    calc();
  }

  function calc() {
    const p = P[state.key];
    const paperIdx = Number((paperSeg.querySelector("input:checked") || {}).value || 0);
    const rush = document.querySelector('input[name="speed"]:checked').value === "rush";
    let pct = 0;
    let fixed = 0;
    finishBox.querySelectorAll("input:checked").forEach((c) => {
      const f = p.finish[Number(c.value)];
      pct += f[2];
      fixed += f[3];
    });
    const unit = p.unit * p.paper[paperIdx][1] * (1 + pct);
    const setup = p.setup + fixed;
    let total = unit * state.qty + setup;
    if (rush) total *= 1.3;
    total = Math.round(total / 1000) * 1000;

    out.unit.textContent = money(unit) + " / " + p.unitLabel;
    out.setup.textContent = setup ? money(setup) : "Miễn phí";
    out.day.textContent = rush ? p.rushDays : p.days === 1 ? "Trong ngày" : `Sau ${p.days} ngày làm việc`;
    out.total.textContent = money(total);
    const per = money(total / state.qty);
    out.note.textContent = `Tính ra ${per} một ${p.unitLabel}. Chưa gồm VAT 8%. ` +
      (total >= 3000000 ? "Được miễn phí giao nội thành TP.HCM." : "Phí giao nội thành từ 30.000₫.");
    state.summary = `${state.qty.toLocaleString("vi-VN")} ${p.unitLabel} ${p.name.toLowerCase()}, ${p.paper[paperIdx][0]}` +
      (rush ? ", in gấp" : "") + ` · tạm tính ${money(total)}`;
  }

  productSel.addEventListener("change", () => { state.key = productSel.value; build(); });
  document.getElementById("calc").addEventListener("change", (e) => {
    if (e.target !== productSel) calc();
  });
  document.getElementById("calc").addEventListener("submit", (e) => e.preventDefault());

  document.querySelectorAll(".pick").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.key = btn.dataset.product;
      build();
      document.getElementById("bao-gia").scrollIntoView({ behavior: "smooth" });
    })
  );

  document.getElementById("toOrder").addEventListener("click", () => {
    document.getElementById("needInput").value = state.summary;
    document.getElementById("lien-he").scrollIntoView({ behavior: "smooth" });
  });

  build();

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const run = (el) => {
    const end = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1200;
    const step = (t) => {
      const k = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString("vi-VN") + (k === 1 && end >= 1000 ? "+" : "");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = Number(c.dataset.count).toLocaleString("vi-VN")));
  }

  /* ---------- Order form ---------- */
  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName");
  fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files.length ? "Đã chọn: " + fileInput.files[0].name : "Đính kèm file thiết kế (PDF, AI, PSD)";
  });

  const form = document.getElementById("orderForm");
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    if (!name || phone.replace(/\D/g, "").length < 9) {
      msg.hidden = false;
      msg.style.background = "rgba(209,0,111,.08)";
      msg.style.color = "#a80059";
      msg.textContent = "Bạn vui lòng nhập họ tên và số điện thoại hợp lệ để xưởng gọi lại nhé.";
      return;
    }
    msg.hidden = false;
    msg.style.background = "";
    msg.style.color = "";
    msg.textContent = `Cảm ơn ${name}! Đây là bản demo, yêu cầu chưa được gửi đi. Trên website thật, kỹ thuật viên sẽ gọi lại số ${phone} trong 30 phút.`;
    form.reset();
    fileName.textContent = "Đính kèm file thiết kế (PDF, AI, PSD)";
  });
})();
