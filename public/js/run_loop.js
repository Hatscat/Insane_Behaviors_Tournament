/*
** run loop, every frames
*/
function run (p_config)
{
	p_config.time 			= Date.now() || function(){return new Date().getTime()};
	var elapsed_time 		= p_config.time - p_config.old_time;
	p_config.old_time 		= p_config.time;
	p_config.delta_time 	= elapsed_time * 0.04 || 1;

	if (p_config.player._id)
	{
		p_config.socket.emit('playerMove',
		{
			position: p_config.camera.position,
			rotation: p_config.camera.rotation,
			id: p_config.player._id
		});
	}

	if (p_config.aieGUI)
	{

		p_config.aieGUI -= 0.02;

		if (p_config.aieGUI <= 0)
		{
			p_config.aieGUI = false;
			//config.gui_context.drawImage(config.player.constraintImage, 500, 500);
			p_config.gui_context.clearRect(0,0,window.innerWidth, window.innerHeight);
			drawHUD(p_config)
			
		}
	}

	if (p_config.player.is_jumping)
	{
		p_config.player.jump();
	}

	p_config.player.check_constraint();

	if (p_config.player.y < p_config.min_y)
	{
		p_config.player.respawn();
	}

	for (var i1 in p_config.lasers)
	{
		Laser_update(p_config.lasers[i1]);
	}
}
