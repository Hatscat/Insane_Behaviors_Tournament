/*
** new player event cb
*/
function new_player (p_config, p_data)
{
	/*on va créer le player il faut qu'il ai un ID en deuxième paramètre*/
	window.config = p_config
	p_config.player.init(p_data);
}

function delete_ghost (p_config, p_data)
{
	p_config.ghosts[p_data.id].kill();
	delete p_config.ghosts[p_data.id];
}

function update_ghosts (p_config, p_data)
{

	/* on va mettre tout les autres players en tant que "ghost" des images rémanentes des persos*/
	for(var p in p_data.players)
	{	

		if(p != p_config.player._id && p_data.players[p].active)
		{
			if(!p_config.ghosts[p])
			p_config.ghosts[p] = new Ghost(p_config, p_data.players[p], p);
		
			p_config.ghosts[p].anim(p_data.players[p]);
			p_config.ghosts[p].move(p_data.players[p]);
			p_config.ghosts[p].death = p_data.players[p].death;
			p_config.ghosts[p].frag = p_data.players[p].frag;

		}
	}
}

function kill (p_config, p_data)
{
	p_config.player.frag++;
	config.gui_context.fillStyle = "rgb(255,0,0)";
	config.gui_context.clearRect(window.innerWidth-200, 10,500, 500);
	config.gui_context.fillText("FRAGS :"  + (config.player.frag || 0), window.innerWidth-150, 50);
}

function update_life (p_config, p_data)
{
	if (p_config.player.current_hp > p_data.life)
	{
		p_config.aieGUI = 0.4;
	}

	p_config.player.current_hp = p_data.life;

	if(p_data.life <= 0)
	{
		p_config.player.death = p_data.death;
		p_config.player.respawn();
	}
}

function show_laser (p_config, p_data)
{
	console.log(p_data); // class Laser_ghost (p_config, p_pos, p_rot, p_distance)
	p_config.lasers.push(new Laser_ghost(p_config, p_data.pos, p_data.rot, p_data.dist));
}

function casseToi (p_config, p_data)
{
	localStorage.removeItem("id");
	localStorage["EROR_INSANE_TOURNAMENT"] = "Problème de connexion, veuillez rééssayer";
	window.location.reload();
}





