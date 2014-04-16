/*
** Player class
*/
function Player (p_config, p_id, p_position)
{
	this._config 		= p_config;
	this._id 			= p_id;
	this.x 				= p_position.x;
	this.y 				= p_position.y;
	this.z 				= p_position.z;
	this.hp_max 		= p_config.hp_max;
	this.current_hp 	= p_config.hp_max;

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
};
Player.prototype.shoot = function (p_config)
{

};
Player.prototype.check_constraint = function (p_config)
{

};
Player.prototype.respawn = function (p_config)
{

};