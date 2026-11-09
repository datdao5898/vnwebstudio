# Việc hằng ngày: mẫu website mới cho fanpage VN Web Studio

Bạn đang chạy tự động, không có ai trả lời câu hỏi. Đừng hỏi lại, hãy tự quyết định và làm cho xong.
Bạn chỉ được đọc và ghi file. Không chạy lệnh. Việc chụp ảnh và đăng bài sẽ do script khác làm sau khi bạn xong.

`DATE` được truyền trong lời gọi, dạng `YYYY-MM-DD`. Mọi đường dẫn bên dưới tính từ thư mục gốc `VN Web Studio`.

## 1. Chọn chủ đề

- Đọc `automation-post-articles/daily/topics.json` và lấy chủ đề đầu tiên có `"done": null`.
- Nếu đã có thư mục `web/<slug>-landing`, đánh dấu chủ đề đó là xong rồi lấy chủ đề tiếp theo.
- Nếu không còn chủ đề nào, ghi file `automation-post-articles/daily/out/DATE.json` với nội dung `{ "skip": "Hết chủ đề trong topics.json" }` rồi dừng.

## 2. Làm website

Tạo thư mục `web/<slug>-landing/` gồm `index.html`, `styles.css`, `script.js`, đúng cấu trúc như `web/flower-shop-landing/`. Đọc mẫu đó trước để nắm cách làm.

Yêu cầu:
- Đặt một thương hiệu giả, có tên tiếng Việt và hợp với ngành. Nội dung viết bằng tiếng Việt có dấu, cụ thể và thật: giá bằng ₫, địa chỉ ở Việt Nam, giờ mở cửa, quy trình, chi tiết riêng của ngành. Không dùng lorem ipsum.
- `<title>` có dạng `Tên thương hiệu — câu giới thiệu ngắn`.
- Trang có các phần: header, hero, dịch vụ hoặc sản phẩm (có giá), một tính năng tương tác hợp với ngành (ví dụ đặt lịch, bảng giá có tab, tính chi phí, lọc sản phẩm), quy trình hoặc lý do chọn, cảm nhận khách hàng hoặc con số, CTA và footer.
- Dùng ảnh thật theo mục "Ảnh thật" bên dưới. Nếu không có ảnh dùng được thì vẽ minh họa bằng SVG inline, CSS hoặc canvas cho đẹp và hợp ngành. Không dùng link ảnh từ trang khác.
- Font từ Google Fonts phải hỗ trợ tiếng Việt, ví dụ Be Vietnam Pro, Fraunces, Lora, Playfair Display, Montserrat, Nunito, Source Serif 4, Roboto Slab. Chọn cặp font khác với các mẫu trước.
- Mỗi ngày dùng một bảng màu và bố cục khác. Đừng lặp lại mẫu hoa và tránh các mẫu AI quen thuộc như nền kem với chữ serif và màu đất nung, hoặc gradient tím xanh.
- Giao diện sáng. Trang phải đẹp ở cả độ rộng 1440px và 390px, không bị tràn ngang. Header sticky thì thêm `scroll-margin-top` cho các section.
- Phần hero phải đẹp trong khung 1440×900 vì đó là ảnh bìa bài đăng.
- Form chỉ là demo: dùng `preventDefault` và hiện thông báo trên trang.

### Ảnh thật

Script đã tải sẵn ảnh ứng viên từ Pixabay vào `automation-post-articles/daily/photo-candidates/DATE/`. Danh sách nằm trong `manifest.json` ở thư mục đó. Nếu không có file này, hoặc `slug` trong đó khác chủ đề bạn đang làm, thì bỏ qua mục này và vẽ minh họa như trên.

- Mở từng ảnh bằng công cụ Read để xem tận mắt rồi mới chọn. Đừng chọn chỉ dựa vào tag.
- Chọn 3 đến 5 ảnh đúng ngành và hợp với nhau về màu sắc. Thiết kế bảng màu và bố cục theo ảnh đã chọn. Ảnh hero phải là ảnh đẹp nhất. Nếu không có ảnh nào đủ tốt cho một vị trí, dùng SVG hoặc CSS cho vị trí đó.
- Bỏ ngay ảnh có logo, tên thương hiệu, sản phẩm nhận ra được hãng, chữ nước ngoài lộ rõ, hoặc có dấu hiệu lỗi do AI tạo ra.
- Tránh ảnh thấy rõ mặt người. Không bao giờ gắn ảnh người vào phần cảm nhận khách hàng, đội ngũ hay bác sĩ/chuyên gia, vì thương hiệu là giả. Phần cảm nhận khách hàng chỉ dùng chữ hoặc chữ cái đầu của tên.
- Trong HTML và CSS, trỏ tới ảnh bằng đường dẫn `images/<tên-file>.jpg` với tên file tiếng Anh không dấu, ví dụ `images/hero.jpg`. Bạn không chép được file ảnh, script sẽ tự chép sau khi bạn xong.
- Mỗi `<img>` có `alt` tiếng Việt, `width`, `height` và `object-fit: cover`. Ảnh tối đa rộng 1280px nên đừng để hero tràn toàn màn hình ở 1440px mà không có lớp phủ màu hoặc khung chứa.
- Nếu chữ nằm đè lên ảnh, thêm lớp phủ để chữ luôn dễ đọc.
- Footer có thêm dòng nhỏ `Ảnh: Pixabay`.

## 3. Viết nội dung bài đăng

Ghi file `automation-post-articles/daily/out/DATE.json` (JSON hợp lệ, UTF-8):

```json
{
  "slug": "<slug>-landing",
  "brand": "Tên thương hiệu",
  "industry": "Ngành",
  "industryEn": "Industry in English, ngắn gọn (ví dụ: Dental Clinic)",
  "summary": "1 câu tiếng Việt (dưới 120 ký tự) giới thiệu mẫu và 2–3 tính năng nổi bật, dùng cho thẻ trên trang chủ VN Web Studio",
  "summaryEn": "Câu trên dịch sang tiếng Anh",
  "caption": "Nội dung bài Facebook",
  "photos": [
    { "id": 1234567, "file": "hero.jpg" }
  ]
}
```

`photos` liệt kê mọi ảnh trang đang dùng: `id` lấy từ `manifest.json`, `file` là tên file trong thư mục `images/`. Mọi đường dẫn `images/...` trong trang phải có mặt ở đây, nếu không bài sẽ không đăng được. Không dùng ảnh thật thì để `[]`.

Caption viết theo giọng các bài trong `web/fanpage-content/noi-dung-dang-fanpage.md`:
- Dòng đầu có một emoji hợp ngành, theo mẫu `Mẫu website <ngành> – <Thương hiệu>`.
- Viết 1 đến 2 câu nói về nhu cầu thật của chủ doanh nghiệp ngành đó.
- Liệt kê 3 đến 4 tính năng, mỗi dòng bắt đầu bằng `✔`.
- Kết bằng lời mời: `Inbox VN Web Studio để nhận bản demo theo thương hiệu của mình nhé.`
- Thêm 3 đến 4 hashtag không dấu, có `#thietkeweb` và `#vnwebstudio`.
- Độ dài dưới 900 ký tự.

Thêm mục `"reel"` vào cùng file JSON. Đây là kịch bản Reel dọc khoảng 30–40 giây: trang web trên điện thoại phủ kín khung hình, cuộn từ trên xuống qua từng phần. Mỗi phần có nhãn `01 / 05 · THƯƠNG HIỆU · PHẦN` và câu `say` hiện chữ lớn ở đáy, giọng Hải Đăng đọc đúng câu đó. Video kết bằng thẻ tối "Làm website cho thương hiệu của bạn".

```json
"reel": {
  "hook": "Chữ lớn ở khung đầu, dưới 60 ký tự, nói thẳng nỗi đau hoặc kết quả",
  "hookSay": "Câu mở đầu giới thiệu mẫu: ngành gì, thương hiệu nào, điểm đặc biệt (dưới 110 ký tự)",
  "features": [
    { "title": "Tên tính năng, tối đa 28 ký tự", "label": "Tên phần, 1–3 chữ", "say": "1 câu nói phần này làm được gì cho khách (dưới 110 ký tự)", "section": "#id-cua-section" }
  ],
  "outroSay": "1 câu mời nhắn tin cho VN Web Studio để nhận bản demo"
}
```

- `features` có 4 đến 6 mục, đi lần lượt từ trên xuống dưới trang (ví dụ: bảng giá, công cụ tra cứu, sản phẩm, quy trình, đánh giá, đặt lịch). Các tính năng `✔` trong caption phải có mặt.
- `label` là tên ngắn của phần đó, hiện trên nhãn, ví dụ `Bảng giá`, `Lịch tiêm`, `Đặt lịch`.
- `section` là selector CSS (thường là `#id`) của phần trên trang minh họa tính năng đó, phải tồn tại trong `index.html` bạn vừa làm.
- Câu `say` hiện nguyên văn trên hình nên phải ngắn, đọc một hơi là hết.
- Câu đọc viết như người nói, không dùng emoji, ký hiệu, dấu `/` hay chữ viết tắt. Viết số tiền và số liệu bằng chữ khi dễ đọc hơn.

## 4. Đánh dấu đã làm

Trong `topics.json`, sửa `"done": null` của chủ đề vừa làm thành `"done": "DATE"`.

Không sửa file nào khác ngoài các file kể trên.
