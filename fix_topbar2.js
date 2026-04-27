const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'lib' && file !== '.git') {
                getAllHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = getAllHtmlFiles(process.cwd());
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    const regexes = [
        { find: /<small data-i18n=\"topbar\.address\">/g, replace: '<small class=\"text-white\" data-i18n=\"topbar.address\">' },
        { find: /<small data-i18n=\"topbar\.email\">/g, replace: '<small class=\"text-white\" data-i18n=\"topbar.email\">' },
        { find: /<small data-i18n=\"topbar\.phone\">/g, replace: '<small class=\"text-white\" data-i18n=\"topbar.phone\">' },
        { find: /<small data-i18n=\"topbar\.hours\">/g, replace: '<small class=\"text-white\" data-i18n=\"topbar.hours\">' },
        { find: /<small>Rue du CYRUS/g, replace: '<small class=\"text-white\">Rue du CYRUS' },
        { find: /<small>Info@groupagecosco\.com<\/small>/g, replace: '<small class=\"text-white\">Info@groupagecosco.com</small>' },
        { find: /<small>Tél\. : \(228\)/g, replace: '<small class=\"text-white\">Tél. : (228)' },
        { find: /<small>Lun - Vend/g, replace: '<small class=\"text-white\">Lun - Vend' }
    ];
    regexes.forEach(r => {
        if (content.match(r.find)) {
            content = content.replace(r.find, r.replace);
            modified = true;
        }
    });
    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    }
});
