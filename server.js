var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.engine('html', expressHbs({extname:'html', defaultLayout:'main'}));
app.set('view engine', 'html');
app.use('/images', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/js'));
var sleepLight = { 
  mode: 'sleep',
  time: '21:41',
  light1Bri: '169',
  light2Bri: '246',
  light3Bri: '84' 
}
var watchLight = { 
  mode: 'watch',
  time: '21:41',
  light1Bri: '169',
  light2Bri: '246',
  light3Bri: '84' 
}
var studyLight = { 
  mode: 'study',
  time: '21:41',
  light1Bri: '169',
  light2Bri: '246',
  light3Bri: '84' 
}
var diningLight = { 
  mode: 'dining',
  time: '21:41',
  light1Bri: '169',
  light2Bri: '246',
  light3Bri: '84' 
}
app.get('/', function(req, res){
   var file = {
    'sleep':sleepLight,
    'watch':watchLight,
    'study':studyLight,
    'dining':diningLight
  }
  res.render('index',file );
});

app.get('/sleep', function(req, res){
  res.render('index', sleepLight);
});

app.post('/setsleep', function(req, res){
   if (req.body.light1Bri){
    sleepLight = req.body;
    console.log(req.body);
  }else{
    sleepLight.time = req.body.time;
    console.log("SleepTime change to: " +  req.body.time);
  res.end();
}
  res.end();
});

app.get('/watch', function(req, res){
  res.render('index', watchLight);
});

app.post('/setwatch', function(req, res){
  if (req.body.light1Bri){
    watchLight = req.body;
    console.log(req.body);
  }else{
    watchLight.time = req.body.time;
    console.log("WatchTime change to: " +  req.body.time);
  res.end();
}
});

app.get('/study', function(req, res){
  res.render('index', studyLight);
});

app.post('/setstudy', function(req, res){
  if (req.body.light1Bri){
    studyLight = req.body;
    console.log(req.body);
  }else{
    studyLight.time = req.body.time;
    console.log("StudyTime change to: " +  req.body.time);
  res.end();
}
});

app.get('/dining', function(req, res){
  res.render('index', diningLight);
});

app.post('/setdining', function(req, res){
  if (req.body.light1Bri){
    diningLight = req.body;
    console.log(req.body);
  }else{
    diningLight.time = req.body.time;
    console.log("DiningTime change to: " +  req.body.time);
    res.end();
  }
});
app.get('/all', function(req, res){
  var file = {
    'sleep':sleepLight,
    'watch':watchLight,
    'study':studyLight,
    'dining':diningLight
  }
  res.send(file);
  res.end();
});
app.listen(8000, function(){
  console.log("server is running on port 8000");
});

