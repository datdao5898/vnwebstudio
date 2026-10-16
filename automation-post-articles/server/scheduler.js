import cron from 'node-cron';
import { db, log, upsertPost } from './db.js';
import { config } from './config.js';
import { listApprovedBaseRecords, updateRecordStatus } from './services/lark.js';
import { publishFacebookPost } from './services/facebook.js';

let runningSync = false;
let runningPublish = false;

export async function syncFromLark() {
  if (runningSync) return { skipped: true };
  runningSync = true;
  try {
    const records = await listApprovedBaseRecords();
    for (const post of records) upsertPost(post);
    log('info', `Đồng bộ ${records.length} bài viết đã duyệt từ Lark Base`, { count: records.length });
    return { count: records.length };
  } catch (err) {
    log('error', 'Đồng bộ Lark thất bại', { error: err.message });
    throw err;
  } finally {
    runningSync = false;
  }
}

export async function publishDuePosts() {
  if (runningPublish) return { skipped: true };
  runningPublish = true;
  try {
    const now = new Date().toISOString();
    const duePosts = db.prepare(`SELECT * FROM posts WHERE status='scheduled' AND schedule_at <= ? ORDER BY schedule_at ASC LIMIT 10`).all(now);
    let published = 0;
    for (const post of duePosts) {
      try {
        db.prepare(`UPDATE posts SET status='publishing', updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(post.id);
        const fb = await publishFacebookPost({ pageId: post.facebook_page_id, message: post.content });
        db.prepare(`UPDATE posts SET status='published', facebook_post_id=?, last_error=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(fb.id, post.id);
        try { await updateRecordStatus(post.lark_record_id, 'Đã đăng', fb.id); } catch (e) { log('warn', 'Đã đăng Facebook nhưng cập nhật Lark thất bại', { recordId: post.lark_record_id, error: e.message }); }
        log('info', 'Đã đăng bài lên Facebook', { id: post.id, facebookPostId: fb.id, dryRun: fb.dryRun || false });
        published++;
      } catch (err) {
        db.prepare(`UPDATE posts SET status='failed', last_error=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(err.message, post.id);
        log('error', 'Đăng Facebook thất bại', { id: post.id, error: err.message });
      }
    }
    return { due: duePosts.length, published };
  } finally {
    runningPublish = false;
  }
}

export function startScheduler() {
  cron.schedule(`*/${config.syncEveryMinutes} * * * *`, () => syncFromLark().catch(() => {}), { timezone: config.timezone });
  cron.schedule('* * * * *', () => publishDuePosts().catch(() => {}), { timezone: config.timezone });
  log('info', 'Scheduler đã chạy', { syncEveryMinutes: config.syncEveryMinutes, timezone: config.timezone, dryRun: config.dryRun });
}
