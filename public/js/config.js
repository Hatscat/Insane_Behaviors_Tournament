/*
** return a brand new config
*/
function new_config (p_canvas)
{
	var config = {
		socket					: null,
		engine					: null,
		map_mesh				: null,
		ghost_mesh_model 		: null,
		id 						: null,
		scene 					: null,
		canvas 					: p_canvas,
		gui_canvas				: null,
		gui_context 			: null,
		canvas_width 			: window.innerWidth,
		canvas_height 			: window.innerHeight,
		keys_down  				: {},
		ghosts	 				: {},
		player 					: null,
		player_speed_max 		: 0.6,
		camera_speed_max 		: 3000,
		gravity 				: 3,
		time 					: 0,
		old_time 				: 0,
		delta_time 				: 1,
		max_hp 					: 100,
		max_frag 				: 10,
		keys 					: {
			up 		: 90, // Touche Z
			down 	: 83, // Touche S
			left 	: 81, // Touche Q
			right 	: 68, // Touche D
			jump 	: 32  // Touche Space Bare

		},
		main_light 				: {
			name : "main_light",
			x : 0,
			y : 100,
			z : 0,
			angle : 0,
			intesity : 1,
			r :1,
			g: 1,
			b: 1
		},
		babylon_camera : {
			
		},
		skybox : 
		{
			size : 750.0,
			images : "img/skybox/skybox",
		},

	};

	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
