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

function drawHUD(p_config)
{
	p_config.gui_context.font = "20pt Nova-Square";
	p_config.gui_context.fillStyle = "rgb(255,0,0)";
	p_config.gui_context.fillText("FRAGS : "  + (p_config.player.frag || 0), p_config.fragX, p_config.fragY);
	p_config.gui_context.fillText("LIFE :", p_config.lifeX, p_config.lifeY);
	p_config.gui_context.fillStyle = '#f50';
	p_config.gui_context.fillRect(p_config.cursorX, p_config.cursorY, 8, 8); // arg


	p_config.gui_context.fillStyle = '#000';
	p_config.gui_context.fillRect(p_config.lifeBackX, 25, 500, 30); // arg

	p_config.gui_context.fillStyle = '#f00';
	p_config.gui_context.fillRect(p_config.lifeBackX+1, 24, (p_config.player.current_hp || p_config.max_hp)*498/p_config.max_hp, 30); // arg
}