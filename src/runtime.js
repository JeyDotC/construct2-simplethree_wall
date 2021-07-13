/*
Copyright 2020 Jeysson Guevara (JeyDotC)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
    const BoxType = {
        Box: 0,
        VerticalPlane: 1,
        HorizontalPlane: 2,
    };

    const VerticalHotSpot = {
        Top: 0,
        Center: 1,
        Bottom: 2
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
        this.boxType = BoxType.VerticalBox;
    };

    const behinstProto = behaviorProto.Instance.prototype;

    function toVerticalHotspot(hotspotEnum) {
        switch (hotspotEnum) {
            case VerticalHotSpot.Top:
                return 0;
            case VerticalHotSpot.Center:
                return 0.5;
            case VerticalHotSpot.Bottom:
                return 1;
        }

        return 1;
    }

    function toAnisotropyValue(anisotropy, maxAnisotropy){
        switch (anisotropy){
            case 0: return Math.min(1, maxAnisotropy);
            case 1: return Math.min(2, maxAnisotropy);
            case 2: return Math.min(4, maxAnisotropy);
            case 3: return Math.min(8, maxAnisotropy);
            case 4: return Math.min(16, maxAnisotropy);
            case 5: return maxAnisotropy;
        }
        console.warn('Unknown value, returning default 1.');
        return 1;
    }

    const toMinificationFilter = (filter) => {
        switch (filter){
            case 0: return THREE.NearestFilter;
            case 1: return THREE.NearestMipmapNearestFilter;
            case 2: return THREE.NearestMipmapLinearFilter;
            case 3: return THREE.LinearFilter;
            case 4: return THREE.LinearMipmapNearestFilter;
            case 5: return THREE.LinearMipmapLinearFilter;
        }
    }

    function GeometrySpec(width, verticalHeight, depth, boxType) {
        this.width = width;
        this.verticalHeight = verticalHeight;
        this.depth = depth;
        this.boxType = boxType;
    }

    function createGeometry(geometrySpec) {
        const {width, verticalHeight, depth, boxType} = geometrySpec;

        switch (boxType) {
            case BoxType.Box:
                return new THREE.BoxGeometry(width, verticalHeight, depth);
            case BoxType.VerticalPlane:
                return new THREE.PlaneGeometry(width, verticalHeight);
            case BoxType.HorizontalPlane:
                return new THREE.PlaneGeometry(width, depth)
                    .rotateX(cr.to_radians(-90));
        }
    }

    function CubeStatus(behaviorInstance) {

        this.update = function () {
            this.width = behaviorInstance.inst.width;
            this.verticalHeight = behaviorInstance.verticalHeight;
            this.height = behaviorInstance.inst.height;
        };

        this.hasChanged = function () {
            return (
                this.width != behaviorInstance.inst.width ||
                this.verticalHeight != behaviorInstance.verticalHeight ||
                this.height != behaviorInstance.inst.height
            );
        };

        this.update();
    }

    behinstProto.findSimpleThreeInstance = function () {
        const simpleThreeInstances = Object.values(this.runtime.objectsByUid)
            .filter(instance => instance.plugin instanceof cr.plugins_.SimpleThree);

        if (simpleThreeInstances.length === 0) {
            return undefined;
        }

        return simpleThreeInstances[0];
    };


    behinstProto.onCreate = function () {
        this.verticalHeight = this.properties[0];
        this.verticalHotspot = toVerticalHotspot(this.properties[1]);
        this.elevation = this.properties[2];
        this.rotationX = cr.to_radians(this.properties[3]);
        this.rotationZ = cr.to_radians(this.properties[4]);
        this.boxType = this.properties[5];
        this.render2D = this.properties[7] === 1;
        this.magnificationFilter = this.properties[8] === 0 ? THREE.LinearFilter : THREE.NearestFilter;
        this.minificationFilter = toMinificationFilter(this.properties[9]);

        if(!this.render2D){
            this.inst.drawGL = this.inst.drawGL_earlyZPass = this.inst.draw = () => {};
        }

        if(this.boxType === BoxType.HorizontalPlane){
            this.verticalHeight = 0;
        }

        this.cubeStatus = new CubeStatus(this);

        this.pivot = new THREE.Group();
        this.simpleThree = this.findSimpleThreeInstance();
        this.pixelsTo3DUnits = v => v;

        if (this.simpleThree === undefined) {
            console.warn('No simpleThree Object found. If it exists in this layout and you see this message, try moving the SimpleThree object to the bottom of the layer.');
            return;
        }

        const anisotropy = this.anisotropy = toAnisotropyValue(this.properties[6], this.simpleThree.renderer.getMaxAnisotropy());

        this.pixelsTo3DUnits = this.simpleThree.pixelsTo3DUnits.bind(this.simpleThree);

        const width3D = this.pixelsTo3DUnits(this.inst.width);
        const verticalHeight3D = this.pixelsTo3DUnits(this.verticalHeight);
        const depth3D = this.pixelsTo3DUnits(this.inst.height);

        const geometrySpec = new GeometrySpec(width3D, verticalHeight3D, depth3D, this.boxType);

        const geometry = createGeometry(geometrySpec);

        const isBox = this.boxType === BoxType.Box;
        const textureFile = this.inst.type.texture_file;

        let material = undefined;
        const onTextureLoad = () => {
            this.simpleThree.runtime.redraw = true;
        };

        const textureSettings = {
            textureFile,
            isBox,
            opacity: this.inst.opacity,
            anisotropy,
            onLoad: onTextureLoad,
            magnificationFilter: this.magnificationFilter,
            minificationFilter: this.minificationFilter,
        };

        const frontBack = createMaterial({
            ...textureSettings,
            repeats: this.frontBackRepeats(),
        });
        const topBottom = createMaterial({
            ...textureSettings,
            repeats: this.topBottomRepeats(),
        });
        const leftRight = createMaterial({
            ...textureSettings,
            repeats: this.leftRightRepeats(),
        });

        if (isBox) {
            material = [
                leftRight,
                leftRight,
                topBottom,
                topBottom,
                frontBack,
                frontBack,
            ];
        } else {
            material = this.boxType === BoxType.VerticalPlane ? frontBack : topBottom;
        }

        this.box = new THREE.Mesh(geometry, material);

        this.box.position.y = this.pixelsTo3DUnits((this.verticalHotspot - 0.5) * this.verticalHeight);

        if (this.inst.hasOwnProperty('hotspotX')) {
            this.box.position.x = this.pixelsTo3DUnits((0.5 - this.inst.hotspotX) * this.inst.width);
        }
        if (this.inst.hasOwnProperty('hotspotY')) {
            this.box.position.z = this.pixelsTo3DUnits((0.5 - this.inst.hotspotY) * this.inst.height);
        }

        this.pivot.add(this.box);
        this.pivot.rotation.order = 'YXZ';
        this.updatePivot();

        this.simpleThree.scene.add(this.pivot);
    };

    behinstProto.updatePivot = function () {
        this.pivot.position.set(
            this.pixelsTo3DUnits(this.inst.x),
            this.pixelsTo3DUnits(this.elevation),
            this.pixelsTo3DUnits(this.inst.y)
        );
        this.pivot.rotation.set(
            -this.rotationX,
            -this.inst.angle,
            -this.rotationZ
        );
    };

    behinstProto.updateGeometry = function () {
        if (!this.box) {
            return;
        }
        const width3D = this.pixelsTo3DUnits(this.inst.width);
        const verticalHeight3D = this.pixelsTo3DUnits(this.verticalHeight);
        const depth3D = this.pixelsTo3DUnits(this.inst.height);

        const geometrySpec = new GeometrySpec(width3D, verticalHeight3D, depth3D, this.boxType);

        this.box.geometry = createGeometry(geometrySpec);
    };

    function createMaterial({textureFile, repeats, isBox, opacity, anisotropy, onLoad, minificationFilter, magnificationFilter}) {
        const [repeatVertical, repeatHorizontal] = repeats;
        const texture = new THREE.TextureLoader().load(textureFile, onLoad);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = anisotropy;
        texture.magFilter = magnificationFilter;
        texture.minFilter = minificationFilter;

        texture.repeat.set(repeatVertical, repeatHorizontal);
        const side = isBox ? THREE.FrontSide : THREE.DoubleSide;

        return new THREE.MeshStandardMaterial({
            map: texture,
            side: side,
            transparent: !isBox,
            alphaTest: isBox ? 0 : 0.5,
            opacity,
        });
    }

    behinstProto.frontBackRepeats = function () {
        return [
            this.inst.width / this.inst.type.texture_img.width,
            this.verticalHeight / this.inst.type.texture_img.height
        ];
    };

    behinstProto.topBottomRepeats = function () {
        return [
            this.inst.width / this.inst.type.texture_img.width,
            this.inst.height / this.inst.type.texture_img.height
        ];
    };

    behinstProto.leftRightRepeats = function () {
        return [
            this.inst.height / this.inst.type.texture_img.width,
            this.verticalHeight / this.inst.type.texture_img.height
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
        return {
            "vh": this.verticalHeight,
            "e": this.elevation,
            "rx": this.rotationX,
            "rz": this.rotationZ,
        };
    };

    // called when loading the full state of the game
    behinstProto.loadFromJSON = function (o) {
        this.verticalHeight = o["vh"];
        this.elevation = o["e"];
        this.rotationX = o["rx"];
        this.rotationZ = o["rz"];
    };

    behinstProto.tick = function () {
        const dt = this.runtime.getDt(this.inst);
        // called every tick for you to update this.inst as necessary
        if (this.cubeStatus.hasChanged()) {
            this.cubeStatus.update();
            this.updateGeometry();
        }
        this.updatePivot();
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
                {"name": "Vertical Height", "value": this.verticalHeight},
                {"name": "Elevation", "value": this.elevation},
                {"name": "Rotation X", "value": cr.to_degrees(this.rotationX)},
                {"name": "Rotation Z", "value": cr.to_degrees(this.rotationZ)},
            ]
        });
    };

    behinstProto.onDebugValueEdited = function (header, name, value) {
        const acts = this.behavior.acts;
        switch (name) {
            case "Vertical Height":
                acts.SetVerticalHeightFrom2D.bind(this)(value);
                break;
            case "Elevation"      :
                acts.SetElevationFrom2D.bind(this)(value);
                break;
            case "Rotation X"     :
                acts.SetRotationXFrom2D.bind(this)(value);
                break;
            case "Rotation Z"     :
                acts.SetRotationZFrom2D.bind(this)(value);
                break;
        }
    };

    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {
    }

    // Conditions here ...
    Cnds.prototype.CompareVerticalHeight = function (cmp, value) {
        return cr.do_cmp(this.verticalHeight, cmp, value);
    };

    Cnds.prototype.CompareElevation = function (cmp, value) {
        return cr.do_cmp(this.elevation, cmp, value);
    };

    Cnds.prototype.CompareRotationX = function (cmp, value) {
        return cr.do_cmp(this.rotationX, cmp, cr.to_radians(value));
    };

    Cnds.prototype.CompareRotationZ = function (cmp, value) {
        return cr.do_cmp(this.rotationZ, cmp, cr.to_radians(value));
    };

    behaviorProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {
    }

    Acts.prototype.SetVerticalHeightFrom2D = function (verticalHeight) {
        this.verticalHeight = verticalHeight;
    };

    Acts.prototype.SetElevationFrom2D = function (elevation) {
        this.elevation = elevation;
    };

    Acts.prototype.SetRotationXFrom2D = function (angle) {
        this.rotationX = cr.to_radians(angle);
    };

    Acts.prototype.SetRotationZFrom2D = function (angle) {
        this.rotationZ = cr.to_radians(angle);
    };

    // Actions here ...

    behaviorProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {
    }

    Exps.prototype.VerticalHeight = function (ret) {
        ret.set_float(this.verticalHeight);
    };

    Exps.prototype.Elevation = function (ret) {
        ret.set_float(this.elevation);
    };

    Exps.prototype.RotationX = function (ret) {
        ret.set_float(cr.to_degrees(this.rotationX));
    };

    Exps.prototype.RotationZ = function (ret) {
        ret.set_float(cr.to_degrees(this.rotationZ));
    };

    // Expressions here ...

    behaviorProto.exps = new Exps();

}());