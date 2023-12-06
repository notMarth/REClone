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

function checkPickup(state, player) {
    if(state.holdItem != null) {
        putDown(state, player, state.holdItem);
        let put = new Audio("putdown.mp3");
        put.play();
    }
    else {
        for(let i = 0; i < state.pickupItems.length; i++) {
            console.log(vec3.distance(player.model.position, state.pickupItems[i].model.position));
            if(vec3.distance(player.model.position, state.pickupItems[i].model.position) <= 1.0) {
                pickUp(state, player, state.pickupItems[i]);
                let pick = new Audio("pickup.mp3");
                pick.play();
                return;
            }
        }
        console.log("Couldn't find anything!");
        let nope = new Audio("nope.mp3");
        nope.play();
    }
}

function pickUp(state, parent, object) {
    object.parent = parent.name;
    state.holdItem = object;
    //object.model.modelMatrix = parent.model.modelMatrix;
    }

function putDown(state, parent, object) {
    object.model.position = vec3.clone(parent.atPoint);
    object.parent = null;
    state.holdItem = null;
}

function chandelierCutscene(state) {
    let glass = getObject(state, "GlassPanel");
    let chandelier = getObject(state, "Chandelier");
    rope.translate(vec3.fromValues(0.0, -50.0, 0.0));

    

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
