import { missingConfig, config } from '../config.js';
const missing = missingConfig();
console.log(JSON.stringify({ ok: missing.length === 0, missing, dryRun: config.dryRun, timezone: config.timezone }, null, 2));
if (missing.length && !config.dryRun) process.exit(1);
