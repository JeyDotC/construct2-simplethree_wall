// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.SimpleThree_Wall = function (runtime) {
    this.runtime = runtime;
};

(function () {
    const TextureRepeatMode = {
        ForWall: 0,
        ForRoof: 1
    };

    const behaviorProto = cr.behaviors.SimpleThree_Wall.prototype;

    /////////////////////////////////////
    // Behavior type class
    behaviorProto.Type = function (behavior, objtype) {
        this.behavior = behavior;
        this.objtype = objtype;
        this.runtime = behavior.runtime;

        this.simpleThree = undefined;
    };

    const behtypeProto = behaviorProto.Type.prototype;

    behtypeProto.onCreate = function () {

    };

    /////////////////////////////////////
    // Behavior instance class
    behaviorProto.Instance = function (type, inst) {
        this.type = type;
        this.behavior = type.behavior;
        this.inst = inst;				// associated object instance to modify
        this.runtime = type.runtime;

        this.verticalHeight = 32;
        this.verticalHotspot = 1;
        this.elevation = 0;
        this.rotationX = 0;
        this.rotationZ = 0;
        this.textureRepeat = TextureRepeatMode.ForWall;
    };

    const behinstProto = behaviorProto.Instance.prototype;

    function toVerticalHotspot(hotspotEnum) {
        switch (hotspotEnum) {
            case 0:
                return 0;
            case 1:
                return 0.5;
            case 2:
                return 1;
        }

        return 1;
    }

    function GeometrySpec(width, verticalHeight, depth) {
        this.width = width;
        this.verticalHeight = verticalHeight;
        this.depth = depth;

        const byWidth = this.width === 0;
        const byDepth = this.depth === 0;
        const byVerticalHeight = this.verticalHeight === 0;

        this.planeSpec = {
            byWidth,
            byDepth,
            byVerticalHeight,

            isPlane: (byWidth || byDepth || byVerticalHeight),
            isLine: [byWidth, byDepth, byVerticalHeight].filter(x => x).length > 1,
        }
    }

    function createGeometry(geometrySpec) {
        const planeSpec = geometrySpec.planeSpec;
        const {width, verticalHeight, depth} = geometrySpec;

        if (!planeSpec.isPlane) {
            return new THREE.BoxGeometry(width, verticalHeight, depth);
        }

        if (planeSpec.byWidth) {
            return new THREE.PlaneGeometry(depth, verticalHeight)
                .rotateY(cr.to_radians(-90));
        }

        if (planeSpec.byDepth) {
            return new THREE.PlaneGeometry(width, verticalHeight);
        }

        if (planeSpec.byVerticalHeight) {
            return new THREE.PlaneGeometry(width, depth)
                .rotateX(cr.to_radians(-90));
        }
    }

    behinstProto.onCreate = function () {
        this.verticalHeight = this.properties[0];
        this.verticalHotspot = toVerticalHotspot(this.properties[1]);
        this.elevation = this.properties[2];
        this.rotationX = cr.to_radians(this.properties[3]);
        this.rotationZ = cr.to_radians(this.properties[4]);
        this.textureRepeat = this.properties[5];

        const simpleThreeInstances = Object.values(this.runtime.objectsByUid)
            .filter(instance => instance.plugin instanceof cr.plugins_.SimpleThree);

        if (simpleThreeInstances.length === 0) {
            console.warn('No simpleThree Object found');
            return;
        }

        this.simpleThree = simpleThreeInstances[0];
        console.log(this);
        const pixelsTo3DUnits = this.simpleThree.pixelsTo3DUnits.bind(this.simpleThree);

        const width3D = pixelsTo3DUnits(this.inst.width);
        const verticalHeight3D = pixelsTo3DUnits(this.verticalHeight);
        const depth3D = pixelsTo3DUnits(this.inst.height);
        const geometrySpec = new GeometrySpec(width3D, verticalHeight3D, depth3D);

        if (geometrySpec.planeSpec.isLine) {
            console.warn("This object has more than one dimension set to 0, it won't be processed.");
            return;
        }

        const geometry = createGeometry(geometrySpec);

        geometry.rotateY(-this.inst.angle);
        geometry.rotateX(-this.rotationX);
        geometry.rotateZ(-this.rotationZ);

        let box2DX = this.inst.x;
        let box2DY = this.inst.y;
        let box2DElevation = this.elevation + (this.verticalHotspot - 0.5) * this.verticalHeight;

        if (this.inst.hasOwnProperty('hotspotX')) {
            box2DX = box2DX + (0.5 - this.inst.hotspotX) * this.inst.width;
        }
        if (this.inst.hasOwnProperty('hotspotY')) {
            box2DY = box2DY + (0.5 - this.inst.hotspotY) * this.inst.height;
        }

        geometry.translate(
            pixelsTo3DUnits(box2DX),
            pixelsTo3DUnits(box2DElevation),
            pixelsTo3DUnits(box2DY)
        );

        const texture = new THREE.TextureLoader().load(this.inst.type.texture_file);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const [repeatVertical, repeatHorizontal] = this.calculateRepeats();

        texture.repeat.set(repeatVertical, repeatHorizontal);

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

        const box = new THREE.Mesh(geometry, material);

        this.simpleThree.scene.add(box);
    };

    behinstProto.calculateRepeats = function () {
        if (this.textureRepeat === TextureRepeatMode.ForWall) {
            return [
                this.inst.width / this.inst.type.texture_img.width,
                this.verticalHeight / this.inst.type.texture_img.height
            ];
        }

        return [
            this.inst.width / this.inst.type.texture_img.width,
            this.inst.height / this.inst.type.texture_img.height
        ];
    };

    behinstProto.onDestroy = function () {
        // called when associated object is being destroyed
        // note runtime may keep the object and behavior alive after this call for recycling;
        // release, recycle or reset any references here as necessary
    };

    // called when saving the full state of the game
    behinstProto.saveToJSON = function () {
        // return a Javascript object containing information about your behavior's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        return {};
    };

    // called when loading the full state of the game
    behinstProto.loadFromJSON = function (o) {
        // load from the state previously saved by saveToJSON
        // 'o' provides the same object that you saved, e.g.
        // this.myValue = o["myValue"];
        // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
        // Closure Compiler renaming and breaking the save format
    };

    behinstProto.tick = function () {
        const dt = this.runtime.getDt(this.inst);

        // called every tick for you to update this.inst as necessary
        // dt is the amount of time passed since the last tick, in case it's a movement
    };

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    behinstProto.getDebuggerValues = function (propsections) {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.
        propsections.push({
            "title": this.type.name,
            "properties": [
                // Each property entry can use the following values:
                // "name" (required): name of the property (must be unique within this section)
                // "value" (required): a boolean, number or string for the value
                // "html" (optional, default false): set to true to interpret the name and value
                //									 as HTML strings rather than simple plain text
                // "readonly" (optional, default false): set to true to disable editing the property
            ]
        });
    };

    behinstProto.onDebugValueEdited = function (header, name, value) {
        // Called when a non-readonly property has been edited in the debugger. Usually you only
        // will need 'name' (the property name) and 'value', but you can also use 'header' (the
        // header title for the section) to distinguish properties with the same name.
        if (name === "Name")
            this.name = value;

        if (name === "Tags")
            this.tags = value.split(',');
    };

    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {
    }

    // Conditions here ...

    behaviorProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {
    }

    // Actions here ...

    behaviorProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {
    }

    // Expressions here ...

    behaviorProto.exps = new Exps();

}());