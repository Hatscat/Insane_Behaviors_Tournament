/*
** laser beam class
*/
function Laser (p_config, p_A, p_B, p_distance)
{
	var that 			= this;
	this._config 		= p_config;
	this.A 				= p_A;
	this.B 				= p_B;
	this.length 		= p_distance;
	this.margin 		= 1;
	this.mesh 			= null;


	this.create(that);
}

/*
** methods
*/
Laser.prototype.create = function (that)
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

Laser.prototype.update = function ()
{
	var ratio = 0.9;

	this.mesh.scaling.x *= ratio;
	this.mesh.scaling.z *= ratio;
	this.mesh.scaling.y *= (ratio * 1.1);
	//this.mesh.material.alpha *= ratio;

	if (this.mesh.scaling.x <= 0.1)
	{
		this._config.lasers.splice(this._config.lasers.indexOf(this), 1);
		this._config.scene._toBeDisposed.push(this.mesh);
		//this.mesh.dispose();
	}
};

Laser.prototype._destroy = function ()
{
	
};


function getForwardVector (p_rotation)
{
	var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(p_rotation.y, p_rotation.x, p_rotation.z);   
	var forward = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 1), rotationMatrix);
	//console.log(forward)
	return forward;
}
