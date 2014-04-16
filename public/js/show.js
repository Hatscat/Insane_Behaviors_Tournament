
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


