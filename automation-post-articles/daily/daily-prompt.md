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
- Không dùng ảnh bên ngoài hay file ảnh. Hình minh họa vẽ bằng SVG inline, CSS hoặc canvas cho đẹp và hợp ngành.
- Font từ Google Fonts phải hỗ trợ tiếng Việt, ví dụ Be Vietnam Pro, Fraunces, Lora, Playfair Display, Montserrat, Nunito, Source Serif 4, Roboto Slab. Chọn cặp font khác với các mẫu trước.
- Mỗi ngày dùng một bảng màu và bố cục khác. Đừng lặp lại mẫu hoa và tránh các mẫu AI quen thuộc như nền kem với chữ serif và màu đất nung, hoặc gradient tím xanh.
- Giao diện sáng. Trang phải đẹp ở cả độ rộng 1440px và 390px, không bị tràn ngang. Header sticky thì thêm `scroll-margin-top` cho các section.
- Phần hero phải đẹp trong khung 1440×900 vì đó là ảnh bìa bài đăng.
- Form chỉ là demo: dùng `preventDefault` và hiện thông báo trên trang.

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
  "caption": "Nội dung bài Facebook"
}
```

Caption viết theo giọng các bài trong `web/fanpage-content/noi-dung-dang-fanpage.md`:
- Dòng đầu có một emoji hợp ngành, theo mẫu `Mẫu website <ngành> – <Thương hiệu>`.
- Viết 1 đến 2 câu nói về nhu cầu thật của chủ doanh nghiệp ngành đó.
- Liệt kê 3 đến 4 tính năng, mỗi dòng bắt đầu bằng `✔`.
- Kết bằng lời mời: `Inbox VN Web Studio để nhận bản demo theo thương hiệu của mình nhé.`
- Thêm 3 đến 4 hashtag không dấu, có `#thietkeweb` và `#vnwebstudio`.
- Độ dài dưới 900 ký tự.

## 4. Đánh dấu đã làm

Trong `topics.json`, sửa `"done": null` của chủ đề vừa làm thành `"done": "DATE"`.

Không sửa file nào khác ngoài các file kể trên.
