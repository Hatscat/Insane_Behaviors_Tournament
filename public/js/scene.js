function createScene (p_config, p_callback)
{
	if (!p_config.scene)
	{
		$('body').append('<h1 id="loading">Loading...</h1>');

		BABYLON.SceneLoader.Load('./assets/scene/', 'scene.babylon', p_config.engine, function (p_new_scene)
		{
			p_new_scene.executeWhenReady(function ()
			{
				p_new_scene.cameras = [];
				delete(p_new_scene.activeCamera);

				var ratio = 7;

				for (var i1 in p_new_scene.meshes)
				{
					p_new_scene.meshes[i1].checkCollisions = true;
					p_new_scene.meshes[i1].scaling = new BABYLON.Vector3(ratio, ratio, ratio);
					//p_new_scene.meshes[i1].position.y += 10; 
				}
				
				//console.log(p_new_scene);

				p_config.scene = p_new_scene;
				p_config.main_light.light = new BABYLON.DirectionalLight(p_config.main_light.name, new BABYLON.Vector3(p_config.main_light.x, p_config.main_light.y, p_config.main_light.z), p_config.scene);
				p_config.main_light.light.intensity = p_config.main_light.intensity;
				p_config.main_light.light.diffuse = new BABYLON.Color3(p_config.main_light.r, p_config.main_light.g, p_config.main_light.b);
				p_config.main_light.light.specular = new BABYLON.Color3(1, 1, 1);

				var skybox = createSkybox(p_config);
				p_config.player = new Player(p_config);

				//p_config.map_mesh = createMapMesh(p_config);
				p_config.laser_mesh_model = createLaserMeshModel(p_config);
				
				createGunMesh(p_config, function(){createGhostsMeshModel(p_config, function(){end_loading(p_config, p_callback)})});

			}, function (p_progress)
			{
				// To do: give progress feedback to user
				//console.log("p_progress", p_progress);
				//$('body').append('<h1 id="loading">Loading...</h1>');
			});
		});
	}
}

function end_loading (p_config, p_callback)
{
	p_config.scene.gravity = new BABYLON.Vector3(0, -p_config.gravity, 0);
	p_config.scene.collisionsEnabled = true;

	p_config.engine.runRenderLoop(function ()
	{
		p_config.scene.render();
	});

	p_callback(p_config);
	$("#loading").remove();
	$('body').append('<h1 id="c2p">The game is loaded, click to play !</h1>');
}

function createSkybox (p_config)
{
	var skybox 			= BABYLON.Mesh.CreateBox("skyBox", p_config.skybox.size, p_config.scene);
	var skyboxMaterial 	= new BABYLON.StandardMaterial("skyBox", p_config.scene);

	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(p_config.skybox.images, p_config.scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

	return skybox;
};

/*function createMapMesh (p_config)
{
	var ground 	= BABYLON.Mesh.CreatePlane("ground", 200.0, p_config.scene);

	ground.material = new BABYLON.StandardMaterial("groundMat", p_config.scene);
	ground.material.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.1);
	ground.material.specularColor = new BABYLON.Color3(0, 0, 0);
	ground.material.backFaceCulling = false;
	ground.position = new BABYLON.Vector3(0, -1, 0);
	ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	ground.checkCollisions = true;

	return ground;
}*/

function createGhostsMeshModel (p_config, p_callback)
{
	// var sphere 		= BABYLON.Mesh.CreateSphere("sphere", 10.0, 3.0, p_config.scene);
	// var sphere_mat 	= new BABYLON.StandardMaterial("sphere_mat", p_config.scene);
	
	// sphere.position = new BABYLON.Vector3(0, -1000, 0);
	// sphere_mat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
	// sphere_mat.specularColor = new BABYLON.Color3(0, 0, 0);
	// sphere_mat.emissiveColor = new BABYLON.Color4(1, 0.5, 0, 1);
	// sphere.material = sphere_mat;

	BABYLON.SceneLoader.ImportMesh('pCube1', './assets/scene/', 'hand.babylon', p_config.scene, function (newMeshes, particleSystems, skeletons) //Skeleton - skeleton.babylon // Cube - blender
	{
		//console.log("newMeshes", newMeshes);

		p_config.ghost_mesh_model = newMeshes[0];

		p_callback(p_config);
	});
}

function createLaserMeshModel (p_config)
{
	// name, height, diameterTop, diameterBottom, tessellation (highly detailed or not), scene, updatable.
	var laser 		= BABYLON.Mesh.CreateCylinder("laser", 1, 1, 1, 9, p_config.scene, false);
	var laser_mat 	= new BABYLON.StandardMaterial("laser_mat", p_config.scene);
	
	laser.position = new BABYLON.Vector3(0, -1000, 0);
	laser_mat.diffuseColor = new BABYLON.Color3(0, 0.2, 0);
	laser_mat.specularColor = new BABYLON.Color3(0, 0.5, 0);
	laser_mat.emissiveColor = new BABYLON.Color3(0.7, 0, 1);
	laser_mat.alpha = 0.5;
	laser.material = laser_mat;

	return laser;
}

function createGunMesh (p_config, p_callback)
{
	BABYLON.SceneLoader.ImportMesh('pCube1', './assets/scene/', 'hand.babylon', p_config.scene, function (newMeshes, particleSystems, skeletons) //Skeleton - skeleton.babylon // Cube - blender
	{
		//console.log("newMeshes", newMeshes);

		p_config.gun_mesh = newMeshes[0];

		var scaling_ratio = 0.001;
		p_config.gun_mesh.scaling = new BABYLON.Vector3(scaling_ratio, scaling_ratio, scaling_ratio);
		/*p_config.gun_mesh.scaling.x *= 0.01;
		p_config.gun_mesh.scaling.y *= 0.01;
		p_config.gun_mesh.scaling.z *= 0.01;*/

		//p_config.gun_mesh.rotation.y = Math.PI;
		//p_config.gun_mesh.position = new BABYLON.Vector3(0, 1, 0);//p_config.player.camera.position;// new BABYLON.Vector3(0, 0, -80);
		
		//console.log("skeletons", skeletons);
		//p_config.scene.beginAnimation(skeletons[0], 0, 100, true, 5.0); //function (target, from, to, loop, speedRatio, onAnimationEnd)
	
		/*p_config.gun_mesh.position.x = p_config.camera.position.x - 2.2;
		p_config.gun_mesh.position.y = p_config.camera.position.y - 0.6;
		p_config.gun_mesh.position.z = p_config.camera.position.z - 6;

		console.log(p_config.camera)
		
		p_config.gun_mesh.parent = p_config.camera;*/

		p_callback(p_config);
	});
}

/* function createDecorMeshModel (p_config) {//box.checkCollisions = true;} */
