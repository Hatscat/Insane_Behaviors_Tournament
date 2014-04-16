/*
** ghost class
*/
function Ghost (p_config, p_data, id)
{
	this._config 						= p_config;
	this._id 							= id;
	this.frag							= p_data.frag;
	this.death							= p_data.death;
	this.mesh 							= p_config.ghost_mesh_model.clone(this._id);
	this.mesh.position.x 				= p_data.x;
	this.mesh.position.y 				= p_data.y;
	this.mesh.position.z 				= p_data.z;
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
	this.mesh.position.x 	= p_data.x;
	this.mesh.position.y 	= p_data.y;
	this.mesh.position.z 	= p_data.z;
};

Ghost.prototype.kill = function (p_data)
{
	this._config.scene._toBeDisposed.push(this.mesh);
	//this.mesh.dispose();
};
