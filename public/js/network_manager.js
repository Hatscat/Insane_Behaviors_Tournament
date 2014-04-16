/*
** new player event cb
*/
function new_player (p_config, p_data)
{
	/*on va créer le player il faut qu'il ai un ID en deuxième paramètre*/
	window.config = p_config
	p_config.player.init(p_data);

	//p_config.player.config = p_config;
/*	p_config.player.respawn = function ()
	{
		this.x = 10;
		this.y = 10;
		this.z = 10;
		this.config.socket.emit('respawn', {id:this.id, x:this.x, y:this.y, z:this.z})
	}*/
	p_config.socket.emit('playerMove', {x:p_config.player.x, y:p_config.player.y, z:p_config.player.z, id:p_config.player.id})


}

function delete_ghost (p_config, p_data)
{

	delete p_config.ghosts[p_data.id];
}

function update_ghosts (p_config, p_data)
{

	/* on va mettre tout les autres players en tant que "ghost" des images rémanentes des persos*/
	for(var p in p_data.players)
	{	

		if(p != p_config.player._id && !p_config.ghosts[p] && p_data.players[p].active)
		{
			p_config.ghosts[p] = new Ghost(p_config, p_data.players[p], p);
		}

		p_config.ghosts[p].anim(p_config.ghosts[p], p_data.players[p]);
		p_config.ghosts[p].move(p_config.ghosts[p], p_data.players[p]);
	}
}

function kill (p_config, p_data)
{
	p_config.player.frag++;
}

function update_life (p_config, p_data)
{
	p_config.player.life = p_data.life;

	if(p_data.life <= 0)
	{
		p_config.player.death = p_data.death;
		p_config.player.respawn();
	}
}

function show_laser (p_config, p_data)
{
	p_config.lasers.push(p_data);
	console.log(p_data);
}





