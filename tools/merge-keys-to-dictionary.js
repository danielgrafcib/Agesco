/* Merge keys from tools/keys.json into js/dictionary.js
   - For each key in tools/keys.json not present in dictionary.js, add entry:
     "key": { en: "<first example>", fr: "" }
   - Preserve existing fr values in dictionary.js
   - Write updated js/dictionary.js (overwrite)

   Usage: node tools/merge-keys-to-dictionary.js
*/
const fs = require('fs');
const path = require('path');

const workspace = path.resolve(__dirname, '..');
const keysPath = path.join(workspace, 'tools', 'keys.json');
const dictPath = path.join(workspace, 'js', 'dictionary.js');

function loadKeys() {
  if (!fs.existsSync(keysPath)) throw new Error('tools/keys.json not found');
  const raw = fs.readFileSync(keysPath, 'utf8');
  return JSON.parse(raw);
}

function loadDictionary() {
  if (!fs.existsSync(dictPath)) throw new Error('js/dictionary.js not found');
  const raw = fs.readFileSync(dictPath, 'utf8');
  // Attempt to extract the dictionary object literal between the first "const dictionary = {" and the closing "};" before exports
  const start = raw.indexOf('const dictionary = {');
  if (start === -1) throw new Error('could not find "const dictionary = {" in dictionary.js');
  const afterStart = raw.slice(start + 'const dictionary = '.length);

  // Find the matching closing brace by counting braces
  let braceCount = 0;
  let endIndex = -1;
  for (let i = 0; i < afterStart.length; i++) {
    const ch = afterStart[i];
    if (ch === '{') braceCount++;
    else if (ch === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (endIndex === -1) throw new Error('could not find end of dictionary object');
  const objectLiteral = afterStart.slice(0, endIndex + 1);
  const pre = raw.slice(0, start);
  const post = raw.slice(start + 'const dictionary = '.length + endIndex + 1);

  // Evaluate the object literal safely by wrapping in parentheses and using Function
  const evalText = 'return ' + objectLiteral + ';';
  const obj = Function(evalText)();
  return { obj, pre, post, raw };
}

function merge(keysObj, dictObj) {
  let added = 0;
  for (const key of Object.keys(keysObj)) {
    if (!dictObj.hasOwnProperty(key)) {
      const exampleList = keysObj[key].examples || [];
      const first = exampleList.length ? exampleList[0].trim().replace(/\n+/g, ' ') : '';
      dictObj[key] = { en: first, fr: '' };
      added++;
    } else {
      // preserve existing fr; if en empty, try fill from examples
      if ((!dictObj[key].en || dictObj[key].en.trim() === '') && keysObj[key].examples && keysObj[key].examples.length) {
        dictObj[key].en = keysObj[key].examples[0].trim().replace(/\n+/g, ' ');
      }
      if (!dictObj[key].hasOwnProperty('fr')) {
        dictObj[key].fr = '';
      }
    }
  }
  return added;
}

function renderDictionary(dictObj, pre, post) {
  // Render the object with stable key ordering
  const keys = Object.keys(dictObj).sort();
  const lines = ['const dictionary = {'];
  for (const k of keys) {
    const val = dictObj[k];
    const en = String(val.en || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const fr = String(val.fr || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    lines.push(`    "${k}": { en: "${en}", fr: "${fr}" },`);
  }
  lines.push('};\n');

  // Keep pre and post but replace the original dictionary block
  return pre + lines.join('\n') + '\n' + post;
}

function main() {
  try {
    const keys = loadKeys();
    const { obj, pre, post, raw } = loadDictionary();
    const dictObj = obj;
    const added = merge(keys, dictObj);
    const out = renderDictionary(dictObj, pre, post);
    fs.writeFileSync(dictPath, out, 'utf8');
    console.log('Merged', Object.keys(keys).length, 'keys; added', added, 'new keys to js/dictionary.js');
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

if (require.main === module) main();
