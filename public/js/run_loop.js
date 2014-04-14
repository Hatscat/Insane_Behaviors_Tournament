/*
** run loop, every frames
*/
function run (p_config, p_timestamp)
{
	p_config.time 			= p_timestamp;
	var elapsed_time 		= p_config.time - p_config.old_time;
	p_config.old_time 		= p_config.time;
	p_config.delta_time 	= elapsed_time * 0.06;

	for (var i1 in p_config.players)
	{
		//p_config.players[i1].move(p_config);
	}

	//

	draw(p_config);
	requestAnimationFrame(function(p_ts){run(p_config, p_ts)});
}

/*
** render loop, called by "run()"
*/
function draw (p_config)
{

}