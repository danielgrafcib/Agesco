import os
import re
import shutil

ROOT = r"e:\\Agecosco"
DICT_PATH = os.path.join(ROOT, 'js', 'dictionary.js')
BACKUP = DICT_PATH + '.bak'

# read keys used in ALL html pages
used_keys = set()
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            try:
                txt = open(path, 'r', encoding='utf-8').read()
            except Exception as e:
                print('SKIP', path, e)
                continue
            for m in re.finditer(r'data-i18n\\s*=\\s*"([^\"]+)"', txt):
                used_keys.add(m.group(1).strip())

print('Keys used in site (HTML):', len(used_keys))
import os
import re
import shutil

ROOT = r"e:\\Agecosco"
DICT_PATH = os.path.join(ROOT, 'js', 'dictionary.js')
BACKUP = DICT_PATH + '.bak'

# read keys used in ALL html pages
used_keys = set()
html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            html_files.append(path)
            try:
                txt = open(path, 'r', encoding='utf-8').read()
            except Exception as e:
                print('SKIP', path, e)
                continue
            for m in re.finditer(r'data-i18n\\s*=\\s*"([^\"]+)"', txt):
                used_keys.add(m.group(1).strip())

print('Keys used in site (HTML):', len(used_keys))

# read dictionary
if not os.path.exists(DICT_PATH):
    raise SystemExit('dictionary.js not found')
import os
import re
import shutil

ROOT = r"e:\\Agecosco"
DICT_PATH = os.path.join(ROOT, 'js', 'dictionary.js')
BACKUP = DICT_PATH + '.bak'

# read keys used in ALL html pages
used_keys = set()
html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            html_files.append(path)
            try:
                txt = open(path, 'r', encoding='utf-8').read()
            except Exception as e:
                print('SKIP', path, e)
                continue
            for m in re.finditer(r'data-i18n\s*=\s*"([^"]+)"', txt):
                used_keys.add(m.group(1).strip())

print('Keys used in site (HTML):', len(used_keys))

# read dictionary
if not os.path.exists(DICT_PATH):
    raise SystemExit('dictionary.js not found')
text = open(DICT_PATH, 'r', encoding='utf-8').read()

# parse all keys present with their block spans
all_key_re = re.compile(r'^\s*"([^\"]+)"\s*:\s*\{')
lines = text.splitlines()

# build index of line numbers where each key starts
key_starts = {}
for idx, line in enumerate(lines):
    m = all_key_re.match(line)
    if m:
        key_starts[m.group(1)] = idx

# function to get block range for a key starting at line i
def find_block_end(start_idx):
    # scan forward until we find a line that contains '},' or '}'
    for j in range(start_idx, min(start_idx+400, len(lines))):
        if lines[j].strip().endswith('},') or lines[j].strip().endswith('}'): 
            return j
    return None

modified = False
new_entries = []
for key in sorted(used_keys):
    if key in key_starts:
        s = key_starts[key]
        e = find_block_end(s+1)
        e_or = e if e is not None else min(s+10, len(lines)-1)
        block = '\n'.join(lines[s:e_or+1])
        # find fr value
        fr_match = re.search(r"fr\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\\\"]|\\.)*\")", block)
        en_match = re.search(r"en\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\\\"]|\\.)*\")", block)
        fr_val = None
        en_val = None
        if en_match:
            raw = en_match.group(1)
            en_val = raw[1:-1]
        if fr_match:
            raw = fr_match.group(1)
            fr_val = raw[1:-1]
        if fr_val is None or fr_val.strip() == '':
            # need to insert or replace fr with en_val
            new_fr = en_val if en_val is not None else '[traduction manquante]'
            # modify block: if fr exists, replace; else insert after en line
            if fr_match:
                for li in range(s, e_or+1):
                    if 'fr' in lines[li]:
                        lines[li] = re.sub(r"fr\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\\\"]|\\.)*\")", "fr: '"+new_fr.replace("'", "\\'")+"'", lines[li])
                        modified = True
                        break
            else:
                inserted = False
                for li in range(s, e_or+1):
                    if 'en' in lines[li]:
                        indent = re.match(r"(\s*)", lines[li]).group(1)
                        insert_line = indent + "fr: '" + new_fr.replace("'", "\\'") + "',"
                        lines.insert(li+1, insert_line)
                        modified = True
                        inserted = True
                        break
                if not inserted and e is not None:
                    indent = re.match(r"(\s*)", lines[e]).group(1)
                    lines.insert(e, indent + "fr: '" + new_fr.replace("'", "\\'") + "',")
                    modified = True
    else:
        # key missing entirely; try to extract sample text from html files
        sample = None
        for path in html_files:
            try:
                page_txt = open(path, 'r', encoding='utf-8').read()
            except Exception:
                continue
            m = re.search(r'data-i18n\s*=\s*"' + re.escape(key) + r'"[^>]*>([^<]+)<', page_txt)
            if m:
                sample = m.group(1).strip()
                break
        new_fr = sample if sample else key
        new_entries.append((key, new_fr))
        modified = True

# backup original
shutil.copyfile(DICT_PATH, BACKUP)
print('Backup written to', BACKUP)

if modified:
    # rebuild text
    new_text = '\n'.join(lines)
    # if new_entries exist, insert them before the last closing '};'
    if new_entries:
        m = re.search(r'\n\s*\};\s*$', new_text)
        insert_block = ''
        for k, v in new_entries:
            insert_block += f"    \"{k}\": {{ en: '{v.replace("'", "\\'")}', fr: '{v.replace("'", "\\'")}' }},\n"
        if m:
            pos = m.start()
            new_text = new_text[:pos] + '\n' + insert_block + new_text[pos:]
        else:
            new_text = new_text.rstrip()
            if new_text.endswith('};'):
                new_text = new_text[:-2] + '\n' + insert_block + '};'
            else:
                new_text += '\n' + insert_block
    # write back
    with open(DICT_PATH, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('dictionary.js updated with', len(new_entries), 'new entries and fr filled where needed.')
else:
    print('No modifications required.')
