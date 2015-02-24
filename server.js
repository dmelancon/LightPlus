var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser')

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
   //state = lightState.create();

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
  light1Bri: '0',
  light2Bri: '0',
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

//route to test Sleep mode
app.get('/testsleep', function(req, res){
  lightTest(sleepLight);
  res.end();
});
//route to test Sleep mode
app.post('/setsleep', function(req, res){
 if (req.body.light1Bri){
    sleepLight = req.body;
    console.log(req.body);
  }else{
    sleepLight.time = req.body.time;
    console.log("SleepTime change to: " +  req.body.time);
  }
  res.end();
});

//route to test Watch mode
app.get('/testwatch', function(req, res){
  lightTest(watchLight);
  res.end();
});

//route to test Watch mode
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

//route to test Study mode
app.get('/teststudy', function(req, res){
    lightTest(studyLight);
    res.end();
});

//route to set Study mode
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

//route to test Dining mode
app.get('/testdining', function(req, res){
  lightTest(diningLight);
  res.end();
});
//route to set Dining mode
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

//route to see all data
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



//creates 3 lightstates and passees in each light's brightness

var lightTest = function(typeLight){
    bri1 =   parseInt(typeLight.light1Bri)
    state1 = lightState.create().on().bri(bri1).transition(400);;
    bri2 =   parseInt(typeLight.light2Bri)
    state2 = lightState.create().on().bri(bri2).transition(400);
    // bri3 =   int(typeLightLight.light3Bri)
    // state3 = lightState.create().on().bri(bri3).transition(400);;

    api.setLightState(1, state1)
        .then(displayResult)
        .fail(displayError)
        .done();

    api.setLightState(4, state2)
        .then(displayResult)
        .fail(displayError)
        .done();

    // api.setLightState(1, state3)
    //     .then(displayResult)
    //     .fail(displayError)
    //     .done();
}



