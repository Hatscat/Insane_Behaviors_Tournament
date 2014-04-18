/*
** return a brand new config
*/
function new_config (p_canvas)
{
	var config = {
		socket						: null,
		engine						: null,
		gun_mesh					: null,
		ghost_mesh_model 			: null,
		laser_mesh_model 			: null,
		id 							: null,
		scene 						: null,
		canvas 						: p_canvas,
		gui_canvas					: null,
		gui_context 				: null,
		canvas_width 				: window.innerWidth,
		canvas_height 				: window.innerHeight,
		keys_down  					: {},
		ghosts 						: {},
		lasers 						: [],
		player 						: null,
		player_speed_max 			: 6,
		camera_speed_max 			: 400,
		player_jump_max 			: 4,
		ghost_id 					: 'ghost',
		gravity 					: 0.9,
		time 						: 0,
		old_time 					: 0,
		delta_time 					: 1,
		damage 						: 350,
		max_hp 						: 1000,
		min_y 						: -20,
		laser_margin 				: 2,
		laser_decreasing_speed		: 0.7,
		backSoundUrl				: "/assets/AMBIANCEnewversion",
		shootSoundUrl				: "/assets/eclair",
		aieSoundUrl					: "/assets/blessure",
		max_frag 					: 10,
		constraint_hp_punishment 	: 100,
		time_between_constraints 	: 500,
		fragX						: window.innerWidth-170,
		fragY						: 50,
		lifeX						: window.innerWidth/2-280,
		lifeY						: 50,
		cursorX						: window.innerWidth / 2 - 4,
		cursorY						: window.innerHeight / 2 - 4,
		lifeBackX					: window.innerWidth/2-200,
		nameTextX					: window.innerWidth/2,
		nameTextY					: window.innerHeight-300,
		peace_time 					: 3000,
		oldRayTime					: 0,

		constraint_names 			: [
			{name:"dont_miss",text:"Miss and you'll die !"},
			{name:"always_move",text:"Run you fool !"},
			{name:"dont_shoot_while_moving",text:"Shoot or move you must choose"},
			//"always_jump"
		],

		keys 						: {
			up 		: 90, // Touche Z
			down 	: 83, // Touche S
			left 	: 81, // Touche Q
			right 	: 68, // Touche D
			jump 	: 32  // Touche Space Bare

		},

		main_light 					: {
			name : "main_light",
			x : 0,
			y : -0.9,
			z : 0,
			intensity : 0.1,
			r :1,
			g: 1,
			b: 1
		},

		babylon_camera 				: {
			
		},

		skybox 						: {
			size : 1000.0,
			images : "assets/skybox/skybox",
		},

		spwan_points				: [
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
		max_life : config.max_hp,
		spwan_points : config.spwan_points.slice()
	},

	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
