// Cho dự án khác (vd. topkhoahoc) đăng bài qua tool này mà không cần mở server. Chạy từ thư mục automation-post-articles:
//   node server/scripts/post.mjs --project topkhoahoc --message-file bai.txt [--link https://...] [--title "..."] [--draft]
// Đăng video dọc thành Reel: thêm --video <file.mp4> (bỏ qua --link).
// Lên lịch Reel: thêm --schedule "2026-10-30T20:00:00+07:00", Facebook tự đăng đúng giờ (cách hiện tại ít nhất 15 phút).
// In ra một dòng JSON kết quả: {"id":..,"facebookPostId":"..",...}
import fs from 'fs';
import { publishDirectPost } from '../services/direct-post.js';

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const messageFile = opt('message-file');
if (!opt('project') || !messageFile) {
  console.error('Cách dùng: node server/scripts/post.mjs --project <id> --message-file <file> [--link <url>] [--video <file.mp4> [--schedule <giờ ISO>]] [--title <tiêu đề>] [--draft]');
  process.exit(1);
}

try {
  const result = await publishDirectPost({
    project: opt('project'),
    title: opt('title') || '',
    content: fs.readFileSync(messageFile, 'utf8'),
    link: opt('link'),
    video: opt('video'),
    draft: args.includes('--draft'),
    scheduleAt: opt('schedule') ? new Date(opt('schedule')) : undefined
  });
  console.log(JSON.stringify(result));
} catch (err) {
  console.error(`Đăng bài thất bại: ${err.message}`);
  process.exit(1);
}
