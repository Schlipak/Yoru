'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// New

var cheerio = require('cheerio');
var fs = require('fs-extra');
var ora = require('ora');
var path = require('path');

var _require = require('./utils'),
    Logger = _require.Logger,
    SilentLogger = _require.SilentLogger,
    Run = _require.Run,
    ShSpawn = _require.ShSpawn,
    Scribe = _require.Scribe;

var copySkeletonFiles = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
    var strmIn, strmOut, html, $;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // {{name}}.js
            fs.appendFileSync('app/' + name + '.js', '// Entry point for ' + name + '\n\n');
            strmIn = fs.createReadStream(path.join(__dirname, '/../skeletons/app.skeleton.js'));
            strmOut = fs.createWriteStream('app/' + name + '.js', { flags: 'a' });

            strmIn.pipe(strmOut);

            // index.html
            html = fs.readFileSync(path.join(__dirname, '/../skeletons/index.skeleton.html'));
            $ = cheerio.load(html, { normalizeWhitespace: true });

            $('title').text('\uFF39\uFF2F\uFF32\uFF35 \u30FC ' + Scribe.constantize(name));
            $('hello-yoru').attr('y:appname', Scribe.constantize(name));
            $('hello-yoru').attr('y:filename', name);
            $('#skeleton-entry-point').attr('src', './' + name + '.js');
            $('#skeleton-entry-point').removeAttr('id');
            fs.appendFileSync('app/index.html', $.html());

            // hello-yoru.html
            strmIn = fs.createReadStream(path.join(__dirname, '/../skeletons/hello-yoru.skeleton.html'));
            strmOut = fs.createWriteStream('app/templates/hello-yoru.html');
            strmIn.pipe(strmOut);

            // _all.html
            strmIn = fs.createReadStream(path.join(__dirname, '/../skeletons/_all.skeleton.html'));
            strmOut = fs.createWriteStream('app/templates/_all.html');
            strmIn.pipe(strmOut);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function copySkeletonFiles(_x) {
    return _ref.apply(this, arguments);
  }

  return copySkeletonFiles;
}();

var createSkeleton = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fs.ensureDir('assets');

          case 2:
            _context2.next = 4;
            return fs.ensureDir('app');

          case 4:
            process.chdir('app');
            fs.closeSync(fs.openSync(name + '.js', 'w'));
            _context2.next = 8;
            return fs.ensureDir('templates');

          case 8:
            _context2.next = 10;
            return fs.ensureDir('routes');

          case 10:
            process.chdir('..');
            _context2.next = 13;
            return copySkeletonFiles(name);

          case 13:
            return _context2.abrupt('return', 'Created skeleton directory structure in ./' + name);

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function createSkeleton(_x2) {
    return _ref2.apply(this, arguments);
  }

  return createSkeleton;
}();

var createPackageJson = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(name) {
    var packageDefaults;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            packageDefaults = {
              name: name,
              version: '0.1.0',
              description: 'My new Yoru app',
              main: 'app/' + name + '.js',
              scripts: {
                test: 'echo "Error: no test specified" && exit 1'
              },
              keywords: ['yoru'],
              author: '',
              license: 'MIT',
              dependencies: {
                yoru: 'https://github.com/Schlipak/Yoru'
              }
            };


            fs.writeFileSync('package.json', JSON.stringify(packageDefaults, null, 2));
            return _context3.abrupt('return', 'Created package.json');

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function createPackageJson(_x3) {
    return _ref3.apply(this, arguments);
  }

  return createPackageJson;
}();

var getManagerOpts = function getManagerOpts(manager) {
  return {
    npm: ['install', '--production'],
    yarn: ['install', '--production']
  }[manager];
};

var installDependencies = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(name, manager) {
    var output;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return ShSpawn(manager, getManagerOpts(manager));

          case 2:
            output = _context4.sent;

            if (output) {
              Run.later(function () {
                if (output.stderr) {
                  output.stderr.trim().split('\n').forEach(function (line) {
                    return Logger.warn(line);
                  });
                }
                if (output.stdout) {
                  output.stdout.trim().split('\n').forEach(function (line) {
                    return Logger.info(line);
                  });
                }
              }, 10);
            }
            return _context4.abrupt('return', 'Installed dependencies');

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  function installDependencies(_x4, _x5) {
    return _ref4.apply(this, arguments);
  }

  return installDependencies;
}();

var newApp = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(name, manager) {
    var promise;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            name = Scribe.dasherize(name);
            if (!/^[\w\d][\w\d-]*$/.test(name)) {
              Logger.error('Invalid app name `' + name + '\'');
              Logger.error('Name must match /^[\\w\\d][\\w\\d-]*$/');
              process.exit(1);
            }
            Logger.info('Creating new Yoru app `' + name + '\'');
            _context5.prev = 3;

            if (!fs.existsSync(name)) {
              _context5.next = 6;
              break;
            }

            throw 'Path ./' + name + ' already exists, please choose another name';

          case 6:
            _context5.next = 8;
            return fs.ensureDir(name);

          case 8:
            process.chdir(name);
            promise = createSkeleton(name);

            ora.promise(promise, 'Creating skeleton directory structure');
            _context5.next = 13;
            return promise;

          case 13:
            promise = createPackageJson(name);
            ora.promise(promise, 'Creating package.json');
            _context5.next = 17;
            return promise;

          case 17:
            promise = installDependencies(name, manager);
            ora.promise(promise, 'Installing dependencies');
            _context5.next = 21;
            return promise;

          case 21:
            _context5.next = 27;
            break;

          case 23:
            _context5.prev = 23;
            _context5.t0 = _context5['catch'](3);

            Logger.error(_context5.t0);
            process.exit(1);

          case 27:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[3, 23]]);
  }));

  function newApp(_x6, _x7) {
    return _ref5.apply(this, arguments);
  }

  return newApp;
}();

module.exports = newApp;