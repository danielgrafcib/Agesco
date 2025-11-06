const fs = require('fs');
const path = require('path');

// Read the dictionary file
const dictionaryContent = fs.readFileSync('js/dictionary.js', 'utf8');

// Read the branches.html file
const branchesContent = fs.readFileSync('branches.html', 'utf8');

// Extract all data-i18n attributes from branches.html
const i18nRegex = /data-i18n="([^"]+)"/g;
let match;
let missingTranslations = [];

console.log('Checking branches.html for missing translations...\n');

while ((match = i18nRegex.exec(branchesContent)) !== null) {
    const key = match[1];
    // Check if this key exists in the dictionary
    if (!dictionaryContent.includes(`"${key}"`)) {
        missingTranslations.push(key);
        console.log(`  Missing translation key: ${key}`);
    }
}

if (missingTranslations.length === 0) {
    console.log('All translations are complete!');
} else {
    console.log(`\nFound ${missingTranslations.length} missing translation keys.`);
    console.log('Please add these keys to js/dictionary.js with appropriate translations.');
}

// Also check for hardcoded texts that should be internationalized
console.log('\nChecking for hardcoded texts that should be internationalized...\n');

const hardcodedTexts = [
    'Our Global Network',
    'Strategic offices across West Africa',
    'Regional Offices & Branches',
    'Our network spans across major West African ports',
    'Assistant Manager',
    'PORT',
    'PORT DE COTONOU',
    'LAGOS PORT',
    'PORT D\'ABIDJAN',
    'PORT DE DOUALA',
    'PORT DE LIBREVILLE',
    'LAND TRANSPORT',
    'Our Portfolio & Projects',
    'Explore our comprehensive range',
    'Our Accreditations & Certifications',
    'Active Certifications',
    'Countries Certified',
    'Compliance Rate',
    'Stay updated with our latest maritime services',
    'We respect your privacy',
    'Copyright',
    'All Right Reserved'
];

let hardcodedFound = [];
for (const text of hardcodedTexts) {
    // Check if the text exists in the file but is not within a data-i18n attribute
    const textRegex = new RegExp(`>\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g');
    const matches = branchesContent.match(textRegex);
    if (matches) {
        // Check if these matches are already internationalized
        const i18nTextRegex = new RegExp(`data-i18n="[^"]*">${text}<`, 'g');
        const i18nMatches = branchesContent.match(i18nTextRegex);
        if (!i18nMatches || i18nMatches.length < matches.length) {
            hardcodedFound.push(text);
            console.log(`  Hardcoded text found: ${text}`);
        }
    }
}

if (hardcodedFound.length === 0) {
    console.log('No hardcoded texts found that need internationalization.');
} else {
    console.log(`\nFound ${hardcodedFound.length} texts that should be internationalized.`);
    console.log('Please add data-i18n attributes to these elements.');
}