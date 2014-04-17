/*
** Player class
*/
function Player (p_config)
{
	var that 						= this;
	this._config 					= p_config;
	this.on_ground 					= true;
	this.is_jumping 				= false;
	this.velocity 					= 0;
	this.accelation 				= p_config.gravity;
	this.velocity_max 				= p_config.player_jump_max;
	this.constraint 				= this._new_constraint();
	this.constraintImage			= new Image();
	this.constraintImage.src		= /*this._config.constraintImages[this.constraint.id]*/ '/assets/imageStock.png';
	this.camera 					= new BABYLON.FreeCamera('client_camera', new BABYLON.Vector3(this.x, this.y, this.z), p_config.scene);

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

	//console.log(this._config)
	// shoot event
	window.addEventListener('click', function ()
	{
		if (that._config)
		{
			that.shoot(that);
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
	localStorage['Username']	= this.name;
	this.camera.position 		= new BABYLON.Vector3(p_data.player.position.x, p_data.player.position.y, p_data.player.position.z);
	this.camera.rotation 		= new BABYLON.Vector3(p_data.player.rotation.x, p_data.player.rotation.y, p_data.player.rotation.z);
	this.frag					= p_data.player.frag;
	this.death					= p_data.player.death;
	this.hp_max 				= this._config.max_hp;
	this.current_hp 			= p_data.player.life;
	this._config.socket.emit('playerCreated');
}

Player.prototype._new_constraint = function ()
{
	var rand = Math.random() * this._config.constraint_names.length | 0;

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
		var pickResult = that._config.scene.pick(that._config.canvas.width / 2, that._config.canvas.height / 2);
		
		if (pickResult.pickedMesh)
		{
			//console.log("touché :", pickResult.pickedMesh.name);
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
	/*this["constraint_" + this.constraint]();*/
};

Player.prototype.respawn = function ()
{

	var spwan = Math.random() * this._config.spwan_points.length | 0;
	show_leaderboard(this._config, 300);
	this.showLeader = true;

	this.camera.position 		= new BABYLON.Vector3(this._config.spwan_points[spwan].position.x, this._config.spwan_points[spwan].position.y, this._config.spwan_points[spwan].position.z);
	this.camera.rotation 		= new BABYLON.Vector3(this._config.spwan_points[spwan].rotation.x, this._config.spwan_points[spwan].rotation.y, this._config.spwan_points[spwan].rotation.z);

	this._config.socket.emit('respawn',
		{
			id: this._id,
			position: this.camera.position,
			rotation: this.camera.rotation
		});
};

/*
** constraints
*/
Player.prototype.constraint_dont_miss = function ()
{

}
Player.prototype.constraint_always_move = function ()
{

}
Player.prototype.constraint_dont_shoot_while_moving = function ()
{

}