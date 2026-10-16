import Database from 'better-sqlite3';
import fs from 'fs';

fs.mkdirSync('data', { recursive: true });
export const db = new Database('data/automation-post-articles.db');

db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lark_record_id TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  facebook_page_id TEXT,
  schedule_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  facebook_post_id TEXT,
  last_error TEXT,
  raw_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_posts_status_schedule ON posts(status, schedule_at);
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  meta_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);
// Dự án của bài (vnwebstudio, topkhoahoc…), thêm sau nên phải bổ sung cột cho database cũ.
if (!db.prepare('PRAGMA table_info(posts)').all().some(col => col.name === 'project')) {
  db.exec(`ALTER TABLE posts ADD COLUMN project TEXT NOT NULL DEFAULT 'vnwebstudio'`);
}

export function log(level, message, meta = {}) {
  db.prepare('INSERT INTO logs(level, message, meta_json) VALUES (?, ?, ?)')
    .run(level, message, JSON.stringify(meta));
  console.log(`[${level}] ${message}`, meta);
}

export function upsertPost(post) {
  db.prepare(`
    INSERT INTO posts(lark_record_id, title, content, facebook_page_id, schedule_at, status, raw_json, updated_at)
    VALUES (@lark_record_id, @title, @content, @facebook_page_id, @schedule_at, @status, @raw_json, CURRENT_TIMESTAMP)
    ON CONFLICT(lark_record_id) DO UPDATE SET
      title=excluded.title,
      content=excluded.content,
      facebook_page_id=excluded.facebook_page_id,
      schedule_at=excluded.schedule_at,
      status=CASE WHEN posts.status='published' THEN posts.status ELSE excluded.status END,
      raw_json=excluded.raw_json,
      updated_at=CURRENT_TIMESTAMP
  `).run(post);
}
