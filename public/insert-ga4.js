const fs = require('fs');
const path = require('path');

const ga4Snippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CLE62Y9TYD"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CLE62Y9TYD');
</script>`;

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walkDir(file));
            }
        } else {
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = walkDir('.');
let modifiedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('G-CLE62Y9TYD')) {
        // Attempt to insert after <head> or <head ...>
        if (content.match(/<head[^>]*>/i)) {
            content = content.replace(/(<head[^>]*>)/i, `$1\n${ga4Snippet}\n`);
            fs.writeFileSync(file, content, 'utf8');
            modifiedCount++;
        }
    }
});

console.log(`GA4 tag inserted into ${modifiedCount} files.`);
