const fs = require('fs');
const dictionary = require('./js/dictionary.js');
const html = fs.readFileSync('fruit-perish.html', 'utf8');
const i18nRegex = /data-i18n="([^"]+)"/g;
let match;
let missing = [];

while ((match = i18nRegex.exec(html)) !== null) {
    const key = match[1];
    if (!dictionary[key]) {
        missing.push(key);
    }
}

if (missing.length === 0) {
    console.log('All translations are present in dictionary.js');
} else {
    console.log('Missing translations:', missing);
}