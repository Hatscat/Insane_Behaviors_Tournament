/*
** return a brand new config
*/
function new_config (p_canvas)
{
	var config = {
		socket					: null,
		engine					: null,
		map						: null,
		id 						: null,
		canvas_width 			: window.innerWidth,
		canvas_height 			: window.innerHeight,
		keys_down 				: {},
		ghosts	 				: {},
		player 					: null,
		time 					: 0,
		old_time 				: 0,
		delta_time 				: 1,

		babylon_lights 			: {

			torch1: 
			{
				name : "torch1",	
				x : 0,
				y : 100,
				z : 0,
				angle: 0,
				intesity: 1,
			},		
		},

		skybox 					: {
			size : 750.0,
			images : "img/skybox/skybox",
		},

		spwan_points			: [
			{x:0, y:0, z:0},
			{x:3, y:0, z:7},
			{x:5, y:0, z:8},
		]

	};

	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
