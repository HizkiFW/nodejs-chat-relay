/*
NodeJS Chat Relay
*/

var ChatRelay = {
	ready: false,
	I: {
		ws: require('ws')
	},
	
	WS: {
		wss: null,
		init: function() {
			var WebSocketServer = ChatRelay.I.ws.Server;
			ChatRelay.WS.wss = new WebSocketServer({port: (process.env.PORT || 5000)});
			console.log("Starting WS Server on port " + (process.env.PORT || 5000));
			ChatRelay.WS.wss.on('connection', function connection(ws) {
				ws.on('message', function incoming(msg) {
					console.log("WS msg: " + msg);
					if(ChatRelay.ready)
						ChatRelay.WS.wss.broadcast(msg);
				});
				if(ChatRelay.ready)
					ws.send("Connected");
				else
					ws.send("Wait");
			});
			ChatRelay.WS.wss.broadcast = function broadcast(data) {
				ChatRelay.WS.wss.clients.forEach(function each(client) {
					client.send(data);
				});
			}
		}
	},
	
	init: function() {
		ChatRelay.WS.init();
		
		console.log("ChatRelay ready");
		ChatRelay.ready = true;
	}
};

ChatRelay.init();