/*
** new player event cb
*/
function new_player (p_config, p_data)
{
	/*on va créer le player il faut qu'il ai un ID en deuxième paramètre*/
	window.config = p_config
	p_config.player = {x:p_data.player.x, y:p_data.player.y, id:p_data.id, life: p_data.player.life};
	p_config.player.x +=10;
	p_config.player.y +=10;
	p_config.player.config = p_config;
	p_config.player.respawn = function()
	{
		this.x = 10;
		this.y = 10;
		this.config.socket.emit('respawn', {id:this.id, x:this.x, y:this.y})
	}
	p_config.socket.emit('playerMove', {x:p_config.player.x, y:p_config.player.y, id:p_config.player.id})

	console.log("event new_player", p_config.player)

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
		if(p != p_config.player.id)
		{
			if(!p_config.ghosts[p])
				p_config.ghosts[p] = {};

			p_config.ghosts[p].x = p_data.players[p].x;
			p_config.ghosts[p].y = p_data.players[p].y;
			p_config.ghosts[p].id = p
			
		}
	}
	console.log("event new_player", p_config.ghosts)
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
		p_config.player.respawn();
	}

}





