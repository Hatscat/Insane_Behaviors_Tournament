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
	this.is_shooting 					= true;
	this.miss_a_ghost					= false;
	this.velocity 						= p_config.player_jump_max;
	this.accelation 					= p_config.gravity;
	this.velocity_max 					= p_config.player_jump_max;
	this.constraint 					= null;
	this.ready_2_be_punish 				= false;
	this.time_between_constraint_checks = p_config.time_between_constraints;
	this.time_2_check_constraint 		= 0;
	this.constraintImage				= new Image();
	this.constraintImage.src			= /*this._config.constraintImages[this.constraint.id]*/ '/assets/imageStock.png';
	this.camera 						= new BABYLON.FreeCamera('client_camera', new BABYLON.Vector3(3, 0, 7), p_config.scene);

	this.camera.checkCollisions 	= true;
	this.camera.applyGravity 		= true;
	this.camera.ellipsoid 			= new BABYLON.Vector3(0.4, 2.5, 0.4);

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
				that.on_ground = false;
				that.is_jumping = true;

				window.setTimeout(function(){that.on_ground = true}, that.velocity_max * 70 / p_config.gravity);
			}
		}
	});

	window.addEventListener('keyup', function (event)
	{
		if (event.keyCode == that._config.keys.jump)
		{
			that.is_jumping = false;

				//that.on_ground = true;

			that.velocity = that.velocity_max;
		}
	});

	// shoot event
	window.addEventListener('mousedown', function ()
	{
		if (that._config && that.state == "playing" && !that.is_shooting)
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
	this._config.gui_context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	drawHUD(this._config);
	show_constrain(this._config);
	
	var test = {
		position : {
			x:3,
			y:0,
			z:7
		},
		rotation : {
			x:0,
			y:0,
			z:0
		}
	};

	this.set_gun(test);
}

Player.prototype._new_constraint = function ()
{
	var rand = Math.random() * this._config.constraint_names.length | 0;

	//console.log("contrainte :", this._config.constraint_names[rand]);
	return this._config.constraint_names[rand];
};

Player.prototype.jump = function ()
{
	var ratio = 0.75;
	this.camera.cameraDirection.y = this._config.gravity * this.velocity// * this._config.delta_time);
	this.velocity *= ratio;
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
			that._config.shootSound.play();
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
		//console.log("PUNITION !");
		this.time_2_check_constraint = this._config.time + this.time_between_constraint_checks;
		this._config.socket.emit('constaint_punishment', this._config.constraint_hp_punishment);
	}
};

Player.prototype.respawn = function ()
{
	var spwan = Math.random() * this._config.spwan_points.length | 0;
	var that = this;
	this._config.aieGUI = false;
	this._config.gui_context.clearRect(0,0,window.innerWidth, window.innerHeight);
	drawHUD(this._config);
	this.state = "playing";
	show_leaderboard(this._config);

	this.camera.position = new BABYLON.Vector3(this._config.spwan_points[spwan].position.x, this._config.spwan_points[spwan].position.y, this._config.spwan_points[spwan].position.z);
	this.camera.rotation = new BABYLON.Vector3(this._config.spwan_points[spwan].rotation.x, this._config.spwan_points[spwan].rotation.y, this._config.spwan_points[spwan].rotation.z);

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
	that.constraintInfo = that._new_constraint();
	that.constraint = that.constraintInfo.name;
	that.ready_2_be_punish = false;
	that.is_shooting = true;
	window.setTimeout(function(){that.ready_2_be_punish = true}, that._config.peace_time);
	window.setTimeout(function(){that.is_shooting = false}, that._config.peace_time / 6);
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

Player.prototype.set_gun = function (p_mesh)
{
	this._config.gun_mesh.position.x = p_mesh.position.x - 2.2// + p_mesh.rotation.x;
	this._config.gun_mesh.position.y = p_mesh.position.y - 0.6// + p_mesh.rotation.y;
	this._config.gun_mesh.position.z = p_mesh.position.z - 6// + p_mesh.rotation.z;

	this._config.gun_mesh.rotation.x = p_mesh.rotation.x - 0.5;
	this._config.gun_mesh.rotation.y = p_mesh.rotation.y - 0.3;
	this._config.gun_mesh.rotation.z = p_mesh.rotation.z + 2.5;

	this._config.gun_mesh.parent = this.camera;

	//console.log("positions", this._config.gun_mesh.position, p_mesh.position);
	//console.log("rotations", this._config.gun_mesh.rotation, p_mesh.rotation);
}

/*
**
*/

function check_player_movement (that)
{
	var margin = 0.01;

	//this._config.gun_mesh.position = this._config.camera._oldPosition.clone();

	that.is_moving = margin < that.camera._diffPosition.x * that.camera._diffPosition.x
							+ that.camera._diffPosition.y * that.camera._diffPosition.y
							+ that.camera._diffPosition.z * that.camera._diffPosition.z;
}
function handCalculateDistance (p_config, origin, arivée, speed)
{
	var distanceX = arivée.x - origin.x;
	var distanceY = arivée.y - origin.y;
	var distanceZ = arivée.z - origin.z;
	var normalisationRatio = Math.abs(distanceX) + Math.abs(distanceY) + Math.abs(distanceZ);
	normalisationRatio = normalisationRatio ? normalisationRatio : 1;
	this.hasReached = (distanceX > -0.1 && distanceX < 0.1) && (distanceY > -0.1 && distanceY < 0.1) && (distanceZ > -0.1 && distanceZ < 0.1) ? true:false;
	if(this.hasReached)
		return 0;

	return { x: distanceX / normalisationRatio, y:distanceY /normalisationRatio, z: distanceZ / normalisationRatio }
}

function moveHand(p_config, origin, destination, speed)
{
	var distanceXYZ = handCalculateDistance(p_config, origin, destination);

	if(!distanceXYZ)
	{
		p_config.HandNeedToMove = false;
		p_config.cpt++;
		this.nextPos = null;
	}
	else
	{
		p_config.gun_mesh.position.x += distanceXYZ.x * p_config.hand_speed * speed;
		p_config.gun_mesh.position.y += distanceXYZ.y * p_config.hand_speed * speed;
		p_config.gun_mesh.position.z += distanceXYZ.z * p_config.hand_speed * speed;
		
	}
}
