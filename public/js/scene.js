function createScene (p_config)
{
	if (!p_config.scene)
	{
		p_config.scene = new BABYLON.Scene(p_config.engine);

		p_config.lights[l] = new BABYLON.direcionalLight(p_config.babylon_lights[l].name, new BABYLON.Vector3(p_config.babylon_lights[l].x, p_config.babylon_lights[l].y, p_config.babylon_lights[l].z), p_config.scene);
		p_config.lights[l].intesity = p_config.babylon_lights[l].intesity;

		var skybox = createSkybox(p_config);
		//import meshses
		//lenflare
		p_config.map_mesh = createMapMesh(p_config);
		p_config.ghost_mesh_model = createGhostsMeshModel(p_config);

		//Set gravity to the scene (G force like, on Y-axis. Very low here, welcome on moon)
		p_config.scene.gravity = new BABYLON.Vector3(0, -10, 0);
	   
		// Enable Collisions
		p_config.scene.collisionsEnabled = true;

		
		
	}
}

function createSkybox (p_config)
{
	var skybox = BABYLON.Mesh.CreateBox("skyBox", p_config.skybox.size, p_config.scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", p_config.scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(p_config.skybox.images, p_config.scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;
	return skybox;
};

function createMapMesh (p_config)
{
	//finally, say which mesh will be collisionable
	//ground.checkCollisions = true;
}

function createGhostsMeshModel (p_config)
{

}

/* function createDecorMeshModel (p_config) {//box.checkCollisions = true;} */
