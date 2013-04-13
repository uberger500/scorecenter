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
                    var collection = db.collection('scorecenter');
                    var doc1 = {'hello':'doc1'};
                    var doc2 = {'hello':'doc2'};
                    var twoDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

                    collection.insert(doc1);
                    collection.insert(doc2, {w:1}, function(err, result) {});
                    collection.insert(twoDocs, {w:1}, function(err, result) {});
                    }
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

//var mongoUri = process.env.MONGOLAB_URL ||
 // 'mongodb://heroku_app14816974:5fe3q16hfra5v7bfgt9j7p7k7v@ds031567.mongolab.com:31567/heroku_app14816974';


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/submit.json', function(req, res) {
   var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('test', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
           //     console.log(db.collection.find());
                res.send(result[0]);
            }
        });
    }); // db.scorecenter.insert(data);
    console.log(req.body.score);
   // console.log(    db.scorecenter.insert(req.body));
 //   res.set('Content-Type', 'text/html');
//    res.send(req.body);

	});

app.get('/submit.json', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.send('name submitted1');
    });


app.get('/', function (request, response) {
	response.set('Content-Type', 'text/html');
	response.send('<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit Name</title></head><body><h1>Submit your username:</h1><input type="text" id="name" name="name" size="30" /></body></html>');
});

app.get('/highscores.json', function(request, response) {
	response.set('Content-Type', 'text/json');
	response.send('{"status":"good"}');
});

app.get('/usersearch', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send(200,'<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body><h1>Search for user:</h1><input type="text" id="name" name="name" size="30" /></body></html>');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

