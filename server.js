var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var listPlayers = {};
var listSockets = {};
var queue = [];
var life = 1;
io.set('log level', 1);

io.sockets.on('connection', function (socket) 
{
	socket.co = false;
	queue.push(socket);
	for(q in queue)
	{
		if(socket.co == false)
		{
			listPlayers[socket.id] = ({ x: Math.random()*1280, y: Math.random()*3, z:Math.random()*720, life:life, frag:0, death:0});
			listSockets[socket.id] = socket;
			socket.emit('newPlayer', {player: listPlayers[socket.id], id: socket.id});
			io.sockets.emit('updateGhosts', {players: listPlayers});
			socket.co = true;
		}
	}
	queue = [];

	socket.on('playerMove', function (data)
	{
		if(listPlayers[data.id])
		{
			listPlayers[data.id].x = data.x;
			listPlayers[data.id].y = data.y;
			listPlayers[data.id].z = data.z;
		}

		socket.broadcast.emit('updateGhosts', {players: listPlayers});

	});

	socket.on('respawn', function (data)
	{
		if(listPlayers[data.id])
		{
			listPlayers[data.id].x = data.x;
			listPlayers[data.id].y = data.y;
			listPlayers[data.id].y = data.z;
			listPlayers[data.id].life = life;
		}
		socket.emit('updateLife', {life: listPlayers[data.id].life})
		socket.broadcast.emit('updateGhosts', {players: listPlayers});

	});

	socket.on('shootPlayer', function (data)
	{
		if(listPlayers[data.id] && listPlayers[data.idJoueurTouche])
		{
			listPlayers[data.idJoueurTouche].life--;

			if(listPlayers[data.idJoueurTouche].life <= 0)
			{
				listPlayers[data.id].frag++;
				listPlayers[data.idJoueurTouche].death++;
				socket.emit('kill', listPlayers[data.id].frag);
			}

			listSockets[data.idJoueurTouche].emit('updateLife', listPlayers[data.idJoueurTouche]);
		}

	});

	socket.on('disconnect', function() 
	{

		delete listPlayers[socket.id];
		delete listSockets[socket.id];

		socket.broadcast.emit('deleteGhost', {id: socket.id});

	});
  
});


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('Hello World');
});

server.listen(8080);