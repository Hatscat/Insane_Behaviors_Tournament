/*
** Player class
*/
function Player (p_config)
{
	var that 							= this;
	this._config 						= p_config;
	this.on_ground 						= true;
	this.is_jumping 					= false;
	this.is_moving 						= true;
	this.is_shooting 					= false;
	this.miss_a_ghost					= false;
	this.velocity 						= 0;
	this.accelation 					= p_config.gravity;
	this.velocity_max 					= p_config.player_jump_max;
	this.constraint 					= null;
	this.ready_2_be_punish 				= false;
	this.time_between_constraint_checks = p_config.time_between_constraints;
	this.time_2_check_constraint 		= 0;
	this.constraintImage				= new Image();
	this.constraintImage.src			= /*this._config.constraintImages[this.constraint.id]*/ '/assets/imageStock.png';
	this.camera 						= new BABYLON.FreeCamera('client_camera', new BABYLON.Vector3(this.x, this.y, this.z), p_config.scene);

	this.camera.checkCollisions 	= true;
	this.camera.applyGravity 		= true;
	this.camera.ellipsoid 			= new BABYLON.Vector3(1, 1, 1);

	this.camera.speed 				= this._config.player_speed_max;
	this.camera.angularSensibility 	= this._config.camera_speed_max;
	this.camera.keysUp 				= [this._config.keys.up];
	this.camera.keysDown 			= [this._config.keys.down];
	this.camera.keysLeft 			= [this._config.keys.left];
	this.camera.keysRight 			= [this._config.keys.right];

	this._config.camera 			= this.camera;
	this._config.scene.activeCamera.attachControl(this._config.canvas);

	//console.log(this._config.camera);
	
	// jump event
	window.addEventListener('keydown', function (event)
	{
		if (event.keyCode == that._config.keys.jump)
		{
			if (that.on_ground)
			{
				that.velocity = 0;
				that.on_ground = false;
				that.is_jumping = true;

				window.setTimeout(function(){that.on_ground = true}, that.velocity_max * 100 / p_config.gravity);
			}
		}
		
	});

	// shoot event
	window.addEventListener('click', function ()
	{
		if (that._config)
		{
			that.is_shooting = true;
			that.shoot(that);
			window.setTimeout(function(){that.is_shooting = false}, 10);
		}
	});
}

/*
** methods
*/
Player.prototype.init = function (p_data)
{
	this._id 					= p_data.id;
	localStorage['id'] 			= this._id;
	this.name 					= localStorage['Username'];
	this.camera.position 		= new BABYLON.Vector3(p_data.player.position.x, p_data.player.position.y, p_data.player.position.z);
	this.camera.rotation 		= new BABYLON.Vector3(p_data.player.rotation.x, p_data.player.rotation.y, p_data.player.rotation.z);
	this.frag					= p_data.player.frag;
	this.death					= p_data.player.death;
	this.hp_max 				= this._config.max_hp;
	this.current_hp 			= p_data.player.life;
	this._config.socket.emit('playerCreated');

	this.preparation();
	this._config.gui_context.clearRect(0,0,window.innerWidth, window.innerHeight);
	drawHUD(this._config);
	show_constrain(this._config);

}

Player.prototype._new_constraint = function ()
{
	var rand = Math.random() * this._config.constraint_names.length | 0;

	console.log("contrainte :", this._config.constraint_names[rand]);
	return this._config.constraint_names[rand];
};

Player.prototype.jump = function ()
{
	if ((this.velocity += this.accelation * this._config.delta_time) >= this.velocity_max)
	{
		this.is_jumping = false;
	}
	else
	{
		this.camera.position.y += this.velocity * this._config.delta_time;
	}
}
Player.prototype.shoot = function (that)
{
	if(this.showLeader)
		hide_leaderboard(that._config, 300);

	if (that._config && that._config.scene)
	{
		var pickResult = that._config.scene.pick(that._config.canvas.width / 2, that._config.canvas.height / 2, function(m){return !(m.name=='laser')});

		if (pickResult.pickedMesh)
		{
			//console.log("touché :", pickResult.pickedMesh.name);
			//console.log(pickResult.pickedMesh.id);
			that.miss_a_ghost = pickResult.pickedMesh.id != that._config.ghost_id;

			var laser = new Laser_client(that._config, that.camera, pickResult.distance);

			that._config.lasers.push(laser);
			that._config.socket.emit('shootPlayer',
			{
				id: that._id,
				idJoueurTouche: pickResult.pickedMesh.name,
				laserPos: laser.mesh.position,
				laserRot: laser.mesh.rotation,
				distance: pickResult.distance,
			});
		}
	}
};
Player.prototype.check_constraint = function ()
{
	if (this.ready_2_be_punish && this["constraint_" + this.constraint]() && this._config.time > this.time_2_check_constraint)
	{
		console.log("PUNITION !");
		this.time_2_check_constraint = this._config.time + this.time_between_constraint_checks;
		this._config.socket.emit('constaint_punishment', this._config.constraint_hp_punishment);
	}
};

Player.prototype.respawn = function ()
{
	var spwan = Math.random() * this._config.spwan_points.length | 0;
	this._config.aieGUI = false;
	this._config.gui_context.clearRect(0,0,window.innerWidth, window.innerHeight);
	drawHUD(this._config);
	this.state = "playing";
	show_leaderboard(this._config);

	this.camera.position 		= new BABYLON.Vector3(this._config.spwan_points[spwan].position.x, this._config.spwan_points[spwan].position.y, this._config.spwan_points[spwan].position.z);
	this.camera.rotation 		= new BABYLON.Vector3(this._config.spwan_points[spwan].rotation.x, this._config.spwan_points[spwan].rotation.y, this._config.spwan_points[spwan].rotation.z);

	this._config.socket.emit('respawn',
	{
		id: this._id,
		position: this.camera.position,
		rotation: this.camera.rotation
	});

	this.preparation();
	show_constrain(this._config);
};

Player.prototype.preparation = function ()
{
	var that = this;
	that.ready_2_be_punish = false;
	that.constraintInfo = that._new_constraint();
	that.constraint = that.constraintInfo.name;
	window.setTimeout(function(){that.ready_2_be_punish = true}, that._config.peace_time);
}

/*
** constraints
*/
Player.prototype.constraint_null = function ()
{
	return false;
};

Player.prototype.constraint_dont_miss = function ()
{
	if (this.miss_a_ghost)
	{
		//console.log("raté !");
		this.miss_a_ghost = false;
		return true;
	}
	return false;
};

Player.prototype.constraint_always_move = function ()
{
	check_player_movement(this);
	
	if (!this.is_moving)
	{
		//console.log("immobile !");
		return true;
	}
	return false;
};

Player.prototype.constraint_dont_shoot_while_moving = function ()
{
	//console.log(this.is_moving, this.is_shooting);
	check_player_movement(this);

	if (this.is_moving && this.is_shooting)
	{
		//console.log("attention !");
		return true;
	}
	return false;
};
/*
Player.prototype.constraint_always_jump = function ()
{
	var that 		= this;
	var dont_jump 	= false;

	if (!this.is_jumping && this.can_check_jumping)
	{
		window.setTimeout(function ()
		{
			if (!that.is_jumping)
				console.log("attention !");
				dont_jump = true;
				return dont_jump;
		}, 500);
	}
	return dont_jump;
};*/

/*
**
*/

function check_player_movement (that)
{
	var margin = 0.01;

	that.is_moving = margin < that.camera._diffPosition.x * that.camera._diffPosition.x
							+ that.camera._diffPosition.y * that.camera._diffPosition.y
							+ that.camera._diffPosition.z * that.camera._diffPosition.z;
}