class Game{
	constructor(){

		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		
		this.container;
		this.stats;
		this.camera;
		this.scene;
		this.renderer;
		this.debug = false;
		this.debugPhysics = true;
		this.fixedTimeStep = 1.0/60.0;
		this.model;
		this.container = document.createElement( 'div' );
		this.container.style.height = '100%';

		this.speed_factor = 1;

		document.body.appendChild( this.container );
		
		const game = this;
		
		this.js = { forward:0, turn:0 };
		this.clock = new THREE.Clock();

		this.init();
		
		window.onError = function(error){
			console.error(JSON.stringify(error));
		}
	}
	
	init() {
		this.carbody;
		this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.set( 10, 100, 400 );

		this.speed_factor = 1;

		this.scene = new THREE.Scene();
		
		//this.scene.background = new THREE.Color( 0xafa0a0 );
		this.scene.background = new THREE.TextureLoader().load( 'textures/sky.png' );
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.container.appendChild( this.renderer.domElement );
		
        this.helper = new CannonHelper(this.scene);
        this.helper.addLights(this.renderer);
        
		window.addEventListener( 'resize', function(){ this.onWindowResize(); }, false );

		// stats
		if (this.debug){
			this.stats = new Stats();
			this.container.appendChild( this.stats.dom );
		}
		
		this.joystick = new JoyStick({
			game:this,
			onMove:this.joystickCallback
		});
        
		
		
        this.initPhysics();
	}
	
	initPhysics(){
		this.physics = {};
		
		const game = this;
        const world = new CANNON.World();
		this.world = world;
		
		world.broadphase = new CANNON.SAPBroadphase(world);
		world.gravity.set(0, -5, 0);
		world.defaultContactMaterial.friction = 0;

		const groundMaterial = new CANNON.Material("groundMaterial");
		const wheelMaterial = new CANNON.Material("wheelMaterial");
		const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
			friction: 0.3,
			restitution: 0,
			contactEquationStiffness: 500
		});

		// We must add the contact materials to the world
		world.addContactMaterial(wheelGroundContactMaterial);
		///////////////////////////////////////////////////////////////////////////////////////////////////
		const loader = new THREE.GLTFLoader();
		
		loader.load('MudangE.gltf', function(gltf){
		game.model = gltf.scene.children[0];
		game.model.scale.set(1.2,1.2,1.2);

		game.model.rotation.z = 90;
		game.scene.add(game.model);
		});


		// Gachon University; square
		new THREE.GLTFLoader().load('gachon_square_v6.gltf', function(gltf){
		game.model2 = gltf.scene.children[0];
		game.model2.scale.set(1.9, 1.9, 1.9);
		game.scene.add(game.model2);
		game.model2.position.set(-0,-4,-43);
	    });

		new THREE.GLTFLoader().load('it.gltf', function(gltf){  
		game.model3 = gltf.scene.children[0];
		game.model3.scale.set(.7, .7, .7);
		game.scene.add(game.model3);
		game.model3.position.set(-37,10,35);

		// add the event that when the car is close to the building, the building will be destroyed
		game.model3.addEventListener('click', function(other_object, relative_velocity, relative_rotation, contact_normal){
			if (other_object == game.vehicle.chassisBody){
				game.model3.visible = false;
				game.model3.position.set(0,0,0);
				game.model3.removeEventListener('collision');
			} });
		
		});

		new THREE.GLTFLoader().load('test1.gltf', function(gltf){
			game.model4 = gltf.scene.children[0];
			game.model4.scale.set(5, 5, 15);
			game.scene.add(game.model4);
			game.model4.position.set(40,5,25.5);

			// game.model4.rotation.z = 0;
			game.model4.rotation.y = Math.PI;
			// game.model4.rotation.x = 0;
			});

		new THREE.GLTFLoader().load('ground_v3.gltf', function(gltf){
			game.model5 = gltf.scene.children[0];
			game.model5.scale.set(50, 0.5, 50);
			game.scene.add(game.model5);
			game.model5.position.set(0, -4.3, 0);
			game.model5.rotation.z = Math.PI;
			game.model5.rotation.y = Math.PI / 2;
			});

		new THREE.GLTFLoader().load('gachon_infinity.gltf', function(gltf){
			game.model6 = gltf.scene.children[0];
			game.model6.scale.set(10, 10, 10);
			game.scene.add(game.model6);
		});

		new THREE.GLTFLoader().load('ai.gltf', function(gltf){ 
			game.model7 = gltf.scene.children[0];
			game.model7.scale.set(3, 7, 14);
			game.model7.position.set(-30, 0, -42);
			game.scene.add(game.model7);

			game.model7.rotation.y = Math.PI / 2 * 3;
		});

		new THREE.GLTFLoader().load('lion.gltf', function(gltf){
			game.model9 = gltf.scene.children[0];
			game.model9.scale.set(.8, .8, .8);
			game.model9.position.set(0, -3.5, -7);

			game.model9.rotation.y = Math.PI;

			game.scene.add(game.model9);
		});

		
		function gltf_load(gltf, x, y, z, sta, rot){
			new THREE.GLTFLoader().load(gltf, function(gltf){
				if (sta) {
					gltf.scene.children[0].scale.set(3, .75, .75);
					if (rot) {
						gltf.scene.children[0].rotation.y = Math.PI;
					}
				} else {
				gltf.scene.children[0].scale.set(12, 12, 12);}
				gltf.scene.children[0].position.set(x, y, z);
				game.scene.add(gltf.scene.children[0]);
			});
		}
		var sta_x = [-3.8, 30, 15.2, -31.6];
		var sta_z = [33, 33, -33.5, -33.5];

		for (var i = 0; i < 4; i++){
			if (i == 0 || i == 1){
				gltf_load('station.gltf', sta_x[i], -4, sta_z[i], true, true);} 
			else {
				gltf_load('station.gltf', sta_x[i], -4, sta_z[i], true, false);
			} 
		}
		

		var tree_x = [10, 10, -10, -10, 20, 20, -20, -20, 20, 20, -20, 
		25, 25, -25, 0, 25, -5, -25];
		var tree_z = [10, -10, 10, -10, 10, -10, 10, -10, 35, -35, -35,
		35, -35, -35, 45, -35, 45, -35];
		
		for (var i = 0; i < 18; i++){
			gltf_load('stylized_tree/scene.gltf', tree_x[i], -4.3, tree_z[i], false, false);
		} 

		// const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2)); //가로 2미터, 높이 1미터, 세로 4미터, 
		const controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
		const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 3)); 
		const chassisBody = new CANNON.Body({ mass: 2000});
		chassisBody.addShape(chassisShape);
		
		chassisBody.position.set(-20, 4, 20);
		// chassisBody.position.set(32, 4, 30);

		// chassisBody.threemesh.y = -chassisBody.threemesh.position.y;

		/**
		 * 
		 */
		// rotation setting
		var axis = new CANNON.Vec3(0, 1, 0);
		var angle = Math.PI/ 2;
		chassisBody.quaternion.setFromAxisAngle(axis, angle); 
		
		chassisBody.angularVelocity.set(0, 0, 0);
		this.helper.addVisual(chassisBody, 'car');
		this.carbody=chassisBody;

		// add backward chasing camera
		this.followCam = new THREE.Object3D(); //쫓아가는 카메라

		/***
		 * 
		 * 
		 * Cam view setting 
		 * 
		 * vvvvvv
		 */
		// set followCam position, except y-axis
		this.followCam.position.set(15, 20, -30);

		// this.followCam.position.copy((this.camera.position));
		this.scene.add(this.followCam);
		this.followCam.parent = chassisBody.threemesh; //chassisbody를 parent 로 연결  
        this.helper.shadowTarget = chassisBody.threemesh; 

		const options = {
			radius: 0.5,//바퀴 반지름
			directionLocal: new CANNON.Vec3(0, -1, 0),// DIRECTION OF DOWN???
			suspensionStiffness: 30,//서스펜션의 탄성(강성)
			suspensionRestLength: 0.3,//차체와 바퀴가 떨어진 길이
			frictionSlip: 5,
			dampingRelaxation: 2.3,
			dampingCompression: 4.4,
			maxSuspensionForce: 100000,
			rollInfluence:  0.01,
			axleLocal: new CANNON.Vec3(-1, 0, 0),
			chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
			maxSuspensionTravel: 0.3,
			customSlidingRotationalSpeed: -30,
			useCustomSlidingRotationalSpeed: true
		};

		// Create the vehicle
		const vehicle = new CANNON.RaycastVehicle({
			chassisBody: chassisBody,
			indexRightAxis: 0,
			indexUpAxis: 1,
			indeForwardAxis: 2
		});

		options.chassisConnectionPointLocal.set(1, 0, -1);
		vehicle.addWheel(options);

		options.chassisConnectionPointLocal.set(-1, 0, -1);
		vehicle.addWheel(options);

		options.chassisConnectionPointLocal.set(1, 0, 1);
		vehicle.addWheel(options);

		options.chassisConnectionPointLocal.set(-1, 0, 1);
		vehicle.addWheel(options);

		vehicle.addToWorld(world);

		const wheelBodies = [];
		vehicle.wheelInfos.forEach( function(wheel){
			const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
			const wheelBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
			const q = new CANNON.Quaternion();
			q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
			wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
			wheelBodies.push(wheelBody);
			game.helper.addVisual(wheelBody, 'wheel');
		});

		// Update wheels
		world.addEventListener('postStep', function(){
			let index = 0;
			game.vehicle.wheelInfos.forEach(function(wheel){
            	game.vehicle.updateWheelTransform(index);
                const t = wheel.worldTransform;
                wheelBodies[index].threemesh.position.copy(t.position);
                wheelBodies[index].threemesh.quaternion.copy(t.quaternion);
				index++; 
			});
		});
		
		this.vehicle = vehicle;

		let matrix = [];
		let sizeX = 64,
			sizeY = 64;

		for (let i = 0; i < sizeX; i++) {
			matrix.push([]);
			for (var j = 0; j < sizeY; j++) {
				var height = Math.cos(i / sizeX * Math.PI * 5) * Math.cos(j/sizeY * Math.PI * 5) * 2 + 2;
				if(i===0 || i === sizeX-1 || j===0 || j === sizeY-1)
					height = 3;
				matrix[i].push(0); // flatten the ground
			}
		}

		var hfShape = new CANNON.Heightfield(matrix, {
			elementSize: 100 / sizeX
		});
		var hfBody = new CANNON.Body({ mass: 0 });
		hfBody.addShape(hfShape);
		hfBody.position.set(-sizeX * hfShape.elementSize / 2, -4, sizeY * hfShape.elementSize / 2);
		hfBody.quaternion.setFromAxisAngle( new CANNON.Vec3(1,0,0), -Math.PI/2);
		world.add(hfBody);
		this.helper.addVisual(hfBody, 'landscape');
		
		this.animate(chassisBody);
	}
	
	joystickCallback( forward, turn ){
		this.js.forward = forward; //js for joystick
		this.js.turn = turn;
	}
		
    updateDrive(forward=this.js.forward, turn=this.js.turn){
		
		const maxSteerVal = 0.5;
        const maxForce = 1000;
        const brakeForce = 10;
		 
		const force = maxForce * forward;
		const steer = maxSteerVal * turn;
		
		if (forward!=0){
			this.vehicle.setBrake(0, 0);
			this.vehicle.setBrake(0, 1);
			this.vehicle.setBrake(0, 2);
			this.vehicle.setBrake(0, 3);

			this.vehicle.applyEngineForce(force, 2);
			this.vehicle.applyEngineForce(force, 3);
	 	}else{
			this.vehicle.setBrake(brakeForce, 0);
			this.vehicle.setBrake(brakeForce, 1);
			this.vehicle.setBrake(brakeForce, 2);
			this.vehicle.setBrake(brakeForce, 3);
		}
		
		this.vehicle.setSteeringValue(steer, 0);
		this.vehicle.setSteeringValue(steer, 1);
	}
	
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );

	}

	updateCamera(){
		this.camera.position.lerp(this.followCam.getWorldPosition(new THREE.Vector3()), 0.01); //0.01카메라가 움직이는 거리의 1퍼센트 까지 느리게 따라감
		// this.camera.lookAt(this.vehicle.chassisBody.threemesh.position);
		this.camera.lookAt(this.vehicle.chassisBody.threemesh.position);

        if (this.helper.sun!=undefined){
			this.helper.sun.position.copy( this.camera.position );
			this.helper.sun.position.y += 10;
		}
	}
								   
	animate(chassisBody) { 
		const game = this;
		
		requestAnimationFrame( function(){ game.animate(chassisBody); } );

		/////////////////////////////////// Button click ////////////////////////////////////

		console.log(game.carbody.position);

		/**
		 * x: 33.72 / z: 32.14 -> Vision tower 
		 * x: -4.1 / z: 30.1  -> IT tower
		 * x: 15.2 / z: -30.5  -> Gachon Square
		 * x: -31.6 / z: -30.5  -> AI buildings
		 * 0, -16 -> kakao
		 */

		 document.getElementById("vision_tower_info").style.display = "none";
		 document.getElementById("IT_info").style.display = "none";
		 document.getElementById("GS_info").style.display = "none";
		 document.getElementById("AI_info").style.display = "none";
		 document.getElementById("KAKA_info").style.display = "none";

		if (game.carbody.position.x < 38.72 && game.carbody.position.x > 28.72 && 
			game.carbody.position.z > 27.14 && game.carbody.position.z < 37.14) {
			console.log("Vision tower");
			game.followCam.position.set(12, 2.4, 0);
			document.getElementById("vision_tower_info").style.display = "block";
		} else if (game.carbody.position.x < 1.1 && game.carbody.position.x > -9.1 && 
			game.carbody.position.z > 25.1 && game.carbody.position.z < 35.1) { 
			console.log("IT tower"); 
			document.getElementById("IT_info").style.display = "block";

			game.followCam.position.set(10, 1.4, 10);
		} else if (game.carbody.position.x < 22 && game.carbody.position.x > 12 &&
			game.carbody.position.z > -34.6 && game.carbody.position.z < -24.6) {
			console.log("Gachon Square"); // 17, -29.6
			document.getElementById("GS_info").style.display = "block";
			game.followCam.position.set(12, 2.4, -5);
		} else if (game.carbody.position.x < -26.6 && game.carbody.position.x > -36.6 &&
			game.carbody.position.z > -35.5 && game.carbody.position.z < -25.5) {
			console.log("AI buildings");
			document.getElementById("AI_info").style.display = "block";
			game.followCam.position.set(10, 1.4, 10);
		} else if (game.carbody.position.x < 5 && game.carbody.position.x > -5 &&
			game.carbody.position.z > -21 && game.carbody.position.z < -11) {
            // change following camera to top view
			game.followCam.position.set(-10, 1, 0);
			document.getElementById("KAKA_info").style.display = "block";
			console.log("Kakao");
		} 

		// add keyboard event
		document.addEventListener('keydown', function(event) {
			// use direction key
			// don't use keycode, because it is not working on chrome

			if (event.key == "ArrowUp") {
				game.updateDrive(-2.5, 0);
				console.log("forward");
			} else if (event.key == "ArrowDown") {
				game.updateDrive(2.5, 0);
				console.log("backward");
			} else if (event.key == "ArrowLeft") {
				game.updateDrive(0, 1000000);
				console.log("left");
			} else if (event.key == "ArrowRight") {
				game.updateDrive(0, -1000000);
				console.log("right");
			}


			// change camera using 1, 2, 3
			if (event.key == '1') {
				game.followCam.position.set(5, 10, -10);
				camViewMode = 0;
			} else if (event.key == '2') {
				game.followCam.position.set(5, 15, -30);
				camViewMode = 1;
			} else if (event.key == '3') {
				game.followCam.position.set(5, 90, -30);
				camViewMode = 2;
			}
		});


		document.getElementById('Close_View').addEventListener('click', function(){
			// check if there are followCam
			game.followCam.position.set(5, 10, -10);
		});
		document.getElementById('Far_View').addEventListener('click', function(){
			game.followCam.position.set(5, 15, -30);	
		});
		document.getElementById('Top_View').addEventListener('click', function(){
			game.followCam.position.set(5, 90, -30);
		});

		document.getElementById('Reset').addEventListener('click', function(){
			game.vehicle.chassisBody.position.set(-20, 4, 22);
			game.vehicle.chassisBody.velocity.set(0, 0, 0);
			game.vehicle.chassisBody.angularVelocity.set(0, 0, 0);
			game.vehicle.chassisBody.quaternion.set(0, 0, 0, 1);

			chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2); 
		}); 

		document.getElementById('confirm').addEventListener('click', function(){
			// 1. fill the whole screen with blur
			
		}); 
		
		const now = Date.now();
		if (this.lastTime===undefined) this.lastTime = now;
		const dt = (Date.now() - this.lastTime)/1000.0;
		// this.FPSFactor = dt;

		// difficulty by speed 
		this.lastTime = now;
		
		this.world.step(this.fixedTimeStep, dt);
		this.helper.updateBodies(this.world);
		
		this.updateDrive();
		//console.log(this.vehicle.getWheelTransformWorld(0).position);
		game.model.position.copy(this.carbody.position);
		game.model.quaternion.copy(this.carbody.quaternion);

		this.updateCamera();
		
		this.renderer.render( this.scene, this.camera );

		if (this.stats!=undefined) this.stats.update();

	}
}

class JoyStick{
	constructor(options){
		const circle = document.createElement("div");
		circle.style.cssText = "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126, 126, 126, 0.5); border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
		const thumb = document.createElement("div");
		thumb.style.cssText = "position: absolute; left: 20px; top: 20px; width: 40px; height: 40px; border-radius: 50%; background: #fff;";
		circle.appendChild(thumb);
		document.body.appendChild(circle);
		this.domElement = thumb;
		this.maxRadius = options.maxRadius || 40;
		this.maxRadiusSquared = this.maxRadius * this.maxRadius;
		this.onMove = options.onMove;
		this.game = options.game;
		this.origin = { left:this.domElement.offsetLeft, top:this.domElement.offsetTop };
		this.rotationDamping = options.rotationDamping || 0.06;
		this.moveDamping = options.moveDamping || 0.01;
		if (this.domElement!=undefined){
			const joystick = this;
			if ('ontouchstart' in window){
				this.domElement.addEventListener('touchstart', function(evt){ joystick.tap(evt); });
			}else{
				this.domElement.addEventListener('mousedown', function(evt){ joystick.tap(evt); });
			}
		}
	}
	
	getMousePosition(evt){
		let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
		let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
		console.log(clientX, clientY);
		return { x:clientX, y:clientY };
		// reverse joystick: return { x:clientX, y:clientY };

		// forward = 630, 858
		// backward = 630, 1000

		// left = 550, 930
		// right = 680, 930
	}
	
	tap(evt){
		evt = evt || window.event;
		// get the mouse cursor position at startup:
		this.offset = this.getMousePosition(evt);
		const joystick = this;
		if ('ontouchstart' in window){
			document.ontouchmove = function(evt){ joystick.move(evt); };
			document.ontouchend =  function(evt){ joystick.up(evt); };
		}else{
			document.onmousemove = function(evt){ joystick.move(evt); };
			document.onmouseup = function(evt){ joystick.up(evt); };
		}
	}
	
	move(evt){
		evt = evt || window.event;
		const mouse = this.getMousePosition(evt);
		// calculate the new cursor position:
		let left = mouse.x - this.offset.x;
		let top = mouse.y - this.offset.y;
		//this.offset = mouse;
		
		const sqMag = left*left + top*top;
		if (sqMag>this.maxRadiusSquared){
			//Only use sqrt if essential
			const magnitude = Math.sqrt(sqMag);
			left /= magnitude;
			top /= magnitude;
			left *= this.maxRadius;
			top *= this.maxRadius;
		}
		// set the element's new position:
		this.domElement.style.top = `${top + this.domElement.clientHeight/2}px`;
		this.domElement.style.left = `${left + this.domElement.clientWidth/2}px`;
		
		const forward = (top - this.origin.top + this.domElement.clientHeight/2)/this.maxRadius;
		const turn = (left - this.origin.left + this.domElement.clientWidth/2)/this.maxRadius;
		
		if (this.onMove!=undefined) this.onMove.call(this.game, forward, turn);
	}
	
	up(evt){
		if ('ontouchstart' in window){
			document.ontouchmove = null;
			document.touchend = null;
		}else{
			document.onmousemove = null;
			document.onmouseup = null;
		}
		this.domElement.style.top = `${this.origin.top}px`;
		this.domElement.style.left = `${this.origin.left}px`;
		
		this.onMove.call(this.game, 0, 0);
	}
}

class CannonHelper{
    constructor(scene){
        this.scene = scene;
    }
    
    addLights(renderer){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        // LIGHTS
        const ambient = new THREE.AmbientLight( 0x888888 );
        this.scene.add( ambient );

        const light = new THREE.DirectionalLight( 0xdddddd );
        light.position.set( 3, 10, 4 );
        light.target.position.set( 0, 0, 0 );

        light.castShadow = true;

        const lightSize = 10;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 50;
        light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
        light.shadow.camera.right = light.shadow.camera.top = lightSize;

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        this.sun = light;
        this.scene.add(light);    
    }
    
    set shadowTarget(obj){
        if (this.sun!==undefined) this.sun.target = obj;    
    }
    
    createCannonTrimesh(geometry){
		if (!geometry.isBufferGeometry) return null;
		
		const posAttr = geometry.attributes.position;
		const vertices = geometry.attributes.position.array;
		let indices = [];
		for(let i=0; i<posAttr.count; i++){
			indices.push(i);
		}
		
		return new CANNON.Trimesh(vertices, indices);
	}
	
	createCannonConvex(geometry){
		if (!geometry.isBufferGeometry) return null;
		
		const posAttr = geometry.attributes.position;
		const floats = geometry.attributes.position.array;
		const vertices = [];
		const faces = [];
		let face = [];
		let index = 0;
		for(let i=0; i<posAttr.count; i+=3){
			vertices.push( new CANNON.Vec3(floats[i], floats[i+1], floats[i+2]) );
			face.push(index++);
			if (face.length==3){
				faces.push(face);
				face = [];
			}
		}
		
		return new CANNON.ConvexPolyhedron(vertices, faces);
	}
    
    addVisual(body, name, castShadow=true, receiveShadow=true){
		body.name = name;
		if (this.currentMaterial===undefined) this.currentMaterial = new THREE.MeshLambertMaterial({color:0x888888});
		if (this.settings===undefined){
			this.settings = {
				stepFrequency: 60,
				quatNormalizeSkip: 2,
				quatNormalizeFast: true,
				gx: 0,
				gy: 0,
				gz: 0,
				iterations: 3,
				tolerance: 0.0001,
				k: 1e6,
				d: 3,
				scene: 0,
				paused: false,
				rendermode: "solid",
				constraints: false,
				contacts: false,  // Contact points
				cm2contact: false, // center of mass to contact points
				normals: false, // contact normals
				axes: false, // "local" frame axes
				particleSize: 0.1,
				shadows: false,
				aabbs: false,
				profiling: false,
				maxSubSteps:3
			}
			this.particleGeo = new THREE.SphereGeometry( 1, 16, 8 );
			this.particleMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
		}
		// What geometry should be used?
		let mesh;
		if(body instanceof CANNON.Body) mesh = this.shape2Mesh(body, castShadow, receiveShadow);

		if(mesh) {
			// Add body
			body.threemesh = mesh;
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
			this.scene.add(mesh);
		}
	}
	
	shape2Mesh(body, castShadow, receiveShadow){
		const obj = new THREE.Object3D();
		const material = this.currentMaterial;
		const game = this;
		let index = 0;
		
		body.shapes.forEach (function(shape){
			let mesh;
			let geometry;
			let v0, v1, v2;

			switch(shape.type){

			case CANNON.Shape.types.SPHERE:
				const sphere_geometry = new THREE.SphereGeometry( shape.radius, 8, 8);
				mesh = new THREE.Mesh( sphere_geometry, material );
				break;

			case CANNON.Shape.types.PARTICLE:
				mesh = new THREE.Mesh( game.particleGeo, game.particleMaterial );
				const s = this.settings;
				mesh.scale.set(s.particleSize,s.particleSize,s.particleSize);
				break;

			case CANNON.Shape.types.PLANE:
				geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
				mesh = new THREE.Object3D();
				const submesh = new THREE.Object3D();
				const ground = new THREE.Mesh( geometry, material );
				ground.scale.set(100, 100, 100);
				submesh.add(ground);

				mesh.add(submesh);
				break;

			case CANNON.Shape.types.BOX:
				const box_geometry = new THREE.BoxGeometry(  shape.halfExtents.x*2,
															shape.halfExtents.y*2,
															shape.halfExtents.z*2 );
				mesh = new THREE.Mesh( box_geometry, material );
				break;

			case CANNON.Shape.types.CONVEXPOLYHEDRON:
				const geo = new THREE.Geometry();

				// Add vertices
				shape.vertices.forEach(function(v){
					geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
				});

				shape.faces.forEach(function(face){
					// add triangles
					const a = face[0];
					for (let j = 1; j < face.length - 1; j++) {
						const b = face[j];
						const c = face[j + 1];
						geo.faces.push(new THREE.Face3(a, b, c));
					}
				});
				geo.computeBoundingSphere();
				geo.computeFaceNormals();
				mesh = new THREE.Mesh( geo, material );
				break;

			case CANNON.Shape.types.HEIGHTFIELD:
				geometry = new THREE.Geometry();

				v0 = new CANNON.Vec3();
				v1 = new CANNON.Vec3();
				v2 = new CANNON.Vec3();
				for (let xi = 0; xi < shape.data.length - 1; xi++) {
					for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
						for (let k = 0; k < 2; k++) {
							shape.getConvexTrianglePillar(xi, yi, k===0);
							v0.copy(shape.pillarConvex.vertices[0]);
							v1.copy(shape.pillarConvex.vertices[1]);
							v2.copy(shape.pillarConvex.vertices[2]);
							v0.vadd(shape.pillarOffset, v0);
							v1.vadd(shape.pillarOffset, v1);
							v2.vadd(shape.pillarOffset, v2);
							geometry.vertices.push(
								new THREE.Vector3(v0.x, v0.y, v0.z),
								new THREE.Vector3(v1.x, v1.y, v1.z),
								new THREE.Vector3(v2.x, v2.y, v2.z)
							);
							var i = geometry.vertices.length - 3;
							geometry.faces.push(new THREE.Face3(i, i+1, i+2));
						}
					}
				}
				geometry.computeBoundingSphere();
				geometry.computeFaceNormals();
				mesh = new THREE.Mesh(geometry, material);
				break;

			case CANNON.Shape.types.TRIMESH:
				geometry = new THREE.Geometry();

				v0 = new CANNON.Vec3();
				v1 = new CANNON.Vec3();
				v2 = new CANNON.Vec3();
				for (let i = 0; i < shape.indices.length / 3; i++) {
					shape.getTriangleVertices(i, v0, v1, v2);
					geometry.vertices.push(
						new THREE.Vector3(v0.x, v0.y, v0.z),
						new THREE.Vector3(v1.x, v1.y, v1.z),
						new THREE.Vector3(v2.x, v2.y, v2.z)
					);
					var j = geometry.vertices.length - 3;
					geometry.faces.push(new THREE.Face3(j, j+1, j+2));
				}
				geometry.computeBoundingSphere();
				geometry.computeFaceNormals();
				mesh = new THREE.Mesh(geometry, MutationRecordaterial);
				break;

			default:
				throw "Visual type not recognized: "+shape.type;
			}

			mesh.receiveShadow = receiveShadow;
			mesh.castShadow = castShadow;
            
            mesh.traverse( function(child){
                if (child.isMesh){
                    child.castShadow = castShadow;
					child.receiveShadow = receiveShadow;
                }
            });

			var o = body.shapeOffsets[index];
			var q = body.shapeOrientations[index++];
			mesh.position.set(o.x, o.y, o.z);
			mesh.quaternion.set(q.x, q.y, q.z, q.w);

			obj.add(mesh);
		});

		return obj;
	}
    
    updateBodies(world){
        world.bodies.forEach( function(body){
            if ( body.threemesh != undefined){
                body.threemesh.position.copy(body.position);
                body.threemesh.quaternion.copy(body.quaternion);
            }
        });
    }
}