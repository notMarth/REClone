/**
 * @param  {} gl WebGL2 Context
 * @param  {string} vsSource Vertex shader GLSL source code
 * @param  {string} fsSource Fragment shader GLSL source code
 * @returns {} A shader program object. This is `null` on failure
 */
function initShaderProgram(gl, vsSource, fsSource) {
    // Use our custom function to load and compile the shader objects
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program by attaching and linking the shader objects
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to link the shader program' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

/**
 * Loads a shader from source into a shader object. This should later be linked into a program.
 * @param  {} gl WebGL2 context
 * @param  {} type Type of shader. Typically either VERTEX_SHADER or FRAGMENT_SHADER
 * @param  {string} source GLSL source code
 */
function loadShader(gl, type, source) {
    // Create a new shader object
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // Fail with an error message
        var typeStr = '';
        if (type === gl.VERTEX_SHADER) {
            typeStr = 'VERTEX';
        } else if (type === gl.FRAGMENT_SHADER) {
            typeStr = 'FRAGMENT';
        }
        printError('An error occurred compiling the shader: ' + typeStr, gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * 
 * @param {array of x,y,z vertices} vertices 
 */
function calculateCentroid(vertices, cb) {
    var center = vec3.fromValues(0.0, 0.0, 0.0);
    for (let t = 0; t < vertices.length; t += 3) {
        vec3.add(center, center, vec3.fromValues(vertices[t], vertices[t + 1], vertices[t + 2]));
    }
    vec3.scale(center, center, 1 / (vertices.length / 3));

    if (cb) {
        cb();
        return center;
    } else {
        return center;
    }
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function doAsyncCalc(center, x, y, z) {
    return new Promise((resolve, reject) => {
        vec3.add(center, center, vec3.fromValues(x, y, z));
        resolve(center);
    });
}

function asyncCalcCentroid(vertices) {
    return new Promise((resolve, reject) => {
        var center = vec3.fromValues(0.0, 0.0, 0.0);
        let promises = [];
        for (let t = 0; t < vertices.length; t += 3) {
            promises.push(doAsyncCalc(center, vertices[t], vertices[t + 1], vertices[t + 2]))
        }
        Promise.all(promises)
            .then(() => {
                vec3.scale(center, center, 1 / (vertices.length / 3));
                resolve(center);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

function initPositionAttribute(gl, programInfo, positionArray) {

    // Create a buffer for the positions.
    const positionBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER, // The kind of buffer this is
        positionArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 3; // pull out 3 values per iteration, ie vec3
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize between 0 and 1
        const stride = 0; // how many bytes to get from one set of values to the next
        // Set stride to 0 to use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from


        // Set the information WebGL needs to read the buffer properly
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        // Tell WebGL to use this attribute
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    return positionBuffer;
}

function initNormalAttribute(gl, programInfo, normalArray) {

    // Create a buffer for the positions.
    const normalBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER, // The kind of buffer this is
        normalArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 3; // pull out 4 values per iteration, ie vec3
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize between 0 and 1
        const stride = 0; // how many bytes to get from one set of values to the next
        // Set stride to 0 to use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from

        // Set the information WebGL needs to read the buffer properly
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        // Tell WebGL to use this attribute
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexNormal);
    }

    return normalBuffer;
}

function initTextureCoords(gl, programInfo, textureCoords) {
    if (textureCoords != null && textureCoords.length > 0) {
        // Create a buffer for the positions.
        const textureCoordBuffer = gl.createBuffer();

        // Select the buffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(
            gl.ARRAY_BUFFER, // The kind of buffer this is
            textureCoords, // The data in an Array object
            gl.STATIC_DRAW // We are not going to change this data, so it is static
        );

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize between 0 and 1
            const stride = 0; // how many bytes to get from one set of values to the next
            // Set stride to 0 to use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from

            // Set the information WebGL needs to read the buffer properly
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexUV,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            // Tell WebGL to use this attribute
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexUV);
        }

        // TODO: Create and populate a buffer for the UV coordinates

        return textureCoordBuffer;
    }
}

function initBitangentBuffer(gl, programInfo, bitangents) {
    if (bitangents != null && bitangents.length > 0) {
        // Create a buffer for the positions.
        const bitangentBuffer = gl.createBuffer();

        // Select the buffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, bitangentBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(
            gl.ARRAY_BUFFER, // The kind of buffer this is
            bitangents, // The data in an Array object
            gl.STATIC_DRAW // We are not going to change this data, so it is static
        );

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3;
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize between 0 and 1
            const stride = 0; // how many bytes to get from one set of values to the next
            // Set stride to 0 to use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from

            // Set the information WebGL needs to read the buffer properly
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexBitangent,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            // Tell WebGL to use this attribute
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexBitangent);
        }

        // TODO: Create and populate a buffer for the UV coordinates

        return bitangentBuffer;
    }
}

function initIndexBuffer(gl, elementArray) {

    // Create a buffer for the positions.
    const indexBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, // The kind of buffer this is
        elementArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    return indexBuffer;
}

function loadJSONFile(cb, filePath) {
    fetch(filePath)
        .then((data) => {
            return data.json();
        })
        .then((jData) => {
            cb(jData);
        })
        .catch((err) => {
            console.error(err);
        })
}

function getTextures(gl, imgPath) {
    let fullpath = "/materials/" + imgPath;
    if (imgPath) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255])); // red

        const image = new Image();

        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE,
                image
            );
        }

        image.src = fullpath;
        return texture;
    }
}

function parseOBJFileToJSON(objFileURL) {
    return new Promise((resolve, reject) => {
        fetch("/models/" + objFileURL)
            .then((data) => {
                return data.text();
            })
            .then((text) => {
                let mesh = OBJLoader.prototype.parse(text);
                resolve(mesh);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            })
    });
}

/**
 * 
 * @param {hex value of color} hex 
 */
function hexToRGB(hex) {
    let r = hex.substring(1, 3);
    let g = hex.substring(3, 5);
    let b = hex.substring(5, 7);
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);
    return [r / 255, g / 255, b / 255];
}

function parseSceneFile(file, state) {
    return new Promise((resolve, reject) => {
        state.lights = [];
        state.loadObjects = [];
        state.objects = [];

        fetch(file)
            .then((data) => {
                return data.json();
            })
            .then((jData) => {
                state.loadObjects = jData[0].objects;
                state.pointLights = jData[0].pointLights;
                state.settings = jData[0].settings;
                state.camera = state.settings.camera;
                state.camera.at = vec3.fromValues();
                state.camera.right = vec3.fromValues();
                vec3.subtract(state.camera.at, state.camera.atPoint, state.camera.position);
                vec3.normalize(state.camera.at, state.camera.at);
                vec3.cross(state.camera.right, state.camera.at, state.camera.up);
                vec3.normalize(state.camera.right, state.camera.right);
                state.numberOfObjectsToLoad = jData[0].objects.length;
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}

function addCube(object, state, vertShader = null, fragShader = null) {
    let tempCube = new Cube(state.gl, object);
    tempCube.vertShader = vertShader ? vertShader : state.vertShaderSample;
    tempCube.fragShader = fragShader ? fragShader : state.fragShaderSample;
    tempCube.setup();
    addObjectToScene(state, tempCube);
    return tempCube;
}

function addPlane(object, state, vertShader = null, fragShader = null) {
    let tempPlane = new Plane(state.gl, object);
    tempPlane.vertShader = vertShader ? vertShader : state.vertShaderSample;
    tempPlane.fragShader = fragShader ? fragShader : state.fragShaderSample;
    tempPlane.setup();
    addObjectToScene(state, tempPlane);
    return tempPlane;
}

function addCustom(object, state, vertShader = null, fragShader = null) {
    let tempObject = new CustomObject(state.gl, object);
    //tempObject.fragShader = fragShader ? fragShader : state.fragShaderSample;

    if (tempObject.name.includes("Glass")) {
        tempObject.fragShader = state.fragShaderGlass;
    }
    else {
        tempObject.fragShader = fragShader ? fragShader : state.fragShaderSample;
    }
    tempObject.vertShader = vertShader ? vertShader : state.vertShaderSample;
    tempObject.setup();
    addObjectToScene(state, tempObject);
    return tempObject;
}

function addRoom(object, state, vertShader = null, fragShader = state.fragShaderRooms) {
    let tempObject = new Room(state.gl, object);
    tempObject.vertShader = vertShader ? vertShader : state.vertShaderSample;
    tempObject.fragShader = fragShader ? fragShader : state.fragShaderRooms;
    tempObject.setup();
    addObjectToScene(state, tempObject);
    return tempObject;
}

function addHall(object, state, vertShader = null, fragShader = null) {
    let tempObject = new Hallway(state.gl, object);
    tempObject.vertShader = vertShader ? vertShader : state.vertShaderSample;
    tempObject.fragShader = fragShader ? fragShader : state.fragShaderSample;
    tempObject.setup();
    addObjectToScene(state, tempObject);
    return tempObject;
}

function addCorner(object, state, vertShader = null, fragShader = null) {
    let tempObject = new Corner(state.gl, object);
    tempObject.vertShader = vertShader ? vertShader : state.vertShaderSample;
    tempObject.fragShader = fragShader ? fragShader : state.fragShaderSample;
    tempObject.setup();
    addObjectToScene(state, tempObject);
    return tempObject;
}

async function addMesh(object, vertShader = null, fragShader = null) {
    if (state.meshCache[object.model]) { // a way to load the mesh faster by re-using model data
        const created = await createMesh(state.meshCache[object.model], object, vertShader, fragShader);
        return created;
    } else {
        const mesh = await parseOBJFileToJSON(object.model);
        state.meshCache[object.model] = mesh;
        const created = await createMesh(mesh, object, vertShader, fragShader);
        return created;
    }
}
