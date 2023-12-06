class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        this.rooms = [];
        this.check = true;
        this.DEBUG = true;
        this.KNIFE = false;
        this.CHANDELIER = false;
        this.ZOMBIE;
        this.zombies = [];

        this.music = new Audio("mainMusic.mp3");
    }


    // example - we can add our own custom method to our game and call it using 'this.customMethod()'
    customMethod() {
        console.log("Custom method!");
    }

    // example - create a collider on our object with various fields we might need (you will likely need to add/remove/edit how this works)
    // createSphereCollider(object, radius, onCollide = null) {
    //     object.collider = {
    //     type: "SPHERE",
    //     radius: radius,
    //     onCollide: onCollide ? onCollide : (otherObject) => {
    //         console.log(`Collided with ${otherObject.name}`);
    //         }
    //     };
    //     this.collidableObjects.push(object);
    // }
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

    createRoom(object) {
        let minX = null;
        let maxX = null;
        let minZ = null;
        let maxZ = null;

        for (let i = 0; i < object.model.vertices.length; i+=3) {
            let x = object.model.vertices[i];
            let z = object.model.vertices[i+2];

            if (minX == null || x < minX) {
                minX = x;
            }

            if (maxX == null || x > maxX) {
                maxX = x;
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
                minX: minX,
                maxX: maxX,
                minZ: minZ,
                maxZ: maxZ,
            },
            /*onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
                object.stop = 1;
            }*/
        };
        this.rooms.push(object);
    }

    // Similar to creating a room, except doors occupy 1D so area must be added to either side of the doors
    createDoor(object) {
        let minX = null;
        let maxX = null;
        let minZ = null;
        let maxZ = null;

        // How far to extend the door "room"
        let extension = 1;

        for (let i = 0; i < object.model.vertices.length; i+=3) {
            let x = object.model.vertices[i];
            let z = object.model.vertices[i+2];

            if (minX == null || x < minX) {
                minX = x;
            }

            if (maxX == null || x > maxX) {
                maxX = x;
            }

            if (minZ == null || z < minZ) {
                minZ = z;
            }
            
            if (maxZ == null || z > maxZ) {
                maxZ = z;
            }
        }

        if (minX == maxX) {
            // The door is parallel to the x plane, extend into +- x
            minX -= extension * 2;
            maxX += extension * 2;
            minZ -= extension / 2;
            maxZ += extension / 2 ;
        } else if (minZ == maxZ) {
            // The door is parallel to the z plane, extend into +- z
            minX -= extension / 2;
            maxX += extension / 2;
            minZ -= extension * 2;
            maxZ += extension * 2;
        }

        object.collider = {
            type: "DOOR",
            bounds : {
                minX: minX,
                maxX: maxX,
                minZ: minZ,
                maxZ: maxZ,
            },
            /*onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
                object.stop = 1;
            }*/
        };
        this.rooms.push(object);
    }

    // example - function to check if an object is colliding with collidable objects
    // checkCollision(object) {
    // //     // loop over all the other collidable objects 
    //     this.state.objects.forEach(otherObject => {
    // //         // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
    // //         // call the onCollide we define for that specific object. This way we can handle collisions identically for all
    // //         // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
    // //         // use the modeling transformation for object and otherObject to transform position into current location
    // let colCheck = vec3.fromValues();
    // if (otherObject.position - vec3.fromValues(object.radius, object.radius, object.radius) )
    //     });
    // }

    // Check if a point is inside bounds
    // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection#point_vs._aabb
    isPointInsideBounds(point, bounds, radius = 0) {
        //let posX = point.x;
        //let posZ = point.z;
        let posX = point[0];
        let posZ = point[2];
        return (
            posX - radius > bounds.minX &&
            posX + radius < bounds.maxX &&
            posZ - radius > bounds.minZ &&
            posZ + radius < bounds.maxZ
          );
    }

    // example - function to check if an object is colliding with collidable objects
    checkCollision(object) {

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
    }

    checkInMap(object) {
        let inMap = false;

        let position1 = vec3.create();
        vec3.transformMat4(position1, object.model.position, object.modelMatrix);

        // loop over all the other room objects 
        for (const otherObject of this.rooms) {
            if (object.collider.type === "SPHERE") {
                if (this.isPointInsideBounds(position1, otherObject.collider.bounds, object.collider.radius)) {
                    inMap = true;
                }
            }
        };
        return inMap;
    }

    // runs once on startup after the scene loads the objects
    async onStart() {

        this.music.loop = true;

        console.log("On start");
        this.startTime = Date.now();

        // this just prevents the context menu from popping up when you right click
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);


        // example - set an object in onStart before starting our render loop!
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
        const zombie2 = getObject(this.state, 'Zombie2');
        const zombie3 = getObject(this.state, 'Zombie3');
        const zombie4 = getObject(this.state, 'Zombie4');

        this.zombies.push(zombie1);
        this.zombies.push(zombie2);
        this.zombies.push(zombie3);
        this.zombies.push(zombie4);


        console.log(this.player)

        // Add all the rooms to the list of rooms
        for (const obj of this.state.objects) {
            if (obj.name.includes("Door")) {
                this.createDoor(obj);
                console.log(obj);
            }
            else if (obj.name.includes("Room") || obj.name.includes("Hall")) {
                this.createRoom(obj);
                console.log(obj);
            }
        }

        this.createSphereCollider(this.player, 0.4);

        //const otherCube = getObject(this.state, "cube2"); // we wont save this as instance var since we dont plan on using it in update

        // example - create sphere colliders on our two objects as an example, we give 2 objects colliders otherwise
        // no collision can happen
        // this.createSphereCollider(this.player, 0.5, (otherObject) => {
        //     console.log(`This is a custom collision of ${otherObject.name}`)
        // });
        // this.createSphereCollider(otherCube, 0.5);

        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keypress", (e) => {
            e.preventDefault();

            switch (e.key) {
                case "w":
                    // Move forwards
                    this.music.play();

                    var oldPlayerPos = vec3.clone(this.player.model.position);
                    this.player.movePlayerForward();
                    // if(this.state.holdItem) {
                    //     var temp = vec3.fromValues();
                    //     vec3.scale(temp, this.player.at, 0.1);
                    //     this.state.holdItem.translate(temp);
                    // }
                    console.log(this.player.model.position);

                    //if (this.checkInMap(this.player)) {
                        var newPlayerPos = this.player.model.position;
                        checkCamera(this.state, oldPlayerPos, newPlayerPos);
                    //} else {
                    //   this.player.movePlayerBackward();
                    //}
                    //console.log("in map: " + this.checkInMap(this.player) + ", pos: " + this.player.model.position);
                    break;

                case 'd':
                    // Turn player to right
                    this.player.rotatePlayer('y', -0.05);
                    break;

                case 'a':
                    // Turn player left
                    this.player.rotatePlayer('y', 0.05);
                    break;

                case "s":
                    // Move player backwards
                    var oldPlayerPos = vec3.clone(this.player.model.position);
                    this.player.movePlayerBackward()
                    // if(this.state.holdItem) {
                    //     var temp = vec3.fromValues();
                    //     vec3.scale(temp, this.player.at, -0.1);
                    //     this.state.holdItem.translate(temp);
                    // }
                    console.log(this.player.model.position);
                    checkCamera(this.state, this.player.model.position);
                    break;

                case " ":

                    if (vec3.dist(this.player.model.position, vec3.fromValues(0.0, 0, -6)) <= 2.0 && this.state.holdItem.name == "knife") {
                        this.rope.translate(vec3.fromValues(0.0, -50.0, 0.0));
                        this.CHANDELIER = true;
                        break;
                    }

                    checkPickup(this.state, this.player);



                    if (this.checkInMap(this.player)) {
                    //console.log(this.player.model.position);
                        var newPlayerPos = this.player.model.position;
                        checkCamera(this.state, oldPlayerPos, newPlayerPos);
                    } else {
                       this.player.movePlayerForward();
                    }
                    //console.log("in map: " + this.checkInMap(this.player) + ", pos: " + this.player.model.position);
                    break;

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
                default:
                    break;
            }
        });


        this.customMethod(); // calling our custom method! (we could put spawning logic, collision logic etc in there ;) )
        
        // example: spawn some stuff before the scene starts
        // for (let i = 0; i < 10; i++) {
        //     for (let j = 0; j < 10; j++) {
        //         for (let k = 0; k < 10; k++) {
        //             spawnObject({
        //                 name: `new-Object${i}${j}${k}`,
        //                 type: "cube",
        //                 material: {
        //                     diffuse: randomVec3(0, 1)
        //                 },
        //                 position: vec3.fromValues(4 - i, 5 - j, 10 - k),
        //                 scale: vec3.fromValues(0.5, 0.5, 0.5)
        //             }, this.state);
        //         }
        //     }
        // }

        // for (let i = 0; i < 10; i++) {
        //     let tempObject = await spawnObject({
        //         name: `new-Object${i}`,
        //         type: "cube",
        //         material: {
        //             diffuse: randomVec3(0, 1)
        //         },
        //         position: vec3.fromValues(4 - i, 0, 0),
        //         scale: vec3.fromValues(0.5, 0.5, 0.5)
        //     }, this.state);


        // tempObject.constantRotate = true; // lets add a flag so we can access it later
        // this.spawnedObjects.push(tempObject); // add these to a spawned objects list

        // tempObject.collidable = true;
        // tempObject.onCollide = (object) => { // we can also set a function on an object without defining the function before hand!
        //     console.log(`I collided with ${object.name}!`);
        // };
        // }
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {

        if(this.player.model.position[0] > 78) {
            this.state.settings.backgroundColor = vec3.fromValues(0, 0, 0);
            this.state.pointLights = [];
            this.state.numLights = 0;
        }

        if(vec3.dist(this.crateR.model.position, this.panelR.centroid) <= 0.75 && vec3.dist(this.crateB.model.position, this.panelB.centroid) <= 0.75 && vec3.dist(this.crateG.model.position, this.panelG.centroid) <=0.75 && !this.KNIFE) {
            let knifeAudio = new Audio("knife.mp3");
            knifeAudio.play();
            this.knife.translate(vec3.fromValues(0.0, -20, 0.0));
            this.state.pickupItems.push(this.knife)
            this.KNIFE = true;
        }

        if(this.CHANDELIER) {
            var temp = vec3.fromValues();
            vec3.transformMat4(temp,this.chandelier.model.position, this.chandelier.model.modelMatrix);
            if(temp[1] > 4) {
                
                this.chandelier.translate(vec3.fromValues(0.0, -6*deltaTime, 0.0));
            }
            else {
                let glassAudio = new Audio("glass.mp3");
                glassAudio.play();
                this.chandelier.translate(vec3.fromValues(0.0, -50, 0.0));
                this.state.pointLights[3].position = vec3.fromValues(0.0, 100, 0.0);
                this.glass.translate(vec3.fromValues(0.0, -50, 0.0));
                this.CHANDELIER = false;
            }
        }

        if(this.player.model.position[0] <= 8 && this.player.model.position[0] >= -1 &&
            this.player.model.position[2] <=-12 && this.player.model.position[2] >=-24) {

            this.player.model.position = vec3.fromValues(0, -50, 5);
            this.player.atPoint = vec3.fromValues(1, -50, 5)
            this.player.at = vec3.fromValues(1, 0, 0);
            this.state.camera.position = vec3.fromValues(20, -45, 5);
            this.state.camera.atPoint = vec3.fromValues(0, -50, 5);
            this.state.settings.backgroundColor = vec3.fromValues(1, 1, 1)
            this.ZOMBIE = true;
        }

        if(this.ZOMBIE) {
            
            for(let i=0; i < this.zombies.length; i++) {
                var temp = vec3.fromValues();
                vec3.subtract(temp, this.player.model.position, this.zombies[i].model.position);
                vec3.scale(temp, temp, deltaTime*0.5);
                this.zombies[i].translate(temp);
            }

            // var temp = vec3.fromValues();
            // //vec3.transformMat4(temp, this.zombies[0].model.position,this.zombies[0].model.modelMatrix);
            // vec3.subtract(temp, this.player.model.position, this.zombies[0].model.position);
            // vec3.scale(temp, temp, deltaTime*0.1);
            // this.zombies[0].translate(temp);

            
        }
        // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions

        // example: Rotate a single object we defined in our start method
        // this.cube.rotate('x', deltaTime * 0.5);

        // example: Rotate all objects in the scene marked with a flag
        // this.state.objects.forEach((object) => {
        //     if (object.constantRotate) {
        //         object.rotate('y', deltaTime * 0.5);
        //     }
        // });

        // simulate a collision between the first spawned object and 'cube' 
        // if (this.spawnedObjects[0].collidable) {
        //     this.spawnedObjects[0].onCollide(this.cube);
        // }

        // example: Rotate all the 'spawned' objects in the scene
        // this.spawnedObjects.forEach((object) => {
        //     object.rotate('y', deltaTime * 0.5);
        // });


        // example - call our collision check method on our cube
        // this.checkCollision(this.cube);
    }
}
