var fs = require('fs');
var sharp = require('sharp');
var async = require('async');
var pathModule = require('path');

sharp.cache(false);

var fileName = '100mpix.jpg';

var image = fs.readFileSync(pathModule.resolve(__dirname, '100mpix.jpg'));

var singleTest = function(cb) {
  var i = sharp(image);
  i.embed().interpolateWith(sharp.interpolator.bicubic)
    .resize(1000,1000).rotate()
    .background({r:0,g:0,b:0,a:0}).quality(75)
    .toFormat('jpeg').toBuffer(function(err, output, info) {
    if (err) {
      throw err;
    }
    cb();
  });
};

var run = function(name) {
  var count = 0;

  var num = 500;
  var iterationNumbers = [];
  for (var i = 1 ; i <= num ; i += 1) {
    iterationNumbers.push(i);
  }

  async.eachLimit(iterationNumbers, 1, function (iterationNumber, cb) {
    console.log(name, "before iteration #" + iterationNumber, process.memoryUsage());
    singleTest(cb);
  }, function (err) {
    if (err) throw err;
  });
};

run("example");
