/*
** run loop, every frames
*/
function run (p_config)
{
	if(!p_config.HandNeedToMove && p_config.time > p_config.oldHandTime + 500 && lauchGame)
	{
		p_config.oldHandTime = p_config.time
		p_config.HandNeedToMove = true;
	}
	
	check_player_movement(p_config.player);

	p_config.time 			= Date.now() || function(){return new Date().getTime()};
	//var elapsed_time 		= p_config.time - p_config.old_time;
	//p_config.old_time 		= p_config.time;
	//p_config.delta_time 	= elapsed_time * 0.04 || 1;

	if(p_config.time > p_config.oldRayTime + 500)
	{
		p_config.oldRayTime = p_config.time;
		pickResult = p_config.scene.pick(window.innerWidth / 2, window.innerHeight / 2, function(m){return !(m.name=='laser')});

		if (pickResult.pickedMesh && pickResult.pickedMesh.id == p_config.ghost_id && p_config.ghosts[pickResult.pickedMesh.name])
		{
			var txt = "Name: " + p_config.ghosts[pickResult.pickedMesh.name].name
			$("#nameSpoted").text(txt);
			$("#nameSpoted").show();
		}
		else
		{
			$("#nameSpoted").hide();
		}
		
	}
	if(p_config.HandNeedToMove)
	{
		var origin = p_config.gun_mesh.position;
/*		if(p_config.player.is_shooting)
		{
			var dest = {x : -0.5, y: -0.5, z: 0.1}
			moveHand(p_config, origin, dest, 0.001);
		}*/
		if(p_config.player.is_moving)
		{
			var dest = p_config.cpt %2 == 0 ? {x :0.7, y: p_config.gun_mesh.position.y, z: p_config.gun_mesh.position.z}:{x : 0.2, y: p_config.gun_mesh.position.y, z: p_config.gun_mesh.position.z}
			moveHand(p_config, origin, dest, 0.001)
		}

	}


	if (p_config.player._id)
	{
		p_config.socket.emit('playerMove',
		{
			position: p_config.camera.position,
			rotation: p_config.camera.rotation,
			id: p_config.player._id
		});
	}

	if (p_config.aieGUI)
	{

		p_config.aieGUI -= 0.02;

		if (p_config.aieGUI <= 0)
		{
			p_config.aieGUI = false;
			//config.gui_context.drawImage(config.player.constraintImage, 500, 500);
			p_config.gui_context.clearRect(0,0,window.innerWidth, window.innerHeight);
			drawHUD(p_config);
			
		}
	}

	if (p_config.player.is_jumping)
	{
		p_config.player.jump();
	}

	p_config.player.check_constraint();

	if (p_config.player.camera.position.y < p_config.min_y)
	{
		p_config.socket.emit('constaint_punishment', p_config.max_hp);
	}

	for (var i1 in p_config.lasers)
	{
		Laser_update(p_config.lasers[i1]);
	}
}
