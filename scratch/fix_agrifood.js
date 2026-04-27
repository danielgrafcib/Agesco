const fs = require('fs');

try {
    let agrifood = fs.readFileSync('../agri-food.html', 'utf8');
    let survey = fs.readFileSync('../survey.html', 'utf8');

    // Get the good footer starting exactly from <!-- Footer Start --> to the end of the file
    const surveyFooterMatch = survey.match(/(<!-- Footer Start -->[\s\S]*?<\/html>)/i);
    if (!surveyFooterMatch) {
        console.error('Survey footer not found');
        process.exit(1);
    }
    const goodFooter = surveyFooterMatch[1];

    // Find the broken section in agrifood.html
    // It starts at <!-- Bootstrap JS Bundle --> and goes to the end
    const badSectionRegex = /<!-- Bootstrap JS Bundle -->[\s\S]*<\/html>/i;
    
    if (!badSectionRegex.test(agrifood)) {
        console.error('Bad section not found in agri-food.html');
        process.exit(1);
    }

    // Replace the bad section with the good footer
    agrifood = agrifood.replace(badSectionRegex, goodFooter);

    fs.writeFileSync('../agri-food.html', agrifood, 'utf8');
    console.log('Fixed successfully');
} catch (e) {
    console.error(e);
}
