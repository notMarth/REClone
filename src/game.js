class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        this.rooms = [];
        this.check = true;
        this.DEBUG = true;
        this.startTime;
        this.frameFrate = 0;
    }


    // example - we can add our own custom method to our game and call it using 'this.customMethod()'
    customMethod() {
        console.log("Custom method!");
    }

    // example - create a collider on our object with various fields we might need (you will likely need to add/remove/edit how this works)
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
            console.log(`Door paralel to x: x1:${minX}, x2:${maxX}, z1:${minZ}, z2:${maxZ}`)
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
    //     // loop over all the other collidable objects 
    //     this.collidableObjects.forEach(otherObject => {
    //         // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
    //         // call the onCollide we define for that specific object. This way we can handle collisions identically for all
    //         // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
    //         // use the modeling transformation for object and otherObject to transform position into current location
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

        console.log("On start");
        this.startTime = Date.now();

        // this just prevents the context menu from popping up when you right click
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        // example - set an object in onStart before starting our render loop!
        this.player = getObject(this.state, "Player");
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
        // this.createSphereCollider(this.cube, 0.5, (otherObject) => {
        //     console.log(`This is a custom collision of ${otherObject.name}`)
        // });
        // this.createSphereCollider(otherCube, 0.5);

        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keypress", (e) => {
            e.preventDefault();

            switch (e.key) {
                case "w":
                    // Move forwards
                    var oldPlayerPos = vec3.clone(this.player.model.position);
                    this.player.movePlayerForward();

                    if (this.checkInMap(this.player)) {
                        //TODO what does this do? it's not in the "s" case
                        // This is already present in the function movePlayerForward()
                        //vec3.add(this.player.atPoint, this.player.atPoint, this.player.at);
                        //console.log(this.player.model.position);
                        var newPlayerPos = this.player.model.position;
                        checkCamera(this.state, oldPlayerPos, newPlayerPos);
                    } else {
                       this.player.movePlayerBackward();
                    }
                    console.log("in map: " + this.checkInMap(this.player) + ", pos: " + this.player.model.position + ", room: ");
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

                    if (this.checkInMap(this.player)) {
                    //console.log(this.player.model.position);
                    var newPlayerPos = this.player.model.position;
                    checkCamera(this.state, oldPlayerPos, newPlayerPos);
                    } else {
                       this.player.movePlayerForward();
                    }
                    console.log("in map: " + this.checkInMap(this.player) + ", pos: " + this.player.model.position);
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
        this.frameFrate ++;
        //console.log("Framerate: " + this.frameFrate / ((Date.now() - this.startTime) * .001));
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
