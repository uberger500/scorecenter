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

//var mongoUri = process.env.MONGOLAB_URL 
//MONGOLAB_URI: mongodb://heroku_app14958216:5bijf3ts652u91o3glilooi633@ds037077.mongolab.com:37077/heroku_app14958216


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

app.get('/highscores.json', function (request, response) {
    db.collection('scorecenter', function(err, collection) {
        collection.find({game_title:frogger},{'limit':10,'sort':{'score':-1}).toArray(function(err, items) {
        response.set('Content-Type', 'text/json');
        response.send(items);
        });
    });
});

app.get('/usersearch', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send('<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body><h1>Search for user:</h1><form id="usr" action="http://tranquil-beach-4417.herokuapp.com/usersearch" method="post"><input type="text" id="input" name="username" size="30" /><input type="submit" id="submit" onclick=submit()/></form></body></html>');
});

app.post('/usersearch', function(request, response) {
    db.collection('scorecenter', function(err, collection) {
      collection.find(request.body,{'sort':{'score': -1}}).toArray(function(err, items) {
			if (items.length == 1) {response.set('Content-Type', 'text/html');
			var result = "<table>"+"<tr>"+"<th>"+"Game_Title" + "</th>"+"<th>"+"Username"+"</th>"+"<th>"+"Score"+"</th>"+"<th>"+"Created_On"+"</th>"+"<tr/>" +"<tr>"+"<td>"+items[0].game_title + "</td>"+"<td>"+items[0].username+"</td>"+"<td>"+items[0].score+"</td>"+"<td>"+items[0].created_at+"</td>"+"<tr/>" + "</table>";
			response.send(result);}
			else if (items.length > 1) {
			
			
			var tops = []; //put biggest scores into separate array
			tops[0] = items[0];
			for (i = 1; i < (items.length); i++) {
			    if(items[i].game_title != items[0].game_title) {
			        for (j = 0; j < tops.length; ) {
			        if(items[i].game_title == tops[j].game_title) {break;}
				        if(items[i].game_title != tops[j].game_title) { 
				            j++;
				            if (j == tops.length) {
				                tops.push(items[i]);
				                j = 0;
				                break;
				                }
				            } else {j++;}
				    }
			    }
            }
            
            var tableBody = "";
	        for (i=0; i < tops.length; i++) {
	        tableRow = "<tr>" + "<td>" + tops[i].game_title + "<td/>"+"<td>" +tops[i].username+"<td/>"+"<td>"+tops[i].score+"<td/>"+"<td>"+tops[i].created_at+"<td/>"+"<tr/>";
	        tableBody += tableRow;
	        }       
        
            var table = "<table>"+"<tr>"+"<th>"+"Game_Title" + "</th>"+"<th>"+"Username"+"</th>"+"<th>"+"Score"+"</th>"+"<th>"+"      Created_On"+"</th>"+"<tr/>"+ tableBody + "</table>";
            response.set('Content-Type', 'text/html');
            response.send(table);
         }
            else { 
            response.set('Content-Type', 'text/html');
            response.send('username not found');}
    });
});         
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

//response.send(200,'<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body><h1>Search for user:</h1><input type="text" id="name" name="name" size="30" /></body></html>');
