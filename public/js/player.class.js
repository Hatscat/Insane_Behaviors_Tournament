/*
** Player class
*/
function Player (p_config, p_data)
{
	console.log(p_data)

	var that 					= this;
	this._config 				= p_config;
	this._id 					= p_data.id;
	this.x 						= p_data.player.x;
	this.y 						= p_data.player.y;
	this.z 						= p_data.player.z;
	this.frag					= p_data.player.frag;
	this.death					= p_data.player.death;
	this.hp_max 				= p_config.max_hp;
	this.current_hp 			= p_data.player.life;
	this.on_ground 				= true;
	this.is_jumping 			= false;
	this.speed 					= p_config.player_speed_max;
	this.camera_rotation_speed 	= p_config.camera_speed_max;
	this.camera 				= new BABYLON.FreeCamera('client_camera', new BABYLON.Vector3(this.x, this.y, this.z), p_config.scene);

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
	//config.camera = new BABYLON.freeCamera(config.babylon_camera.name, config.babylon_camera.alpha, config.babylon_camera.beta, config.babylon_camera.radius, new BABYLON.Vector3(config.babylon_camera.x, config.babylon_camera.y, config.babylon_camera.z), config.scene);
	//config.scene.activeCamera.attachControl(canvas);

	/*this.camera.speed 				= 0.5;
	this.camera.angularSensibility 	= 2500;
	this.camera.keysUp 				= [this._config.keys.up]; // Touche Z
	this.camera.keysDown 			= [this._config.keys.down]; // Touche S
	this.camera.keysLeft 			= [this._config.keys.left]; // Touche Q
	this.camera.keysRight 			= [this._config.keys.right]; // Touche D;*/

}

/*
** methods
*/
Player.prototype._collide = function (p_config)
{

};
Player.prototype.move = function (p_config)
{
	this._collide(p_config);

	/*if(hasMoved)
	{
		this._config.socket.emit('playerMove', {x:this.x, y:this.y, id:this._id})
	}*/
};
Player.prototype.jump = function (p_config)
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
Player.prototype.shoot = function (p_config)
{
	/*if(raycastHasTouchedAPlayer)*/
	this._config.socket.emit('shootPlayer', {id: this._id, idJoueurTouche: name});
};
Player.prototype.check_constraint = function (p_config)
{

};
Player.prototype.respawn = function (p_config)
{
	this.x = 10;
	this.y = 10;
	this.z = 10;
	this._config.socket.emit('respawn', {id:this._id, x:this.x, y:this.y, z:this.z})
};