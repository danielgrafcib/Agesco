import os
import re
from collections import defaultdict

ROOT = r"e:\Agecosco"
DICT_PATH = os.path.join(ROOT, 'js', 'dictionary.js')
REPORT_PATH = os.path.join(ROOT, 'tools', 'translation_report.json')

# extract data-i18n keys from html files
used_keys = defaultdict(list)
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    txt = f.read()
            except Exception as e:
                print('SKIP', path, e)
                continue
            for m in re.finditer(r'data-i18n\s*=\s*"([^"]+)"', txt):
                key = m.group(1).strip()
                used_keys[key].append(os.path.relpath(path, ROOT))

# parse dictionary keys and fr values by scanning entire file for key: { ... } patterns
dict_keys = {}
if not os.path.exists(DICT_PATH):
    print('dictionary.js not found at', DICT_PATH)
else:
    content = open(DICT_PATH, 'r', encoding='utf-8').read()

    # find occurrences of "key": { ... } by a simple regex that captures the block
    # This is robust enough for our generated dictionary.js where each entry is a top-level property
    # match simple pattern: "key": {  (keys are quoted with double quotes)
    entry_re = re.compile(r'"\s*([^\"]+?)\s*"\s*:\s*\{', re.MULTILINE)
    # simpler fr/en extractor inside a block
    fr_re = re.compile(r"fr\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\\\"]|\\.)*\")")
    en_re = re.compile(r"en\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\\\"]|\\.)*\")")

    # iterate over all matches and extract the following block by finding the next closing '},' or '}\n' occurrence
    for m in entry_re.finditer(content):
        # key extraction: group 1 contains the key text (inside quotes)
        key = m.group(1)
        start = m.end()
        # find block end: look for '},' from start
        end_idx = content.find('},', start)
        if end_idx == -1:
            end_idx = content.find('\n}', start)
        if end_idx == -1:
            # fallback: take a short slice
            block = content[start:start+400]
        else:
            block = content[start:end_idx]

        fm = fr_re.search(block)
        fr_val = None
        if fm:
            raw = fm.group(1)
            if raw[0] in "'\"":
                fr_val = raw[1:-1]
            else:
                fr_val = raw
        dict_keys[key] = fr_val

# compute missing keys and empty fr
used_set = set(used_keys.keys())
dict_set = set(dict_keys.keys())
missing_in_dict = sorted(list(used_set - dict_set))
fr_empty = sorted([k for k, v in dict_keys.items() if v is None or v.strip() == ''])

# map missing keys to files
missing_map = {k: used_keys.get(k, []) for k in missing_in_dict}

report = {
    'used_key_count': len(used_set),
    'dictionary_key_count': len(dict_set),
    'missing_in_dictionary_count': len(missing_in_dict),
    'missing_in_dictionary': missing_map,
    'fr_empty_count': len(fr_empty),
    'fr_empty_keys_sample': fr_empty[:200],
}

import json
with open(REPORT_PATH, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print('Report written to', REPORT_PATH)
print('Used keys:', len(used_set))
print('Dictionary keys:', len(dict_set))
print('Missing keys:', len(missing_in_dict))
print('FR-empty keys:', len(fr_empty))

# print top missing keys (up to 30)
if missing_in_dict:
    print('\nMissing keys (sample up to 30):')
    for k in missing_in_dict[:30]:
        print('-', k, '->', missing_map.get(k)[:3])

if fr_empty:
    print('\nKeys with empty FR (sample up to 30):')
    for k in fr_empty[:30]:
        print('-', k)
