const Kuroshiro = require("@dsquare-gbu/kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const Slugify = require('slugify');

const path = require("path");
const fs = require("fs");

const kuroshiro = new Kuroshiro();
const kuroshiroInitialized = kuroshiro.init(new KuromojiAnalyzer());

const toSafeFilename = (filename) => (
  kuroshiroInitialized.then(() =>
    kuroshiro.convert(filename, { to: "romaji" })
  ).then((res) => (
    Slugify(res, { lower: true, strict: true, locale: "ja" })
  ))
);

async function traverse(dirPath) {
  const stat = fs.statSync(dirPath);

  if (stat.isDirectory()) {
    const children = fs.readdirSync(dirPath);

    children.forEach((child) => {
      const childPath = path.join(dirPath, child);
      traverse(childPath);
    });

    const filename = path.basename(dirPath);
    const filenameWithoutSpaces = await toSafeFilename(filename);
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

async function main() {
  if (!process.argv[2]) {
    console.log("usage: node cleanSimfiles.js [root-dir]");
    process.exit(1);
  }

  await traverse(path.join(process.cwd(), process.argv[2]));
}

main();
