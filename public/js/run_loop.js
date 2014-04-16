/*
** run loop, every frames
*/
function run (p_config)
{
	p_config.time 			= Date.now() || function(){return new Date().getTime()};
	var elapsed_time 		= p_config.time - p_config.old_time;
	p_config.old_time 		= p_config.time;
	p_config.delta_time 	= elapsed_time * 0.06;

	player.move(p_config);
	player.shoot(p_config);
	player.check_constraint(p_config);

	if (player.y < p_config.min_y)
	{
		player.respawn(p_config);
	}
}
