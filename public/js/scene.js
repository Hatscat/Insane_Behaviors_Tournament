function createScene (p_config)
{
	if (!p_config.scene)
	{

		p_config.scene = new BABYLON.Scene(p_config.engine);

		p_config.main_light.light = new BABYLON.DirectionalLight(p_config.main_light.name, new BABYLON.Vector3(p_config.main_light.x, p_config.main_light.y, p_config.main_light.z), p_config.scene);
		p_config.main_light.light.intesity = p_config.main_light.intesity;
		p_config.main_light.light.diffuse = new BABYLON.Color3(p_config.main_light.r, p_config.main_light.g, p_config.main_light.b);
		p_config.main_light.light.specular = new BABYLON.Color3(1, 1, 1);

		var skybox = createSkybox(p_config);
		//import meshses
		//lenflare
		p_config.player = new Player(p_config);

		p_config.map_mesh = createMapMesh(p_config);
		p_config.ghost_mesh_model = createGhostsMeshModel(p_config);
		p_config.laser_mesh_model = createLaserMeshModel(p_config);

		p_config.scene.gravity = new BABYLON.Vector3(0, -p_config.gravity, 0);
		p_config.scene.collisionsEnabled = true;

	}
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

function createMapMesh (p_config)
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
}

function createGhostsMeshModel (p_config)
{
	var sphere 		= BABYLON.Mesh.CreateSphere("sphere", 10.0, 3.0, p_config.scene);
	var sphere_mat 	= new BABYLON.StandardMaterial("sphere_mat", p_config.scene);
	
	sphere.position = new BABYLON.Vector3(0, -1000, 0);
	sphere_mat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
	sphere_mat.specularColor = new BABYLON.Color3(0, 0, 0);
	sphere_mat.emissiveColor = new BABYLON.Color4(1, 0.5, 0, 1);
	sphere.material = sphere_mat;

	return sphere;
}

function createLaserMeshModel (p_config)
{
	// name, height, diameterTop, diameterBottom, tessellation (highly detailed or not), scene, updatable.
	var laser 		= BABYLON.Mesh.CreateCylinder("laser", 1, 2, 2, 9, p_config.scene, false);
	var laser_mat 	= new BABYLON.StandardMaterial("laser_mat", p_config.scene);
	
	laser.position = new BABYLON.Vector3(0, -1000, 0);
	laser_mat.diffuseColor = new BABYLON.Color3(1, 0.1, 0);
	laser_mat.specularColor = new BABYLON.Color3(1, 0.1, 0);
	laser_mat.emissiveColor = new BABYLON.Color3(1, 0, 0);
	laser_mat.alpha = 0.5;
	laser.material = laser_mat;

	return laser;
}

/* function createDecorMeshModel (p_config) {//box.checkCollisions = true;} */
