# Automation post articles

Ứng dụng tự động đăng bài từ Lark Base/Lark Drive lên Facebook theo lịch đã duyệt.

## Tính năng

- Kết nối Lark Base để lấy record có trạng thái `Đã duyệt`.
- Lấy tiêu đề, nội dung, giờ đăng, page Facebook từ các field trong Base.
- Lưu lịch đăng vào SQLite cục bộ.
- Scheduler chạy mỗi phút để đăng bài đến hạn lên Facebook Page.
- Dashboard tiếng Việt để xem trạng thái, log, đồng bộ thủ công, tạo bài demo.
- `DRY_RUN=true` mặc định để test an toàn, không đăng thật.

## Cài đặt

```bash
cd /mnt/c/Users/datda/automation-post-articles
cp .env.example .env
npm install
npm run dev
```

Mở dashboard:

- Frontend dev: http://localhost:5174
- API/backend: http://localhost:8655/api/health

## Cấu hình Lark Base

Trong `.env`, điền:

```env
LARK_APP_ID=...
LARK_APP_SECRET=...
LARK_APP_TOKEN=...
LARK_TABLE_ID=...
```

Bảng Lark Base nên có các field mặc định:

- `Trạng thái duyệt`: giá trị `Đã duyệt` thì app mới lấy.
- `Thời gian đăng`: ngày giờ cần đăng.
- `Tiêu đề`: tiêu đề nội bộ để quản lý.
- `Nội dung`: nội dung bài đăng Facebook.
- `Bài viết trên Drive`: optional, dùng khi không nhập field Nội dung.
- `Facebook Page ID`: optional, nếu trống dùng `FACEBOOK_PAGE_ID` trong `.env`.

Có thể đổi tên field bằng các biến `LARK_FIELD_*` trong `.env`.

## Cấu hình Facebook

Cần Facebook Page Access Token có quyền đăng bài lên Page.

```env
FACEBOOK_APP_ID=893274256916940
FACEBOOK_PAGE_ID=page_id_here
FACEBOOK_PAGE_ACCESS_TOKEN=page_access_token_here
FACEBOOK_GRAPH_VERSION=v20.0
```

`FACEBOOK_APP_ID` là định danh Meta App. App Secret và Page Access Token là dữ liệu nhạy cảm; chỉ nhập trực tiếp vào `.env`, không gửi qua chat.

## Kết nối Facebook bằng trình duyệt

1. Trong Meta App, thêm `http://localhost:8655/auth/facebook/callback` vào **Facebook Login → Settings → Valid OAuth Redirect URIs**.
2. Chạy ứng dụng và mở `http://localhost:8655`.
3. Bấm **Kết nối Facebook Page**, đăng nhập bằng tài khoản có toàn quyền trên Page và đồng ý các quyền được hỏi.
4. Ứng dụng tự lưu Page Access Token vào `.env`; không hiển thị token trên dashboard hoặc log.

Khi đã sẵn sàng đăng thật, đổi:

```env
DRY_RUN=false
```

## Kiểm thử nhanh không cần token thật

Giữ `DRY_RUN=true`, chạy:

```bash
npm run dev
```

Trên dashboard bấm “Tạo bài demo”, chờ đến giờ đã chọn hoặc bấm “Đăng bài đến hạn ngay”. App sẽ tạo `facebook_post_id` dạng `dry_run_...` thay vì gọi Facebook thật.

## API chính

- `GET /api/health`: kiểm tra cấu hình.
- `GET /api/posts`: danh sách lịch đăng.
- `GET /api/logs`: log gần đây.
- `POST /api/sync`: đồng bộ Lark Base thủ công.
- `POST /api/publish-due`: đăng các bài đến hạn thủ công.
- `POST /api/posts/demo`: tạo bài demo.

## Lưu ý vận hành

- Máy/server phải đang chạy app tại thời điểm cần đăng bài.
- Nếu chạy production, dùng `npm run build && npm start` hoặc process manager như PM2.
- Facebook có thể yêu cầu app review/permission tùy loại Page và token.
