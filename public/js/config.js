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
		laser_mesh_model 		: null,
		id 						: null,
		scene 					: null,
		canvas 					: p_canvas,
		gui_canvas				: null,
		gui_context 			: null,
		canvas_width 			: window.innerWidth,
		canvas_height 			: window.innerHeight,
		keys_down  				: {},
		ghosts 					: {},
		lasers 					: [],
		player 					: null,
		player_speed_max 		: 0.6,
		camera_speed_max 		: 3000,
		player_jump_max 		: 4,
		gravity 				: 0.5,
		time 					: 0,
		old_time 				: 0,
		delta_time 				: 1,
		damage 					: 300,
		max_hp 					: 1000,
		laser_margin 			: 2,
		laser_decreasing_speed	: 0.65,
		backSoundUrl			: "/assets/AMBIANCEnewversion",
		max_frag 				: 10,
		constraint_names 		: [
			"dont_miss",
			"always_move",
			"dont_shoot_while_moving"
		],
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
			y : -1,
			z : 0,
			intesity : 1,
			r :1,
			g: 1,
			b: 1
		},

		babylon_camera 			: {
			
		},

		skybox : 
		{
			size : 1000.0,
			images : "assets/skybox/skybox",
		},

		spwan_points			: [
			{
				position : {x:0, y:0, z:0},
				rotation : {x:0, y:0, z:0},
			},
			{
				position : {x:3, y:0, z:7},
				rotation : {x:0, y:0, z:0},
			},
			{
				position : {x:5, y:0, z:8},
				rotation : {x:0, y:0, z:0},
			}
		]
	};

	config.server = {
		max_frag : config.max_frag,
		damage : config.damage,
		max_life : config.max_life,
		spwan_points : config.spwan_points.slice()
	},


	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
