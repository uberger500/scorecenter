var express = require('express');
var mongo = require('mongodb');
var app = express(express.logger());
app.use(express.bodyParser());
app.set('title', 'nodeapp');

// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/scorecenter';


var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
        if(!error) {
            console.log("We are connected");
        }
    });

//CORS
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/submit.json', function(req, res) {
    db.collection('scorecenter', function(err, collection) {
        collection.insert({game_title: req.body.game_title, username: req.body.username, score: req.body.score, created_at:Date()}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
            
                res.send(result[0]);
            
            }
        });
    }); 
});

app.get('/', function (request, response) {
    db.collection('scorecenter', function(err, collection) {
        collection.find().toArray(function(err, items) {
        //put results in table body
        var table ='<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body>';
        table +="<table>"+"<tr>"+"<th>"+"Game_Title" + "</th>"+"<th>"+"Username"+"</th>"+"<th>"+"Score"+"</th>"+"<th>"+"Created_On"+"</th>"+"</tr>"; 
        for (i=0; i < items.length; i++) {
                table += "<tr>" + "<td>" + items[i].game_title + "</td>"+"<td>" +items[i].username+"</td>"+"<td>"+items[i].score+"</td>"+"<td>"+items[i].created_at+"</td>"+"</tr>";
                }
        table +=  "</table>"+"</body>"+"</html>";
        response.set('Content-Type', 'text/html');
        response.send(table);
        });
    });
});

/*

app.post('/usersearch', function(request, response) {
console.log(request.body);
    db.collection('scorecenter', function(err, collection) {
        collection.insert({chatline: request.body.chatline, created_at:Date()}, {safe:true}, function(err, result) {
          if (err) {
              response.send({'error':'An error has occured'});
          } else {response.send(result[0]+"  ello"); }
                });
       });
});

app.get('/usersearch', function(request, response) {
        response.set('Content-Type', 'text/html');
        response.send('<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body><h1>Search for user:</h1><form id="usr" action=" http://tranquil-beach-4417.herokuapp.com/usersearch" method="post"><input type="text" id="input" name="chatline" size="30" /><input type="submit" id="submit" onclick=submit()/></form></body></html>');
});

*/


app.get('/highscores.json', function (request, response) {
    db.collection('scorecenter', function(err, collection) {
       collection.find(request.query,{'limit':10,'sort':{'score':-1}}).toArray(function(err, items) {
        if (items.length > 0) {
        response.set('Content-Type', 'text/json');
        response.send(JSON.stringify(items));
        } else { 
        response.send('game title not found');}
        });
    });
});

//action="http://tranquil-beach-4417.herokuapp.com/usersearch"
app.get('/usersearch', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send('<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Submit username</title></head><body><h1>Search for user:</h1><form id="usr" action="http://tranquil-beach-4417.herokuapp.com/usersearch" method="post"><input type="text" id="input" name="username" size="30" /><input type="submit" id="submit" onclick=submit()/></form></body></html>');
});

app.post('/usersearch', function(request, response) {
//console.log(request.body);    
      db.collection('scorecenter', function(err, collection) {
      collection.find(request.body,{'sort':{'score': -1}}).toArray(function(err, items) {
			if (items.length == 1) {response.set('Content-Type', 'text/html');
			var result = "<table>"+"<tr>"+"<th>"+"Game_Title" + "</th>"+"<th>"+"Username"+"</th>"+"<th>"+"Score"+"</th>"+"<th>"+"Created_On"+"</th>"+"</tr>" +"<tr>"+"<td>"+items[0].game_title + "</td>"+"<td>"+items[0].username+"</td>"+"<td>"+items[0].score+"</td>"+"<td>"+items[0].created_at+"</td>"+"</tr>" + "</table>";
			response.send(result);}
			else if (items.length > 1) {		
			var tops = []; //put biggest scores into separate array
			tops[0] = items[0];
			for (i = 1; i < (items.length); i++) {//iterate over items and put unique game titles in tops
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
            //place results in table object
            var tableBody = "";
	        for (i=0; i < tops.length; i++) {
	        tableRow = "<tr>" + "<td>" + tops[i].game_title + "</td>"+"<td>" +tops[i].username+"</td>"+"<td>"+tops[i].score+"</td>"+"<td>"+tops[i].created_at+"</td>"+"</tr>";
	        tableBody += tableRow;
	        }       
            //table header
            var table = "<table>"+"<tr>"+"<th>"+"Game_Title" + "</th>"+"<th>"+"Username"+"</th>"+"<th>"+"Score"+"</th>"+"<th>"+"Created_On"+"</th>"+"</tr>"+ tableBody + "</table>";
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
