
$("#ButtonIndex").click(function () {

	$("#ButtonIndex, #ButtonScreenIndex").hide();

    $(".EnsembleLogin").show();

});

$(".ButtonBackLogin").click(function () {

	$(".EnsembleLogin").hide();

	$("#ButtonIndex, #ButtonScreenIndex").show();

});



$('#ButtonScreenIndex').click(function() 
{

 	localStorage['FullScreen'] = localStorage['FullScreen'] == true ? false:true;
 	screenfull.toggle();

 	});

