// Chạy sau `vite build`: dựng sẵn HTML trang chủ (cho Google và các AI đọc được không cần JS),
// chèn dữ liệu có cấu trúc JSON-LD, và tạo sitemap.xml + llms.txt từ danh sách mẫu và FAQ.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = 'https://datdao5898.github.io/vnwebstudio/';
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, 'src', file), 'utf8'));
const demos = read('demos.json');
const faq = read('faq.json');

// Mẫu có sẵn trong main.jsx (projectMedia) + mẫu tự động trong demos.json
const library = [
  ['Azure Haven', 'Khách sạn & Resort', 'hotel'], ['Mơ Mộng Tea', 'Trà sữa', 'milk-tea'], ['Hannah Tutor', 'Gia sư', 'tutor'],
  ['K2 Studio', 'Kiến trúc & Thi công', 'construction'], ['Mây Travel', 'Du lịch', 'travel'], ['NEST Workspaces', 'Văn phòng cho thuê', 'office'],
  ['Étienne Mori', 'Portfolio nhiếp ảnh', 'portfolio-01'], ['Minh Khôi', 'MC Wedding & Sự kiện', 'portfolio-02'], ['Đèn Xanh', 'Trường dạy lái xe', 'driving'],
  ...demos.map(d => [d.name, d.type.vi, d.slug])
];

const services = [
  ['Thiết kế website', 'Website chỉn chu, khác biệt, xây dựng theo cách khách hàng suy nghĩ và ra quyết định.'],
  ['Thiết kế landing page', 'Landing page cho chiến dịch, sự kiện hoặc ưu đãi — thiết kế và ra mắt trong một ngày làm việc.'],
  ['Tối ưu website', 'Cải thiện tốc độ, SEO và tỉ lệ chuyển đổi.'],
  ['Quản lý website', 'Cập nhật nội dung, hỗ trợ và chăm sóc website sau khi ra mắt.']
];

const org = {
  '@type': 'ProfessionalService', '@id': `${site}#business`, name: 'VN Web Studio', url: site,
  slogan: 'Design · Optimize · Grow',
  description: 'Studio thiết kế website tại Việt Nam: thiết kế website và landing page, tối ưu tốc độ & SEO, quản lý và chăm sóc website cho doanh nghiệp, cửa hàng và thương hiệu cá nhân.',
  logo: `${site}assets/vn-logo-256.png`, image: `${site}assets/og-image.jpg`,
  telephone: '+84348644071', areaServed: { '@type': 'Country', name: 'Việt Nam' },
  address: { '@type': 'PostalAddress', addressCountry: 'VN' }, knowsLanguage: ['vi', 'en'],
  contactPoint: { '@type': 'ContactPoint', telephone: '+84348644071', contactType: 'customer service', availableLanguage: ['Vietnamese', 'English'] },
  sameAs: ['https://www.facebook.com/profile.php?id=61592644081779', 'https://zalo.me/0944190237', 'https://t.me/daviddao98', 'https://github.com/datdao5898/vnwebstudio'],
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Dịch vụ website', itemListElement: services.map(([name, description]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, description } })) }
};
const graph = [
  org,
  { '@type': 'WebSite', '@id': `${site}#website`, url: site, name: 'VN Web Studio', inLanguage: 'vi-VN', publisher: { '@id': `${site}#business` } },
  { '@type': 'FAQPage', '@id': `${site}#faq`, inLanguage: 'vi-VN', mainEntity: faq.vi.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  { '@type': 'ItemList', '@id': `${site}#library`, name: 'Kho giao diện website mẫu', numberOfItems: library.length,
    itemListElement: library.map(([name, industry, slug], i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: `Mẫu website ${industry} – ${name}`, url: `${site}demos/${slug}/`, creator: { '@id': `${site}#business` } } })) }
];
const jsonLd = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const indexFile = path.join(dist, 'index.html');
const html = fs.readFileSync(indexFile, 'utf8')
  .replace('<!--structured-data-->', jsonLd)
  .replace('<!--app-->', render());
fs.writeFileSync(indexFile, html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${site}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority><image:image><image:loc>${site}assets/og-image.jpg</image:loc></image:image></url>
</urlset>
`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);

// llms.txt: bản tóm tắt dạng văn bản cho ChatGPT, Perplexity, Gemini… (chuẩn llmstxt.org)
fs.writeFileSync(path.join(dist, 'llms.txt'), `# VN Web Studio

> Studio thiết kế website tại Việt Nam. Thiết kế website và landing page, tối ưu tốc độ & SEO, quản lý và chăm sóc website cho doanh nghiệp, cửa hàng và thương hiệu cá nhân. Landing page có thể ra mắt trong một ngày làm việc. Tư vấn miễn phí.

- Trang chủ: ${site}
- Điện thoại: 0348 644 071
- Zalo: https://zalo.me/0944190237
- Telegram: https://t.me/daviddao98
- Facebook: https://www.facebook.com/profile.php?id=61592644081779

## Dịch vụ

${services.map(([n, d]) => `- **${n}**: ${d}`).join('\n')}

## Kho giao diện mẫu (${library.length} mẫu)

${library.map(([name, industry, slug]) => `- [Mẫu website ${industry} – ${name}](${site}demos/${slug}/)`).join('\n')}

## Câu hỏi thường gặp

${faq.vi.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}
`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Prerender xong: ${library.length} mẫu, ${faq.vi.length} câu hỏi, sitemap.xml, robots.txt, llms.txt`);
