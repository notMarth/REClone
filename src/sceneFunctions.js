function checkCamera(state, playerPos) {

    if (!inside(playerPos, state.cameraBounds[state.currentCameraBound])) {

        for(let i=0; i < state.cameraBounds.length; i++) {

            if (inside(playerPos, state.cameraBounds[i])) {
                switchCamera(state, state.cameras[i]);
                state.currentCameraBound = i;
                return;
            }

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

function inside(playerPos, currentCameraBound) {
    let xCheck = playerPos[0] >= currentCameraBound[0][0] && playerPos[0] <= currentCameraBound[1][0];
    let yCheck = playerPos[1] >= currentCameraBound[0][1] && playerPos[1] <= currentCameraBound[1][1];
    let zCheck = playerPos[2] >= currentCameraBound[0][2] && playerPos[2] <= currentCameraBound[1][2];

    return xCheck && yCheck && zCheck;
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
