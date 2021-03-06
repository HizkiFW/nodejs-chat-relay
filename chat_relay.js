/*
NodeJS Chat Relay
*/

console.log('Attempting to start webserver');
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});
app.ws('/', function(ws, req) {
	ws.on('message', function(msg) {
		console.log('WS msg: ' + msg);
		bc(msg);
	});
	console.log('WS connect');
	//ws.send('Connected');
});
var aWss = expressWs.getWss('/');

function bc(msg) {
	aWss.clients.forEach(function (client) {
		client.send(msg);
	});
}

setTimeout(function() {
	bc("ping");
}, 10000);

app.listen(app.get('port'), function() {
	console.log('Webserver running on port ', app.get('port'));
});