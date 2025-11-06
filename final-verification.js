const fs = require('fs');

// Read the dictionary file
const dictionaryContent = fs.readFileSync('js/dictionary.js', 'utf8');

// Read the fruit-perish.html file
const fruitPerishContent = fs.readFileSync('fruit-perish.html', 'utf8');

// Extract all data-i18n attributes from fruit-perish.html
const i18nRegex = /data-i18n="([^"]+)"/g;
let match;
let missingTranslations = [];

console.log('Checking fruit-perish.html for missing translations...\n');

while ((match = i18nRegex.exec(fruitPerishContent)) !== null) {
    const key = match[1];
    // Check if this key exists in the dictionary
    if (!dictionaryContent.includes(`"${key}"`)) {
        missingTranslations.push(key);
        console.log(`  Missing translation key: ${key}`);
    }
}

if (missingTranslations.length === 0) {
    console.log('All data-i18n attributes have translations in dictionary.js!');
} else {
    console.log(`\nFound ${missingTranslations.length} missing translation keys.`);
    console.log('Please add these keys to js/dictionary.js with appropriate translations.');
}

console.log('\nVerification complete.');