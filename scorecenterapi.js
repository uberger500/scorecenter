var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
app.set('title', 'nodeapp');


// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/scorecenter';

var mongo = require('mongodb');

var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
        	if(!error) {
                    console.log("We are connected");
//                    var collection = db.collection('scorecenter');
  //                var doc1 = {'hello':'doc1'};
    //                collection.insert(doc1);
                    }
        });

//var mongoUri = process.env.MONGOLAB_URL ||
 // 'mongodb://heroku_app14816974:5fe3q16hfra5v7bfgt9j7p7k7v@ds031567.mongolab.com:31567/heroku_app14816974';


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/submit.json', function(req, res) {
    var score = req.body;
    console.log('Adding score: ' + JSON.stringify(score));
    db.collection('scorecenter', function(err, collection) {
        collection.insert({game_title: req.body.game_title, username: req.body.username, score: req.body.score, created_at:new Date()}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    }); 
});

app.get('/submit.json', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.send('name submitted1');
    });


app.get('/', function (request, response) {
    db.collection('scorecenter', function(err, collection) {
        collection.find().toArray(function(err, items) {

        var tableBody = "";
	    for (i=0; i < items.length; i++) {
	        tableRow = "<tr>" + "<td>" + items[i].game_title + "<td/>"+"<td>" +items[i].username+"<td/>"+"<td>"+items[i].score+"<td/>"+"<td>"+items[i].created_at+"<td/>"+"<tr/>";
	        tableBody += tableRow;
	        }       
        
        var table = "<table>"+"<tr>"+"<th>"+"Game_Title" + "</th>"+"<th>"+"Username"+"</th>"+"<th>"+"Score"+"</th>"+"<th>"+"      Created_On"+"</th>"+"<tr/>"+ tableBody + "</table>";
        response.set('Content-Type', 'text/html');
        response.send(table);
        });
    });
});

app.get('/highscores.json', function(request, response) {
	response.set('Content-Type', 'text/json');
	response.send('{"status":"good"}');
});

app.get('/usersearch', function(request, response) {
db.collection('scorecenter', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
//	response.set('Content-Type', 'text/html');
//	response.send(200,'<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body><h1>Search for user:</h1><input type="text" id="name" name="name" size="30" /></body></html>');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

/*
app.get('/', function (request, response){
        response.set('Content-Type', 'text/html');
        response.send('<p>Hi!</p> ');
});

app.get('/data.json', function(request, response) {
        response.set('Content-Type', 'text/json');
        response.send('{"status":"good"}');
});

app.get('/fool', function(request, response) {
        response.set('Content-Type', 'text/html');
        response.send(500, 'Something broke!');
});


*/

