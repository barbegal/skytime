var fs = require('fs');
var moment = require('moment');
var express = require('express');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

//for 0>16 slices
//for a bunch of dates thanks moment

var prefix = 'https://spaceneedledev.com/panocam/assets/';
var url = 'https://spaceneedledev.com/panocam/assets/2018/08/22/2018_0822_073000/slice1.jpg';
var post = '2018/08/22/2018_0822_073000/';
var file = 'slice';
var des = '/files/';
var type = '.jpg';

if (!fs.existsSync(des+post)) fs.mkdirSync(des+post);
download(url,des+post);


var app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))