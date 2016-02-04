var fs = require('fs');
var sharp = require('sharp');
var async = require('async');

var fileName = '100mpix.jpg';

var singleTest = function(cb) {
  fs.readFile(fileName, function (err, buffer ) {
    if (err) {
      throw err;
    }
    var i = sharp(buffer);
    i.metadata(function(err, metadata) {
      if (err) {
        throw err;
      }
      console.log("metadata:", metadata);
      i.embed().interpolateWith(sharp.interpolator.bicubic)
        .resize(1000,1000).rotate()
        .background({r:0,g:0,b:0,a:0}).quality(75)
        .toFormat('jpeg').toBuffer(function(err, output, info) {
        if (err) {
          throw err;
        }
        console.log("info:", info);
        cb();
      });
    });
  });
};

var run = function(name) {
  var count = 0;

  async.whilst(
      function () { return count < 50000; },
      function (callback) {
        count++;
        console.log(name, "next", count);
        singleTest(callback);
      },
      function (err, n) {
          // 5 seconds have passed, n = 5
      }
  );
};

run("a");
