/*
** hud class
*/
function Hud (p_)
{
	this._private_attribut 	= 0;
	this.public_attribut 	= 0;

	
}

/*
** methods
*/
Hud.prototype._private_methods = function (p_)
{

};
Hud.prototype.public_methods = function (p_)
{

};

function drawHUD(p_config, debug)
{
	var ctx = p_config.gui_context;
	$("#iconContrainte").show();
	fillText(p_config, "#f00", 'Constraint : ', 10, 50)
	ctx.font = "20pt Nova-Square";
	ctx.fillStyle = "rgb(255,0,0)";
	ctx.fillText("FRAGS : "  + (p_config.player.frag || 0), p_config.fragX, p_config.fragY);
	ctx.fillText("LIFE :", p_config.lifeX, p_config.lifeY);
	drawCursor(p_config);

	ctx.fillStyle = '#000';
	ctx.fillRect(p_config.lifeBackX-2, 23, 504, 36); // arg

	var grd = ctx.createLinearGradient(p_config.lifeBackX+1 +( (p_config.player.current_hp || p_config.max_hp)*498/p_config.max_hp)/2 , 26, p_config.lifeBackX+1 +( (p_config.player.current_hp || p_config.max_hp)*498/p_config.max_hp)/2, 56);
	grd.addColorStop(0.000, 'rgba(150, 22, 24, 1.000)');
	grd.addColorStop(0.500, 'rgba(255, 0, 0, 1.000)');
	grd.addColorStop(1.000, 'rgba(150, 19, 19, 1.000)');
    ctx.fillStyle = grd;
    if(debug)
		ctx.fillRect(p_config.lifeBackX+1, 26, 1, 30); // arg
	else
		ctx.fillRect(p_config.lifeBackX+1, 26, (p_config.player.current_hp || p_config.max_hp)*498/p_config.max_hp, 30); // arg

}

function fillText(p_config, color, txt, x,y)
{
	p_config.gui_context.font = "20pt Nova-Square";
	p_config.gui_context.fillStyle = color;

	if(x === 'center')
		p_config.gui_context.fillText(txt, window.innerWidth/2-txt.length*5/2, window.innerHeight/2-20/2);
	else
		p_config.gui_context.fillText(txt, x,y);
}
function drawCursor(p_config)
{
	var ctx = p_config.gui_context;
	ctx.strokeStyle = '#0f0';
	ctx.beginPath();
	ctx.moveTo(p_config.cursorX+5,p_config.cursorY);
	ctx.lineTo(p_config.cursorX+35,p_config.cursorY);
	ctx.moveTo(p_config.cursorX-5,p_config.cursorY);
	ctx.lineTo(p_config.cursorX-35,p_config.cursorY);
	ctx.moveTo(p_config.cursorX,p_config.cursorY+5);
	ctx.lineTo(p_config.cursorX,p_config.cursorY+35);
	ctx.moveTo(p_config.cursorX,p_config.cursorY-5);
	ctx.lineTo(p_config.cursorX,p_config.cursorY-35);
	ctx.stroke();
}
function eraseCursor(p_config)
{
	p_config.gui_context.clearRect(p_config.cursorX-35, p_config.cursorY-35, 80,80)
}