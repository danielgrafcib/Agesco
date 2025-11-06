const fs = require('fs');
const path = require('path');
const out = {};

function walkDir(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, cb);
    else cb(full);
  }
}

function extractFromFile(file) {
  if (!file.endsWith('.html')) return;
  const text = fs.readFileSync(file,'utf8');
  const regexes = [
    /data-i18n="([^"]+)"[^>]*>([^<]*)</g,
    /data-i18n-placeholder="([^"]+)"[^>]*placeholder="([^"]*)"/g,
    /data-i18n-value="([^"]+)"[^>]*>([^<]*)</g,
    /data-i18n-agree="([^"]+)"[^>]*>([^<]*)</g
  ];
  regexes.forEach(rx => {
    let m;
    while((m = rx.exec(text)) !== null) {
      const key = m[1].trim();
      const sample = (m[2] || '').trim();
      if(!out[key]) out[key] = { examples: [], files: [] };
      if(sample && !out[key].examples.includes(sample)) out[key].examples.push(sample);
      if(!out[key].files.includes(file)) out[key].files.push(file);
    }
  });
}

walkDir(process.cwd(), f => extractFromFile(f));

fs.mkdirSync(path.dirname('tools/keys.json'), { recursive: true });
fs.writeFileSync('tools/keys.json', JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote tools/keys.json with', Object.keys(out).length, 'keys.');
