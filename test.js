var fs = require('fs');
var sharp = require('sharp');
var async = require('async');

var cacheMem = parseInt(process.env.CACHE_MEM || 20);
sharp.cache({memory: cacheMem, files:20, items: 100});

console.log("CACHE", sharp.cache());

var fileName = '100mpix.jpg';

var singleTest = function(cb) {
  fs.readFile(fileName, function (err, buffer ) {
    if (err) {
      throw err;
    }
    var i = sharp(buffer);
    i.embed().interpolateWith(sharp.interpolator.bicubic)
      .resize(1000,1000).rotate()
      .background({r:0,g:0,b:0,a:0}).quality(75)
      .toFormat('jpeg').toBuffer(function(err, output, info) {
      if (err) {
        throw err;
      }
      cb();
    });
  });
};

var run = function(name) {
  var count = 0;

  async.whilst(
      function () { return count < 5; },
      function (callback) {
        count++;
        console.log(name, "iteration", count, process.memoryUsage());
        singleTest(callback);
      },
      function (err, n) {
        console.log("CACHE BEFORE EXIT", sharp.cache());
      }
  );
};

run("example");
