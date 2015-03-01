var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser')
var schedule = require('node-schedule');
var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
    //scheduleId = result.id;
};
var displayError = function(result) {
    console.log(JSON.stringify(result, null, 2));
    //scheduleId = result.id;
};
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var host = "128.122.151.166",
    username = "DanielMelancon",
    api = new HueApi(host, username)
var host2 = "128.122.151.76",
    username = "DanielMelancon",
    apiStrip = new HueApi(host2, username)
  

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.engine('html', expressHbs({extname:'html', defaultLayout:'main'}));
app.set('view engine', 'html');
app.use('/images', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/js'));

//data
var sleepLight = { 
  mode: 'sleep',
  time: '10:41',
  light1R: '0',
  light1G: '10',
  light1B: '0',
  light1Bri: 169,
  light2Bri: 246,
  light3Bri: 84,
  on: 1
}

var watchLight = { 
  mode: 'watch',
  time: '21:41',
  light1R: '255',
  light1G: '0',
  light1B: '0',
  light1Bri: 169,
  light2Bri: 246,
  light3Bri: 84,
  on: 0
}

var studyLight = { 
  mode: 'study',
  time: '05:41',
  light1R: '255',
  light1G: '255',
  light1B: '255',
  light1Bri: 169,
  light2Bri: 246,
  light3Bri: 84,
  on: 1
}

var diningLight = { 
  mode: 'dining',
  time: '18:41',
  light1R: '255',
  light1G: '200',
  light1B: '0',
  light1Bri: 0,
  light2Bri: 0,
  light3Bri: 84,
  on: 0
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

//route to test Sleep mode
app.get('/testsleep', function(req, res){
  lightTest(sleepLight);
  res.end();
});

app.get('/sleep/:bool', function(req, res){
  sleepLight.on = req.params.bool;
  setSchedule(sleepLight);
  console.log(sleepLight);
  res.end();
});

//route to test Sleep mode
app.post('/setsleep', function(req, res){
  console.log(req.body)
  if (req.body.light1Bri) sleepLight.light1Bri = req.body.light1Bri;
  if (req.body.light2Bri) sleepLight.light2Bri = req.body.light2Bri;
  if (req.body.light3Bri) sleepLight.light3Bri = req.body.light3Bri;
  if (req.body.time) sleepLight.time = req.body.time;
  setSchedule(sleepLight)
  res.end();
});

//route to test Watch mode
app.get('/testwatch', function(req, res){
  lightTest(watchLight);
  res.end();
});

app.get('/watch/:bool', function(req, res){
  watchLight.on = req.params.bool;
  setSchedule(watchLight);
  console.log(watchLight);
  res.end();
});

//route to test Watch mode
app.post('/setwatch', function(req, res){
   console.log(req.body)
  if (req.body.light1Bri) watchLight.light1Bri = req.body.light1Bri;
  if (req.body.light2Bri) watchLight.light2Bri = req.body.light2Bri;
  if (req.body.light3Bri) watchLight.light3Bri = req.body.light3Bri;
  if (req.body.time) watchLight.time = req.body.time;
  setSchedule(watchLight)
  res.end();
});

//route to test Study mode
app.get('/teststudy', function(req, res){
    lightTest(studyLight);
    res.end();
});

app.get('/study/:bool', function(req, res){
   studyLight.on = req.params.bool;
   setSchedule(studyLight);
    console.log(studyLight);
    res.end();
});

//route to set Study mode
app.post('/setstudy', function(req, res){
   console.log(req.body)
  if (req.body.light1Bri) studyLight.light1Bri = req.body.light1Bri;
  if (req.body.light2Bri) studyLight.light2Bri = req.body.light2Bri;
  if (req.body.light3Bri) studyLight.light3Bri = req.body.light3Bri;
  if (req.body.time) studyLight.time = req.body.time;
  setSchedule(studyLight)
  res.end();
});

//route to test Dining mode
app.get('/testdining', function(req, res){
  lightTest(diningLight);
  res.end();
});

app.get('/dining/:bool', function(req, res){
  diningLight.on = req.params.bool;
  console.log(diningLight);
  setSchedule(diningLight);
  res.end();
});

//route to set Dining mode
app.post('/setdining', function(req, res){
   console.log(req.body)
  if (req.body.light1Bri) diningLight.light1Bri = req.body.light1Bri;
  if (req.body.light2Bri) diningLight.light2Bri = req.body.light2Bri;
  if (req.body.light3Bri) diningLight.light3Bri = req.body.light3Bri;
  if (req.body.time) diningLight.time = req.body.time;
  setSchedule(diningLight);
  res.end();
});

//route to see all data
app.get('/all', function(req, res){
  var file = {
    'sleep':sleepLight,
    'watch':watchLight,
    'study':studyLight,
    'dining':diningLight
  }
  res.send(JSON.stringify(file));
  res.end();
});

app.listen(8000, function(){
  console.log("server is running on port 8000");
});



//creates 3 lightstates and passes in each light's brightness

var lightTest = function(typeLight){
    r =   parseInt(typeLight.light1R)
    g =   parseInt(typeLight.light1G)
    b =   parseInt(typeLight.light1B)
    bri1 =   parseInt(typeLight.light1Bri)
    state1 = lightState.create().rgb(r,g,b).on().bri(bri1).transition(400);;
    bri2 =   parseInt(typeLight.light2Bri)
    state2 = lightState.create().on().bri(bri2).transition(400);
    bri3 =   parseInt(typeLight.light3Bri)
    state3 = lightState.create().on().bri(bri3).transition(400);;

    api.setLightState(1, state1)
        .then(displayResult)
        .fail(displayError)
        .done();

    api.setLightState(4, state2)
        .then(displayResult)
        .fail(displayError)
        .done();

    apiStrip.setLightState(1, state3)
        .then(displayResult)
        .fail(displayError)
        .done();
}

var setSchedule = function(typeLight){
  console.log(typeLight.on);
  if (typeLight.schedule) schedule.cancelJob(typeLight.schedule.name);
  var cronJob =  typeLight.time.slice(0,2) + ' ' + typeLight.time.slice(3,5)  + ' * * *'
  console.log(cronJob);
  if (typeLight.on == 1){
    typeLight.schedule = schedule.scheduleJob(cronJob, function(){
      lightTest(typeLight);
      console.log(typeLight.mode + "Event is Happening")
    });
    console.log(typeLight.schedule.name);
    typeLight.schedule.name = typeLight.mode;
    console.log(typeLight.mode + "cron is On");
    //console.log(schedule);
  }else{
    if (typeLight.schedule){
      schedule.cancelJob(typeLight.schedule.name);
      console.log(typeLight.mode + "cron is Off")
    }
  }

}
