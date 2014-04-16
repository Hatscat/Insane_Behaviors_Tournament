/*
** Player class
*/
function Player (p_config)
{
	var that 						= this;
	this._config 					= p_config;
	this.on_ground 					= true;
	this.is_jumping 				= false;
	this.constraint 				= this._new_constraint();
	this.speed 						= p_config.player_speed_max;
	this.camera_rotation_speed 		= p_config.camera_speed_max;
	this.camera 					= new BABYLON.FreeCamera('client_camera', new BABYLON.Vector3(this.x, this.y, this.z), p_config.scene);

	this.camera.speed 				= this._config.player_speed_max;
	this.camera.angularSensibility 	= this._config.camera_speed_max;
	this.camera.keysUp 				= [this._config.keys.up];
	this.camera.keysDown 			= [this._config.keys.down];
	this.camera.keysLeft 			= [this._config.keys.left];
	this.camera.keysRight 			= [this._config.keys.right];

	this._config.camera 			= this.camera;
	this._config.scene.activeCamera.attachControl(this._config.canvas);

	// jump event
	window.addEventListener('keydown', function (event)
	{
		if (event.keyCode == that._config.keys.jump)
		{
			if (that.on_ground)
			{
				console.log("je saute !");
				that.on_ground = false;
				that.is_jumping = true;
			}
		}
	});

	//console.log(this._config)
	// shoot event
	window.addEventListener('click', this.shoot);
}

/*
** methods
*/
Player.prototype.init = function (p_data)
{
	this._id 					= p_data.id;
	this.x 						= p_data.player.x;
	this.y 						= p_data.player.y;
	this.z 						= p_data.player.z;
	this.frag					= p_data.player.frag;
	this.death					= p_data.player.death;
	this.hp_max 				= p_config.max_hp;
	this.current_hp 			= p_data.player.life;
}

Player.prototype._new_constraint = function ()
{
	var constraint = null;

	return constraint;
};

Player.prototype.move = function ()
{
	this._config.camera.position.x = this.x;
	this._config.camera.position.y = this.y;
	this._config.camera.position.z = this.z;

	/*if(hasMoved)
	{
		this._config.socket.emit('playerMove', {x:this.x, y:this.y, id:this._id})
	}*/
};
Player.prototype.jump = function ()
{	
	/*is_jumping (camera, ground, velocity, velocity_max, is_falling, ts)
	{
		var value = velocity_max / 9;
		velocity += velocity < velocity_max ? is_falling ? -value : value : (is_falling = true, -value);
		camera.position.y += velocity;

		if (velocity <= 0)
		{
			on_ground = true;
		}
		else
		{ // pas ça !
			requestAnimationFrame(function(t){is_jumping(camera,ground,velocity,velocity_max,is_falling,t)});
		}
	}*/
}
Player.prototype.shoot = function ()
{
	if (this._config && this._config.scene)
	{
		var pickResult = this._config.scene.pick(this._config.canvas.width / 2, this._config.canvas.height / 2);
		console.log("touché :", pickResult.pickedMesh.name);
		//console.log("point touché :", pickResult.pickedPoint);

		this._config.socket.emit('shootPlayer', {id: this._id, idJoueurTouche: pickResult.pickedMesh.name, pickedPoint: pickResult.pickedPoint});
		
		/*var particleSystem = new BABYLON.ParticleSystem("particles", 200, scene);
		particleSystem.particleTexture = new BABYLON.Texture("Flare.png", scene);
		// Where the particles comes from
		particleSystem.emitter = pickResult.pickedMesh; // the starting object, the emitter
		particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 1); // Starting all From
		particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, -1); // To...

		// Colors of all particles (splited in 2 + specific color before dispose)
		particleSystem.color1 = new BABYLON.Color4(0.5, 0.5, 0.5, 1e-100);
		particleSystem.color2 = new BABYLON.Color4(0.5, 0.5, 0.5, 1e-100);
		particleSystem.colorDead = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0);

		// Size of each particle (random between...
		particleSystem.minSize = 2;
		particleSystem.maxSize = 3;

		// Life time of each particle (random between...
		particleSystem.minLifeTime = 0.8;
		particleSystem.maxLifeTime = 0.8;

		// Emission rate
		particleSystem.emitRate = 100;
		// OR
		//particleSystem.manualEmitCount = 1000;


		// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		//Set the gravity of all particles (not necessary down)
		//particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

		//Direction of each particle after it has been emitted
		particleSystem.direction1 = new BABYLON.Vector3(-10, 0, 10);
		particleSystem.direction2 = new BABYLON.Vector3(10, 0, -10);

		//angular speed, in radian
		particleSystem.minAngularSpeed = 0;
		particleSystem.maxAngularSpeed = Math.PI;

		//particleSystem.targetStopDuration = 3;

		//speed
		particleSystem.minEmitPower = 0.2;
		particleSystem.maxEmitPower = 0.2;
		particleSystem.updateSpeed = 0.005;

		//dispose
		particleSystem.disposeOnStop = true;

		//Start the particle system
		particleSystem.start();*/
	}
};
Player.prototype.check_constraint = function ()
{
	eval(this.constraint);
};
Player.prototype.respawn = function ()
{
	this.x = 10;
	this.y = 10;
	this.z = 10;
	this._config.socket.emit('respawn', {id:this._id, x:this.x, y:this.y, z:this.z})
};