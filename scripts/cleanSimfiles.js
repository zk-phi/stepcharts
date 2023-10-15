const path = require("path");
const fs = require("fs");

function traverse(dirPath) {
  const stat = fs.statSync(dirPath);

  if (stat.isDirectory()) {
    const children = fs.readdirSync(dirPath);

    children.forEach((child) => {
      const childPath = path.join(dirPath, child);
      traverse(childPath);
    });

    const filename = path.basename(dirPath);
    const filenameWithoutSpaces = filename.replace(/\s/g, "-");
    const newPath = dirPath.replace(filename, filenameWithoutSpaces);

    if (dirPath !== newPath) {
      console.log(`Rename ${dirPath} -> ${newPath}`);
      fs.renameSync(dirPath, newPath);
    }
  } else {
    if ([".sm", ".dwi"].findIndex((ext) => ext === path.extname(dirPath)) === -1) {
      console.log(`Delete ${dirPath}`);
      fs.unlinkSync(dirPath);
    }
  }
}

function main() {
  if (!process.argv[2]) {
    console.log("usage: node cleanSimfiles.js [root-dir]");
    process.exit(1);
  }

  traverse(path.join(process.cwd(), process.argv[2]));
}

main();
