import path from 'path';
import os from 'os';
import fs from 'fs';
import {cp, ln, mkdir, rm, test, ls} from 'shelljs';

const links = path.join(process.cwd(), '/test/links');

function setup(link, fixture) {
  const fixtures = path.join(os.tmpdir(), '/flos/fixtures/');
  const dir = path.join(fixtures, fixture);
  const src = path.join(process.cwd(), `test/fixtures/${fixture}`);

  // create tmp fixture folder
  mkdir('-p', dir);
  // copy fixture contents to tmp folder
  cp('-r', src, fixtures);
  if (!test('-e', links)) {
    // create 'links' folder if not exists
    mkdir('-p', links);
  }
  // in 'links' folder, create a symlink to the tmp fixture folder
  ln('-sf', dir, link);
  console.log('Created link ' + link + ' to ' + dir);
  ls('-RAd', dir).forEach(file => {
    console.log(file);
  });

  return link;
}

function cleanup(name) {
  rm('-rf', path.join(links, name || '*'));
  rm('-rf', path.join(os.tmpdir(), '/flos/fixtures', name || '*'));
}

function fixture(name) {
  const link = path.join(links, name);
  if (!test('-e', link)) {
    setup(link, name);
  }

  const root = fs.realpathSync(link);
  return (...paths) => path.join(root, ...paths);
}

module.exports = {
  fixture,
  cleanup
};

