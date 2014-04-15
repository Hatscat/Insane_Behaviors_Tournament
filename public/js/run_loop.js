/*
** run loop, every frames
*/
function run (p_config)
{
	p_config.time 			= Date.now() || function(){return new Date().getTime()};
	var elapsed_time 		= p_config.time - p_config.old_time;
	p_config.old_time 		= p_config.time;
	p_config.delta_time 	= elapsed_time * 0.06;

	p_config.player.move(p_config);
	p_config.player.shoot(p_config);
	p_config.player.check_constraint(p_config);

	if (p_config.player.y < p_config.min_y)
	{
		p_config.player.respawn(p_config);
	}

	for (var i1 in p_config.ghosts)
	{
		p_config.ghosts[i1].anim(p_config);
		p_config.ghosts[i1].move(p_config);
	}
}
