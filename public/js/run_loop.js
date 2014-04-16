/*
** run loop, every frames
*/
function run (p_config)
{
	p_config.time 			= Date.now() || function(){return new Date().getTime()};
	var elapsed_time 		= p_config.time - p_config.old_time;
	p_config.old_time 		= p_config.time;
	p_config.delta_time 	= elapsed_time * 0.06;

	p_config.player.move();
	//p_config.player.shoot(); // event
	if (p_config.player.is_jumping)
	{
		p_config.player.jump();
	}
	
	p_config.player.check_constraint();

	if (p_config.player.y < p_config.min_y)
	{
		p_config.player.respawn();
	}

	for (var i1 in p_config.ghosts)
	{
		p_config.ghosts[i1].anim(p_config);
		p_config.ghosts[i1].move(p_config);
	}
}
