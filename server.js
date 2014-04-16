var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var listPlayers = {};
var listSockets = {};
var queue = [];
var config = {};
/*io.set('log level', 1);*/

io.sockets.on('connection', function (socket, data) 
{
	socket.emit('connectionEstablished', '')

	socket.on('iWantToPlay', function (data)
	{
		config.max_frag = data.max_frag;
		config.max_life = data.max_life;
		config.spwan_points = data.spwan_points;
		console.log(data.spwan_points)

		if(!data.id)
		{
			var spwan = (Math.random()*(config.spwan_points.length-1)) | 0
			socket.identif = socket.id;
			listPlayers[socket.identif] = ({ x: config.spwan_points[spwan].x, y: config.spwan_points[spwan].y, z:config.spwan_points[spwan].z, life:config.max_life, frag:0, death:0, active:true});
			listSockets[socket.identif] = socket;
		}

		else if(listPlayers[data.id])
		{
			socket.identif = data;
			listPlayers[socket.identif].active = true;
			listSockets[socket.identif] = socket;
		}
		else
		{
			socket.disconnect();
		}

		socket.emit('newPlayer', {player: listPlayers[socket.identif], id:socket.identif});
	});

	socket.on('playerCreated', function (data)
	{
		io.sockets.emit('updateGhosts', {players: listPlayers});		
	})

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
		if(listPlayers[data.id])
		{
			if(listPlayers[data.idJoueurTouche])
			{
				listPlayers[data.idJoueurTouche].life--;

				if(listPlayers[data.idJoueurTouche].life <= 0)
				{
					listPlayers[data.id].frag++;

					if(listPlayers[data.id].frag > maxFrag)
						io.sockets.emit('GameOver', listPlayers)

					listPlayers[data.idJoueurTouche].death++;
					socket.emit('kill', listPlayers[data.id].frag);
				}

				listSockets[data.idJoueurTouche].emit('updateLife', {life: listPlayers[data.idJoueurTouche]});
				listSockets[data.idJoueurTouche].emit('showLaser', {emitter: listPlayers[data.id], receptor: listPlayers[data.idJoueurTouche]});
			}
			else
			{
				socket.broadcast.emit('showLaser', {emitter: listPlayers[data.id], receptor: data.pickedPoint});
			}
			
		}

	});

	socket.on('disconnect', function() 
	{
		if(listPlayers[socket.identif])
		{
			listPlayers[socket.identif].active = false;
			delete listSockets[socket.identif];
		}

		socket.broadcast.emit('deleteGhost', {id: socket.identif});

	});
});


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('Hello World');
});

server.listen(8080);