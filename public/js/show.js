
$("#ButtonIndex").click(function () 
{
	if(localStorage['Username'])
	{
		init_game();
		$("#menu").hide();
		return;
	}

	$("#ButtonIndex, #ButtonScreenIndex").fadeOut('fast');

    $(".EnsembleLogin").fadeIn('fast');

});

$(".ButtonBackLogin").click(function () {

	$(".EnsembleLogin").fadeOut('fast');

	$("#ButtonIndex, #ButtonScreenIndex").fadeIn('fast');

});

$(".ButtonLogin").click(function () {

    localStorage['Username'] = document.getElementById("text-1").value;
    $("#menu").hide();
    init_game();

});
function show_leaderboard(p_config)
{
	$("#leaderBoard").empty()
	var tabOrdo = [];
	var balises ="";

	for(var g in p_config.ghosts)
	{
		tabOrdo.push(p_config.ghosts[g].frag);
	}
	tabOrdo.push(p_config.player.frag);
	tabOrdo.sort(function(a,b){return b-a});
	for(var i=0; i<tabOrdo.length;i++)
	{
		var match = false;
		for(var g in p_config.ghosts)
		{
			if(p_config.ghosts[g].frag === tabOrdo[i])
			{
				match = true;
				var phrase = ("<tr><td>" + p_config.ghosts[g]._id + "</td><td>"+p_config.ghosts[g].frag+"</td> <td>"+p_config.ghosts[g].death+"</td></tr>")
				balises += 	phrase;
			}
		}
		if(match == false)
		{
			var phrase = "<tr id='player'><td>" + p_config.player._id + "</td><td>"+p_config.player.frag+"</td><td>"+p_config.player.death+"</td></tr>"
			balises += phrase
								
								
								
						
		}
	}

	$("#leaderBoard").append(balises);
	$("#leaderBoard").show();
	
}

