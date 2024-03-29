// Generated by CoffeeScript 1.11.1
(function() {
  var comments, correct, data, expected, fs, hack, i, len, likes, rate, tags, values;

  fs = require('fs');

  data = require('./devpostdump.json');

  console.log("Project count =" + data.length);

  values = [0.710852, 0.918123, 0.022008, 0.063375, 0.227326];

  rate = function(likes, comments, tags) {
    var a, b, c, x, z;
    z = values[0];
    x = values[1];
    a = values[2];
    b = values[3];
    c = values[4];
    return z * (x * ((a * likes) + (b * comments)) + (c * c * tags));
  };

  correct = 0;

  for (i = 0, len = data.length; i < len; i++) {
    hack = data[i];
    likes = hack.num_likes * 2;
    comments = hack.num_comments * 2;
    tags = hack.tags.length * 2;
    console.log(hack.name);
    console.log("Predicted " + (rate(likes, comments, tags)));
    expected = hack.num_prizes;
    if (hack.num_prizes === void 0) {
      expected = 0;
    }
    if (expected === Math.round(rate(hack.num_likes, hack.num_comments, hack.tags.length * 2))) {
      correct += 1;
    }
  }

  console.log("Correctness = " + correct / data.length);

}).call(this);
