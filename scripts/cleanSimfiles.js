const path = require("path");
const fs = require("fs");

const REMOVE_FILE_EXTS = [
  ".mp3",
  ".mp4",
  ".ogg",
  ".avi",
  ".lrc",
  ".png",
  ".jpg",
  ".db",
];

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
    if (REMOVE_FILE_EXTS.findIndex((ext) => ext === path.extname(dirPath)) >= 0) {
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
