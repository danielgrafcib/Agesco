const fs = require('fs');
const path = require('path');

// Read the dictionary file
const dictionaryContent = fs.readFileSync('js/dictionary.js', 'utf8');

// Extract all data-i18n attributes from HTML files
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
let missingTranslations = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /data-i18n="([^"]+)"/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    // Check if this key exists in the dictionary
    if (!dictionaryContent.includes(`"${key}"`)) {
      missingTranslations.push({ file, key });
    }
  }
});

if (missingTranslations.length === 0) {
  console.log('All translations are complete!');
} else {
  console.log('Missing translations:');
  missingTranslations.forEach(({ file, key }) => {
    console.log(`  ${file}: ${key}`);
  });
}