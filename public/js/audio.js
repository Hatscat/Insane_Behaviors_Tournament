var Sound = function(ctx, url, volume, autoPlay, loop)
{
	this.ctx = ctx
	this.volume = volume
	this.soundBuffer = null;
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	// Create a gain node.
	this.gainNode = context.createGain();

	// Decode asynchronously
	this = that;
	request.onload = function() 
	{
	  this.ctx.decodeAudioData(request.response, function(buffer) 
	  {
	    that.soundBuffer = buffer;
		that.source = that.ctx.createBufferSource(); 				// creates a sound source
		that.source.loop = that.loop || false 						//sets the loop
		that.source.buffer = that.soundBuffer;                   	// tell the source which sound to play
		that.source.connect(gainNode);      						// connect the source to the node (serve to manipulate the sound)
		that.gainNode.connect(that.ctx.destination) 				// connect the node to the destination (speaker)
		that.gainNode.gain.value = that.volume;
		if(that.autoPlay)
			that.play();
	  }, onError);
	}
	request.send();

	if(autoPlay)
		this.play();

}

Sound.prototype.play = function (delay) 
{
	delay = delay || 0;
	this.source.start(delay);                           // play the source after the given delay
}

Sound.prototype.stop = function (delay) 
{
	delay = delay || 0;
	this.source.stop(delay);                           // play the source after the given delay
}

function init_sound_context(p_config) 
{

   var context = new AudioContext();

}