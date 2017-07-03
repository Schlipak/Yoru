// New

const cheerio = require('cheerio');
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');

const { Logger, SilentLogger, Run, ShSpawn, Scribe } = require('./utils');

const copySkeletonFiles = async function copySkeletonFiles(name) {
  // {{name}}.js
  fs.appendFileSync(`app/${name}.js`, `// Entry point for ${name}\n\n`);
  let strmIn = fs.createReadStream(
    path.join(__dirname, '/../skeletons/app.skeleton.js')
  );
  let strmOut = fs.createWriteStream(`app/${name}.js`, { flags: 'a' });
  strmIn.pipe(strmOut);

  // index.html
  const html = fs.readFileSync(
    path.join(__dirname, '/../skeletons/index.skeleton.html')
  );
  const $ = cheerio.load(html, { normalizeWhitespace: true });
  $('title').text(`ＹＯＲＵ ー ${Scribe.constantize(name)}`);
  $('hello-yoru').attr('y:appname', Scribe.constantize(name));
  $('hello-yoru').attr('y:filename', name);
  $('#skeleton-entry-point').attr('src', `./${name}.js`);
  $('#skeleton-entry-point').removeAttr('id');
  fs.appendFileSync('app/index.html', $.html());

  // hello-yoru.html
  strmIn = fs.createReadStream(
    path.join(__dirname, '/../skeletons/hello-yoru.skeleton.html')
  );
  strmOut = fs.createWriteStream('app/templates/hello-yoru.html');
  strmIn.pipe(strmOut);

  // _all.html
  strmIn = fs.createReadStream(
    path.join(__dirname, '/../skeletons/_all.skeleton.html')
  );
  strmOut = fs.createWriteStream('app/templates/_all.html');
  strmIn.pipe(strmOut);
};

const createSkeleton = async function createSkeleton(name) {
  await fs.ensureDir('assets');
  await fs.ensureDir('app');
  process.chdir('app');
  fs.closeSync(fs.openSync(`${name}.js`, 'w'));
  await fs.ensureDir('templates');
  await fs.ensureDir('routes');
  process.chdir('..');
  await copySkeletonFiles(name);
  return `Created skeleton directory structure in ./${name}`;
};

const createPackageJson = async function createPackageJson(name) {
  const packageDefaults = {
    name: name,
    version: '0.1.0',
    description: 'My new Yoru app',
    main: `app/${name}.js`,
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: ['yoru'],
    author: '',
    license: 'MIT',
    dependencies: {
      yoru: 'https://github.com/Schlipak/Yoru',
    },
  };

  fs.writeFileSync('package.json', JSON.stringify(packageDefaults, null, 2));
  return 'Created package.json';
};

const getManagerOpts = function getManagerOpts(manager) {
  return {
    npm: ['install', '--production'],
    yarn: ['install', '--production'],
  }[manager];
};

const installDependencies = async function installDependencies(name, manager) {
  const output = await ShSpawn(manager, getManagerOpts(manager));
  if (output) {
    Run.later(() => {
      if (output.stderr) {
        output.stderr.trim().split('\n').forEach(line => Logger.warn(line));
      }
      if (output.stdout) {
        output.stdout.trim().split('\n').forEach(line => Logger.info(line));
      }
    }, 10);
  }
  return 'Installed dependencies';
};

const newApp = async function newApp(name, manager) {
  name = Scribe.dasherize(name);
  if (!/^[\w\d][\w\d-]*$/.test(name)) {
    Logger.error(`Invalid app name \`${name}'`);
    Logger.error(
      'Name must match /^[\\w\\d][\\w\\d-]*$/'
    );
    process.exit(1);
  }
  Logger.info(`Creating new Yoru app \`${name}'`);
  try {
    if (fs.existsSync(name)) {
      throw `Path ./${name} already exists, please choose another name`;
    }
    await fs.ensureDir(name);
    process.chdir(name);
    let promise = createSkeleton(name);
    ora.promise(promise, 'Creating skeleton directory structure');
    await promise;
    promise = createPackageJson(name);
    ora.promise(promise, 'Creating package.json');
    await promise;
    promise = installDependencies(name, manager);
    ora.promise(promise, 'Installing dependencies');
    await promise;
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
};

module.exports = newApp;
