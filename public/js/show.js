
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

	if(document.getElementById("text-1").value != undefined)	
    	localStorage['Username'] = document.getElementById("text-1").value;

    $("#menu").hide();
    init_game();

});

$('#TitreIndex').addClass('animated bounceIn');

function show_leaderboard(p_config, delay)
{
	delay = delay || 300;

	if(this.show)
	{
		this.show = false;
		hide_leaderboard(p_config, delay);
		return;
	}

	this.show = true;

	var tabOrdo = 	[];
	var balises ="<tr><td>Joueur</td><td>Kill</td><td>Death</td></tr>";

	for(var g in p_config.ghosts)
	{
		tabOrdo.push(p_config.ghosts[g].frag);
		p_config.ghosts[g].select = false;

	}
	tabOrdo.push(p_config.player.frag);
	tabOrdo.sort(function(a,b){return b-a});
	for(var i=0; i<tabOrdo.length;i++)
	{
		var match = false;
		for(var g in p_config.ghosts)
		{
			if(p_config.ghosts[g].frag === tabOrdo[i] && !p_config.ghosts[g].select)
			{
				match = true;
				p_config.ghosts[g].select = true
				var phrase = ("<tr><td>" + p_config.ghosts[g].name + "</td><td>"+p_config.ghosts[g].frag+"</td> <td>"+p_config.ghosts[g].death+"</td></tr>")
				balises += 	phrase;
				break;
			}
		}
		if(match == false)
		{
			var phrase = "<tr id='player' style='color: #FF0000;'><td>" + p_config.player.name + "</td><td>"+p_config.player.frag+"</td><td>"+p_config.player.death+"</td></tr>"
			balises += phrase
						
		}
	}

	$("#leaderBoard").append(balises);
	$("#leaderBoard").fadeIn(delay);
	
}
function hide_leaderboard(p_config, delay)
{
	delay = delay || 300;
	$("#leaderBoard").empty();
	$("#leaderBoard").fadeOut();
}

function show_constrain(p_config)
{
	$(".imageContrainte").css("background-image", "url('assets/" + p_config.player.constraintInfo.name + "_img.png')");
	$("#iconContrainte").css("background-image", "url('assets/" + p_config.player.constraintInfo.name + "_img.png')");
	$(".TexteContrainte").text(p_config.player.constraintInfo.text);
	$(".popupContrainte").fadeIn(300, function(){
			hide_constrain(2000)
			
		});
;
}

function hide_constrain(delay)
{
	$(".popupContrainte").fadeOut(delay, function(){
		$(".TexteContrainte").empty();
		
	});
}

