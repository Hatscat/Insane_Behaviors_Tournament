/*
** new player event cb
*/
function new_player (p_config, p_data)
{
	/*on va créer le player il faut qu'il ai un ID en deuxième paramètre*/
		//window.config = p_config

	p_config.player.ready_2_be_punish = true;
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
			if (p_data.players[p].alive)
			{
				if (!p_config.ghosts[p])
				{
					p_config.ghosts[p] = new Ghost(p_config, p_data.players[p], p);
				}

				//p_config.ghosts[p].mesh.material.alpha = 1.0;
				//p_config.ghosts[p].anim(p_data.players[p]);
				p_config.ghosts[p].move(p_data.players[p]);
				p_config.ghosts[p].death = p_data.players[p].death;
				p_config.ghosts[p].frag = p_data.players[p].frag;
			}
			else if (p_config.ghosts[p])
			{
				//p_config.ghosts[p].mesh.material.alpha = 0.0;
				p_config.ghosts[p].kill();
				//p_config.scene._toBeDisposed.push(p_config.ghosts[p].mesh);
				//p_config.ghosts[p].mesh.dispose();
				delete(p_config.ghosts[p]);
			}
		}
	}
}

function kill (p_config, p_data)
{
	p_config.player.frag++;
	p_config.gui_context.fillStyle = "#f00";
	p_config.gui_context.clearRect(window.innerWidth-200, 10, 500, 500);
	p_config.gui_context.fillText("FRAGS : "  + (p_config.player.frag || 0), window.innerWidth-160, 50);
}

function update_life (p_config, p_data)
{
	p_config.player.frag =  p_data.frag || p_config.player.frag;
	p_config.player.death =  p_data.death || p_config.player.death;

	drawHUD(p_config, '', true);

	if (p_config.player.current_hp > p_data.life)
	{
		p_config.aieGUI = 0.2;
		p_config.aieSound.play(100);
		p_config.gui_context.clearRect(0,0,window.innerWidth, window.innerHeight);
		
		if (p_data.origin == 'constaint_punishment')
		{
			p_config.gui_context.fillStyle = "rgba(0, 255, 0, 0.6)";
		}
		else
		{
			p_config.gui_context.fillStyle = "rgba(255, 0, 0, 0.6)";
		}

		p_config.gui_context.fillRect(0,0,window.innerWidth, window.innerHeight);
		drawHUD(p_config);
	}

	p_config.player.current_hp = p_data.life;

	if(p_data.life <= 0)
	{
		p_config.player.death = p_data.death;
		p_config.player.current_hp = 0;
		p_config.aieGUI = 1000;
		drawHUD(p_config, "drawemptybar");
		show_leaderboard(p_config);
		fillText(p_config, "#00f", '"ENTER" to respawn',  window.innerWidth/2-100, window.innerHeight-250)
		p_config.player.state = "waitTorespawn";
		p_config.player.ready_2_be_punish = false;
		p_config.socket.emit('playerDied');
	}
}

function show_laser (p_config, p_data)
{
	//console.log(p_data); // class Laser_ghost (p_config, p_pos, p_rot, p_distance)
	p_config.lasers.push(new Laser_ghost(p_config, p_data.pos, p_data.rot, p_data.dist));
}

function casseToi (p_config)
{
	localStorage.removeItem("id");
	localStorage["EROR_INSANE_TOURNAMENT"] = "Connection problem, please try again";
	window.location.reload();
}





