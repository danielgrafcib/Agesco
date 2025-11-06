import json, re
from pathlib import Path
ROOT = Path(r"e:/Agecosco")
report = ROOT / 'tools' / 'translation_report.json'
dictf = ROOT / 'js' / 'dictionary.js'

with report.open(encoding='utf-8') as f:
    r = json.load(f)
missing = list(r.get('missing_in_dictionary', {}).keys())
text = dictf.read_text(encoding='utf-8')

found = []
not_found = []
for k in missing:
    # look for quoted key pattern or dot-notated assignment
    pattern1 = re.compile(rf"[\"']{re.escape(k)}[\"']\s*:\s*\{{")
    pattern2 = re.compile(rf"\b{re.escape(k)}\b")
    if pattern1.search(text):
        found.append(k)
    elif pattern2.search(text):
        # fallback: key token appears somewhere (may be in comments)
        found.append(k)
    else:
        not_found.append(k)

print('missing listed:', len(missing))
print('found in dictionary.js (approx):', len(found))
print('not found literally:', len(not_found))
if not_found:
    print('\nSample not-found keys (up to 200):')
    for k in not_found[:200]:
        print(k)
else:
    print('\nAll missing keys appear present in dictionary.js')
