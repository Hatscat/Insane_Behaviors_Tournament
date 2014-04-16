var Sound = function(ctx, url, volume, autoPlay, loop)
{
	this.volume = volume || 1;
	this.autoPlay = autoPlay || false;
	this.loop = loop || false
	this.ctx = ctx
	
	if(this.ctx === "useHowler")
	{
		this.sound = new Howl({  urls: [url + ".mp3", url + ".ogg"],  
			autoplay: this.autoPlay,  loop: this.loop,  volume: this.volume, buffer: true,  
		});

	}

	else
	{
		this.soundBuffer = null;
		var request = new XMLHttpRequest();
		request.open('GET', url + "ogg", true);
		request.responseType = 'arraybuffer';
		// Create a gain node.
		this.gainNode = ctx.createGain();

		// Decode asynchronously
		var that = this;
		request.onload = function() 
		{
			var thut = that;
			that.ctx.decodeAudioData(request.response, function(buffer) 
			{
			that.soundBuffer = buffer;
			
			if(that.autoPlay)
				that.play();
			});
		}
		request.send();
		
	}


}

Sound.prototype.play = function (delay) 
{
	if(this.ctx === "useHowler")
	{
		this.sound.play();
	}
	else
	{
		delay = delay || 0;

		this.source = this.ctx.createBufferSource(); 				// creates a sound source
		this.source.loop = this.loop;								//sets the loop
		this.source.buffer = this.soundBuffer;                   	// tell the source which sound to play
		this.source.connect(this.gainNode);      					// connect the source to the node (serve to manipulate the sound)
		this.gainNode.connect(this.ctx.destination) 				// connect the node to the destination (speaker)
		this.gainNode.gain.value = this.volume;

		this.source.start(delay);                           // play the source after the given delay
		
	}
}

Sound.prototype.stop = function (delay) 
{
	if(this.ctx === "useHowler")
	{
		this.sound.stop()
	}
	else
	{
		delay = delay || 0;
		this.source.stop(delay);                           // play the source after the given delay
		
	}
}

function init_sound_context(p_config) 
{
  try 
  {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    return context
  }

  catch(e) 
  {
  	return "useHowler";
  }
}