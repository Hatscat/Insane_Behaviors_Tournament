function createScene (config)
{
	
	if (!config.scene)
	{
		config.scene = new BABYLON.Scene(config.engine);

/*		for(l in config.babylon_lights)
		{
			config.lights[l] = new BABYLON.direcionalLight(config.babylon_lights[l].name, new BABYLON.Vector3(config.babylon_lights[l].x, config.babylon_lights[l].y, config.babylon_lights[l].z), config.scene);
			config.lights[l].intesity = config.babylon_lights[l].intesity;
		}*/

		var skybox = createSkybox(config);
		//import meshses
		//lenflare
		config.map = createMap(config);
	}
}

function createSkybox (config)
{
	var skybox = BABYLON.Mesh.CreateBox("skyBox", config.skybox.size, config.scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", config.scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(config.skybox.images, config.scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;
	return skybox;
};

function createMap(config)
{

}
