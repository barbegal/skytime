var fs = require('fs'); //file writing
var moment = require('moment'); //datetime
var express = require('express'); //server
var https = require('https'); //request
var reload = require('reload') // reload server
//var SunCalc = require('suncalc'); // sunrise times
var mergeImg = require('merge-img');// measure images 

var prefix = 'https://spaceneedledev.com/panocam/assets/';
var url = 'https://spaceneedledev.com/panocam/assets/2018/08/22/2018_0822_073000/slice1.jpg';
var date = '2018/07/22/2018_0722_'
//var time = '073000/';

var filename = '/slice';
var des = './files/';
var type = '.jpg';

//STEP 2 - LETS PICK A DATE
var a = moment()

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds))
}

async function send() {
  for (var i = 6; i<22; i++){
    var hour = (i<10)?'0'+i:i; 
    for (var t = 0; t<6;t++){
      var time = hour+''+t+'000';
      var merge = [];
      //if exists target... then list and delete asset
      var target = des+time+type;
      if (!(fs.existsSync(target))){
        console.log('trying '+target);
        for (var n = 0;n<17;n++){
          var url = prefix+date+time+filename+n+type;
          var location = des+time+'-'+n+type;
          if (!(fs.existsSync(location))){
            download(url, location);
            console.log(location);
            await wait(500);
          }
          if (fs.existsSync(location)) {
            merge.push(location);
          }
        }
        if (merge.length > 16){
          try {
            let img = await mergeImg(merge);
          img.write(target);
          } catch(err) {
            console.log(err);
          }
        }
      } 
      if (fs.existsSync(target)){//exists, so delete merge locations
        for (var n = 0;n<17;n++){
          var location = des+time+'-'+n+type;
          if (fs.existsSync(location)) fs.unlinkSync(location);
        }
      }
    }
  }
  //var times = SunCalc.getTimes(new Date(), 51.5, -0.1);
  //var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
}

send()

var app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('to do: open client react-app');
})
 
reload(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))