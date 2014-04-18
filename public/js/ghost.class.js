/*
** ghost class
*/
function Ghost (p_config, p_data, id)
{
	this._config 						= p_config;
	this._id 							= id;
	this.name							= p_data.name;
	this.frag							= p_data.frag;
	this.death							= p_data.death;
	this.mesh 							= p_config.ghost_mesh_model.clone(this._id);
	this.mesh.id 						= p_config.ghost_id;
	this.mesh.position 					= new BABYLON.Vector3(p_data.position.x, p_data.position.y, p_data.position.z);
	this.mesh.rotation 					= new BABYLON.Vector3(p_data.rotation.x, p_data.rotation.y, p_data.rotation.z);
}

/*
** methods
*/
Ghost.prototype.anim = function (p_ghost_new)
{
	if (this.x > p_ghost_new.x)
	{
		//anim gauche ou droite (je sais jamais quel sens);
	}
	else if (this.x < p_ghost_new.x)
	{
		// anim droite ou gauche (inverse de la précédante)
	}

	if (this.y > p_ghost_new.y)
	{
		//anim chute
	}
	else if (this.y < p_ghost_new.y)
	{
		//anim saut
	}
};

Ghost.prototype.move = function (p_data)
{
	this.mesh.position.x 	= p_data.position.x;
	this.mesh.position.y 	= p_data.position.y + 2;
	this.mesh.position.z 	= p_data.position.z;

	this.mesh.rotation.x 	= p_data.rotation.x + Math.PI;
	this.mesh.rotation.y 	= p_data.rotation.y;
	this.mesh.rotation.z 	= p_data.rotation.z;

	//this.mesh.rotation.x += Math.PI;// / 2;
};

Ghost.prototype.kill = function (p_data)
{
	if (this.mesh)
	{
		this._config.scene._toBeDisposed.push(this.mesh);
		//this.mesh.dispose();
	}
};
