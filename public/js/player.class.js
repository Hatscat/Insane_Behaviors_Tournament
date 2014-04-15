/*
** Player class
*/
function Player (p_config, p_data)
{
	console.log(p_data)
	this._config 		= p_config;
	this._id 			= p_data.id;
	this.x 				= p_data.player.x;
	this.y 				= p_data.player.y;
	this.z 				= p_data.player.z;
	this.frag			= p_data.player.frag;
	this.death			= p_data.player.death;
	this.current_hp 	= p_data.player.life;
	//config.camera = new BABYLON.freeCamera(config.babylon_camera.name, config.babylon_camera.alpha, config.babylon_camera.beta, config.babylon_camera.radius, new BABYLON.Vector3(config.babylon_camera.x, config.babylon_camera.y, config.babylon_camera.z), config.scene);

	//config.scene.activeCamera.attachControl(canvas);

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
Player.prototype.shoot = function (p_config)
{
	/*if(raycastHasTouchedAPlayer)*/
	this._config.socket.emit('shootPlayer', {id:this._id, idJoueurTouche: name})
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