/*
** return a brand new config
*/
function new_config (p_canvas)
{
	var config = {
		gravity 				: 10,
		player_size 			: 10,
		player_velocity 		: 2,
		ball_size 				: 3,
		canvas_width 			: window.innerWidth,
		canvas_height 			: window.innerHeight,
		canvas 					: p_canvas,
		context 				: p_canvas.getContext('2D'),
		socket 					: io.connect(),
		keys_down 				: {},
		players 				: {},
		time 					: 0,
		old_time 				: 0,
		delta_time 				: 1
	};

	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
