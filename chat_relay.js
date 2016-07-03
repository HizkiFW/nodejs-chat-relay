/*
NodeJS Chat Relay
*/

var ChatRelay = {
	ready: false,
	I: {
		ws: require('ws')
	},
	Rooms: {},
	
	WS: {
		wss: null,
		init: function() {
			var WebSocketServer = ChatRelay.I.ws.Server;
			ChatRelay.WS.wss = new WebSocketServer({port: (process.env.PORT || 5000)});
			ChatRelay.WS.wss.on('connection', function connection(ws) {
				ws.on('message', function incoming(msg) {
					console.log("WS msg: " + msg);
					if(ChatRelay.ready) {
						if(msg.startsWith('chat ')) {
							var idx = ChatRelay.Rooms.indexOf(ws);
							if(idx)
								ChatRelay.WS.wss.broadcast('chat ' + user + ' ' + msg);
						} else if(msg.startsWith('join ')) {
							ChatRelay.Rooms[ws] = msg.substring(5);
						} else if(msg == 'leave') {
							var idx = ChatRelay.Rooms.indexOf(ws);
							if(idx)
								ChatRelay.Rooms.splice(idx, 1);
						}
					}
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
		
		ChatRelay.ready = true;
	}
};

ChaatRelay.init();