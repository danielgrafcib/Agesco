const fs = require('fs');

// Read the fruit-perish.html file
const fruitPerishContent = fs.readFileSync('fruit-perish.html', 'utf8');

// Test text to find
const testText = 'Perishables Services';

// Create a regex that matches the text between > and <
const escapedText = testText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const textRegex = new RegExp(`>\\s*${escapedText}\\s*<`, 'g');
console.log(`Looking for: ${testText}`);
console.log(`Using regex: ${textRegex}`);

// Find all matches
let match;
let count = 0;
while ((match = textRegex.exec(fruitPerishContent)) !== null) {
    count++;
    console.log(`Found match ${count} at position ${match.index}`);
    
    // Show the context around the match
    const start = Math.max(0, match.index - 50);
    const end = Math.min(fruitPerishContent.length, match.index + escapedText.length + 50);
    console.log(`Context: ${fruitPerishContent.substring(start, end)}`);
    
    // Check if this line has data-i18n
    const lines = fruitPerishContent.substring(start, end).split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(testText)) {
            console.log(`Line has data-i18n: ${lines[i].includes('data-i18n')}`);
            if (lines[i].includes('data-i18n')) {
                console.log(`data-i18n attribute: ${lines[i].match(/data-i18n="[^"]*"/)}`);
            }
        }
    }
}

console.log(`Total matches found: ${count}`);