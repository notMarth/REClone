
class RenderObject {
  constructor(glContext, object) {
    this.gl = glContext;
    this.name = object.name;
    this.parent = object.parent;

    //UP AT AND RIGHT VECTORS FOR MOVEMENT//
    this.up = vec3.fromValues(0.0, 1.0, 0.0);
    this.right = vec3.fromValues(0.0, 0.0, 1.0);
    this.at = vec3.fromValues(-1.0, 0, 0.0);
    this.atPoint = vec3.fromValues(1.5, 0.0, 2.5);


    this.initialTransform = {
      position: object.position ? object.position : vec3.create(),
      scale: object.scale ? object.scale : vec3.fromValues(1, 1, 1),
      rotation: object.rotation ? object.rotation : mat4.create()
    };

    this.material = {
      diffuse: object.material && object.material.diffuse ? object.material.diffuse : vec3.fromValues(0.5, 0.5, 0.5),
      ambient: object.material && object.material.ambient ? object.material.ambient : vec3.fromValues(0.1, 0.1, 0.1),
      specular: object.material && object.material.specular ? object.material.specular : vec3.fromValues(0.5, 0.5, 0.5),
      alpha: object.material && object.material.alpha ? object.material.alpha : 1.0,
      n: object.material && object.material.n ? object.material.n : 1.0,
      shaderType: object.material && object.material.shaderType ? object.material.shaderType : 1
    };

    this.model = {
      position: vec3.fromValues(0.0, 0.0, 0.0),
      rotation: mat4.create(),
      scale: vec3.fromValues(1.0, 1.0, 1.0),
      diffuseTexture: object.diffuseTexture ? object.diffuseTexture : "default.png",
      normalTexture: object.normalTexture ? object.normalTexture : "defaultNorm.png",
      texture: object.diffuseTexture ? getTextures(glContext, object.diffuseTexture) : null,
      textureNorm: object.normalTexture ? getTextures(glContext, object.normalTexture) : null,
    };

    this.modelMatrix = mat4.create();
    this.lightingShader = this.lightingShader.bind(this);
  }

  rotate(axis, angle) {
    if (axis === 'x') {
      mat4.rotateX(this.model.rotation, this.model.rotation, angle)
    } else if (axis == 'y') {
      mat4.rotateY(this.model.rotation, this.model.rotation, angle);
    } else if (axis == 'z') {
      mat4.rotateZ(this.model.rotation, this.model.rotation, angle)
    }
  }

  //Custom method used only to rotate player
  //aligns the player's at vector with the new rotated orientation
  rotatePlayer(axis, angle) {
    if (axis === 'x') {
      mat4.rotateX(this.model.rotation, this.model.rotation, angle)
    } else if (axis == 'y') {
      mat4.rotate(this.model.rotation, this.model.rotation, angle, this.up);
      vec3.rotateY(this.at, this.at, this.up, angle);
      vec3.cross(this.right, this.at, this.up);
      vec3.normalize(this.at, this.at);
      vec3.normalize(this.right, this.right);
      vec3.add(this.atPoint, this.at, this.model.position);
    } else if (axis == 'z') {
      mat4.rotateZ(this.model.rotation, this.model.rotation, angle)
    }
  }

  translate(translateVec) {
    vec3.add(this.model.position, this.model.position, vec3.fromValues(translateVec[0], translateVec[1], translateVec[2]));
  }

  movePlayerForward(speed = 1){
    vec3.add(this.model.position, this.model.position, vec3.fromValues(this.at[0]*0.1*speed, this.at[1]*0.1*speed, this.at[2]*0.1*speed));
    vec3.add(this.atPoint, this.atPoint, vec3.fromValues(this.at[0]*0.1*speed, this.at[1]*0.1*speed, this.at[2]*0.1*speed));
    vec3.subtract(this.at, this.atPoint, this.model.position);
    vec3.normalize(this.at, this.at);
  }

  movePlayerBackward(speed = 1){
    vec3.add(this.model.position, this.model.position, vec3.fromValues(this.at[0]*-0.1*speed, this.at[1]*-0.1*speed, this.at[2]*-0.1*speed));
    vec3.add(this.atPoint, this.atPoint, vec3.fromValues(this.at[0]*-0.1*speed, this.at[1]*-0.1*speed, this.at[2]*-0.1*speed));
    vec3.subtract(this.at, this.atPoint, this.model.position);
    vec3.normalize(this.at, this.at);
  }

  movePlayerX(speed = 1){
    vec3.add(this.model.position, this.model.position, vec3.fromValues(this.at[0]*0.1*speed, 0, 0));
    vec3.add(this.atPoint, this.atPoint, vec3.fromValues(this.at[0]*0.1*speed, 0, 0));
    vec3.subtract(this.at, this.atPoint, this.model.position);
    vec3.normalize(this.at, this.at);
  }

  movePlayerZ(speed = 1){
    vec3.add(this.model.position, this.model.position, vec3.fromValues(0, 0, this.at[2]*0.1*speed));
    vec3.add(this.atPoint, this.atPoint, vec3.fromValues(0, 0, this.at[2]*0.1*speed));
    vec3.subtract(this.at, this.atPoint, this.model.position);
    vec3.normalize(this.at, this.at);
  }

  // Strafe right
  movePlayerRight(speed = 1) {
    vec3.add(this.model.position, this.model.position, vec3.fromValues(this.right[0]*0.1*speed, this.right[1]*0.1*speed, this.right[2]*0.1*speed));
    vec3.add(this.atPoint, this.atPoint, vec3.fromValues(this.right[0]*0.1*speed, this.right[1]*0.1*speed, this.right[2]*0.1*speed));
    vec3.subtract(this.at, this.atPoint, this.model.position);
    vec3.normalize(this.at, this.at);
  }

// Strafe left
movePlayerLeft(speed = 1) {
    vec3.add(this.model.position, this.model.position, vec3.fromValues(this.right[0]*-0.1*speed, this.right[1]*-0.1*speed, this.right[2]*-0.1*speed));
    vec3.add(this.atPoint, this.atPoint, vec3.fromValues(this.right[0]*-0.1*speed, this.right[1]*-0.1*speed, this.right[2]*-0.1*speed));
    vec3.subtract(this.at, this.atPoint, this.model.position);
    vec3.normalize(this.at, this.at);
}


  scale(scaleVec) {
    //model scale
    let xVal = this.model.scale[0];
    let yVal = this.model.scale[1];
    let zVal = this.model.scale[2];


    xVal *= scaleVec[0];
    yVal *= scaleVec[1];
    zVal *= scaleVec[2];

    this.model.scale = vec3.fromValues(xVal, yVal, zVal);
  }

  initBuffers() {
    //create vertices, normal and indicies arrays
    const positions = new Float32Array(this.model.vertices);
    const normals = new Float32Array(this.model.normals);
    const indices = new Uint16Array(this.model.triangles);

    const textureCoords = new Float32Array(this.model.uvs);
    var vertexArrayObject = this.gl.createVertexArray();
    this.gl.bindVertexArray(vertexArrayObject);

    this.buffers = {
      vao: vertexArrayObject,
      attributes: {
        position: initPositionAttribute(this.gl, this.programInfo, positions),
        normal: initNormalAttribute(this.gl, this.programInfo, normals),
        uv: initTextureCoords(this.gl, this.programInfo, textureCoords),
      },
      indicies: initIndexBuffer(this.gl, indices),
      numVertices: indices.length
    }
  }

  lightingShader() {
    //console.log(this.model.vertices)

    const shaderProgram = initShaderProgram(this.gl, this.vertShader, this.fragShader);
    // Collect all the info needed to use the shader program.
    const programInfo = {
      // The actual shader program
      program: shaderProgram,
      // The attribute locations. WebGL will use there to hook up the buffers to the shader program.
      // NOTE: it may be wise to check if these calls fail by seeing that the returned location is not -1.
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aPosition'),
        vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aNormal'),
        vertexUV: this.gl.getAttribLocation(shaderProgram, 'aUV'),
      },
      uniformLocations: {
        projection: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        view: this.gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
        model: this.gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
        // normalMatrix: this.gl.getUniformLocation(shaderProgram, 'normalMatrix'),
        diffuseVal: this.gl.getUniformLocation(shaderProgram, 'diffuseVal'),
        ambientVal: this.gl.getUniformLocation(shaderProgram, 'ambientVal'),
        specularVal: this.gl.getUniformLocation(shaderProgram, 'specularVal'),
        n: this.gl.getUniformLocation(shaderProgram, 'n'),
        cameraPosition: this.gl.getUniformLocation(shaderProgram, 'cameraPos'),
        numLights: this.gl.getUniformLocation(shaderProgram, 'numLights'),
        //lightPosition: this.gl.getUniformLocation(shaderProgram, 'lightPos'),
        //lightColour: this.gl.getUniformLocation(shaderProgram, 'lightColour'),
        //lightStrength: this.gl.getUniformLocation(shaderProgram, 'lightStrength'),
        sampler: this.gl.getUniformLocation(shaderProgram, 'uTexture'),
        samplerExists: this.gl.getUniformLocation(shaderProgram, "samplerExists"),
        alpha: this.gl.getUniformLocation(shaderProgram, 'alpha')
      },
    };
    shaderValuesErrorCheck(programInfo);
    this.programInfo = programInfo;
  }
}
