(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const vnd = (n) => Math.round(n).toLocaleString("vi-VN") + "₫";

  const CATS = [
    { id: "all", name: "Tất cả" },
    { id: "la", name: "Rau lá" },
    { id: "cu", name: "Củ quả" },
    { id: "trai", name: "Trái cây" },
    { id: "kho", name: "Trứng & đồ khô" },
  ];

  const PRODUCTS = [
    { id: "xalach", cat: "la", name: "Xà lách thủy canh", unit: "300g", price: 32000, from: "Đức Trọng, Lâm Đồng", art: "leaf", c: ["#8fd16a", "#e7f6d8"], change: 0 },
    { id: "caingot", cat: "la", name: "Cải ngọt", unit: "500g", price: 18000, from: "Củ Chi, TP.HCM", art: "leaf", c: ["#3f9a46", "#e2f2dc"], change: -2000 },
    { id: "raumuong", cat: "la", name: "Rau muống", unit: "bó 500g", price: 15000, from: "Củ Chi, TP.HCM", art: "stem", c: ["#4caf50", "#e4f4df"], change: 0 },
    { id: "boxoi", cat: "la", name: "Cải bó xôi", unit: "300g", price: 38000, from: "Đơn Dương, Lâm Đồng", art: "leaf", c: ["#2d7a35", "#dfefd9"], change: 0, isNew: true },
    { id: "carot", cat: "cu", name: "Cà rốt Đà Lạt", unit: "1kg", price: 28000, from: "Đơn Dương, Lâm Đồng", art: "root", c: ["#f28a1e", "#fff0dc"], change: -3000 },
    { id: "khoaitay", cat: "cu", name: "Khoai tây vàng", unit: "1kg", price: 35000, from: "Đức Trọng, Lâm Đồng", art: "potato", c: ["#e3b85a", "#fbf2dc"], change: 0 },
    { id: "cuden", cat: "cu", name: "Củ dền đỏ", unit: "1kg", price: 30000, from: "Đà Lạt, Lâm Đồng", art: "round", c: ["#8e2a4f", "#f7e3ea"], change: 2000 },
    { id: "bido", cat: "cu", name: "Bí đỏ hồ lô", unit: "1kg", price: 26000, from: "Củ Chi, TP.HCM", art: "round", c: ["#f0a019", "#fff3d6"], change: 0 },
    { id: "catim", cat: "cu", name: "Cà tím", unit: "500g", price: 24000, from: "Hóc Môn, TP.HCM", art: "long", c: ["#5d2e83", "#efe5f6"], change: 0 },
    { id: "cherry", cat: "trai", name: "Cà chua cherry", unit: "hộp 500g", price: 42000, from: "Đà Lạt, Lâm Đồng", art: "berries", c: ["#e8452c", "#fde6e1"], change: -4000 },
    { id: "bo", cat: "trai", name: "Bơ sáp 034", unit: "1kg", price: 65000, from: "Lâm Hà, Lâm Đồng", art: "pear", c: ["#5f8f2c", "#ebf3dc"], change: 0, isNew: true },
    { id: "man", cat: "trai", name: "Mận hậu Mộc Châu", unit: "1kg", price: 55000, from: "Mộc Châu, Sơn La", art: "round", c: ["#a3324a", "#f9e3e8"], change: 0 },
    { id: "dau", cat: "trai", name: "Dâu tây Đà Lạt", unit: "hộp 500g", price: 95000, from: "Đà Lạt, Lâm Đồng", art: "berries", c: ["#d92f45", "#fde3e6"], change: 5000 },
    { id: "trung", cat: "kho", name: "Trứng gà thả vườn", unit: "10 quả", price: 45000, from: "Ba Vì, Hà Nội", art: "egg", c: ["#d9a066", "#fbefe1"], change: 0 },
    { id: "gao", cat: "kho", name: "Gạo ST25 hữu cơ", unit: "2kg", price: 78000, from: "Sóc Trăng", art: "grain", c: ["#c9a24a", "#f8f1dd"], change: 0 },
    { id: "dieu", cat: "kho", name: "Hạt điều rang muối", unit: "250g", price: 89000, from: "Bình Phước", art: "grain", c: ["#b5793a", "#f6eadb"], change: 0 },
  ];

  const PRESETS = [
    { name: "Rổ 2 người", note: "đủ 1 tuần", items: { xalach: 1, caingot: 1, raumuong: 1, carot: 1, khoaitay: 1, bido: 1, cherry: 1, trung: 1, man: 1 } },
    { name: "Rổ 4 người", note: "đủ 1 tuần", items: { xalach: 2, caingot: 2, raumuong: 2, carot: 1, khoaitay: 1, cuden: 1, bido: 1, catim: 1, cherry: 1, trung: 2, man: 1 } },
    { name: "Rổ ăn dặm", note: "cho bé 6–24 tháng", items: { boxoi: 1, carot: 1, khoaitay: 1, bido: 1, bo: 1, trung: 1 } },
  ];

  const cart = {};
  let cat = "all";

  /* ---------- SVG art ---------- */
  function art(p) {
    const [c] = p.c;
    const g = "#3f9a46";
    switch (p.art) {
      case "leaf":
        return `<svg viewBox="0 0 80 80"><path d="M40 70C18 66 10 46 16 30c8 4 14 12 16 22 0-16 2-30 8-40 6 10 8 24 8 40 2-10 8-18 16-22 6 16-2 36-24 40z" fill="${c}"/><path d="M40 70V22M40 50l-10-10M40 44l10-10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>`;
      case "stem":
        return `<svg viewBox="0 0 80 80"><g stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M28 72V30M40 72V20M52 72V28"/></g><g fill="${c}"><path d="M28 34c-10-2-14-10-12-18 8 2 12 8 12 18z"/><path d="M40 24c8-4 16-2 20 4-8 4-16 2-20-4z"/><path d="M52 32c10-2 14-10 12-18-8 2-12 8-12 18z"/></g><rect x="24" y="54" width="32" height="7" rx="3" fill="#c9a24a"/></svg>`;
      case "root":
        return `<svg viewBox="0 0 80 80"><path d="M30 24h20l-8 50c-1 3-3 3-4 0z" fill="${c}"/><path d="M33 34h8M35 46h6M37 58h4" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/><path d="M40 24c-4-8-10-12-16-12 2 6 8 10 16 12zM40 24c0-8 2-14 6-18 2 6 0 12-6 18zM40 24c4-6 10-10 16-10-2 6-8 10-16 10z" fill="${g}"/></svg>`;
      case "potato":
        return `<svg viewBox="0 0 80 80"><ellipse cx="34" cy="46" rx="22" ry="16" fill="${c}" transform="rotate(-15 34 46)"/><ellipse cx="54" cy="52" rx="14" ry="11" fill="${c}" opacity=".85"/><g fill="#a87b2c" opacity=".6"><circle cx="26" cy="42" r="1.8"/><circle cx="38" cy="50" r="1.6"/><circle cx="34" cy="38" r="1.4"/><circle cx="56" cy="50" r="1.4"/></g></svg>`;
      case "round":
        return `<svg viewBox="0 0 80 80"><circle cx="40" cy="46" r="24" fill="${c}"/><ellipse cx="32" cy="38" rx="7" ry="5" fill="#fff" opacity=".25"/><path d="M40 22c0-6 2-10 4-12" stroke="#6b4a2a" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M42 18c6-6 14-6 18-2-6 5-12 5-18 2z" fill="${g}"/></svg>`;
      case "long":
        return `<svg viewBox="0 0 80 80"><path d="M22 30c8-8 22-4 34 10 10 12 10 24 2 28s-22-2-32-16c-8-10-10-16-4-22z" fill="${c}"/><path d="M16 24c4-2 10 0 12 4-4 4-10 2-12-4z" fill="${g}"/><path d="M30 38c6 2 12 8 16 14" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".3" fill="none"/></svg>`;
      case "berries":
        return `<svg viewBox="0 0 80 80"><g fill="${c}"><circle cx="28" cy="50" r="12"/><circle cx="50" cy="52" r="12"/><circle cx="40" cy="34" r="12"/></g><g fill="#fff" opacity=".3"><circle cx="24" cy="46" r="3"/><circle cx="46" cy="48" r="3"/><circle cx="36" cy="30" r="3"/></g><path d="M40 22l-4-6M40 22l5-6" stroke="${g}" stroke-width="3" stroke-linecap="round"/></svg>`;
      case "pear":
        return `<svg viewBox="0 0 80 80"><path d="M40 14c8 0 10 10 12 20 2 8 10 12 10 22 0 12-10 18-22 18S18 68 18 56c0-10 8-14 10-22 2-10 4-20 12-20z" fill="${c}"/><circle cx="40" cy="54" r="10" fill="#c7a46a"/><circle cx="40" cy="54" r="6" fill="#8a5a2b"/></svg>`;
      case "egg":
        return `<svg viewBox="0 0 80 80"><ellipse cx="30" cy="46" rx="14" ry="18" fill="${c}"/><ellipse cx="52" cy="50" rx="13" ry="16" fill="#f1d3ad"/><ellipse cx="26" cy="40" rx="4" ry="6" fill="#fff" opacity=".35"/></svg>`;
      default:
        return `<svg viewBox="0 0 80 80"><path d="M14 62c4-16 14-26 26-26s22 10 26 26z" fill="${c}"/><g fill="#fff" opacity=".45"><ellipse cx="30" cy="50" rx="3" ry="2"/><ellipse cx="42" cy="46" rx="3" ry="2"/><ellipse cx="52" cy="54" rx="3" ry="2"/><ellipse cx="38" cy="56" rx="3" ry="2"/></g><rect x="12" y="60" width="56" height="6" rx="3" fill="#8a6a3a"/></svg>`;
    }
  }

  /* ---------- Ticker ---------- */
  const tickerHtml = PRODUCTS.map((p) => {
    const ch = p.change < 0 ? `<i class="down">giảm ${vnd(-p.change)}</i>` : p.change > 0 ? `<i>tăng ${vnd(p.change)}</i>` : `<i>giữ giá</i>`;
    return `<span class="ticker-item">${p.name} <b>${vnd(p.price)}/${p.unit}</b> ${ch}</span>`;
  }).join("");
  $("#ticker").innerHTML = tickerHtml + tickerHtml;

  /* ---------- Filters & products ---------- */
  const chipsEl = $("#chips");
  chipsEl.innerHTML = CATS.map((c) => `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="${c.id === cat}">${c.name}</button>`).join("");
  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    cat = b.dataset.cat;
    chipsEl.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-selected", x === b));
    renderProducts();
  });

  const productsEl = $("#products");
  function renderProducts() {
    const list = PRODUCTS.filter((p) => cat === "all" || p.cat === cat);
    productsEl.innerHTML = list.map((p) => {
      const q = cart[p.id] || 0;
      return `<article class="card${q ? " in" : ""}" data-id="${p.id}">
        <div class="art" style="background:${p.c[1]}">${art(p)}</div>
        ${p.isNew ? '<span class="tag-new">Mới về</span>' : ""}
        <div><h3>${p.name}</h3><div class="origin-tag">${p.from}</div></div>
        <div class="row">
          <div class="price">${vnd(p.price)} <small>/ ${p.unit}</small></div>
          <div class="stepper">
            <button type="button" data-act="dec" aria-label="Bớt ${p.name}">−</button>
            <span>${q}</span>
            <button type="button" data-act="inc" aria-label="Thêm ${p.name}">+</button>
          </div>
        </div>
      </article>`;
    }).join("");
  }
  productsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const id = b.closest(".card").dataset.id;
    const q = (cart[id] || 0) + (b.dataset.act === "inc" ? 1 : -1);
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 20);
    update();
  });

  /* ---------- Presets ---------- */
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const presetTotal = (pr) => Object.entries(pr.items).reduce((s, [id, q]) => s + byId[id].price * q, 0);
  $("#presets").innerHTML = PRESETS.map((pr, i) =>
    `<button class="preset" type="button" data-i="${i}"><b>${pr.name}</b><small>${pr.note} · ${vnd(presetTotal(pr))}</small></button>`).join("");
  $("#presets").addEventListener("click", (e) => {
    const b = e.target.closest(".preset");
    if (!b) return;
    const pr = PRESETS[b.dataset.i];
    Object.keys(cart).forEach((k) => delete cart[k]);
    Object.assign(cart, pr.items);
    update();
    toast(`Đã chọn ${pr.name}. Bạn có thể thêm bớt từng món.`);
  });
  $("#clear").addEventListener("click", () => { Object.keys(cart).forEach((k) => delete cart[k]); update(); });

  /* ---------- Delivery days ---------- */
  const DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const days = [];
  const d = new Date();
  while (days.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d));
  }
  let dayIdx = 0;
  const daysEl = $("#days");
  const renderDays = () => {
    daysEl.innerHTML = days.map((x, i) =>
      `<button class="day" type="button" data-i="${i}" aria-pressed="${i === dayIdx}">${DOW[x.getDay()]}<b>${x.getDate()}</b></button>`).join("");
  };
  daysEl.addEventListener("click", (e) => {
    const b = e.target.closest(".day");
    if (!b) return;
    dayIdx = +b.dataset.i;
    renderDays();
  });
  renderDays();

  /* ---------- Summary ---------- */
  const FREE = 300000, FEE = 25000;
  document.querySelectorAll('input[name="freq"]').forEach((r) => r.addEventListener("change", update));

  function calc() {
    const sub = Object.entries(cart).reduce((s, [id, q]) => s + byId[id].price * q, 0);
    const weekly = $('input[name="freq"]:checked').value === "weekly";
    const disc = weekly ? Math.round(sub * 0.1 / 1000) * 1000 : 0;
    const after = sub - disc;
    const fee = sub === 0 || after >= FREE ? 0 : FEE;
    return { sub, disc, fee, total: after + fee, after, weekly };
  }

  function update() {
    renderProducts();
    const ids = Object.keys(cart);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    $("#lines").innerHTML = ids.length
      ? ids.map((id) => `<li><span>${cart[id]} × ${byId[id].name}</span><span>${vnd(byId[id].price * cart[id])}</span></li>`).join("")
      : `<li class="empty">Rổ đang trống. Chọn rau củ bên trái nhé.</li>`;
    const t = calc();
    $("#sub").textContent = vnd(t.sub);
    $("#disc").textContent = t.disc ? "−" + vnd(t.disc) : "0₫";
    $("#fee").textContent = t.sub === 0 ? "—" : t.fee ? vnd(t.fee) : "Miễn phí";
    $("#total").textContent = vnd(t.total);
    const pct = Math.min(100, (t.after / FREE) * 100);
    $("#shipFill").style.width = pct + "%";
    $("#shipText").textContent = t.after >= FREE
      ? "Rổ của bạn được miễn phí giao hàng."
      : `Thêm ${vnd(FREE - t.after)} để được miễn phí giao`;
    const btn = $(".basket-btn");
    if ($("#count").textContent !== String(count)) {
      btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    }
    $("#count").textContent = count;
  }

  $("#orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("#orderMsg");
    const t = calc();
    if (!t.sub) {
      msg.className = "note err";
      msg.textContent = "Rổ đang trống, bạn chọn vài món trước nhé.";
      return;
    }
    const name = e.target.elements.namedItem("name").value.trim();
    const day = days[dayIdx];
    msg.className = "note";
    msg.textContent = `Cảm ơn ${name}! Rổ ${vnd(t.total)} sẽ giao ${DOW[day.getDay()]} ngày ${day.getDate()}/${day.getMonth() + 1}${t.weekly ? ", lặp lại mỗi tuần" : ""}. Rổ Xanh sẽ gọi xác nhận trong 15 phút.`;
    toast("Đã nhận đơn (bản demo).");
    e.target.reset();
    $('input[name="freq"][value="' + (t.weekly ? "weekly" : "once") + '"]').checked = true;
  });

  /* ---------- Traceability ---------- */
  const LOTS = {
    "RX-1109-DT": {
      item: "Xà lách thủy canh", farm: "Nông trại Lá Xanh, Đức Trọng, Lâm Đồng", cert: "VietGAP số 112/2025",
      steps: [["16/10", "Gieo hạt trong nhà màng"], ["09/11 05:10", "Thu hoạch 240 kg"], ["09/11 07:40", "Test nhanh dư lượng: âm tính"], ["09/11 14:05", "Đóng rổ tại kho Thảo Điền"]],
    },
    "RX-1109-CC": {
      item: "Cải ngọt, rau muống", farm: "HTX Rau sạch Tân Phú Trung, Củ Chi", cert: "VietGAP số 087/2024",
      steps: [["14/10", "Gieo hạt ngoài đồng, tưới nước giếng khoan"], ["09/11 05:00", "Thu hoạch 410 kg"], ["09/11 07:15", "Test nhanh dư lượng: âm tính"], ["09/11 13:30", "Đóng rổ tại kho Thảo Điền"]],
    },
    "RX-1108-MC": {
      item: "Mận hậu", farm: "Vườn mận nhà bác Thào, Mộc Châu, Sơn La", cert: "VietGAP số 041/2025",
      steps: [["08/11 06:00", "Hái chọn quả chín 80%"], ["08/11 10:00", "Test nhanh dư lượng: âm tính"], ["08/11 16:00", "Xe lạnh về TP.HCM"], ["09/11 13:00", "Nhập kho, đóng hộp"]],
    },
  };
  const traceForm = $("#traceForm");
  const codeInput = $("#code");
  const showLot = (raw) => {
    const code = raw.trim().toUpperCase().replace(/\s+/g, "");
    const lot = LOTS[code];
    const out = $("#traceResult");
    if (!code) { out.innerHTML = ""; return; }
    if (!lot) {
      out.innerHTML = `<p class="miss">Không tìm thấy mã ${code.replace(/[<>&"]/g, "")}. Mã gồm chữ RX, ngày giao và nơi trồng, ví dụ RX-1109-DT.</p>`;
      return;
    }
    out.innerHTML = `<div class="trace-card">
      <header><div><b>${lot.item}</b><div>${lot.farm}</div></div><span class="ok">${lot.cert}</span></header>
      <ol class="timeline">${lot.steps.map(([t, s]) => `<li><time>${t}</time>${s}</li>`).join("")}</ol>
    </div>`;
  };
  traceForm.addEventListener("submit", (e) => { e.preventDefault(); showLot(codeInput.value); });
  document.querySelectorAll(".try button").forEach((b) => b.addEventListener("click", () => {
    codeInput.value = b.dataset.code;
    showLot(b.dataset.code);
  }));

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const run = (el) => {
    const end = +el.dataset.count;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString("vi-VN");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    }), { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else counters.forEach(run);

  /* ---------- Toast ---------- */
  let tt;
  function toast(text) {
    const el = $("#toast");
    el.textContent = text;
    el.hidden = false;
    clearTimeout(tt);
    tt = setTimeout(() => (el.hidden = true), 2800);
  }

  update();
})();
