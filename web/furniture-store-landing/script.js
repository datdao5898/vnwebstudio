(() => {
  const vnd = (n) => n.toLocaleString("vi-VN") + "₫";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const WOODS = {
    tanbi: { n: "Tần bì", c: "#e6d2ab", d: "#bfa271", m2: 4200000, days: 18, janka: 1320, tone: "Vàng kem sáng, vân thẳng rõ", fit: "Phòng ngủ, nhà phong cách Bắc Âu" },
    soi: { n: "Sồi trắng", c: "#d3b07f", d: "#a98250", m2: 4900000, days: 18, janka: 1360, tone: "Nâu mật ong nhạt, vân núi", fit: "Bàn ăn, tủ bếp, nơi hay dính nước" },
    teak: { n: "Teak", c: "#b98447", d: "#8c5e2b", m2: 6400000, days: 21, janka: 1070, tone: "Nâu vàng, càng dùng càng sậm", fit: "Ban công, phòng tắm, nhà gần biển" },
    occho: { n: "Óc chó", c: "#7a5640", d: "#553827", m2: 9800000, days: 25, janka: 1010, tone: "Nâu sô-cô-la, vân xoáy", fit: "Phòng khách, bàn làm việc cao cấp" }
  };
  const ROOMS = { all: "Tất cả", an: "Phòng ăn", khach: "Phòng khách", ngu: "Phòng ngủ", lam: "Làm việc" };

  /* ---------- Hình vẽ sản phẩm ---------- */
  const ART = {
    table: (c, d) => `<rect x="22" y="56" width="156" height="10" rx="2" fill="${c}"/><path d="M40 66 32 126h9l9-60ZM160 66l8 60h-9l-9-60Z" fill="${d}"/><rect x="46" y="72" width="108" height="5" fill="${d}" opacity=".55"/>`,
    chair: (c, d) => `<path d="M78 24h44v8H78z" fill="${c}"/><path d="M78 24h6v60h-6zM116 24h6v60h-6z" fill="${d}"/><path d="M84 44h32v6H84z" fill="${c}"/><rect x="72" y="78" width="56" height="9" rx="3" fill="${c}"/><path d="M76 87h6l-3 39h-6ZM118 87h6l3 39h-6Z" fill="${d}"/>`,
    bench: (c, d) => `<rect x="30" y="84" width="140" height="9" rx="2" fill="${c}"/><path d="M42 93h10l-3 33h-9ZM148 93h10l2 33h-9Z" fill="${d}"/><rect x="50" y="104" width="100" height="4" fill="${d}" opacity=".55"/>`,
    tv: (c, d) => `<rect x="20" y="66" width="160" height="44" rx="3" fill="${c}"/><path d="M73 66v44M127 66v44" stroke="${d}" stroke-width="2"/><path d="M20 88h53M127 88h53" stroke="${d}" stroke-width="2"/><circle cx="100" cy="88" r="2.5" fill="${d}"/><path d="M34 110h7l-2 16h-4ZM159 110h7l-1 16h-4Z" fill="${d}"/>`,
    coffee: (c, d) => `<rect x="34" y="80" width="132" height="9" rx="2" fill="${c}"/><path d="M42 89h8v37h-8ZM150 89h8v37h-8Z" fill="${d}"/><rect x="50" y="108" width="100" height="6" fill="${c}"/>`,
    bed: (c, d) => `<rect x="24" y="34" width="152" height="56" rx="6" fill="${c}"/><path d="M62 34v50M100 34v50M138 34v50" stroke="${d}" stroke-width="1.5" opacity=".6"/><rect x="18" y="72" width="164" height="26" rx="6" fill="#f4f2ec" stroke="#d9d6cc"/><rect x="30" y="66" width="46" height="14" rx="6" fill="#fff" stroke="#d9d6cc"/><rect x="124" y="66" width="46" height="14" rx="6" fill="#fff" stroke="#d9d6cc"/><rect x="14" y="96" width="172" height="16" rx="3" fill="${c}"/><path d="M22 112h8v14h-8ZM170 112h8v14h-8Z" fill="${d}"/>`,
    wardrobe: (c, d) => `<rect x="46" y="10" width="108" height="112" rx="3" fill="${c}"/><path d="M82 10v112M118 10v112" stroke="${d}" stroke-width="2"/><path d="M76 58v18M88 58v18M112 58v18M124 58v18" stroke="${d}" stroke-width="3" stroke-linecap="round"/><rect x="46" y="122" width="108" height="4" fill="${d}"/>`,
    night: (c, d) => `<rect x="66" y="62" width="68" height="50" rx="3" fill="${c}"/><path d="M66 87h68" stroke="${d}" stroke-width="2"/><path d="M92 75h16M92 99h16" stroke="${d}" stroke-width="3" stroke-linecap="round"/><path d="M72 112h6v14h-6ZM122 112h6v14h-6Z" fill="${d}"/>`,
    desk: (c, d) => `<rect x="24" y="58" width="152" height="9" rx="2" fill="${c}"/><rect x="118" y="67" width="50" height="34" fill="${c}"/><path d="M118 84h50" stroke="${d}" stroke-width="2"/><path d="M136 76h14M136 93h14" stroke="${d}" stroke-width="2.5" stroke-linecap="round"/><path d="M32 67h7v59h-7ZM161 101h7v25h-7Z" fill="${d}"/>`,
    shelf: (c, d) => `<path d="M58 12h7v114h-7ZM135 12h7v114h-7Z" fill="${d}"/><path d="M58 12h84v6H58ZM58 40h84v6H58ZM58 68h84v6H58ZM58 96h84v6H58Z" fill="${c}"/><rect x="72" y="24" width="6" height="16" fill="#3f6650"/><rect x="80" y="20" width="7" height="20" fill="#84561f"/><rect x="89" y="26" width="5" height="14" fill="#c8995a"/><rect x="108" y="54" width="20" height="14" rx="7" fill="#3f6650" opacity=".8"/><rect x="74" y="84" width="24" height="12" fill="#d6dcd1"/>`
  };
  const art = (type, wood) => `<svg viewBox="0 0 200 140" aria-hidden="true"><ellipse cx="100" cy="127" rx="78" ry="4" fill="#1c2620" opacity=".08"/>${ART[type](WOODS[wood].c, WOODS[wood].d)}</svg>`;

  /* ---------- Danh sách sản phẩm ---------- */
  const PRODUCTS = [
    { n: "Bàn ăn “Nắng Sớm” 1m8", room: "an", wood: "soi", p: 12900000, size: "180 × 85 × 75 cm · 6 chỗ", art: "table", tag: "Bán chạy" },
    { n: "Ghế ăn nan cong “Lá Me”", room: "an", wood: "tanbi", p: 1950000, size: "Mặt đan dây cói · chịu tải 120 kg", art: "chair" },
    { n: "Băng ghế dài 1m5", room: "an", wood: "soi", p: 3200000, size: "150 × 35 × 45 cm · 3 chỗ", art: "bench" },
    { n: "Kệ tivi “Phố Cũ” 1m8", room: "khach", wood: "occho", p: 14800000, size: "180 × 40 × 52 cm · 2 hộc, 2 ngăn", art: "tv", tag: "Mới về" },
    { n: "Bàn trà hai tầng", room: "khach", wood: "teak", p: 5600000, size: "110 × 60 × 42 cm", art: "coffee" },
    { n: "Kệ sách 4 tầng “Chữ”", room: "khach", wood: "tanbi", p: 7200000, size: "90 × 32 × 180 cm · tải 30 kg mỗi tầng", art: "shelf" },
    { n: "Giường “Giấc Trưa” 1m8", room: "ngu", wood: "tanbi", p: 16500000, size: "180 × 200 cm · 2 hộc kéo", art: "bed", tag: "Bán chạy" },
    { n: "Tủ áo 3 cánh cao 2m2", room: "ngu", wood: "soi", p: 21900000, size: "150 × 58 × 220 cm · bản lề giảm chấn", art: "wardrobe" },
    { n: "Tab đầu giường 2 ngăn", room: "ngu", wood: "tanbi", p: 2300000, size: "45 × 40 × 50 cm", art: "night" },
    { n: "Bàn làm việc “Tĩnh” 1m4", room: "lam", wood: "occho", p: 11400000, size: "140 × 65 × 75 cm · 2 hộc, lỗ đi dây", art: "desk" },
    { n: "Bàn làm việc Sồi 1m2", room: "lam", wood: "soi", p: 6900000, size: "120 × 60 × 75 cm · 2 hộc", art: "desk" },
    { n: "Bàn ăn tròn Teak 1m2", room: "an", wood: "teak", p: 10800000, size: "Đường kính 120 cm · 4–5 chỗ", art: "table" }
  ];
  const filter = { room: "all", wood: "all", sort: "pop" };
  const grid = $("#grid");
  const roomChips = $("#roomChips");
  const woodChips = $("#woodChips");

  roomChips.innerHTML = Object.entries(ROOMS).map(([k, v]) => `<button type="button" data-room="${k}" aria-pressed="${k === "all"}">${v}</button>`).join("");
  woodChips.innerHTML = Object.entries(WOODS).map(([k, w]) => `<button type="button" data-wood="${k}" aria-pressed="false"><i style="--c:${w.c}"></i>${w.n}</button>`).join("");

  const renderGrid = () => {
    let list = PRODUCTS.filter((p) => (filter.room === "all" || p.room === filter.room) && (filter.wood === "all" || p.wood === filter.wood));
    if (filter.sort === "asc") list = [...list].sort((a, b) => a.p - b.p);
    if (filter.sort === "desc") list = [...list].sort((a, b) => b.p - a.p);
    $("#resultCount").textContent = list.length ? `Đang hiện ${list.length} trên ${PRODUCTS.length} mẫu` : "";
    grid.innerHTML = list.length ? list.map((p, i) => `
      <article class="card" style="animation-delay:${i * 35}ms">
        <div class="art">${art(p.art, p.wood)}${p.tag ? `<span class="tag">${p.tag}</span>` : ""}</div>
        <div class="body">
          <div class="meta">${ROOMS[p.room]} · ${WOODS[p.wood].n}</div>
          <h3>${p.n}</h3>
          <p class="size">${p.size}</p>
          <div class="row"><span class="price">${vnd(p.p)}</span><button type="button" class="mini" data-pick="${p.n.replace(/"/g, "")}">Hẹn xem</button></div>
        </div>
      </article>`).join("") : `<p class="empty">Chưa có mẫu sẵn cho lựa chọn này. Vân Sồi nhận đóng riêng theo yêu cầu, bạn để lại lịch hẹn bên dưới nhé.</p>`;
  };
  roomChips.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    filter.room = b.dataset.room;
    $$("button", roomChips).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderGrid();
  });
  woodChips.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    filter.wood = filter.wood === b.dataset.wood ? "all" : b.dataset.wood;
    $$("button", woodChips).forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.wood === filter.wood)));
    renderGrid();
  });
  $("#sort").addEventListener("change", (e) => { filter.sort = e.target.value; renderGrid(); });
  renderGrid();

  const note = $("#note");
  const interest = $("#interest");
  const goBook = () => $("#hen-xem").scrollIntoView({ behavior: "smooth" });
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    note.value = `Muốn xem mẫu: ${b.dataset.pick}`;
    goBook();
  });
  $$("[data-interest]").forEach((a) => a.addEventListener("click", () => {
    interest.value = "Đóng trọn bộ cho cả nhà";
    note.value = `Muốn xem: ${a.dataset.interest}`;
  }));

  /* ---------- Cấu hình bàn ăn ---------- */
  const cfg = { wood: "soi", len: 180, wid: 85, thick: 4, leg: "a", finish: "oil" };
  const THICK = { 3: [0.85, 10], 4: [1, 14], 5: [1.18, 18] };
  const LEGS = { a: ["Chân khung gỗ chữ A", 1900000], u: ["Chân sắt hộp chữ U sơn tĩnh điện", 1400000], tru: ["Bốn chân trụ gỗ nguyên khối", 2600000] };
  const FINISH = { oil: ["Dầu lau gốc thực vật, 3 lớp", 0], pu: ["PU mờ chống nước", 600000] };
  const CHAIR = 1950000;
  const seatsFor = (len) => (len < 140 ? 4 : len < 170 ? 6 : len < 210 ? 8 : 10);

  const woodPick = $("#woodPick");
  woodPick.innerHTML = Object.entries(WOODS).map(([k, w]) => `
    <button type="button" role="radio" data-v="${k}" aria-checked="false">
      <span class="sw" style="--c:${w.c}"></span>
      <span><b>${w.n}</b><small>${(w.m2 / 1e6).toLocaleString("vi-VN")} triệu/m²</small></span>
    </button>`).join("");

  const svg = $("#tableSvg");
  const drawTable = () => {
    const W = WOODS[cfg.wood];
    const w = 190 + ((cfg.len - 120) / 120) * 250;
    const x = 260 - w / 2;
    const t = THICK[cfg.thick][1];
    const y = 92, floor = 226, top = y + t;
    const inset = Math.max(18, w * 0.09);
    const a = x + inset, b = x + w - inset;
    let legs = "";
    if (cfg.leg === "a") {
      legs = `<path d="M${a} ${top + 5} L${a - 10} ${floor - 6} L${a + 46} ${floor - 6} L${a + 36} ${top + 5} Z" fill="none" stroke="${W.d}" stroke-width="12" stroke-linejoin="round"/>
              <path d="M${b} ${top + 5} L${b + 10} ${floor - 6} L${b - 46} ${floor - 6} L${b - 36} ${top + 5} Z" fill="none" stroke="${W.d}" stroke-width="12" stroke-linejoin="round"/>`;
    } else if (cfg.leg === "u") {
      legs = `<rect x="${a - 4}" y="${top + 3}" width="44" height="${floor - top - 6}" fill="none" stroke="#2a302c" stroke-width="7"/>
              <rect x="${b - 40}" y="${top + 3}" width="44" height="${floor - top - 6}" fill="none" stroke="#2a302c" stroke-width="7"/>`;
    } else {
      legs = `<path d="M${a - 6} ${top} h18 l-4 ${floor - top} h-10 Z" fill="${W.d}"/><path d="M${b + 6} ${top} h-18 l4 ${floor - top} h10 Z" fill="${W.d}"/>
              <rect x="${a + 10}" y="${top}" width="${b - a - 20}" height="9" fill="${W.d}" opacity=".6"/>`;
    }
    const grain = [0.3, 0.62].map((k) => `<path d="M${x + 6} ${y + t * k} H${x + w - 6}" stroke="${W.d}" stroke-width="1" opacity=".45"/>`).join("");
    // mặt bằng nhìn từ trên xuống
    const ph = 36 + ((cfg.wid - 70) / 30) * 18;
    const py = 322 - ph / 2;
    const seats = seatsFor(cfg.len);
    const perSide = seats >= 8 ? (seats - 2) / 2 : seats / 2;
    let chairs = "";
    for (let i = 0; i < perSide; i++) {
      const cx = x + (w / perSide) * (i + 0.5) - 15;
      chairs += `<rect x="${cx}" y="${py - 17}" width="30" height="12" rx="5"/><rect x="${cx}" y="${py + ph + 5}" width="30" height="12" rx="5"/>`;
    }
    if (seats >= 8) chairs += `<rect x="${x - 17}" y="${322 - 15}" width="12" height="30" rx="5"/><rect x="${x + w + 5}" y="${322 - 15}" width="12" height="30" rx="5"/>`;
    const planks = [1, 2, 3].map((k) => `<path d="M${x + 4} ${py + (ph / 4) * k} H${x + w - 4}" stroke="${W.d}" stroke-width="1" opacity=".4"/>`).join("");
    svg.innerHTML = `
      <g font-family="Commissioner, sans-serif" font-size="13" font-weight="600" fill="#1c2620">
        <path d="M${x} 58 H${x + w} M${x} 52 v12 M${x + w} 52 v12" stroke="#2e4a3a" stroke-width="1.5" fill="none"/>
        <rect x="${260 - 34}" y="46" width="68" height="24" rx="12" fill="#2e4a3a"/>
        <text x="260" y="63" text-anchor="middle" fill="#fff">${cfg.len} cm</text>
        <text x="20" y="30" fill="#5a675e" font-weight="500">Nhìn ngang</text>
        <text x="20" y="276" fill="#5a675e" font-weight="500">Nhìn từ trên · rộng ${cfg.wid} cm</text>
      </g>
      <path d="M24 ${floor} H496" stroke="#b9c2b5" stroke-width="2"/>
      ${legs}
      <rect x="${x}" y="${y}" width="${w}" height="${t}" rx="2.5" fill="${W.c}"/>${grain}
      <g fill="#c3ccbf">${chairs}</g>
      <rect x="${x}" y="${py}" width="${w}" height="${ph}" rx="4" fill="${W.c}"/>${planks}`;
  };

  const calcQuote = () => {
    const W = WOODS[cfg.wood];
    const area = (cfg.len * cfg.wid) / 10000;
    const topPrice = Math.round((area * W.m2 * THICK[cfg.thick][0]) / 10000) * 10000;
    const seats = seatsFor(cfg.len);
    const lines = [
      [`Mặt bàn ${W.n} ${cfg.len} × ${cfg.wid} cm, dày ${cfg.thick} cm`, topPrice],
      [LEGS[cfg.leg][0], LEGS[cfg.leg][1]],
      [FINISH[cfg.finish][0], FINISH[cfg.finish][1]]
    ];
    let total = topPrice + LEGS[cfg.leg][1] + FINISH[cfg.finish][1];
    if ($("#chairs").checked) { lines.push([`${seats} ghế ăn cùng tông gỗ`, seats * CHAIR]); total += seats * CHAIR; }
    lines.push(["Giao và lắp tại TP.HCM, Bình Dương", 0]);
    $("#quoteLines").innerHTML = lines.map(([t, v]) => `<li><span>${t}</span><span>${v ? vnd(v) : "Miễn phí"}</span></li>`).join("");
    $("#quoteTotal").textContent = vnd(total);
    $("#quoteNote").textContent = `Đặt cọc 30% là ${vnd(Math.round((total * 0.3) / 10000) * 10000)}. Xưởng hoàn thành sau khoảng ${W.days} ngày.`;
    $("#chairNote").textContent = `(${seats} ghế × ${vnd(CHAIR)})`;
    $("#vSeats").textContent = seats;
    $("#vDays").textContent = W.days;
    $("#lenOut").textContent = `${cfg.len} cm`;
    $("#widOut").textContent = `${cfg.wid} cm`;
    return total;
  };
  const sync = () => {
    $$("button", woodPick).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === cfg.wood)));
    [["thick", String(cfg.thick)], ["leg", cfg.leg], ["finish", cfg.finish]].forEach(([id, v]) =>
      $$("button", $("#" + id)).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === v))));
    drawTable();
    return calcQuote();
  };
  woodPick.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { cfg.wood = b.dataset.v; sync(); } });
  ["thick", "leg", "finish"].forEach((id) => $("#" + id).addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    cfg[id] = id === "thick" ? Number(b.dataset.v) : b.dataset.v;
    sync();
  }));
  $("#len").addEventListener("input", (e) => { cfg.len = Number(e.target.value); sync(); });
  $("#wid").addEventListener("input", (e) => { cfg.wid = Number(e.target.value); sync(); });
  $("#chairs").addEventListener("change", sync);
  sync();

  $("#sendConfig").addEventListener("click", () => {
    const total = sync();
    interest.value = "Bàn ăn đặt đóng theo kích thước";
    note.value = `Bàn ăn ${WOODS[cfg.wood].n} ${cfg.len} × ${cfg.wid} cm, mặt dày ${cfg.thick} cm, ${LEGS[cfg.leg][0].toLowerCase()}, ${FINISH[cfg.finish][0].toLowerCase()}${$("#chairs").checked ? `, kèm ${seatsFor(cfg.len)} ghế` : ""}. Tạm tính ${vnd(total)}.`;
  });

  /* ---------- Bảng chất gỗ ---------- */
  $("#woodList").innerHTML = Object.values(WOODS).map((w) => `
    <li>
      <span class="sw" style="--c:${w.c}"></span>
      <h3>${w.n}</h3>
      <span class="from">mặt bàn từ <b>${(w.m2 / 1e6).toLocaleString("vi-VN")} triệu/m²</b></span>
      <p>${w.tone}. Hợp với: ${w.fit.toLowerCase()}.</p>
      <div class="bar"><span>Độ cứng</span><i style="--v:${Math.round((w.janka / 1500) * 100)}%"></i><span>${w.janka.toLocaleString("vi-VN")} lbf</span></div>
    </li>`).join("");

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

  /* ---------- Hẹn xem mẫu ---------- */
  const form = $("#bookForm");
  const msg = $("#formMsg");
  const dateInput = $("#bookDate");
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = iso(new Date());
  dateInput.value = iso(tomorrow);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    const name = f["name"].value.trim();
    const phone = f["phone"].value.replace(/\D/g, "");
    f["name"].classList.toggle("err", !name);
    f["phone"].classList.toggle("err", phone.length < 9);
    msg.hidden = false;
    if (!name || phone.length < 9 || !dateInput.value) {
      msg.className = "form-msg bad";
      msg.textContent = "Vui lòng nhập họ tên, số điện thoại hợp lệ và chọn ngày đến.";
      return;
    }
    const [y, m, d] = dateInput.value.split("-");
    msg.className = "form-msg";
    msg.textContent = `Cảm ơn ${name}! Vân Sồi đã giữ lịch ${f["time"].value} ngày ${d}/${m}/${y} tại showroom Thảo Điền. Thợ tư vấn sẽ gọi xác nhận trong 30 phút. (Bản demo, chưa gửi dữ liệu.)`;
    form.reset();
    dateInput.value = iso(tomorrow);
  });
})();
