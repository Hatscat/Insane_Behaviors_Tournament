/*
** new player event cb
*/
function new_player (p_data, p_config)
{

	p_config.myID = p_config.myID || p_data[0];
	/*sessionStorage.setItem("id", p_config.myID);*/

	console.log("data ", p_data);

	for (var i in p_data[1])
	{
		if (p_data[1][i] && !p_config.players[p_data[1][i]])
		{
			p_config.players[i] = new Player(i);
		}
		console.log(i);
	}
	//console.log(p_config.players[p_data[0]]);
}
/*
** update one extern player cb
*/
function update_an_ext_player (p_data, p_config)
{
	if (p_data[0] != p_config.myID)
	{
		console.log("player " + p_data[0] + " move !");
		var p = p_config.players[p_data[0]];
		p.x = p_data[1];
		p.y = p_data[2];
	}
}
/*
** update my player obj
*/
function my_player_move (p_data, p_config)
{
	p_config.players[p_config.myID].x = p_data.pageX - p_config.players[p_config.myID].w / 2;
	p_config.players[p_config.myID].y = p_data.pageY - p_config.players[p_config.myID].h / 2;
	p_config.socket.emit('move', [p_config.myID, p_config.players[p_config.myID].x, p_config.players[p_config.myID].y]);
}
/*
** update a player
*/
function deco_player (p_data, p_config)
{
	delete p_config.players[p_data];
	console.log(p_config.players)
}