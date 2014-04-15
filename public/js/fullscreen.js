var notFull = false;

   if ( notFull === false ) {

$('#ButtonScreen').click(function() {

 	screenfull.toggle();
 	notFull = true;

 	});

 } 

 	if ( notFull === true ) {

$('#ButtonScreen').click(function() {

	screenfull.toggle();
    notFull = false;

    });
 }
