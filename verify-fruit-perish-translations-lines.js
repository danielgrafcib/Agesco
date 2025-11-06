const fs = require('fs');
const path = require('path');

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

// Also check for hardcoded texts that should be internationalized
console.log('\nChecking for hardcoded texts that should be internationalized...\n');

const hardcodedTexts = [
    'Perishables Services',
    'Our Complete Service Portfolio',
    'Risk Management',
    'P&I Claims Handling',
    'Loss Prevention Plans',
    'Agrifood Sector',
    'Why Choose Our Fruit & Perishables Services?',
    'Our Professional Approach',
    'See All Survey Services',
    'Request a Consultation',
    'Contact Information',
    'Our Services',
    'Quick Links',
    'Home',
    'About Us',
    'Branches',
    'Our Team',
    'Contact Us',
    'Newsletter',
    'Stay updated with our latest announcements and industry insights',
    'We respect your privacy. Unsubscribe at any time.',
    'Please enter a valid email address.'
];

let hardcodedFound = [];
const lines = fruitPerishContent.split('\n');

for (const text of hardcodedTexts) {
    // Create a regex that matches the text between > and <
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const textRegex = new RegExp(`>\\s*${escapedText}\\s*<`, 'g');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(textRegex)) {
            // Check if this line already has a data-i18n attribute
            const i18nTextRegex = new RegExp(`data-i18n="[^"]*">${escapedText}<`, 'g');
            if (!line.match(i18nTextRegex)) {
                hardcodedFound.push({text: text, line: i + 1});
                console.log(`  Hardcoded text found: "${text}" on line ${i + 1}`);
            }
        }
    }
}

if (hardcodedFound.length === 0) {
    console.log('No hardcoded texts found that need internationalization.');
} else {
    console.log(`\nFound ${hardcodedFound.length} texts that should be internationalized.`);
    console.log('Please add data-i18n attributes to these elements.');
}