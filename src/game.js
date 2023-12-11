class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        // Putting this in a sub objects would allow using getObject()
        this.rooms = {
            objects: []
        };
        this.check = true;
        this.DEBUG = true;
        this.KNIFE = false;
        this.CHANDELIER = false;
        this.ZOMBIE;
        this.zombies = [];

        this.music = new Audio("./assets/audio/mainMusic.mp3");
        this.playerSpeed = 4;
        this.playerTurnSpeed = 1;
        this.pressedKeys = {
            w : false,
            a : false,
            s : false,
            d : false,
        }
        this.movementIntervalID = null;
        this.rotationIntervalID = null;
        this.gameStarted = false;
    }

    createSphereCollider(object, radius, onCollide = null) {
        object.collider = {
            type: "SPHERE",
            radius: radius,
            onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
            }
        };
        this.collidableObjects.push(object);
    }

    createRoom(object, extensionX = 0, extensionY = 0, extensionZ = 0) {
        let minX = null;
        let maxX = null;
        let minY = null;
        let maxY = null;
        let minZ = null;
        let maxZ = null;

        for (let i = 0; i < object.model.vertices.length; i+=3) {
            let x = object.model.vertices[i];
            let y = object.model.vertices[i+1];
            let z = object.model.vertices[i+2];

            if (minX == null || x < minX) {
                minX = x;
            }

            if (maxX == null || x > maxX) {
                maxX = x;
            }

            if (minY == null || y < minY) {
                minY = y;
            }

            if (maxY == null || y > maxY) {
                maxY = y;
            }

            if (minZ == null || z < minZ) {
                minZ = z;
            }
            
            if (maxZ == null || z > maxZ) {
                maxZ = z;
            }
        }

        object.collider = {
            type: "ROOM",
            bounds : {
                minX: minX - extensionX,
                maxX: maxX + extensionX,
                minY: minY - extensionY,
                maxY: maxY + extensionY,
                minZ: minZ - extensionZ,
                maxZ: maxZ + extensionZ
            },
            /*onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
                object.stop = 1;
            }*/
        };
        this.rooms.objects.push(object);
    }

    // example - function to check if an object is colliding with collidable objects
    /*checkCollision(object) {

        // keep track of any collisions, and the minimum distance between two objects when colliding
        let minDistance = null;
        let collisionDetected = false;
        let inMap = false;

        let position1 = vec3.create();
        vec3.transformMat4(position1, object.model.position, object.modelMatrix);
        let position2 = vec3.create();

        // loop over all the other collidable objects 
        for (const otherObject of this.collidableObjects) {

            // Skip when the objects are the same
            if (otherObject.name === object.name) {
                continue;
            }

            if (otherObject.collider.type === "ROOM") {
                // For rooms, just check if the object is outside the x and y min / max

                if (object.collider.type === "SPHERE") {
                    if (this.isPointInsideBounds(object.model.position, otherObject.collider.bounds, object.collider.radius)) {
                        inMap = true;
                    }
                }

            } else {

                vec3.transformMat4(position2, otherObject.model.position, otherObject.modelMatrix);

                let distance = vec3.distance(position1, position2);
                let combinedRadius = (object.collider.radius + otherObject.collider.radius);

                // check the distance is less than the 2 radius values combined
                if (distance < combinedRadius) {
                    object.collider.onCollide(otherObject);
                    minDistance = combinedRadius - distance;
                    if (minDistance == null || combinedRadius - distance < minDistance) {
                        minDistance = combinedRadius - distance;
                    }
                    collisionDetected = true;
                }
            }
            // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
            // call the onCollide we define for that specific object. This way we can handle collisions identically for all
            // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
            // use the modeling transformation for object and otherObject to transform position into current location
        };
        return inMap;
    }*/

    // Check if a point is inside bounds
    // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection#point_vs._aabb
    isPointInsideBounds(point, bounds, radius = 0) {
        //let posX = point.x;
        //let posZ = point.z;
        let posX = point[0];
        let posY = point[1];
        let posZ = point[2];

        // Don't apply radius to the Y value
        return (
            posX - radius > bounds.minX &&
            posX + radius < bounds.maxX &&
            posY > bounds.minY &&
            posY < bounds.maxY &&
            posZ - radius > bounds.minZ &&
            posZ + radius < bounds.maxZ
          );
    }

    // Check if an object is inside any of the rooms
    checkInMap(object) {
        let inMap = false;

        let position1 = vec3.create();
        vec3.transformMat4(position1, object.model.position, object.modelMatrix);
        vec3.add(position1, position1, object.centroid);

        // loop over all the other room objects 
        for (const otherObject of this.rooms.objects) {
            if (object.collider.type === "SPHERE") {
                if (this.isPointInsideBounds(position1, otherObject.collider.bounds, object.collider.radius)) {
                    inMap = true;
                    break;
                }
            }
        };
        return inMap;
    }

    // Set of functions to be called at an interval when keys are pressed
    pressedW(object) {
        var validPosition = false;
        var oldPlayerPos = vec3.clone(object.model.position);
        object.movePlayerForward(this.playerSpeed);
        // if(this.state.holdItem) {
        //     var temp = vec3.fromValues();
        //     vec3.scale(temp, object.at, 0.1);
        //     this.state.holdItem.translate(temp);
        // }

        if (this.checkInMap(object)) {
            validPosition = true;
        } else {
            // Not valid, move back
            object.movePlayerBackward(this.playerSpeed);

            // Try moving in the X direction and see if it's valid
            object.movePlayerX(this.playerSpeed);

            if (this.checkInMap(object)) {
                validPosition = true;
            } else {

                // Not valid, move back
                object.movePlayerX(-1 * this.playerSpeed);

                // Try moving in the Z direction and see if it's valid
                object.movePlayerZ(this.playerSpeed);

                if (this.checkInMap(object)) {
                    validPosition = true;
                } else {
                    // Not valid, move back
                    object.movePlayerZ(-1 * this.playerSpeed);
                }
            }
        }

        if (validPosition) {
            var newPlayerPos = object.model.position;
            checkCamera(this.state, oldPlayerPos, newPlayerPos);
        }
    }

    pressedS(object) {
        var validPosition = false;
        var oldPlayerPos = vec3.clone(object.model.position);
        object.movePlayerBackward(this.playerSpeed);
        // if(this.state.holdItem) {
        //     var temp = vec3.fromValues();
        //     vec3.scale(temp, object.at, 0.1);
        //     this.state.holdItem.translate(temp);
        // }

        if (this.checkInMap(this.player)) {
            var validPosition = true;
        } else {
            // Not valid, move back
            object.movePlayerForward(this.playerSpeed);

            // Try moving in the X direction and see if it's valid
            object.movePlayerX(-1 * this.playerSpeed);

            if (this.checkInMap(object)) {
                validPosition = true;
            } else {

                // Not valid, move back
                object.movePlayerX(this.playerSpeed);

                // Try moving in the Z direction and see if it's valid
                object.movePlayerZ(-1 * this.playerSpeed);

                if (this.checkInMap(object)) {
                    validPosition = true;
                } else {
                    // Not valid, move back
                    object.movePlayerZ(this.playerSpeed);
                }
            }
        }

        if (validPosition) {
            var newPlayerPos = object.model.position;
            checkCamera(this.state, oldPlayerPos, newPlayerPos);
        }
    }

    pressedA(object) {
        object.rotatePlayer('y', 0.05 * this.playerTurnSpeed);
    }

    pressedD(object) {
        object.rotatePlayer('y', -0.05 * this.playerTurnSpeed);
    }

    // runs once on startup after the scene loads the objects
    async onStart() {

        //create correct up vector for cameras
        for(let i=0; i < this.state.cameras.length; i++) {
            //grab camera
            let camera = this.state.cameras[i];
            let at = vec3.fromValues();
            let right = vec3.fromValues();

            //find at vector and normalize
            vec3.subtract(at, camera[2], camera[0]);
            vec3.normalize(at, at);
            //generate right vector, orthogonal to both the at and current up vector
            vec3.cross(right, at, camera[1]);
            vec3.normalize(right, right);

            //find real up vector and store in camera
            vec3.cross(camera[1], right, at);
        }

        //loop music forever
        this.music.loop = true;

        console.log("On start");
        this.startTime = Date.now();

        // this just prevents the context menu from popping up when you right click
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        //generate all the interactable objects we need, including player and
        //enemies
        this.player = getObject(this.state, "Player");
        this.crateR = getObject(this.state, "RedCrate");
        this.crateB = getObject(this.state, "BlueCrate");
        this.crateG = getObject(this.state, "GreenCrate");

        this.panelR = getObject(this.state, "RedPanel");
        this.panelB = getObject(this.state, "BluePanel");
        this.panelG = getObject(this.state, "GreenPanel");

        this.state.pickupItems.push(this.crateR, this.crateB, this.crateG);
        
        this.rope = getObject(this.state, "Rope");
        this.chandelier = getObject(this.state, "Chandelier");
        this.glass = getObject(this.state, "GlassPanel");
        this.knife = getObject(this.state, "knife");

        
        const zombie1 = getObject(this.state, 'Zombie1');
        zombie1.speed = 1.0;
        const zombie2 = getObject(this.state, 'Zombie2');
        zombie2.speed = 0.75;
        const zombie3 = getObject(this.state, 'Zombie3');
        zombie3.speed = 0.6;
        const zombie4 = getObject(this.state, 'Zombie4');
        zombie4.speed = 0.41;

        //add zombies to list of zombies
        this.zombies.push(zombie1);
        this.zombies.push(zombie2);
        this.zombies.push(zombie3);
        this.zombies.push(zombie4);


        // Add all the rooms to the list of rooms
        for (const obj of this.state.objects) {
            if (obj.type.includes("Door") || obj.type.includes("Hall") || obj.type.includes("Room")) {
                var extensionX = 0;
                var extensionY = 0;
                var extensionZ = 0;

                // Special cases of rooms that require extensions to their boundaries so
                // that checking with checkInMap() works correctly
                switch(obj.name) {
                    case "Hall1":
                        extensionX = 2;
                        break;
                    case "Hall2":
                        extensionZ = 2;
                        break;
                    case "MainRoomPuzzleRoomDoor":
                        extensionX = 4;
                        extensionY = 3;
                        extensionZ = 0.1;
                        break;
                }
                this.createRoom(obj, extensionX, extensionY, extensionZ);
                //console.log(obj);
            }
        }

        // Make the player collidable
        this.createSphereCollider(this.player, 0.45);

        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keydown", (e) => {
            //console.log(e.key);
            switch(e.key) {
                case "w":
                    // Move forwards
                    if (this.pressedKeys.w || this.pressedKeys.s) {
                        break;
                    }
                    this.pressedKeys.w = true;
                    // console.log(e.key);
                    this.movementIntervalID = window.setInterval(() => this.pressedW(this.player), 50);
                    break;

                case "s":
                    // Move backwards
                    if (this.pressedKeys.w || this.pressedKeys.s) {
                        break;
                    }
                    this.pressedKeys.s = true;
                    this.movementIntervalID = window.setInterval(() => this.pressedS(this.player), 50);
                    break;
                    
                case "a":
                    // Turn left
                    if (this.pressedKeys.a || this.pressedKeys.d) {
                        break;
                    }
                    this.pressedKeys.a = true;
                    this.rotationIntervalID = window.setInterval(() => this.pressedA(this.player), 50);
                    break;
                    
                case "d":
                    // Turn right
                    if (this.pressedKeys.a || this.pressedKeys.d) {
                        break;
                    }
                    this.pressedKeys.d = true;
                    this.rotationIntervalID = window.setInterval(() => this.pressedD(this.player), 50);
                    break;
            }
        });

        document.addEventListener("keyup", (e) => {
            switch(e.key) {
                case "w":
                    // Stopped moving forward
                    window.clearInterval(this.movementIntervalID);
                    this.pressedKeys.w = false;
                    break;

                case "s":
                    // Stopped moving backward
                    window.clearInterval(this.movementIntervalID);
                    this.pressedKeys.s = false;
                    break;
                    
                case "a":
                    // Stopped turning left
                    window.clearInterval(this.rotationIntervalID);
                    this.pressedKeys.a = false;
                    break;
                    
                case "d":
                    // Stopped turning right
                    window.clearInterval(this.rotationIntervalID);
                    this.pressedKeys.d = false;
                    break;
            }
        });

        document.addEventListener("keypress", (e) => {
            e.preventDefault();
            if (!this.gameStarted) {
                return;
            }

            switch (e.key) {
                //interact with environment and check for specific circumstances
                case " ":

                //if we are close enough to the rope, cut it
                    if (vec3.dist(this.player.model.position, vec3.fromValues(0.0, 0, -6)) <= 2.0 && this.state.holdItem.name == "knife") {
                        this.rope.translate(vec3.fromValues(0.0, -50.0, 0.0));
                        this.CHANDELIER = true;
                        break;
                    }

                    //can we pickup an item?
                    checkPickup(this.state, this.player);
                    break;

                    //DEBUG for camera movement
                case "A":
                    if (this.DEBUG) {
                        var right = vec3.clone(state.camera.right);
                        //find at vector/recalculate it and normalize
                        vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                        vec3.normalize(state.camera.at, state.camera.at);
                        //find right vector/recalculate it and normalize
                        vec3.cross(state.camera.right, state.camera.at, state.camera.up);
                        vec3.normalize(state.camera.right, state.camera.right);

                        //get ready to subract right by scaling by some small negative value
                        vec3.scale(right, state.camera.right, -0.1);
                        //find new atPoint
                        vec3.add(state.camera.atPoint, state.camera.atPoint, right);
                        //recalculate new at from new atPoint and store it
                        vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                        vec3.normalize(state.camera.at, state.camera.at);
                        //find new right vector and update
                        vec3.cross(state.camera.right, state.camera.at, state.camera.up);
                        vec3.normalize(state.camera.right, state.camera.right);
                    }
                    break;

                case "D":
                    if (this.DEBUG) {
                        var right = vec3.clone(state.camera.right);
                        // recalculate at vector
                        vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                        vec3.normalize(state.camera.at, state.camera.at);
                        //find right vector and update
                        vec3.cross(state.camera.right, state.camera.at, state.camera.up);
                        vec3.normalize(state.camera.right, state.camera.right);
                        // scale right vector by some small positive constant that we will rotate by
                        vec3.scale(right, state.camera.right, 0.1);
                        //find new atPoint 
                        vec3.add(state.camera.atPoint, state.camera.atPoint, right);

                        //recalculate new at vector
                        vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                        vec3.normalize(state.camera.at, state.camera.at);
                        //recalculate new right vector
                        vec3.cross(state.camera.right, state.camera.at, state.camera.up);
                        vec3.normalize(state.camera.right, state.camera.right);
                    }
                    break;

                case "W":
                    if (this.DEBUG) {
                        vec3.add(state.camera.position, state.camera.position, vec3.fromValues(state.camera.at[0], state.camera.at[1], state.camera.at[2]));
                        vec3.add(state.camera.atPoint, state.camera.atPoint, vec3.fromValues(state.camera.at[0], state.camera.at[1], state.camera.at[2]));
                    }
                    break;

                case "S":
                    if (this.DEBUG) {
                    vec3.subtract(state.camera.position, state.camera.position, vec3.fromValues(state.camera.at[0], state.camera.at[1], state.camera.at[2]));
                    vec3.subtract(state.camera.atPoint, state.camera.atPoint, vec3.fromValues(state.camera.at[0], state.camera.at[1], state.camera.at[2]));
                    }
                    break;

                case "Z":
                    if (this.DEBUG) {                    
                        var up = vec3.clone(state.camera.up);

                        //scale up vector by some small amount
                        vec3.scale(up, up, 0.1);

                        vec3.add(state.camera.atPoint, state.camera.atPoint, up);
                        //calculate at vector
                        vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                        vec3.normalize(state.camera.at, state.camera.at);
                        //find new up vector
                        vec3.cross(state.camera.up, state.camera.right, state.camera.at);
                        vec3.normalize(state.camera.up, state.camera.up);
                    }
                    break;

                case "X":
                    if (this.DEBUG) {
                        var up = vec3.clone(state.camera.up);

                        //scale up vector by some small amount
                        vec3.scale(up, up, -0.1);

                        vec3.add(state.camera.atPoint, state.camera.atPoint, up);
                        //calculate at vector
                        vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                        vec3.normalize(state.camera.at, state.camera.at);
                        //find new up vector
                        vec3.cross(state.camera.up, state.camera.right, state.camera.at);
                        vec3.normalize(state.camera.up, state.camera.up);
                    }
                    break;

                case "Q":
                    if (this.DEBUG) {
                        console.log(this.state.camera.position);
                        console.log(this.state.camera.atPoint);
                        console.log(this.state.camera.up);
                    }
                    break;

                    //DEBUG cycle through cameras
                case "`":
                    if (this.DEBUG) {
                        this.state.camera.position = this.state.cameras[+e.key][0];
                        this.state.camera.up = this.state.cameras[+e.key][1];
                        this.state.camera.atPoint = this.state.cameras[+e.key][2];
                    }
                default:
                    if (!isNaN(+e.key)) {
                        this.state.camera.position = this.state.cameras[+e.key][0];
                        this.state.camera.up = this.state.cameras[+e.key][1];
                        this.state.camera.atPoint = this.state.cameras[+e.key][2];
                        break;
                    }
            }
        });
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {

        //GAME END
        if(this.player.model.position[0] > 78) {
            this.state.settings.backgroundColor = vec3.fromValues(0, 0, 0);
            this.state.pointLights = [];
            this.state.numLights = 0;
        }

        //check if puzzle completed
        if(vec3.dist(this.crateR.model.position, this.panelR.centroid) <= 0.75 && vec3.dist(this.crateB.model.position, this.panelB.centroid) <= 0.75 && vec3.dist(this.crateG.model.position, this.panelG.centroid) <=0.75 && !this.KNIFE) {
            let knifeAudio = new Audio("./assets/audio/knife.mp3");
            knifeAudio.play();
            this.knife.translate(vec3.fromValues(0.0, -20, 0.0));
            this.state.pickupItems.push(this.knife)
            this.KNIFE = true;
        }

        //chandelier event: every frame drop the chandelier a little bit more
        //until we hit the glass
        if(this.CHANDELIER) {
            var temp = vec3.fromValues();
            vec3.transformMat4(temp,this.chandelier.model.position, this.chandelier.model.modelMatrix);
            if(temp[1] > 4) {
                
                this.chandelier.translate(vec3.fromValues(0.0, -6*deltaTime, 0.0));
            }
            else {
                let glassAudio = new Audio("./assets/audio/glass.mp3");
                glassAudio.play();
                this.chandelier.translate(vec3.fromValues(0.0, -50, 0.0));
                this.state.pointLights[3].position = vec3.fromValues(0.0, 100, 0.0);
                this.glass.translate(vec3.fromValues(0.0, -50, 0.0));
                this.CHANDELIER = false;
            }
        }

        //warp character if we enter the abyss
        if(this.player.model.position[0] <= 8 && this.player.model.position[0] >= -1 &&
            this.player.model.position[2] <=-12 && this.player.model.position[2] >=-24) {

            this.player.model.position = vec3.fromValues(1, -50, 5);
            this.player.atPoint = vec3.fromValues(2, -50, 5)
            this.player.at = vec3.fromValues(1, 0, 0);
            this.state.camera.position = vec3.fromValues(20, -45, 5);
            this.state.camera.atPoint = vec3.fromValues(0, -50, 5);
            this.state.settings.backgroundColor = vec3.fromValues(1, 1, 1)
            this.ZOMBIE = true;
        }

        //move zombies
        if(this.ZOMBIE) {
            
            for(let i=0; i < this.zombies.length; i++) {
                var temp = vec3.fromValues();
                vec3.subtract(temp, this.player.model.position, this.zombies[i].model.position);
                vec3.scale(temp, temp, deltaTime*0.5*this.zombies[i].speed);
                this.zombies[i].translate(temp);
            }

            // var temp = vec3.fromValues();
            // //vec3.transformMat4(temp, this.zombies[0].model.position,this.zombies[0].model.modelMatrix);
            // vec3.subtract(temp, this.player.model.position, this.zombies[0].model.position);
            // vec3.scale(temp, temp, deltaTime*0.1);
            // this.zombies[0].translate(temp);

            
        }
    }
}
