const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(process.cwd(), 'dist');

function rewriteFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const rewritten = source.replace(
    /require\((['"])@\/([^'"]+)\1\)/g,
    (_match, quote, target) => {
      let relative = path.relative(path.dirname(filePath), path.join(distDir, target));
      if (!relative.startsWith('.')) relative = `./${relative}`;
      return `require(${quote}${relative.split(path.sep).join('/')}${quote})`;
    },
  );

  if (rewritten !== source) fs.writeFileSync(filePath, rewritten);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.js')) rewriteFile(fullPath);
  }
}

walk(distDir);
