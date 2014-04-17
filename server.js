var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var queue = [];
var config = {};
var cpt = 1;
var rooms = {
	room1 :{active: false, maxConnect: 3, numberCo: 0, listSockets: {}, listPlayers: {}},

	};
io.set('log level', 1);
function createRoom()
{
	cpt++;
	rooms['room' + cpt] = {active: false, maxConnect: 3, numberCo: 0, listPlayers: {}, listSockets: {}};
};

io.sockets.on('connection', function (socket, data) 
{
	socket.co = false;
	socket.emit('connectionEstablished', '')

	socket.on('iWantToPlay', function (data)
	{
		config.max_frag = data.max_frag;
		config.max_life = data.max_life;
		config.spwan_points = data.spwan_points;
		config.damage = data.damage;

		if(!data.id)
		{
			console.log("new")
			queue.push(socket);
			for(q in queue)
			{
				for(var i in rooms)
				{
					if(rooms[i].numberCo < rooms[i].maxConnect && socket.co == false && rooms[i].active == false)
					{
						socket.room = i;
						console.log("cucu");
						console.log(i)
						socket.join(i);
						rooms[i].numberCo++;
						socket.co = true;
					}
				}
				if(socket.co == false)
				{
					createRoom();
					socket.room = 'room' + cpt;
					socket.join(socket.room);
					rooms[socket.room].numberCo++;
					socket.co = true;
				}
			}
			queue = [];

			if(socket.co && socket.room)
			{
				var spwan = (Math.random()*(config.spwan_points.length-1)) | 0
				socket.identif = socket.id;
				rooms[socket.room].listPlayers[socket.identif] = ({name: data.name, position: config.spwan_points[spwan].position, rotation: config.spwan_points[spwan].rotation, life:config.max_life, frag:0, death:0, active:true});
				rooms[socket.room].listSockets[socket.identif] = socket;
				
			}
		}

		else 
		{
			for(var i in rooms)
			{
				if(rooms[i].listPlayers[data.id] && rooms[i].active == true)
				{
					console.log("reconect")
					socket.room = i;
					socket.join(socket.room)
					socket.co = true;
					socket.identif = data.id;
					rooms[socket.room].listPlayers[socket.identif].active = true;
					rooms[socket.room].listSockets[socket.identif] = socket;
				}
				
			}
			if(!socket.co)
			{
				console.log("wrong")
				socket.emit('wrongID');
				socket.disconnect();
			}
		}
		if(socket.co)
			socket.emit('newPlayer', {player: rooms[socket.room].listPlayers[socket.identif], id:socket.identif});
	});

	socket.on('playerCreated', function (data)
	{
		io.sockets.in(socket.room).emit('updateGhosts', {players: rooms[socket.room].listPlayers});		
	})

	socket.on('playerMove', function (data)
	{
		if(socket.room)
		{
			if(rooms[socket.room].listPlayers[data.id])
			{
				rooms[socket.room].listPlayers[data.id].position = data.position;
				rooms[socket.room].listPlayers[data.id].rotation = data.rotation;
			}
			
			socket.broadcast.to(socket.room).emit('updateGhosts', {players: rooms[socket.room].listPlayers});	
		}

	});

	socket.on('respawn', function (data)
	{
		if(rooms[socket.room].listPlayers[data.id])
		{
			rooms[socket.room].listPlayers[data.id].position = data.position;
			rooms[socket.room].listPlayers[data.id].rotation = data.rotation;
			rooms[socket.room].listPlayers[data.id].life = config.max_life;
		}
		socket.emit('updateLife', {life: rooms[socket.room].listPlayers[data.id].life})
		socket.broadcast.to(socket.room).emit('updateGhosts', {players: rooms[socket.room].listPlayers});

	});

	socket.on('shootPlayer', function (data)
	{
		if(socket.room && rooms[socket.room].listPlayers[data.id])
		{
			if(rooms[socket.room].listPlayers[data.idJoueurTouche])
			{
				rooms[socket.room].active = true;
				rooms[socket.room].listPlayers[data.idJoueurTouche].life-= config.damage;

				if(rooms[socket.room].listPlayers[data.idJoueurTouche].life <= 0)
				{
					rooms[socket.room].listPlayers[data.id].frag++;

					if(rooms[socket.room].listPlayers[data.id].frag > config.maxFrag)
						io.sockets.in(socket.room).emit('GameOver', rooms[socket.room].listPlayers)

					rooms[socket.room].listPlayers[data.idJoueurTouche].death++;
					socket.emit('kill', rooms[socket.room].listPlayers[data.id].frag);
				}

				rooms[socket.room].listSockets[data.idJoueurTouche].emit('updateLife', rooms[socket.room].listPlayers[data.idJoueurTouche]);
				//rooms[socket.room].listSockets[data.idJoueurTouche].emit('showLaser', {emitter: rooms[socket.room].listPlayers[data.id], receptor: rooms[socket.room].listPlayers[data.idJoueurTouche]});		
			}
			socket.broadcast.to(socket.room).emit('showLaser', {pos: data.laserPos, rot : data.laserRot, dist: data.distance});
		}

	});

	socket.on('disconnect', function() 
	{
		if(socket.room)
		{
			if(rooms[socket.room].listPlayers[socket.identif])
			{
				rooms[socket.room].listPlayers[socket.identif].active = false;
				delete rooms[socket.room].listSockets[socket.identif];
			}
			socket.broadcast.to(socket.room).emit('deleteGhost', {id: socket.identif});
			
		}

	});
});


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('Hello World');
});

server.listen(8080);