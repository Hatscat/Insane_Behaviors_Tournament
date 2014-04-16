
$("#ButtonIndex").click(function () {

	$("#ButtonIndex, #ButtonScreenIndex").fadeOut('fast');

    $(".EnsembleLogin").fadeIn('fast');

});

$(".ButtonBackLogin").click(function () {

	$(".EnsembleLogin").fadeOut('fast');

	$("#ButtonIndex, #ButtonScreenIndex").fadeIn('fast');

});



$('#ButtonScreenIndex').click(function() 
{

 	localStorage['FullScreen'] = localStorage['FullScreen'] == true ? false:true;
 	screenfull.toggle();

 	});

$(".ButtonLogin").click(function () {

    localStorage['Username'] = document.getElementById("text-1").value;

});


