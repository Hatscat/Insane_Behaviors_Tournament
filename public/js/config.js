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
		//canvas_center_w 			: window.innerWidth / 2,
		//canvas_center_h 			: window.innerHeight / 2,
		keys_down  					: {},
		ghosts 						: {},
		lasers 						: [],
		player 						: null,
		hand_speed					: 6,
		hand_anim					: {x: 0, y: 0, z: 0},
		player_size 				: {w: 0.9, h: 3.5},
		player_speed_max 			: 17,
		camera_speed_max 			: 330,
		player_jump_max 			: 5,
		ghost_id 					: 'ghost',
		gravity 					: 0.9,
		time 						: 0,
		old_time 					: 0,
		delta_time 					: 1,
		damage 						: 350,
		max_hp 						: 1000,
		min_y 						: -15,
		laser_margin 				: 3,
		laser_decreasing_speed		: 1.4,
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
		cpt 						: 0,
		HandNeedToMove				: false,
		oldHandTime					: 0,
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
			y : -0.7,
			z : 0,
			intensity : 2,
			r :1,
			g: 0.9,
			b: 0.9
		},

		babylon_camera 				: {
			
		},

		skybox 						: {
			size : 1000.0,
			images : "assets/skybox/skybox",
		},

		spwan_points				: [
			{
				position : {
					x : 240,
					y : 22,
					z : 100
				},
				rotation : {
					x: 0,
					y: 5, // 5
					z: 0
				}
			},
			{
				position : {
					x : -120,
					y : 22,
					z : 100
				},
				rotation : {
					x: 0,
					y: -5, // -5
					z: 0
				}
			},
			{
				position : {
					x : 240,
					y : 22,
					z : -200
				},
				rotation : {
					x: 0,
					y: 5, // 5
					z: 0
				}
			},
			{
				position : {
					x : -120,
					y : 22,
					z : -200
				},
				rotation : {
					x: 0,
					y: 13.5, // 13.5
					z: 0
				}
			}
		]
	};

	config.server = {
		max_frag : config.max_frag,
		damage : config.damage,
		max_life : config.max_hp,
		spwan_points : config.spwan_points
	},

	p_canvas.width = config.canvas_width;
	p_canvas.height = config.canvas_height;

	return config;
}
