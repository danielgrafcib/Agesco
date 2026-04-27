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
        { find: /<small class=\"fas fa-map-marker-alt text-white\"><\/small>/g, replace: '<i class=\"fas fa-map-marker-alt text-white\"></i>' },
        { find: /<small class=\"fas fa-envelope text-white\"><\/small>/g, replace: '<i class=\"fas fa-envelope text-white\"></i>' },
        { find: /<small class=\"fas fa-phone-alt text-white\"><\/small>/g, replace: '<i class=\"fas fa-phone-alt text-white\"></i>' },
        { find: /<small class=\"fas fa-clock text-white\"><\/small>/g, replace: '<i class=\"fas fa-clock text-white\"></i>' }
    ];
    regexes.forEach(r => {
        if (content.match(r.find)) {
            content = content.replace(r.find, r.replace);
            modified = true;
        }
    });
    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Fixed icons in ' + file);
    }
});
