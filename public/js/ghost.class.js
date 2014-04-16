/*
** ghost class
*/
function Ghost (p_config, p_data)
{
	this._config 		= p_config;
	this._id 			= p_data.id;
	this.x 				= p_data.x;
	this.y 				= p_data.y;
	this.z 				= p_data.z;
	this.mesh 			= p_config.ghost_mesh_model.clone(this._id);
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

Ghost.prototype.move = function (p_ghost_new)
{
	this.x =  p_ghost_new.x;
	this.y =  p_ghost_new.y;
	this.z =  p_ghost_new.z;
};
