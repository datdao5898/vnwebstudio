import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
createServer((request, response) => {
  const pathname = request.url.split("?")[0];
  const requested = pathname === "/" ? "/index.html" : pathname;
  const file = join(root, normalize(requested));
  if (!file.startsWith(root) || !existsSync(file)) { response.writeHead(404); response.end("Not found"); return; }
  response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(4678, "0.0.0.0", () => console.log("Server started"));
