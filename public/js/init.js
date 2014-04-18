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
	localStorage.removeItem('EROR_INSANE_TOURNAMENT');
}
function init_game ()
{
	/*
	** create a canvas balise,
	** create client & server events,
	** load everything
	** launch the run loop
	*/

	var canvas = document.createElement('canvas');
	var config = new_config(canvas);
	config.ctxAudio = init_sound_context();
	config.backSound = new Sound(config.ctxAudio, config.backSoundUrl, 1, false, true)
	config.shootSound = new Sound(config.ctxAudio, config.shootSoundUrl, 0.5, false, false)
	config.aieSound = new Sound(config.ctxAudio, config.aieSoundUrl, 0.4, false, false)
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
	if (localStorage['Username'])
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
		createScene(config, after_scene_is_loaded);
	}
}

function after_scene_is_loaded (p_config)
{
	window.onresize = function ()
	{
		p_config.engine.resize();
	};

	document.addEventListener("contextmenu", function (e) { e.preventDefault(); });

	window.addEventListener('click', setup, false);

	window.addEventListener('click', function ()
	{
		if (p_config.gui_canvas && p_config.player)
		{
			p_config.engine.isPointerLock = true;
		
			if (p_config.gui_canvas.requestPointerLock)
			{
				p_config.gui_canvas.requestPointerLock();
			}

			if (p_config.player.state == 'waitTorespawn')
			{
				p_config.player.respawn();
			}
		}

		if (!screenfull.isFullscreen)
		{
			screenfull.toggle();
		}
	}, false);

	window.addEventListener('keydown', function (event)
	{
		if (event.keyCode == 27) // esc key
		{
			p_config.engine.isPointerLock = false;
		}
		if (event.keyCode == 9) // tab key
		{
			show_leaderboard(p_config, 300);
		}
	}, false);

	drawHUD(p_config);
	p_config.scene.registerBeforeRender(function(){run(p_config)});


	function setup ()
	{
		$("#c2p").remove();
		p_config.socket = io.connect();

		p_config.socket.on('connectionEstablished', function (e)
		{
			p_config.socket.emit('iWantToPlay', p_config.server);
			p_config.player.state = 'playing';
		});

		manage_server_events(p_config);

		window.lauchGame = true;
		document.body.appendChild(p_config.canvas);
		document.body.appendChild(p_config.gui_canvas);
		$('body').append("<table id='leaderBoard'><tbody id='leaderBoardBody'></tbody></table>");
		$('body').append("<div class='popupContrainte'><div class='imageContrainte'></div><p class='TexteContrainte'></p></div>");
		$('body').append("<div id='iconContrainte'></div>");
		$('body').append("<p id='test'></p>");

		window.removeEventListener('click', setup);
	}

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
	p_config.socket.on('disconnect', function(e){
		localStorage["EROR_INSANE_TOURNAMENT"] = "Problème de connexion, veuillez rééssayer";
		window.location.reload();
	});
		
}

