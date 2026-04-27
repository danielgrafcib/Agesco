const fs = require('fs');

try {
    let fruit = fs.readFileSync('../fruit-perish.html', 'utf8');
    let survey = fs.readFileSync('../survey.html', 'utf8');

    const surveyFooterMatch = survey.match(/(<!-- Footer Start -->[\s\S]*?<!-- Copyright End -->)/);
    if (!surveyFooterMatch) {
        console.error('Survey footer not found');
        process.exit(1);
    }
    const goodFooter = surveyFooterMatch[1];

    const fruitFooterRegex = /<!-- Enhanced Footer Start -->[\s\S]*?<!-- Copyright End -->/;
    if (!fruitFooterRegex.test(fruit)) {
        console.error('Fruit footer not found');
        process.exit(1);
    }

    fruit = fruit.replace(fruitFooterRegex, goodFooter);

    fruit = fruit.replace(/<script src="js\/main\.js"><\/script>\s*<\/div>\s*<\/body>/g, '<script src="js/main.js"></script>\r\n</body>');

    fs.writeFileSync('../fruit-perish.html', fruit, 'utf8');
    console.log('Fixed successfully');
} catch (e) {
    console.error(e);
}
