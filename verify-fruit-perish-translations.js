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
    'Rue du CYRUS Ablogame N°1,Lomé, TOGO',
    'agecosco@gmail.com',
    'Tél. : (228) 90-05-74-66 Cél. : (228) 98-24-64-83',
    'Lun-Vend:9H-18H/ Sam:9H-12H',
    'GROUP AGECOSCO',
    'Fruits & Denrées Périssables - GROUP AGECOSCO | Inspection Maritime des Produits Frais',
    'Expert fruit and perishables inspection services',
    'Fruits &',
    'Perishables Services',
    'Temperature Control',
    'Quality Assessment',
    '24/7 Monitoring',
    'Expert Certification',
    'Our Complete Service Portfolio',
    'Tally Inspections and Supervisions',
    'Surveys & Damage Assessment',
    'Risk Management',
    'P&I Claims Handling',
    'Loss Prevention Plans',
    'Agrifood Sector',
    'Current service - specialized fresh produce handling',
    'Why Choose Our Fruit & Perishables Services?',
    'Our in-house surveyors are highly qualified and experienced professionals',
    'Our Professional Approach',
    'Proactive P&I claims handling with real-time updates for all parties',
    'Expert team dedicated to efficient, disruption-free claim resolution',
    'Advanced technology and analytics for streamlined processes',
    'Continuous improvement for the best possible service',
    'Specialized Fruit & Perishables Surveys',
    'Damage surveys to fruits and perishables with detailed assessment reports',
    'Quality and condition assessment using industry-standard protocols',
    'Temperature and storage monitoring throughout the supply chain',
    'See All Survey Services',
    'Key Features & Capabilities',
    '24/7 Claims Support — Always available for urgent needs and emergency situations',
    'Dedicated Claims Manager — Personalized assistance and expert guidance for every client',
    'Real-time Claims Tracking — Transparent updates and progress monitoring at every stage',
    'Comprehensive Reporting — Detailed insights and analytics for better decision-making',
    'Request a Consultation',
    'Client Benefits & Advantages',
    'Improved Claims Outcomes — Higher success rates and better settlements through expert handling',
    'Reduced Claims Processing Time — Streamlined procedures for faster resolution',
    'Enhanced Client Satisfaction — Personalized service and transparent communication',
    'Access to Expert Resources — Specialized knowledge and industry connections',
    'Our Expert Team',
    'Meet our experienced professionals dedicated to providing exceptional fruit and perishables inspection services',
    'TOSSOU Messan, Chief Executive Officer of GROUP AGECOSCO',
    'TOSSOU Messan',
    'Chief Executive Officer',
    'TOSSOU Ekoue Alex, Operations Manager at GROUP AGECOSCO',
    'TOSSOU Ekoue Alex',
    'Operations Manager',
    'NTOMBA MOÏSE, Senior Manager at GROUP AGECOSCO',
    'NTOMBA MOÏSE',
    'Senior Manager',
    'AHLONSOU Emmanuel, Project Manager at GROUP AGECOSCO',
    'AHLONSOU Emmanuel',
    'Project Manager',
    'Contact Information',
    'Rue du CYRUS-Ablogame N°1',
    'Villa N°140 - Zone Portuaire',
    'Lomé, TOGO',
    'Tél: (228) 90-05-74-66',
    'Cél: (228) 98-24-64-83',
    'info@agecosco.com',
    'Follow us on social media',
    'Our Services',
    'Quick Links',
    'Home',
    'About Us',
    'Our Services',
    'Branches',
    'Our Team',
    'Contact Us',
    'Newsletter',
    'Stay updated with our latest announcements and industry insights',
    'Votre email',
    'Subscribe to receive updates about our services and industry insights',
    'We respect your privacy. Unsubscribe at any time.',
    'Please enter a valid email address.',
    'Copyright © Agecosco 2025, All Right Reserved.',
    'Designed By',
    'Distributed By'
];

let hardcodedFound = [];
for (const text of hardcodedTexts) {
    // Check if the text exists in the file but is not within a data-i18n attribute
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const textRegex = new RegExp(`>\\s*${escapedText}\\s*<`, 'g');
    const matches = fruitPerishContent.match(textRegex);
    if (matches) {
        // Check if these matches are already internationalized
        const i18nTextRegex = new RegExp(`data-i18n="[^"]*">${escapedText}<`, 'g');
        const i18nMatches = fruitPerishContent.match(i18nTextRegex);
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