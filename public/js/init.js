/*
** first script launched, initialize things
*/

addEventListener('load', init_home_page);

/*
** create a home page with jQuery,
** launch the game after le login
*/
function init_home_page ()
{
	// on lance juste le jeu dans un premier temps
	init_game();
}
/*
** create a canvas balise,
** create client & server events,
** load everything
** launch the run loop
*/
function init_game ()
{
	var canvas = document.createElement('canvas');
	var config = new_config(canvas);

	document.body.appendChild(canvas);
	manage_input_events(config.keys_down);
	config.socket = io.connect();
	manage_server_events(config);

	config.scene.registerBeforeRender(function(){run(p_config)});
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
	p_config.socket.on('updateLife', function(e){update_life(p_config,e)});
}
