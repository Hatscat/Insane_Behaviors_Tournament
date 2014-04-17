/*
** first script launched, initialize things
*/
window.lauchGame = false;

addEventListener('load', init_home_page);

/*
** create a home page with jQuery,
** launch the game after le login
*/
function init_home_page ()
{
	$("#textEror").empty();
	$("#textEror").text(localStorage['EROR_INSANE_TOURNAMENT']);
	localStorage.removeItem('EROR_INSANE_TOURNAMENT')
	// on lance juste le jeu dans un premier temps
/*	init_game();*/
}
function init_game ()
{
	/*
	** create a canvas balise,
	** create client & server events,
	** load everything
	** launch the run loop
	*/

	if (!localStorage['FullScreen'])	screenfull.toggle();

	var canvas = document.createElement('canvas');
	var config = new_config(canvas);
	config.ctxAudio = init_sound_context();
	config.backSound = new Sound(config.ctxAudio, config.backSoundUrl, 1, false, true)
	config.gui_canvas = canvas.cloneNode(false);
	config.gui_context = config.gui_canvas.getContext('2d');

	config.gui_canvas.requestPointerLock = config.gui_canvas.requestPointerLock
										|| config.gui_canvas.mozRequestPointerLock
										|| config.gui_canvas.webkitRequestPointerLock;

/*	if (localStorage['id'])
	{
		config.server.id = localStorage['id'];
	}
	else
	{
		config.server.id = null;
	}*/
	if(localStorage['Username'])
		config.server.name = localStorage['Username'];
	else
		config.server.name = null;

	if (!BABYLON.Engine.isSupported())
	{
		window.alert('Browser not supported');
	}
	else
	{
		config.engine = new BABYLON.Engine(canvas, true);
		createScene(config);
		
		
		config.engine.runRenderLoop(function ()
		{
			config.scene.render();
		});

		window.onresize = function ()
		{

			config.engine.resize();
		};

		manage_input_events(config.keys_down);
		config.socket = io.connect();

		config.socket.on('connectionEstablished', function (e)
		{
			config.socket.emit('iWantToPlay', config.server);
		});

		manage_server_events(config);
	}	

	if (config.player && window.lauchGame == false)
	{
		window.lauchGame = true;
		document.body.appendChild(canvas);
		document.body.appendChild(config.gui_canvas);
		$('body').append("<table id='leaderBoard'><tbody id='leaderBoardBody'></tbody></table>");

		window.addEventListener("click", function (event)
		{
			config.engine.isPointerLock = true;
			config.gui_canvas.requestPointerLock();
		}, false);

		window.addEventListener('keydown', function (event)
		{
			if (event.keyCode == 27) // esc key
			{
				config.engine.isPointerLock = false;
				show_leaderboard(config, 300);
			}
		}, false);

		config.gui_context.font = "20pt Nova-Square";
		config.gui_context.fillStyle = "rgb(255,0,0)";
		config.gui_context.clearRect(window.innerWidth-200, 10,500, 500);
		config.gui_context.fillText("FRAGS :"  + (config.player.frag || 0), window.innerWidth-150, 50);
		config.gui_context.fillStyle = '#f50';
		config.gui_context.fillRect(window.innerWidth / 2 - 4, window.innerHeight / 2 - 4, 8, 8); // arg

		config.scene.registerBeforeRender(function(){run(config)});	
	}
}

/*
** set keyboard inputs into config
*/

function manage_input_events (p_keys_down)
{
	addEventListener('keydown', function (e) {
		p_keys_down[e.keyCode] = true;
	}, false);
	addEventListener('keyup', function (e) {
		p_keys_down[e.keyCode] = false;
	}, false);
}
/*
** reroute server events
*/
function manage_server_events (p_config)
{
	p_config.socket.on('updateGhosts', function(e){update_ghosts(p_config,e)});
	p_config.socket.on('newPlayer', function(e){new_player(p_config,e)});
	p_config.socket.on('deleteGhost', function(e){delete_ghost(p_config,e)});
	p_config.socket.on('kill', function(e){kill(p_config,e)});
	p_config.socket.on('wrongID', function(e){casseToi(p_config)});
	p_config.socket.on('updateLife', function(e){update_life(p_config,e)});
	p_config.socket.on('showLaser', function(e){show_laser(p_config,e)});
}
