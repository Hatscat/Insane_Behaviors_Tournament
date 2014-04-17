/*
** client laser beam class
*/
function Laser_client (p_config, p_A, p_B, p_distance)
{
	var that 				= this;
	this._config 			= p_config;
	this.A 					= p_A; // mesh
	this.B 					= p_B; // mesh
	this.length 			= p_distance;
	this.margin 			= 2;
	this.decreasing_speed 	= 0.65;
	this.mesh 				= null;

	this.create(that);
}
Laser_client.prototype.create = function (that)
{
	that.mesh = that._config.laser_mesh_model.clone('laser');
	that.mesh.rotation = new BABYLON.Vector3(that.A.rotation.x + Math.PI / 2, that.A.rotation.y, that.A.rotation.z);
	that.mesh.position = that.A.position.clone();
	that.mesh.scaling.y *= that.length;

	var direction 	= getForwardVector(that.A.rotation);
	var ratio 		= that.length / 2 + that.margin;

	that.mesh.position.x += direction.x * ratio;
	that.mesh.position.y += direction.y * ratio;
	that.mesh.position.z += direction.z * ratio;
};

/*
** ghosts laser beam class
*/
function Laser_ghost (p_config, p_pos, p_rot, p_distance)
{
	var that 				= this;
	this._config 			= p_config;
	this.pos 				= p_pos;
	this.rot 				= p_rot;
	this.length 			= p_distance;
	this.margin 			= 2;
	this.decreasing_speed 	= 0.65;
	this.mesh 				= null;

	this.create(that);
}
Laser_ghost.prototype.create = function (that)
{
	that.mesh = that._config.laser_mesh_model.clone('laser');
	that.mesh.position = that.pos;
	that.mesh.rotation = that.rot;
	that.mesh.scaling.y *= that.length;
};

/*
** common function
*/
function getForwardVector (p_rotation)
{
	var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(p_rotation.y, p_rotation.x, p_rotation.z);   
	var forward = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 1), rotationMatrix);

	return forward;
}

function Laser_update (that)
{
	var ratio = that.decreasing_speed * that._config.delta_time;

	that.mesh.scaling.x *= ratio;
	that.mesh.scaling.z *= ratio;
	//that.mesh.scaling.y *= (ratio * 1.1);

	if (that.mesh.scaling.x <= 0.01)
	{
		that._config.lasers.splice(that._config.lasers.indexOf(that), 1);
		that._config.scene._toBeDisposed.push(that.mesh);
		//that.mesh.dispose();
	}
};