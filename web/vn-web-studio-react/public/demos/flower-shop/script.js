const fmt = n => n.toLocaleString("vi-VN") + "₫";
const FREE = 500000, SHIP = 35000;

const OCC = ["Tất cả", "Sinh nhật", "Tình yêu", "Khai trương", "Chúc mừng", "Chia buồn"];
const P = [
  { id: 1, name: "Sớm Mai", occ: "Sinh nhật", price: 450000, old: 520000, stems: "15 cành", mix: "Hồng Ecuador, cát tường", pal: ["#f4a6b8", "#fbd3dc", "#ffffff"], wrap: "#e9d8c4", badge: "Bán chạy", pop: 1 },
  { id: 2, name: "Đỏ Thắm", occ: "Tình yêu", price: 690000, stems: "20 cành", mix: "Hồng đỏ Pháp, lá bạc", pal: ["#c8243f", "#a51b33", "#e04a5f"], wrap: "#2b2b2b", pop: 2 },
  { id: 3, name: "Nắng Hạ", occ: "Chúc mừng", price: 380000, stems: "7 cành", mix: "Hướng dương, cúc tana", pal: ["#f6c234", "#f2a516", "#fff6c8"], wrap: "#d7c3a3", pop: 3 },
  { id: 4, name: "Khai Lộc", occ: "Khai trương", price: 1450000, stems: "Kệ 2 tầng", mix: "Đồng tiền, lan vũ nữ", pal: ["#f05a4f", "#f6b73c", "#ff8c5a"], wrap: "#8a5a3c", badge: "Kệ hoa", pop: 5 },
  { id: 5, name: "Tím Đà Lạt", occ: "Tình yêu", price: 420000, stems: "1 bó lớn", mix: "Cẩm tú cầu, thạch thảo", pal: ["#8f7ad1", "#b7a7ea", "#6e5bb8"], wrap: "#efe7f7", pop: 4 },
  { id: 6, name: "Trắng An", occ: "Chia buồn", price: 980000, stems: "Vòng hoa", mix: "Cúc trắng, ly trắng", pal: ["#ffffff", "#f1f1ec", "#e3e7df"], wrap: "#5f6b62", pop: 8 },
  { id: 7, name: "Đào Phai", occ: "Sinh nhật", price: 560000, stems: "12 cành", mix: "Mẫu đơn, hồng da", pal: ["#f7b29a", "#fbd0bf", "#f39a86"], wrap: "#f3ece2", badge: "Mới", pop: 6 },
  { id: 8, name: "Thanh Xuân", occ: "Chúc mừng", price: 320000, stems: "10 cành", mix: "Tulip trắng, baby", pal: ["#fafafa", "#ffd6e0", "#ffffff"], wrap: "#cfe0d4", pop: 7 },
];

/* procedural bouquet: seeded so each product always draws the same */
function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280 }
function bouquet(p, big) {
  const r = rng(p.id * 97 + 13), heads = big ? 9 : 7;
  let stems = "", leaves = "", flowers = "";
  const spots = [];
  for (let i = 0; i < heads; i++) {
    const a = -Math.PI / 2 + (i / (heads - 1) - .5) * 2.1 + (r() - .5) * .3;
    const d = 40 + r() * 38 * (i % 2 ? 1 : .55);
    spots.push([100 + Math.cos(a) * d * 1.05, 105 + Math.sin(a) * d * .9, 13 + r() * 8]);
  }
  spots.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of spots) stems += `<path d="M100 200 Q${(x + 100) / 2} ${y + 50} ${x} ${y}" stroke="#4d7a52" stroke-width="2" fill="none"/>`;
  for (let i = 0; i < 6; i++) {
    const x = 50 + r() * 100, y = 95 + r() * 40, rot = (x - 100) * 1.2 + (r() - .5) * 40;
    leaves += `<ellipse cx="${x}" cy="${y}" rx="7" ry="20" fill="${i % 2 ? "#5c8f5f" : "#3f6e48"}" transform="rotate(${rot} ${x} ${y})"/>`;
  }
  spots.forEach(([x, y, s], i) => {
    const c = p.pal[i % p.pal.length], n = 6 + (i % 3);
    let g = "";
    for (let k = 0; k < n; k++) g += `<ellipse cx="${x}" cy="${y - s * .5}" rx="${s * .42}" ry="${s * .62}" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width=".6" transform="rotate(${(360 / n) * k} ${x} ${y})"/>`;
    g += `<circle cx="${x}" cy="${y}" r="${s * .32}" fill="${p.pal[(i + 1) % p.pal.length]}" stroke="rgba(0,0,0,.12)" stroke-width=".6"/>`;
    flowers += g;
  });
  const wrap = `<path d="M55 128 L100 215 L145 128 L128 150 L100 138 L72 150 Z" fill="${p.wrap}"/><path d="M72 150 L100 138 L128 150 L100 215 Z" fill="rgba(0,0,0,.12)"/><path d="M86 176 q14 8 28 0 l-4 10 q-10 -4 -20 0z" fill="#c8385f"/>`;
  return `<svg viewBox="0 0 200 220" role="img" aria-label="Minh họa bó hoa ${p.name}">${leaves}${stems}${flowers}${wrap}</svg>`;
}

let occ = "Tất cả", sort = "pop", cart = {};
try { cart = JSON.parse(localStorage.getItem("moc-cart") || "{}") } catch (e) {}
const save = () => { try { localStorage.setItem("moc-cart", JSON.stringify(cart)) } catch (e) {} };
const $ = id => document.getElementById(id);

$("heroArt").insertAdjacentHTML("beforeend", bouquet(P[0], true));
$("chips").innerHTML = OCC.map(o => `<button class="chip" aria-pressed="${o === occ}" data-o="${o}">${o}</button>`).join("");
$("chips").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; occ = b.dataset.o; document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b)); renderGrid() };
$("sort").onchange = e => { sort = e.target.value; renderGrid() };

function renderGrid() {
  let list = P.filter(p => occ === "Tất cả" || p.occ === occ);
  list.sort((a, b) => sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : a.pop - b.pop);
  $("grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="art">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${bouquet(p)}</div>
      <div class="info">
        <span class="meta">${p.occ} · ${p.stems}</span>
        <h3>${p.name}</h3>
        <span class="meta">${p.mix}</span>
        <div class="row">
          <span class="price">${fmt(p.price)}${p.old ? `<s>${fmt(p.old)}</s>` : ""}</span>
          <button class="add" data-id="${p.id}">Thêm vào giỏ</button>
        </div>
      </div>
    </article>`).join("");
}
$("grid").onclick = e => {
  const b = e.target.closest(".add"); if (!b) return;
  const id = +b.dataset.id; cart[id] = (cart[id] || 0) + 1; save(); renderCart();
  b.textContent = "Đã thêm ✓"; b.classList.add("done");
  setTimeout(() => { b.textContent = "Thêm vào giỏ"; b.classList.remove("done") }, 1200);
  toast(`Đã thêm “${P.find(p => p.id === id).name}” vào giỏ`);
};

let placed = false;
function renderCart() {
  const ids = Object.keys(cart).filter(k => cart[k] > 0);
  const n = ids.reduce((s, k) => s + cart[k], 0);
  const sub = ids.reduce((s, k) => s + P.find(p => p.id == k).price * cart[k], 0);
  $("count").textContent = n;
  if (placed) return;
  $("items").innerHTML = ids.length ? ids.map(k => { const p = P.find(p => p.id == k); return `
    <div class="item"><div class="thumb">${bouquet(p)}</div>
      <div><div class="nm">${p.name}</div><div class="meta">${fmt(p.price)}</div>
        <div class="qty"><button data-d="-1" data-id="${k}" aria-label="Bớt">−</button><span>${cart[k]}</span><button data-d="1" data-id="${k}" aria-label="Thêm">+</button></div></div>
      <div class="price">${fmt(p.price * cart[k])}</div></div>` }).join("")
    : `<div class="empty">Giỏ đang trống.<br>Chọn một bó hoa để bắt đầu.</div>`;
  if (!ids.length) { $("checkout").innerHTML = ""; return }
  const ship = sub >= FREE ? 0 : SHIP;
  const today = new Date().toISOString().slice(0, 10);
  $("checkout").innerHTML = `
    <div class="ship">${ship ? `Thêm ${fmt(FREE - sub)} để được miễn phí giao` : "Đơn được miễn phí giao hàng"}</div>
    <div class="bar"><i style="width:${Math.min(100, sub / FREE * 100)}%"></i></div>
    <div class="tot"><span>Tổng (gồm ship ${ship ? fmt(ship) : "0₫"})</span><span>${fmt(sub + ship)}</span></div>
    <form class="order" id="order">
      <div class="two">
        <label>Người nhận<input id="f-name" required value="Chị Lan"></label>
        <label>Số điện thoại<input id="f-phone" required inputmode="tel" value="0912 345 678"></label>
      </div>
      <label>Địa chỉ giao<input id="f-addr" required value="45 Nguyễn Thị Minh Khai, Quận 1"></label>
      <div class="two">
        <label>Ngày giao<input id="f-date" type="date" min="${today}" value="${today}" required></label>
        <label>Khung giờ<select id="f-slot"><option>8h – 10h</option><option>10h – 12h</option><option selected>14h – 16h</option><option>16h – 18h</option><option>18h – 20h</option></select></label>
      </div>
      <label>Lời nhắn trên thiệp<textarea id="f-msg" rows="2">Chúc mừng sinh nhật, mãi rạng rỡ nhé!</textarea></label>
      <button class="btn primary" type="submit">Đặt hoa · ${fmt(sub + ship)}</button>
    </form>`;
  $("order").onsubmit = e => {
    e.preventDefault(); placed = true;
    const f = id => $(id).value;
    $("items").innerHTML = "";
    $("checkout").innerHTML = `<div class="ok"><strong>Đơn mẫu đã tạo</strong>Giao cho ${f("f-name")} lúc ${f("f-slot")}, ngày ${f("f-date").split("-").reverse().join("/")}.<br>Đây là website mẫu nên đơn không được gửi đi. Khi chạy thật, form này sẽ nối với Zalo, email hoặc hệ thống quản lý đơn.</div>
      <button class="btn ghost" id="again" style="margin-top:12px">Tiếp tục mua</button>`;
    cart = {}; save(); $("count").textContent = 0;
    $("again").onclick = () => { placed = false; renderCart() };
  };
}
$("items").onclick = e => {
  const b = e.target.closest("[data-d]"); if (!b) return;
  cart[b.dataset.id] = Math.max(0, cart[b.dataset.id] + +b.dataset.d); if (!cart[b.dataset.id]) delete cart[b.dataset.id];
  save(); renderCart();
};

function openCart(v) {
  $("drawer").classList.toggle("open", v); $("drawer").setAttribute("aria-hidden", !v); $("scrim").hidden = !v;
}
$("openCart").onclick = () => openCart(true);
$("closeCart").onclick = $("scrim").onclick = () => openCart(false);
document.addEventListener("keydown", e => e.key === "Escape" && openCart(false));

let tt; function toast(t) { $("toast").textContent = t; $("toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => $("toast").hidden = true, 1800) }

renderGrid(); renderCart();

// #gio-hoa: mở sẵn giỏ với vài mẫu để demo cho khách
if (location.hash === "#gio-hoa") {
  if (!Object.keys(cart).length) { cart = { 1: 1, 3: 2 }; renderCart() }
  openCart(true);
}
