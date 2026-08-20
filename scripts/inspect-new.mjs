import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const dir = '/Users/dongwei/Documents/DeepSeek/SCMC/素材/素材补充';
for (const f of readdirSync(dir).filter((f) => !f.startsWith('.'))) {
  try {
    const m = await sharp(join(dir, f)).metadata();
    console.log(`${f}  |  ${m.width}x${m.height}  ${m.format}  alpha=${!!m.hasAlpha}`);
  } catch (e) { console.log(`${f}  |  无法解析`); }
}
