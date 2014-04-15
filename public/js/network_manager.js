/*
** new player event cb
*/
function new_player (p_config, p_data)
{
	window.config = p_config;
	p_config.player = new Player(p_config, p_data);
	p_config.socket.emit('playerCreated', '');

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
		if(p != p_config.player._id)
		{
			if(!p_config.ghosts[p])
				p_config.ghosts[p] = new Ghost(p_config, p_data.players[p]);

			p_config.ghosts[p].x = p_data.players[p].x;
			p_config.ghosts[p].y = p_data.players[p].y;
			p_config.ghosts[p].z = p_data.players[p].z;
			p_config.ghosts[p].id = p;
		}
	}
}

function kill (p_config, p_data)
{
	p_config.player.frag++;
}

function update_life (p_config, p_data)
{
	p_config.player.hp = p_data.life;

	if(p_data.life <= 0)
	{
		p_config.player.death = p_data.death;
		p_config.player.respawn();
	}
}





