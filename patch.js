const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

/*
It simply goes to the file whose path is in line 2 (which is a web pack config)
and it replaces node: false with node: {crypto: true, stream: true}
 */

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
