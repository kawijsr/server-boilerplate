const {createHash} = require('crypto');
const {readFileSync, renameSync, writeFileSync} = require('fs');
const {join, sep, dirname} = require('path');
const {statSync, readdir} = require('fs');
const {EOL} = require('os');
const pwd = process.cwd();
const ext = ['.js', '.css'];
const assetsPath = join(pwd, 'dist', '.assets');
const manifest = {};

const versionAsset = (filePath) => {
  const fileName = filePath.split(sep).pop();
  const fileExt = ext.find(e => fileName.endsWith(e));

  if (!fileExt) {
    console.warn(`not a file allowed ${ext}:`, filePath);
    return;
  }

  const file = readFileSync(filePath);

  const hash = createHash('md5').update(file).digest('hex');
  const newFileName = fileName.replace(fileExt, `.${hash}${fileExt}`);
  const newPath = join(dirname(filePath), newFileName);

  renameSync(filePath, newPath);
  manifest[filePath.replace(assetsPath, '')] = newPath.replace(assetsPath, '');
  writeFileSync(
      join(assetsPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
  );
  console.log('versioned:', newFileName);
}

const versionFiles = (dir) => {
  if (!statSync(dir).isDirectory()) {
    console.error(`${dir} is not a directory`);
    return;
  }

  readdir(dir, {recursive: true}, (err, files) => {
    files.forEach(function(file) {
      if (ext.find(e => file.endsWith(e))) {
        versionAsset(join(dir, file))
      }
    });
  });
}

versionFiles(assetsPath);
