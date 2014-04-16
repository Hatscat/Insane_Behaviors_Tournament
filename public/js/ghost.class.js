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
}

/*
** methods
*/
Ghost.prototype.anim = function (p_ghost_old, p_ghost_new)
{
	if(p_ghost_old.x > p_ghost_new.x)
	{
		//anim gauche ou droite (je sais jamais quel sens);
	}
	else if(p_ghost_old.x < p_ghost_new.x)
	{
		// anim droite ou gauche (inverse de la précédante)
	}

	if(p_ghost_old.y > p_ghost_new.y)
	{
		//anim chute
	}
	else if(p_ghost_old.y < p_ghost_new.y)
	{
		//anim saut
	}
};
Ghost.prototype.move = function (p_ghost_old, p_ghost_new)
{
	p_ghost_old.x =  p_ghost_new.x;
	p_ghost_old.y =  p_ghost_new.y;
	p_ghost_old.z =  p_ghost_new.z;
};
