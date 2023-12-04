//function run everytime player moves in order to check if camera boundary crossed
//cameraBounds is an array of arrays of 2 vec3s: one representing the lower left
//corner of the boundary plane, and the other representing the upper right.
//state.camera.cameraBounds is strictly smaller than size of state.camera.cameras
//each bound seperates two cameras
//eg. cameraBounds[0] separates cameras[0] and cameras[1], while cameraBounds[1]
//separates cameras[1] and cameras[2]
function checkCamera(state, oldPlayerPos, newPlayerPos) {

    for(let i=0; i < state.cameraBounds.length; i++) {

        let camera = state.cameraBounds[i];
        let check = false;
        let ind = i;

        //check if the player's new position would have crossed the boundary
        //in all 3 dimensions
        let xCheck = (newPlayerPos[0] >= camera[0][0] && newPlayerPos[0] <= camera[1][0]) || (newPlayerPos[0] >= camera[1][0] && newPlayerPos[0] <= camera[0][0]);
        let yCheck = (newPlayerPos[1] >= camera[0][1] && newPlayerPos[1] <= camera[1][1]) || (newPlayerPos[1] >= camera[1][1] && newPlayerPos[1] <= camera[0][1]);
        let zCheck = (newPlayerPos[2] >= camera[0][2] && newPlayerPos[2] <= camera[1][2]) || (newPlayerPos[2] >= camera[1][2] && newPlayerPos[2] <= camera[0][2]);

        //skip if any of the above not true
        if (!(xCheck&&yCheck&&zCheck)) {
            console.log(xCheck, yCheck, zCheck);
            //console.log(camera[0], camera[1]);
            //console.log(newPlayerPos);
            continue;
        }

        //find center of plane and store in two vectors
        let tempVec1 = vec3.fromValues();
        vec3.add(tempVec1, camera[0], camera[1]);
        tempVec1 = vec3.fromValues(tempVec1[0]/2, tempVec1[1]/2, tempVec1[2]/2);
        let tempVec2 = vec3.clone(tempVec1);

        //check distance vector between center of plane and old and new positions
        //if the signs are different between one of their coordinates, then we crossed the boundary
        vec3.subtract(tempVec1, tempVec1, oldPlayerPos);
        vec3.subtract(tempVec2, tempVec2, newPlayerPos);

        console.log(tempVec1, tempVec2);
        for(let j=0; j < 3; j++) {
            if (Math.sign(tempVec1[j]) != Math.sign(tempVec2[j])) {
                check = true;
                break;
            }
        }

        if (check) {
            //move camera to next element in array
            if (state.camera.position == state.cameras[ind][0]) {
                switchCamera(state, state.cameras[ind+1]);
            }
            else {
            //move camera to previous element in array
                switchCamera(state, state.cameras[ind]);
            }
            //we've switched the camera, exit the function
            return;
        }

    }

}

//Switch camera position
//newCam is an array of vec3s
function switchCamera(state, newCam) {
    state.camera.position = newCam[0];
    state.camera.up = newCam[1];
    state.camera.atPoint = newCam[2];
}

function getObject(state, name) {
    let objectToFind = null;

    for (let i = 0; i < state.objects.length; i++) {
        if (state.objects[i].name === name) {
            objectToFind = state.objects[i];
            break;
        }
    }

    return objectToFind;
}

async function spawnObject(object, state) {
    if (object.type === "mesh") {
        return await addMesh(object);
    } else if (object.type === "cube") {
        return await addCube(object, state);
    } else if (object.type === "plane") {
        return await addPlane(object, state);
    } else if (object.type.includes("Custom")) {
        return await addCustom(object, state);
    }
}

function randomVec3(min, max) {
    return vec3.fromValues(
        Math.random(min, max),
        Math.random(min, max),
        Math.random(min, max),
    )
}
