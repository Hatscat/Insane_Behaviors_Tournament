/*
** run loop, every frames
*/
function run (p_config)
{
	p_config.time 			= Date.now() || function(){return new Date().getTime()};
	var elapsed_time 		= p_config.time - p_config.old_time;
	p_config.old_time 		= p_config.time;
	p_config.delta_time 	= elapsed_time * 0.06;

	//console.log(p_config.player)

	if (p_config.player.is_jumping)
	{
		p_config.player.jump();
	}
	else if (p_config.camera.position.y < 2)
	{
		p_config.player.on_ground = true;
	}
	
	p_config.player.check_constraint();

	if (p_config.player.y < p_config.min_y)
	{
		p_config.player.respawn();
	}
}
