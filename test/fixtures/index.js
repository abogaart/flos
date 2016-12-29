import fs from 'fs';
import os from 'os';
import path from 'path';
import pathUtil from 'path-util';
import {cp, ln, mkdir, rm, test} from 'shelljs';

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
  return (...paths) => pathUtil.canonicalize(path.join(root, ...paths));
}

module.exports = {
  fixture,
  cleanup
};

