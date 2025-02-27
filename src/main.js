var state = {};
var game;
var sceneFile = "scene.json"; // can change this to be the name of your scene

// This function loads on window load, uses async functions to load the scene then try to render it
window.onload = async () => {
    try {
        console.log("Starting to load scene file");
        //await parseOBJFileToJSON("chandelier.obj");
        await parseSceneFile(`./statefiles/${sceneFile}`, state);
        
        main();
    } catch (err) {
        console.error(err);
        alert(err);
    }
}

/**
 * 
 * @param {object - contains vertex, normal, uv information for the mesh to be made} mesh 
 * @param {object - the game object that will use the mesh information} object 
 * @purpose - Helper function called as a callback function when the mesh is done loading for the object
 */
async function createMesh(mesh, object, vertShader, fragShader) {
    let testModel = new Model(state.gl, object, mesh);
    testModel.vertShader = vertShader ? vertShader : state.vertShaderSample;
    testModel.fragShader = fragShader ? fragShader : state.fragShaderSample;
    await testModel.setup();
    addObjectToScene(state, testModel);
    return testModel;
}

/**
 * Main function that gets called when the DOM loads
 */
async function main() {
    //document.body.appendChild( stats.dom );
    const canvas = document.querySelector("#glCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize the WebGL2 context
    var gl = canvas.getContext("webgl2");

    // Only continue if WebGL2 is available and working
    if (gl === null) {
        printError('WebGL 2 not supported by your browser',
            'Check to see you are using a <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#WebGL_2_2" class="alert-link">modern browser</a>.');
        return;
    }

    /**
     * Sample vertex and fragment shader here that simply applies MVP matrix 
     * and diffuse colour of each object
     */
    const vertShaderSample =
        `#version 300 es

        in vec3 aPosition;
        in vec3 aNormal;
        in vec2 aUV;

        uniform mat4 uProjectionMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uModelMatrix;

        out vec2 oUV;
        out vec3 oFragPosition;
        out vec3 oNormal;

        void main() {
            // Simply use this normal so no error is thrown
            oNormal = normalize((uModelMatrix * vec4(aNormal, 1.0)).xyz);
            oFragPosition = (uModelMatrix * vec4(aPosition, 1.0)).xyz;
            oUV = aUV;
            // Postion of the fragment in world space
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        }
        `;

    const fragShaderSample =
        `#version 300 es
        #define MAX_LIGHTS 20
        precision highp float;

        struct PointLight {
            vec3 position;
            vec3 colour;
            float strength;
            float linear;
            float quadratic;
            float constant;
        };

        in vec2 oUV;
        in vec3 oFragPosition;
        in vec3 oNormal;

        uniform PointLight[MAX_LIGHTS] pointLights;
        uniform int numLights;
        uniform vec3 cameraPos;


        uniform vec3 diffuseVal;
        uniform vec3 ambientVal;
        uniform vec3 specularVal;
        uniform float n;
        uniform float alpha;

        uniform int samplerExists;
        uniform sampler2D uTexture;

        out vec4 fragColor;


        vec3 calculateColour(PointLight light, vec3 normal) {
            vec3 N = normalize(normal);
            vec3 L = normalize(light.position - oFragPosition);
            vec3 V = normalize(cameraPos - oFragPosition);
            vec3 H = normalize(V+L);


            float dist = length(light.position - oFragPosition);
            float attenuation = light.strength / (light.constant + light.linear * dist + light.quadratic * (dist*dist));

            vec3 amb = ambientVal*light.colour;
            vec3 diff;
            if (samplerExists == 1) {
                vec3 textureColour = texture(uTexture, oUV).rgb;
                diff = diffuseVal*light.colour*max(0.0, dot(N, L));
                diff = mix(diff, textureColour, 0.1);
            }
            else {
                diff = diffuseVal*light.colour*max(0.0, dot(N, L));
            }

            vec3 spec = specularVal*light.colour*pow(max(0.0, dot(N, H)), n);

            diff = diff * attenuation;
            spec = spec * attenuation;

            return diff+spec+amb;

        }

        void main() {

            //final colour
            vec3 total = vec3(0.0, 0.0, 0.0);

            //iterate over light sources and sum contribution from each light source
            for (int i =0; i < numLights; i++){
                total += calculateColour(pointLights[i], oNormal);
            }
            
            //return fragment colour
            fragColor = vec4(total, alpha);

        }`;

        const fragShaderGlass =
        `#version 300 es
        #define MAX_LIGHTS 20
        precision highp float;

        struct PointLight {
            vec3 position;
            vec3 colour;
            float strength;
            float linear;
            float quadratic;
            float constant;
        };

        in vec2 oUV;
        in vec3 oFragPosition;
        in vec3 oNormal;

        uniform PointLight[MAX_LIGHTS] pointLights;
        uniform int numLights;
        uniform vec3 cameraPos;


        uniform vec3 diffuseVal;
        uniform vec3 ambientVal;
        uniform vec3 specularVal;
        uniform float n;
        uniform float alpha;

        uniform int samplerExists;
        uniform sampler2D uTexture;

        out vec4 fragColor;


        vec3 calculateColour(PointLight light, vec3 normal) {
            vec3 N = normalize(normal);
            vec3 L = normalize(light.position - oFragPosition);
            vec3 V = normalize(cameraPos - oFragPosition);
            vec3 H = normalize(V+L);


            float dist = length(light.position - oFragPosition);
            float attenuation = light.strength / (light.constant + light.linear * dist + light.quadratic * (dist*dist));

            vec3 amb = ambientVal*light.colour*light.strength;
            vec3 diff;
            if (samplerExists == 1) {
                vec3 textureColour = texture(uTexture, oUV).rgb;
                diff = diffuseVal*light.colour*max(0.0, dot(N, L));
                diff = mix(diff, textureColour, 0.1);
            }
            else {
                diff = diffuseVal*light.colour*max(0.0, dot(N, L));
            }

            vec3 spec = specularVal*light.colour*pow(max(0.0, dot(N, H)), n);

            diff = diff * attenuation;
            spec = spec * attenuation;

            return diff+spec+amb;

        }

        void main() {

            //final colour
            vec3 total = vec3(0.0, 0.0, 0.0);

            //iterate over light sources and sum contribution from each light source
            for (int i =0; i < numLights; i++){
                total += calculateColour(pointLights[i], oNormal);
            }
            
            //return fragment colour
            fragColor = vec4(total, alpha);

        }`;

        const fragShaderRooms =
        `#version 300 es
        #define MAX_LIGHTS 20
        precision highp float;

        struct PointLight {
            vec3 position;
            vec3 colour;
            float strength;
            float linear;
            float quadratic;
            float constant;
        };

        in vec2 oUV;
        in vec3 oFragPosition;
        in vec3 oNormal;

        uniform PointLight[MAX_LIGHTS] pointLights;
        uniform int numLights;
        uniform vec3 cameraPos;


        uniform vec3 diffuseVal;
        uniform vec3 ambientVal;
        uniform vec3 specularVal;
        uniform float n;
        uniform float alpha;

        uniform int samplerExists;
        uniform sampler2D uTextureWall;
        uniform sampler2D uTextureFloor;

        out vec4 fragColor;


        vec3 calculateColour(PointLight light, vec3 normal) {
            vec3 N = normalize(normal);
            vec3 L = normalize(light.position - oFragPosition);
            vec3 V = normalize(cameraPos - oFragPosition);
            vec3 H = normalize(V+L);


            float dist = length(light.position - oFragPosition);
            float attenuation = light.strength / (light.constant + light.linear * dist + light.quadratic * (dist*dist));

            vec3 amb = ambientVal*light.colour;
            vec3 diff;
            if (samplerExists == 1) {
                vec3 textureColour;
                if(oUV[0] < 0.0 || oUV[1] < 0.0) {
                    textureColour = texture(uTextureFloor, oUV).rgb;
                    diff = diffuseVal*light.colour*max(0.0, dot(N, L));
                    diff = mix(diff, textureColour, 0.1);
                }
                else {
                    textureColour = texture(uTextureWall, oUV).rgb;
                    diff = diffuseVal*light.colour*max(0.0, dot(N, L));
                    diff = mix(diff, textureColour, 0.1);
                }
            }
            else {
                diff = diffuseVal*light.colour*max(0.0, dot(N, L));
            }

            vec3 spec = specularVal*light.colour*pow(max(0.0, dot(N, H)), n);

            diff = diff * attenuation;
            spec = spec * attenuation;

            return diff+spec+amb;

        }

        void main() {

            //final colour
            vec3 total = vec3(0.0, 0.0, 0.0);

            //iterate over light sources and sum contribution from each light source
            for (int i =0; i < numLights; i++){
                total += calculateColour(pointLights[i], oNormal);
            }
            
            //return fragment colour
            fragColor = vec4(total, alpha);

        }`;

    /**
     * Initialize state with new values (some of these you can replace/change)
     */
    state = {
        ...state, // this just takes what was already in state and applies it here again
        gl,
        vertShaderSample,
        fragShaderSample,
        fragShaderRooms,
        fragShaderGlass,
        canvas: canvas,
        objectCount: 0,
        lightIndices: [],
        keyboard: {},
        mouse: { sensitivity: 0.2 },
        meshCache: {},
        samplerExists: 0,
        samplerNormExists: 0,
        n_all: 1,

        ////////////////////////CAMERAS DEFINED HERE////////////////////////////////
        //Cameras are defined the following way: [cameraPos, cameraUp, cameraAtPoint]
        //where cameraPos is the position of the camera, cameraUp is the up vector,
        //at cameraAtPoint is the lookat point for the camera
        cameras: [
            [
                //STARTING ROOM
                state.camera.position, state.camera.up, state.camera.atPoint,
            ],
            [
                //camera2 (hallway)
                vec3.fromValues(-9.0, 4.5, 2.5), vec3.fromValues(0, 1, 0), vec3.fromValues(-2.5, 0, -2.5)
            ],
            [
                //HALLWAY 1 ANGLE 1
                vec3.fromValues(-5.0, 2, 2), vec3.fromValues(0, 1, 0), vec3.fromValues(-12, 2, 2)
            ],
            [
                //HALLWAY 1 ANGLE 2 + CORNER
                vec3.fromValues(-10.5, 4, -4), vec3.fromValues(0, 1, 0), vec3.fromValues(-11.5, 0, -0.5)
            ],
            [
                //MAIN ROOM ENTRANCE
                vec3.fromValues(-14, 7, -10), vec3.fromValues(0, 1, 0), vec3.fromValues(-11, 2, -7)
            ],
            [
                //MAIN ROOM TOWARDS PUZZLE ROOM
                vec3.fromValues(-10, 7, -14), vec3.fromValues(0, 1, 0), vec3.fromValues(-18, 3, -12)
            ],
            [
                //PUZZLE ROOM ENTRANCE
                vec3.fromValues(-29, 3.5, -22), vec3.fromValues(0, 1, 0), vec3.fromValues(-26, 1.5, -20)
            ],
            [
                //PUZZLE ROOM BACK
                vec3.fromValues(-24, 3, -26), vec3.fromValues(0, 1, 0), vec3.fromValues(-24, 1, -30)
            ],
            [
                //PUZZLE ROOM TILES
                vec3.fromValues(-21.5, 3, -7), vec3.fromValues(0, 1, 0), vec3.fromValues(-26, 1, -9.5)
            ],

            [
                //BACKSIDE OF MAIN ROOM
                vec3.fromValues(-20.5, 4, -29), vec3.fromValues(0, 1, 0), vec3.fromValues(-12, 1, -29)
            ],
            [
                //CENTER OF MAIN ROOM
                vec3.fromValues(-14, 3, -20), vec3.fromValues(0, 1, 0), vec3.fromValues(-2, 1, -20)
            ],
            [
                //CHANDELIER
                vec3.fromValues(-2.7, 2.3, -6.1), vec3.fromValues(0, 1, 0), vec3.fromValues(4.3, 1, -26)
            ],

            [
                //ROPE
                vec3.fromValues(8, 7, -6.5), vec3.fromValues(0, 1, 0), vec3.fromValues(4, 3, -9)
            ],

            [
                //OVERLOOKING GLASS
                vec3.fromValues(-6.5, 7, -19), vec3.fromValues(0, 1, 0), vec3.fromValues(4,-2, -22)
            ],
            [
                //ENTER THE END
                vec3.fromValues(5,-48, 9), vec3.fromValues(0, 1, 0), vec3.fromValues(7,-48.5, 8)
            ],

            [
                //MIDWAY THROUGH THE END
                vec3.fromValues(20.8,-46, 0.6), vec3.fromValues(0, 1, 0), vec3.fromValues(23,-47, 5)
            ],
            [
                //DONT STOP YET
                vec3.fromValues(20.25,-43, 8.5), vec3.fromValues(0, 1, 0), vec3.fromValues(33,-44, 7)
            ],
            [
                //FINAL STRETCH
                vec3.fromValues(30,-45, 5), vec3.fromValues(0, 1, 0), vec3.fromValues(50,-45, 5)
            ],

        ],

        ///////////////////////CAMERA BOUNDARIES DEFINED HERE///////////////////////
        //Camera boundaries are defined the following way: [min, max] where min is the
        //vec3 defining the minimum values of the box, and max the vec3 determining the maximum values
        cameraBounds: [
            [
                //STARTING ROOM
                vec3.fromValues(0.0, 0, 0), vec3.fromValues(5, 5.0, 5.0)
            ],
            [
                //HALLWAY 1 ANGLE 1
                vec3.fromValues(-8, 0, 1), vec3.fromValues(0, 5, 3)
            ],
            [
                //HALLWAY 1 ANGLE 2 + CORNER
                vec3.fromValues(-12, 0, 1), vec3.fromValues(-8, 5, 3)
            ],
            [
                //HALLWAY 2 + CORNER
                vec3.fromValues(-12, 0, -5), vec3.fromValues(-10, 5, -1)
            ],
            [
                //MAIN ROOM ENTRANCE
                vec3.fromValues(-14,0,-10), vec3.fromValues(-8, 24, -6)
            ],
            [
                //MAIN ROOM TOWARDS PUZZLE ROOM
                vec3.fromValues(-21,0,-22), vec3.fromValues(-14, 24, -6)
            ],
            [
                //PUZZLE ROOM ENTRANCE
                vec3.fromValues(-31,0,-28), vec3.fromValues(-21, 5, -18)
            ],
            [
                //PUZZLE ROOM BACK
                vec3.fromValues(-31,0,-30), vec3.fromValues(-21, 5, -28)
            ],
            [
                //PUZZLE ROOM TILES
                vec3.fromValues(-31,0,-18), vec3.fromValues(-21, 5, -6)
            ],
            [
                //BACKSIDE OF MAIN ROOM
                vec3.fromValues(-21,0,-30), vec3.fromValues(3, 5, -20)
            ],
            [
                //CENTER OF MAIN ROOM
                vec3.fromValues(-14,0,-28), vec3.fromValues(-8, 5, -10)
            ],

            [
                //CHANDELIER
                vec3.fromValues(-3,0,-10), vec3.fromValues(3, 5, -6)
            ],
            [
                //ROPE
                vec3.fromValues(-8,0,-10), vec3.fromValues(-3, 5, -6)
            ],
            [
                //OVERLOOKING GLASS
                vec3.fromValues(-8,0,-28), vec3.fromValues(0, 24, -10)
            ],
            [
                //ENTER THE END
                vec3.fromValues(0,-50,0), vec3.fromValues(12, -25, 9)
            ],
            [
                //MIDWAY THROUGH THE END
                vec3.fromValues(12,-50,0), vec3.fromValues(21, -25, 9)
            ],
            [
                //DONT STOP YET
                vec3.fromValues(21,-50,0), vec3.fromValues(31, -25, 9)
            ],
            [
                //FINAL STRETCH!
                vec3.fromValues(31,-50,0), vec3.fromValues(200, -25, 9)
            ],

            
        ],

        currentCameraBound: 0,

        pickupItems: [],

        holdItem: null,

    };    

    state.numLights = state.pointLights.length;

    const then = Date.now();
    for (let i = 0; i < state.loadObjects.length; i++) {
        const object = state.loadObjects[i];

        if (object.type === "mesh") {
            await addMesh(object);
        } else if (object.type === "cube") {
            addCube(object, state);
        } else if (object.type === "plane") {
            addPlane(object, state);
        } 
        else if (object.type === "Room") {
            addRoom(object, state)
        }
        else if (object.type.includes("Custom")) {
            addCustom(object, state);
        }
        // Not using custom object classes for now
        
        // else if (object.type === "Hallway") {
        //     addHall(object, state)
        // }
        // else if (object.type === "Corner") {
        //     addCorner(object, state)
        // }
    }

    const now = Date.now();
    const loadingTime = (now - then) / 1000;
    console.log(`Scene file loaded in ${loadingTime} seconds.`);
    const titleSound = new Audio("./assets/audio/SplashAudio.mp3");

    game = new Game(state);
    await game.onStart();

    document.addEventListener("keydown", function splashRemove(e) {
        loadingPage.animate({opacity: 0}, 4100);
        titleSound.play();

        window.setTimeout(() => {
            loadingPage2.animate({opacity: 0}, 400);
            window.setTimeout(() => {
                loadingPage2.remove();
            }, 410);
            game.gameStarted = true;
            loadingPage.remove();
            game.music.play();
            startRendering(gl, state); // now that scene is setup, start rendering it
        }, 4000)
        document.removeEventListener("keydown", splashRemove);
    });

}

/**
 * 
 * @param {object - object containing scene values} state 
 * @param {object - the object to be added to the scene} object 
 * @purpose - Helper function for adding a new object to the scene and refreshing the GUI
 */
function addObjectToScene(state, object) {
    object.name = object.name;
    state.objects.push(object);
}

/**
 * 
 * @param {gl context} gl 
 * @param {object - object containing scene values} state 
 * @purpose - Calls the drawscene per frame
 */
function startRendering(gl, state) {
    // A variable for keeping track of time between frames
    var then = 0.0;

    // This function is called when we want to render a frame to the canvas
    function render(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        state.deltaTime = deltaTime;
        drawScene(gl, deltaTime, state);
        game.onUpdate(deltaTime); //constantly call our game loop

        // Request another frame when this one is done
        requestAnimationFrame(render);
    }
    // Draw the scene
    requestAnimationFrame(render);
}

/**
 * 
 * @param {gl context} gl 
 * @param {float - time from now-last} deltaTime 
 * @param {object - contains the state for the scene} state 
 * @purpose Iterate through game objects and render the objects aswell as update uniforms
 */
function drawScene(gl, deltaTime, state) {
    gl.clearColor(state.settings.backgroundColor[0], state.settings.backgroundColor[1], state.settings.backgroundColor[2], 1.0); // Here we are drawing the background color that is saved in our state
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.disable(gl.CULL_FACE); // Cull the backface of our objects to be more efficient
    gl.cullFace(gl.BACK);
    // gl.frontFace(gl.CCW);
    gl.clearDepth(1.0); // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // sort objects by nearness to camera
    let sorted = state.objects.sort((a, b) => {
        let aCentroidFour = vec4.fromValues(a.centroid[0], a.centroid[1], a.centroid[2], 1.0);
        vec4.transformMat4(aCentroidFour, aCentroidFour, a.modelMatrix);

        let bCentroidFour = vec4.fromValues(b.centroid[0], b.centroid[1], b.centroid[2], 1.0);
        vec4.transformMat4(bCentroidFour, bCentroidFour, b.modelMatrix);

        return vec3.distance(state.camera.position, vec3.fromValues(aCentroidFour[0], aCentroidFour[1], aCentroidFour[2]))
            >= vec3.distance(state.camera.position, vec3.fromValues(bCentroidFour[0], bCentroidFour[1], bCentroidFour[2])) ? -1 : 1;
    });

    // iterate over each object and render them
    sorted.map((object) => {
        gl.useProgram(object.programInfo.program);
        {

            if (object.material.alpha < 1.0) {
                // TODO turn off depth masking
                // enable blending and specify blending function 
                gl.depthMask(false);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.ONE_MINUS_CONSTANT_ALPHA,gl.ONE_MINUS_SRC_ALPHA);                
            }
            else {
                // TODO disable blending 
                // enable depth masking and z-buffering
                // specify depth function
                gl.disable(gl.BLEND);
                gl.depthMask(true);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
            }

            // Projection Matrix ....
            let projectionMatrix = mat4.create();
            let fovy = 90.0 * Math.PI / 180.0; // Vertical field of view in radians
            let aspect = state.canvas.clientWidth / state.canvas.clientHeight; // Aspect ratio of the canvas
            let near = 0.1; // Near clipping plane
            let far = 1000000.0; // Far clipping plane

            mat4.perspective(projectionMatrix, fovy, aspect, near, far);
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.projection, false, projectionMatrix);
            state.projectionMatrix = projectionMatrix;

            // View Matrix & Camera ....
            let viewMatrix = mat4.create();
            mat4.lookAt(
                viewMatrix,
                state.camera.position,
                state.camera.atPoint,
                state.camera.up,
            );
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.view, false, viewMatrix);
            gl.uniform3fv(object.programInfo.uniformLocations.cameraPosition, state.camera.position);
            state.viewMatrix = viewMatrix;

            // Model Matrix ....
            let modelMatrix = mat4.create();
            let negCentroid = vec3.fromValues(0.0, 0.0, 0.0);
            vec3.negate(negCentroid, object.centroid);
            mat4.translate(modelMatrix, modelMatrix, object.model.position);
            mat4.translate(modelMatrix, modelMatrix, object.centroid);
            mat4.mul(modelMatrix, modelMatrix, object.model.rotation);
            mat4.scale(modelMatrix, modelMatrix, object.model.scale);
            mat4.translate(modelMatrix, modelMatrix, negCentroid);

            if (object.parent) {
                let parent = getObject(state, object.parent);
                if (parent.model && parent.model.modelMatrix) {
                    mat4.multiply(modelMatrix, parent.model.modelMatrix, modelMatrix);
                }
            }

            object.model.modelMatrix = modelMatrix;
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.model, false, modelMatrix);

            // Normal Matrix ....
            let normalMatrix = mat4.create();
            mat4.invert(normalMatrix, modelMatrix);
            mat4.transpose(normalMatrix, normalMatrix);
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.normalMatrix, false, normalMatrix);

            // Object material
            gl.uniform3fv(object.programInfo.uniformLocations.diffuseVal, object.material.diffuse);
            gl.uniform3fv(object.programInfo.uniformLocations.ambientVal, object.material.ambient);
            gl.uniform3fv(object.programInfo.uniformLocations.specularVal, object.material.specular);
            gl.uniform1f(object.programInfo.uniformLocations.n, object.material.n);
            gl.uniform1f(object.programInfo.uniformLocations.alpha, object.material.alpha);

            gl.uniform1i(object.programInfo.uniformLocations.numLights, state.numLights);
            for (let i = 0; i < state.pointLights.length; i++) {
                
                gl.uniform3fv(gl.getUniformLocation(object.programInfo.program, 'pointLights[' + i + '].position'), state.pointLights[i].position);
                gl.uniform3fv(gl.getUniformLocation(object.programInfo.program, 'pointLights[' + i + '].colour'), state.pointLights[i].colour);
                gl.uniform1f(gl.getUniformLocation(object.programInfo.program, 'pointLights[' + i + '].strength'), state.pointLights[i].strength);
                gl.uniform1f(gl.getUniformLocation(object.programInfo.program, 'pointLights[' + i + '].linear'), state.pointLights[i].linear);
                gl.uniform1f(gl.getUniformLocation(object.programInfo.program, 'pointLights[' + i + '].quadratic'), state.pointLights[i].quadratic);
                gl.uniform1f(gl.getUniformLocation(object.programInfo.program, 'pointLights[' + i + '].constant'), state.pointLights[i].constant);

            }



            // one light case
            
            // let mainLight = state.pointLights[0];
            
            // gl.uniform3fv(gl.getUniformLocation(object.programInfo.program, 'mainLight.position'), mainLight.position);
            // gl.uniform3fv(gl.getUniformLocation(object.programInfo.program, 'mainLight.colour'), mainLight.colour);
            // gl.uniform1f(gl.getUniformLocation(object.programInfo.program, 'mainLight.strength'), mainLight.strength);
            


            {
                // Bind the buffer we want to draw
                gl.bindVertexArray(object.buffers.vao);

                //check for diffuse texture and apply it
                if (object.material.shaderType === 3) {
                    state.samplerExists = 1;
                    gl.activeTexture(gl.TEXTURE0);
                    gl.uniform1i(object.programInfo.uniformLocations.samplerExists, state.samplerExists);
                    gl.uniform1i(object.programInfo.uniformLocations.sampler, 0);
                    gl.bindTexture(gl.TEXTURE_2D, object.model.texture);
                } 
                else if(object.material.shaderType === 5) {
                    state.samplerExists = 1;


                    gl.activeTexture(gl.TEXTURE0 + 0);
                    gl.uniform1i(object.programInfo.uniformLocations.samplerExists, state.samplerExists);
                    gl.uniform1i(object.programInfo.uniformLocations.samplerWall, 0);
                    gl.uniform1i(object.programInfo.uniformLocations.samplerFloor, 1);
                    gl.bindTexture(gl.TEXTURE_2D, object.model.textureW);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

                    gl.activeTexture(gl.TEXTURE0 + 1);
                    gl.bindTexture(gl.TEXTURE_2D, object.model.textureF);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);


                }
                
                else {
                    gl.activeTexture(gl.TEXTURE0);
                    state.samplerExists = 0;
                    gl.uniform1i(object.programInfo.uniformLocations.samplerExists, state.samplerExists);
                }

                //check for normal texture and apply it
                if (object.material.shaderType === 4) {
                    state.samplerNormExists = 1;
                    gl.activeTexture(gl.TEXTURE1);
                    gl.uniform1i(object.programInfo.uniformLocations.normalSamplerExists, state.samplerNormExists);
                    gl.uniform1i(object.programInfo.uniformLocations.normalSampler, 1);
                    gl.bindTexture(gl.TEXTURE_2D, object.model.textureNorm);
                } else {
                    gl.activeTexture(gl.TEXTURE1);
                    state.samplerNormExists = 0;
                    gl.uniform1i(object.programInfo.uniformLocations.normalSamplerExists, state.samplerNormExists);
                }

                // Draw the object
                const offset = 0; // Number of elements to skip before starting

                //if its a mesh then we don't use an index buffer and use drawArrays instead of drawElements
                if (object.type === "mesh" || object.type === "meshCustom") {
                    gl.drawArrays(gl.TRIANGLES, offset, object.buffers.numVertices / 3);
                } else {
                    gl.drawElements(gl.TRIANGLES, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
                }
            }
        }
    });
}
