var express = require('express');
var app = express();
var path = require('path');
var fileSystem = require('fs');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/jsApp.js', express.static(__dirname + '/jsApp.js'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/lang', express.static(__dirname + '/lang'));
app.use(bodyParser.json()); // for parsing application/json

var config = require("./data/users.json");


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var users = require("./data/users.json");

app.post('/userEntry', function (req, res) {
    if (!req.body) return res.sendStatus(400)
    
    
    var userInformation = {};

    for (var key in users) {
        if (users[key]['email'] === req.body.email && passwordHash.verify(req.body.password, users[key]['password'])) {
            userInformation.email = users[key]['email'];
            userInformation.age = users[key]['age'];
            userInformation.birthDate = users[key]['birthDate'];
            userInformation.aboutUser = users[key]['aboutUser'];
            break;
        }
    }
    res.send(userInformation);

});

app.post('/changeState', function (req, res) {
    setTimeout(function() { 
           res.send(true);
    },3000);

});


var randomIntFromInterval = function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

/*var requestFailed = false;*/

app.post('/getGraphData', function (req, res) {
    
    if (!req.body) return res.sendStatus(400);

    
    var x1,y1;
    var x0 = req.body.x0;
    var y0 = req.body.y0;
    var capacityY = req.body.capacityY;
    var x1min = req.body.x1min;
    
    x1 = randomIntFromInterval(x1min, x1min + 100); 
    y1 = randomIntFromInterval(0, capacityY); 
    
    var line = {x0: x0 , y0: y0 , x1: x1, y1: y1};
    
    
    /*if (!requestFailed) { // requests falls and then succeed again
        res.send(line);
        requestFailed = true;
    } else { 
        res.sendStatus(400);
        requestFailed = false;
    }*/
    res.send(line);
    
});

var statusMenuResponse;

app.post('/getMenuRequestData', function (req, res) {
    
    (statusMenuResponse) ? statusMenuResponse = false : statusMenuResponse = true;
    setTimeout(function() { 
        res.send(statusMenuResponse);
        
    },2000);
    
});


app.listen(3000, function () {
    console.log(`Server running`);
});