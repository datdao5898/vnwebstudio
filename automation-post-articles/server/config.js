import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8655),
  timezone: process.env.APP_TIMEZONE || 'Asia/Ho_Chi_Minh',
  syncEveryMinutes: Number(process.env.SYNC_EVERY_MINUTES || 5),
  dryRun: String(process.env.DRY_RUN ?? 'true').toLowerCase() === 'true',
  // Trang chủ VN Web Studio, tự chèn vào mọi bài Facebook (xem withSiteLink trong services/facebook.js)
  siteUrl: process.env.SITE_URL || 'https://datdao5898.github.io/vnwebstudio/',
  lark: {
    appId: process.env.LARK_APP_ID,
    appSecret: process.env.LARK_APP_SECRET,
    appToken: process.env.LARK_APP_TOKEN,
    tableId: process.env.LARK_TABLE_ID,
    fields: {
      status: process.env.LARK_FIELD_STATUS || 'Trạng thái duyệt',
      schedule: process.env.LARK_FIELD_SCHEDULE || 'Thời gian đăng',
      title: process.env.LARK_FIELD_TITLE || 'Tiêu đề',
      content: process.env.LARK_FIELD_CONTENT || 'Nội dung',
      driveFile: process.env.LARK_FIELD_DRIVE_FILE || 'Bài viết trên Drive',
      facebookPage: process.env.LARK_FIELD_FACEBOOK_PAGE || 'Facebook Page ID'
    },
    approvedValue: process.env.LARK_APPROVED_VALUE || 'Đã duyệt'
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || `http://localhost:${process.env.PORT || 8655}/auth/facebook/callback`,
    pageId: process.env.FACEBOOK_PAGE_ID,
    pageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    graphVersion: process.env.FACEBOOK_GRAPH_VERSION || 'v20.0'
  }
};

function isMissing(value) {
  return !value || /^(base_app_token_here|tblx+|page_id_here|EAABx+)$/i.test(String(value));
}

export function missingConfig() {
  const required = {
    LARK_APP_ID: config.lark.appId,
    LARK_APP_SECRET: config.lark.appSecret,
    LARK_APP_TOKEN: config.lark.appToken,
    LARK_TABLE_ID: config.lark.tableId,
    FACEBOOK_PAGE_ID: config.facebook.pageId,
    FACEBOOK_PAGE_ACCESS_TOKEN: config.facebook.pageAccessToken
  };
  return Object.entries(required).filter(([, value]) => isMissing(value)).map(([key]) => key);
}
