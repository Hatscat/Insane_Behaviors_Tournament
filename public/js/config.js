/*
** return a brand new config
*/
function new_config (p_canvas)
{
	var config = {
		socket					: null,
		canvas_width 			: window.innerWidth,
		canvas_height 			: window.innerHeight,
		keys_down 				: {},
		ghosts	 				: {},
		player 					: null,
		time 					: 0,
		old_time 				: 0,
		delta_time 				: 1,
		hp_max 					: 100
	};

	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
