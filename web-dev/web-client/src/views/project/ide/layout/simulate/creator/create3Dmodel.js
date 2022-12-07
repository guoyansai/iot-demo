import { ElMessage } from 'element-plus'
import collect from "collect.js";
//three.js依赖
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // gltf加载器
import Stats from "three/examples/jsm/libs/stats.module";
import { TransformControls } from "../utils/TransformControls.js"
// 自定义方法
import createArrow from "./createArrow.js";
import createSprite from "./createSprite.js";
import createPoint from "./createPoint.js";
import { empty, fixedNumber, isAllEqual } from "../utils/util.js";


/******
 * 创建three.js 模型
 * @param parameters.container 当前加载模型的id
 * @param parameters.config 当前配置模型文件的数据
 * @param parameters.visualTrace 已经存在的轨迹数据
 * @param parameters.handlerPointMove 当轨迹点移动时触发的回调
 * @param parameters.handlerPointRotate 当轨迹点旋转时触发的回调 
 */
export default class CreateModel{
    constructor(parameters){
        var modelId = parameters.hasOwnProperty("container") ? parameters["container"] : null;
        this.config = parameters.hasOwnProperty("config") ? parameters["config"] : null;
        this.visualTrace = parameters.hasOwnProperty("visualTrace") ? parameters["visualTrace"] : null;
        this.handlerPointMove = parameters.hasOwnProperty("handlerPointMove") ? parameters["handlerPointMove"] : null;
        this.handlerPointRotate = parameters.hasOwnProperty("handlerPointRotate") ? parameters["handlerPointRotate"] : null;

        if(!this.config){
            ElMessage.error('未找到配置文件，无法渲染模型！');
            return;
        }
        if(modelId){
            this.container = document.querySelector("#" + modelId);
        }else{
            this.container = document.querySelector('body');
        }
        this.initVariables();
        this.initScene(); 
        this.loadModelGltf(this.config.modelPath); 
        this.run(); 
    }
    /****
     * 初始化 全局变量的值
     * ***/
    initVariables() {
        this.positionsCache = {};
        this.forceUpdate = false;
        this.scrollTimer = null;
        this.pointIDs = [];
        this.isDoRender = null; 

        this.controls = null; 
        this.scene = null; 
        this.camera = null; 
        this.renderer = null; 
        this.camTarget = null;
        this.status = null; 
        this.envMap = null;
        this.axisHelper = null; 
        this.testPattern = null;
        this.pointList = [];
        this.pointControl = null; 
        this.modelratio = null;
    }
    /****
     * 初始化 THREE Scene 场景
     * 设置的都是默认的参数
     * ****/
    initScene() {
        //初始化一个场景容器
        this.scene = new THREE.Scene();

        //设置渲染器参数
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio ); 
        this.renderer.setClearColor( 0xbbbbbb );
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding; 

        //初始化一个基础相机
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            50
        );
        try {
            this.camTarget = new THREE.Vector3( 
                this.config.cameraLookAt.x,
                this.config.cameraLookAt.y,
                this.config.cameraLookAt.z
            );
        } catch (err) {
            this.camTarget = new THREE.Vector3(0.0, 0.0, 0.0);
        }
        try {
            this.camera.position.x = this.config.cameraPosition.x;
            this.camera.position.y = this.config.cameraPosition.y;
            this.camera.position.z = this.config.cameraPosition.z;
        } catch (err) {
            this.camera.position.x = -1.0;
            this.camera.position.y = 5.0;
            this.camera.position.z = 1.5;
        }
        this.camera.lookAt(this.camTarget);

        // // 如果在项目中包含traceLine参数，就初始化一条连续的线对象为后期做准备
        // if ('traceLine' in config) {
        //       lineVertices = []
        //       line_material = new THREE.LineBasicMaterial({ color: 0x283449 }) //构建了基础线条材质
        //       line_geometry = new THREE.BufferGeometry()
        //       line = new THREE.Line(line_geometry, line_material)
        // }

        this.initLight(); 
        this.addEventListeners(); 
        this.container.appendChild(this.renderer.domElement);
    }
    /*******
     * 初始化 灯光的默认配置
     */
    initLight() {
        // 模拟户外的自然光线 半球光
        let hemi = new THREE.HemisphereLight(0xffffff, 0x666666);
        hemi.intensity = 1.0;
        if ("hemisphereLight" in this.config) {
            if ("intensity" in this.config.hemisphereLight) {
                hemi.intensity = this.config.hemisphereLight.intensity;
            }
        }
        this.scene.add(hemi);

        // 聚光灯，用于体现模型的光泽和投影
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.castShadow = true;
        spotLight.position.x = 0.0;
        spotLight.position.y = 0.0;
        spotLight.position.z = 15.0;
        spotLight.intensity = 0.2;
        spotLight.angle = 1.0;
        spotLight.penumbra = 1.5;
        spotLight.shadow.mapSize.width = 1024 * 2;
        spotLight.shadow.mapSize.height = 1024 * 2;
        spotLight.shadow.bias = 0.001;
        if ("spotLight" in this.config) {
            const configSpotlight = this.config.spotLight;
            if ("x" in configSpotlight) {
                spotLight.position.x = configSpotlight.x;
            }
            if ("y" in configSpotlight) {
                spotLight.position.y = configSpotlight.y;
            }
            if ("z" in configSpotlight) {
                spotLight.position.z = configSpotlight.z;
            }
            if ("intensity" in configSpotlight) {
                spotLight.intensity = configSpotlight.intensity;
            }
            if ("angle" in configSpotlight) {
                spotLight.angle = configSpotlight.angle;
            }
            if ("penumbra" in configSpotlight) {
                spotLight.penumbra = configSpotlight.penumbra;
            }
            if ("castShadow" in configSpotlight) {
                spotLight.castShadow = configSpotlight.castShadow;
            }
        }
        this.scene.add(spotLight);
    }
    /****
     * 方法 设置监听鼠标事件
     * ？设置节流阀
     * ***/
    addEventListeners() {
        this.renderer.domElement.addEventListener("mousedown", this.onDocumentMouseDown, true);
        this.renderer.domElement.addEventListener("mouseup", this.onDocumentMouseUp, true);
        this.renderer.domElement.addEventListener("wheel", this.onDocumentWheel, true);
    }
    /*******
     * 方法 移除事件监听
     * ******/
    removeEventListeners() {
        if (this.renderer) {
            return;
        }
        this.renderer.domElement.removeEventListener("mousedown", this.onDocumentMouseDown, true);
        this.renderer.domElement.removeEventListener("mouseup", this.onDocumentMouseUp, true);
        this.renderer.domElement.removeEventListener("wheel", this.onDocumentWheel, true);
    }
    /****
     * 监听 鼠标按下事件
     */
    onDocumentMouseDown() {
        this.forceUpdate = true;
    }
    /****
     * 监听 鼠标抬起事件
     */
    onDocumentMouseUp() {
        this.forceUpdate = false;
    }
    /***
     * 监听 鼠标滚动事件
     */
    onDocumentWheel() {
        clearTimeout(this.scrollTimer);
        this.forceUpdate = true;
        this.scrollTimer = null;

        this.scrollTimer = setTimeout(() => {
            this.forceUpdate = false;
        }, 250);
    }
    /***
     * 方法 加载模型
     * @param path 当前模型的获取路径
     * ***/
    loadModelGltf(path) {
        var loader = new GLTFLoader();

        loader.load(path, (gltf) => {
            let obj = gltf.scene; 
            obj.castShadow = false; 
            obj.receiveShadow = false; 
            this.scene.add(obj);
            
            this.configureEnvironmentMap(); 
            this.configureCamera(); 
            this.configureOrbitControls(); 
            this.configureSceneObjects(); 
            this.calcRatio();
        });
    }
    /****
     * 方法 计算模型坐标和实际模型坐标换算的比率
     */
    calcRatio() {
        let modelValue = this.config.modelValue;
        var ratio;
        var ratioList = [];

        if(modelValue.length <= 0){
            ElMessage.error('配置文件错误！');
            return;
        }
        for(let i=0; i<modelValue.length; i++){
            var tempObj = this.scene.getObjectByName(modelValue[i].name);
            var worldPosition = new THREE.Vector3();
            tempObj.getWorldPosition(worldPosition);

            var tempList = [];
            tempList.push(modelValue[i].coordinate.x/worldPosition.x);
            tempList.push(modelValue[i].coordinate.y/worldPosition.y);
            tempList.push(modelValue[i].coordinate.z/worldPosition.z);
            for(let n=0; n<tempList.length; n++){
                tempList[n] = fixedNumber(tempList[n]);
                if(tempList[n] == 0 || !tempList[n]){
                    tempList.splice(n, 1);
                    n--;
                }
            }
            if(isAllEqual(tempList)){
                ratioList.push(tempList[0]);
            }
        }
        if(isAllEqual(ratioList)){
            ratio = ratioList[0];
        }

        this.modelratio = ratio;
    }
    /*****
     * 方法 配置环境贴图
     * 创建一个由6张图片所组成的纹理对象
     */
    configureEnvironmentMap() {
        try {
            // 设置环境贴图直接将环境图粘贴过来
            const path = "/images/";
            const format = ".png";
            const urls = [
                path + "px" + format,
                path + "nx" + format,
                path + "py" + format,
                path + "ny" + format,
                path + "pz" + format,
                path + "nz" + format,
            ];
            this.envMap = new THREE.CubeTextureLoader().load(urls); 
            this.envMap.format = THREE.RGBAFormat;
            this.envMap.minFilter = THREE.NearestFilter;
        } catch (e) {
            ElMessage.error("当前未正确获取到环境图片！");
        }
    }
    /****
     * 方法 配置相机数据
     */
    configureCamera() {
        try {
            var cam = this.scene.getObjectByName('Camera');
            if (cam instanceof THREE.Camera) {
                
                this.camera = cam;
            } else {
                ElMessage.error('获取相机数据错误！');
            }
        } catch (err) {
            ElMessage.error('当前未获取到相机数据！');
        }

        this.camera.up.set(0, 0, 1);
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix(); 
    }
    /****
     * 初始化相机轨道控制器
     * 可以使用鼠标 使相机围绕目标进行轨道运动
     */
    configureOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false; 
        this.controls.enableDamping = true; 
        this.controls.minDistance = 1; 
        this.controls.maxDistance = 10;
        this.controls.minPolarAngle = 0; 
        this.controls.maxPolarAngle = Math.PI;
        this.controls.target = this.camTarget;
        this.controls.screenSpacePanning = true; 
        this.controls.update();
    }

    /****
     * 配置场景中的每个零件对象
     */
    configureSceneObjects() {
        for (var i in this.config["objects"]) {
            var obj = this.config["objects"][i];
            var scnobj = this.scene.getObjectByName(obj["name"]);
            if (typeof scnobj !== "undefined") {
            let receiveShadow = obj.receiveShadow == true;
            let castShadow = obj.castShadow == true; // defaults to false if undefined
            let addEnvMap = obj.addEnvironmentMap;
            scnobj.traverse((child) => {
                if (child.hasOwnProperty("material")) {
                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material];
                    materials.forEach((material) => {
                        if (typeof addEnvMap !== "undefined") {
                        if (addEnvMap) {
                            // material.envMap = envMap
                        } else {
                            material.envMap = null;
                        }
                            material.needsUpdate = true;
                        }
                    });
                }
                if (child.hasOwnProperty("receiveShadow")) {
                    child.receiveShadow = receiveShadow;
                }
                if (child.hasOwnProperty("castShadow")) {
                    child.castShadow = castShadow;
                }
            });
            }
        }
    }
    /******
     * 整合数据
     * 从config的数据中获取到link相关的数据
     * @return returnVal 一个包含了机器可变关节数据的数组
     */
    getRobotLinkValues() {
        var returnVal = [];
        if ("objects" in config) {
            for (var i in config.objects) {
            const configObject = config.objects[i];
            const sceneObject = scene.getObjectByName(configObject.name);

            if (sceneObject) {
                //当前的link如果是数组
                if ("links" in configObject) {
                for (var j in configObject.links) {
                    const linkObject = config.objects[i].links[j];
                    let value = linkObject.value ? linkObject.value : null;
                    const channel = linkObject.channel ? linkObject.channel : 0;
                    const gain = linkObject.gain ? linkObject.gain : 1;
                    const offset = linkObject.offset ? linkObject.offset : 0;
                    returnVal.push({
                    name: configObject.name,
                    // value,
                    displayValue: value * gain + offset,
                    configObject: linkObject,
                    });
                }
                }
                //当前的link如果只是个对象
                if ("link" in configObject) {
                let value = configObject.value ? configObject.value : null;
                const channel = configObject.channel ? configObject.channel : 0;
                const gain = configObject.gain ? configObject.gain : 1;
                const offset = configObject.offset ? configObject.offset : 0;
                returnVal.push({
                    name: configObject.name,
                    // value,
                    displayValue: value * gain + offset,
                    configObject: configObject,
                });
                }
            }
            }
        }
        return returnVal;
    }
    /*********
     * 更新机器状态
     * 从 getRobotLinkValues处获取到数据，然后使用
     * **** */
    robotLinksUpdate() {
        // if (empty(this.subscriptionMessages)) {
        //     return
        // }

        // getRobotLinkValues().forEach(({ name, configObject, displayValue, value }) => {
        //       const sceneObject = scene.getObjectByName(name)
        //       console.log(configObject, sceneObject, displayValue, "configObject, sceneObject, displayValue");
        //       updateSceneObject(configObject, sceneObject, displayValue)
        //       positionsCache[name] = value
        // })

        getRobotLinkValues().forEach(({ name, configObject, displayValue }) => {
            const sceneObject = scene.getObjectByName(name);
            updateSceneObject(configObject, sceneObject, displayValue);
        });
    }
    /***
     * 从模型对应的json文件中traceLine 和 objects中获取路径数据
     * 路径数据都与 Motorcortex Desk中展示的文件夹数据相关
     * ***/
    defineSubscriptionPaths() {
        var subscriptionPaths = collect(config.traceLine)
            .filter((object) => object.hasOwnProperty("link"))
            .map((object) => object.link)
            .unique()
            .toArray();

        const linkobjects = collect(config.objects).filter((object) =>
            object.hasOwnProperty("link")
        );
        linkobjects.each((object) => {
            subscriptionPaths.push(object.link);
        });

        const linksobjects = collect(config.objects).filter((object) =>
            object.hasOwnProperty("links")
        );
        linksobjects.each((object) => {
            var Links = collect(object.links).filter((object) =>
            object.hasOwnProperty("link")
            );
            Links.each((item) => {
            subscriptionPaths.push(item.link);
            });
        });
        subscriptionPaths = collect(subscriptionPaths).unique().toArray();
    }



    /*****
     * API 操控当前轴进行运动
     * @param dir 当前轴的运动的方式方向
     * @param name 当前轴的名称
     * @param val 当前轴运动的值
     */
    changeTheObject(dir, name, val){
        var currentPiece = this.scene.getObjectByName(name);
	    this.updateSceneObject(dir, currentPiece, val);
    }
    /*****
     * 方法 更新模型的展示状态
     * @param configObject 当前从config中获取到的一些轴运动的数据对象
     * @param sceneObject 在场景中拿到的零件对象
     * @param value 具体运动的值
     */
    updateSceneObject(configObject, sceneObject, value) {
        switch (configObject.axis) {
            case "x":
                sceneObject.position.x = value;
                break;
            case "y":
                sceneObject.position.y = value;
                break;
            case "z":
                sceneObject.position.z = value;
                break;
            case "rx":
                sceneObject.rotation.order = "ZYX";
                sceneObject.rotation.x = value;
                break;
            case "ry":
                sceneObject.rotation.order = "ZYX";
                sceneObject.rotation.y = value;
                break;
            case "rz":
                sceneObject.rotation.order = "ZYX";
                sceneObject.rotation.z = value;
                break;
            case "s":
                sceneObject.scale.x = value;
                sceneObject.scale.y = value;
                sceneObject.scale.z = value;
                break;
            case "sx":
                sceneObject.scale.x = value;
                break;
            case "sy":
                sceneObject.scale.y = value;
                break;
            case "sz":
                sceneObject.scale.z = value;
                break;
            case "visible":
                sceneObject.traverse((child) => {
                    child.visible = Boolean(value);
                });
                break;
            case "opacity":
                sceneObject.traverse((child) => {
                    if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.side = THREE.FrontSide;
                    if (Number(value) < 1.0) {
                        child.material.transparent = true;
                    } else {
                        child.material.transparent = false;
                    }
                    child.material.opacity = Number(value);
                    child.visible = !(value <= 0.001);
                    }
                });
                break;
        }
    }
    /***
     * 方法 绘制一个路径点
     */
    drawAPoint(){
        let box = new THREE.Box3().setFromObject( this.scene.getObjectByName("Link6") );
        const helper = new THREE.Box3Helper( box, 0xffff00 ); 
        this.scene.add( helper );
        let endPosition = box.getCenter(new THREE.Vector3());
        let positionX = endPosition.x;
        let positionY = endPosition.y;
        let positionZ = endPosition.z;
        let tempContent = "point"+ (this.pointList.length+1); 

        // 初始化一个小球
        let tempPoint = createPoint({
                position: {
                    x: positionX,
                    y: positionY,
                    z: positionZ
                },
                content: tempContent
            });

        this.displayObj(tempPoint.children[1], false);
        this.scene.add(tempPoint);

        this.pointList.push(tempPoint);

        if(!this.pointControl){
            this.initPointControl();
        }
    }
    /****
     * API 获取到当前所有路径小球的数据
     */
    getPointsInfo(){
        return this.pointList;
    }
    /****
     * 初始化 路径点控制器
     */
    initPointControl(){
        let self = this;
        this.pointControl = new TransformControls( this.camera, this.renderer.domElement );
        this.scene.add( this.pointControl );

        // 拖动小球，鼠标抬起后的事件
        this.pointControl.addEventListener("dragging-changed", function (event) {
            self.controls.enabled = !event.value;
        });
        // 当前轨迹点移动并且数据产生变化时触发的事件
        this.pointControl.addEventListener("objectChange", function () {
            let tempMotion;
            
            if( self.pointControl.getMode()=='translate'){
                tempMotion = self.pointControl.object.position;
                self.handlerPointMove({
                    x: self.conversionModel(tempMotion.x),
                    y: self.conversionModel(tempMotion.y),
                    z: self.conversionModel(tempMotion.z)
                });
            }else{
                tempMotion = self.pointControl.object.rotation;
                self.handlerPointRotate({
                    x: self.conversionDeg(tempMotion.x),
                    y: self.conversionDeg(tempMotion.y),
                    z: self.conversionDeg(tempMotion.z)
                });
            }
        });
        // 当前控制器的模式产生改变的时候
        this.pointControl.addEventListener("mode-changed", function(event) {
            var currentMode = event.value;
            if(currentMode == "rotate"){
                self.displayObj(self.pointControl.object.children[1], true);
            }else{
                self.displayObj(self.pointControl.object.children[1], false);
            }
        });
    }
    /*****
     * API 设置路径点控制器当前是显示还是隐藏
     * @param displayFlag ture显示 false隐藏
     * @param label 路径点的名称
     */
    setPointControl(parameters){ 
        var self = this;
        if( parameters.displayFlag ){
            var tempPoint = this.scene.getObjectByName( parameters.label );
            this.pointControl.attach( tempPoint );

            this.handlerPointMove({ 
                x: self.conversionModel(tempPoint.position.x),
                y: self.conversionModel(tempPoint.position.y),
                z: self.conversionModel(tempPoint.position.z)
            });
            this.handlerPointRotate({ 
                x: self.conversionDeg(tempPoint.rotation.x),    
                y: self.conversionDeg(tempPoint.rotation.y),
                z: self.conversionDeg(tempPoint.rotation.z)
            })

        }else{
            if( !this.pointControl ){ return; }
            this.pointControl.detach();
        }
    }
    /****
     * API 控制当前路径点是执行移动还是旋转
     * @param type move移动 rotate旋转
     */
    changePointControlType(type){
        if(type == 'move'){
            this.pointControl.setMode( 'translate' );
        }else{
            this.pointControl.setMode( 'rotate' );
        }
    }
    /*****
     * API 改变当前路径点的运动状态
     * @param type move移动 rotate旋转
     * @param value {x, y, z}
     */
    changePointMotion(parameters){
        var tempValue = parameters.value;

        if(parameters.type == 'move'){
            this.pointControl.object.position.x = this.conversionWorld(tempValue.x);
            this.pointControl.object.position.y = this.conversionWorld(tempValue.y);
            this.pointControl.object.position.z = this.conversionWorld(tempValue.z);
        }else if(parameters.type == 'rotate'){
            this.pointControl.object.rotation.x = this.conversionRad(tempValue.x);
            this.pointControl.object.rotation.y = this.conversionRad(tempValue.y);
            this.pointControl.object.rotation.z = this.conversionRad(tempValue.z);
        }else{
            ElMessage.error('参数错误，无法配置模型运动！');
        }
    }
    /*****
     * 方法 将-Π到Π的弧度值 转换为 0-360°角度值
     * @param radian 当前需要转化的弧度数
     * @return 角度值
     */
     conversionDeg(radian){
        var tempDeg = THREE.MathUtils.radToDeg(radian);
        if(tempDeg<0){
            tempDeg = tempDeg+360;
        }
        return fixedNumber(tempDeg);
    }
    /*****
     * 方法 将0-360°角度值 转化为 -Π到Π的弧度值
     * @param degree 当前需要转化的角度
     * @return 弧度制
     */
    conversionRad(degree){
        var tempRad;
        if(degree>180){
            tempRad = -THREE.MathUtils.degToRad(360-degree); 
        }else{
            tempRad = THREE.MathUtils.degToRad(degree);
        }
        return tempRad;
    }
    /***
     * 方法 将世界坐标值 转换为实际模型需要的单位值
     * @param pos 当前需要转化的坐标值
     * @return 实际模型单位的值
     */
    conversionModel(pos){
        var tempPos = fixedNumber(pos*this.modelratio, 6)
        return tempPos;
    }
    /****
     * 方法 将模型实际的单位值 转化为世界坐标系
     * @param pos 当前需要转化的坐标值
     * @return 实际模型单位的值
     */
    conversionWorld(pos){
        var tempPos = fixedNumber(pos/this.modelratio, 6)
        return tempPos;
    }
    /****
     * 方法 显示或者隐藏一个物体
     * @param obj 需要被隐藏的物体
     * @param value true显示 false隐藏
     * ***/
    displayObj(obj, value) {
        obj.visible = value; 
    }
    /*****
     * 清除场景
     * *****/
    clearScene() {
        if (empty(container.value) || empty(container.value.firstChild)) {
            return;
        }
        container.value.removeChild(container.firstChild);
    }
    /****
     * 初始化 动画渲染当前的模型场景
     * @param timestamp 调用requestAnimationFrame所给的时间戳
     * *****/
    run() {
        var self = this; //当前的上下文环境
        var fps = 20;
        var fpsInterval = 1000 / fps;
        var avgFps = fps;
        var then = 0;
        var elapsed = 0;
        
        frame();
        
        function frame(timestamp){
            requestAnimationFrame(frame);
            // 需要一个方法去判断当前是否要做渲染
            // if (!this.isRenderRequired()) {
            //     return
            // }
            if (self.isDoRender) {
                self.robotLinksUpdate();
                if ("traceLine" in self.config) {
                    self.traceLineUpdate();
                }
                self.renderer.render(self.scene, self.camera);
            }

            elapsed = timestamp - then;
            if (elapsed > fpsInterval) {
                let newFps = 60;
                newFps = 1000 / elapsed;
                avgFps = (avgFps * 49 + newFps) / 50;
                var fpsCounter = avgFps.toFixed(1);
                if (avgFps < 5) {
                    // shadowEnable(false);
                }

                // robotLinksUpdate()
                // getRobotLinkValues();

                // if ('traceLine' in config) {
                //     traceLineUpdate()
                // }

                
                if(self.testPattern && self.status){
                    self.status.update();
                }
                self.renderer.render(self.scene, self.camera);

                then = timestamp;
            }
        }
    }

    /*****
     * API 是否打开测试模式
     * @param flag true打开测试模式 false关闭测试模式
     */
    isTestPattern(flag){
        this.testPattern = flag;
        if(flag && !this.isFirstInitText()){
            setTimeout(()=>{
                this.initAxesHelper();
                this.initStats();
                this.initTestBall();
            }, 300)
            return;
        }
        this.axisHelper.material.visible = flag;
        this.status.dom.style.display = flag?'block':'none';
        if(flag){
            this.initTestBall();
        }else{
            var textBall = this.scene.getObjectByName("testBall");
            this.scene.remove(textBall);
        }
    }
    /*****
    * API 处理操作栏需要的数据
    * @return templist 轴对应的旋转方向数组
    */
     initBarDatas() {
        var tempCompare = ["Link1", "Link2", "Link3", "Link4", "Link5", "Link6"];
        var tempList = [];
        for (var i = 0; i < this.config.objects.length; i++) {
            var tempIndex = tempCompare.indexOf(this.config.objects[i].name);
            if (tempIndex != -1) {
                tempList.push(this.config.objects[i]);
            }
        }
        return tempList;
    }
    /****
     * 方法 查看当前测试模式的是否做了初始化
     * @reutrn true已经初始化
     */
    isFirstInitText(){
        var flag;
        if(this.testPattern && this.axisHelper){
            flag = true;
        }else if(this.testPattern && !this.axisHelper){
            flag = false;
        }

        return flag;
    }
    /*****
     * 初始化 辅助坐标系
     * Y（绿色） Z（蓝色） X（红色）
     * @param size : Number 指的代表轴线段的长度，单位1
     */
    initAxesHelper() {
        this.axisHelper = new THREE.AxesHelper(250);
        this.scene.add(this.axisHelper);
    }
    /******
     * 初始化 检测帧数(FPS)的工具
     * 性能监听（创建频率显示）
     */
    initStats() {
        this.status = new Stats();
        this.status.dom.style.position = "absolute";
        for (var i = 0; i < this.status.dom.children.length; i++) {
            this.status.dom.children[i].style.width = "112px";
            this.status.dom.children[i].style.height = "68.6px";
        }
        this.container.appendChild(this.status.dom);
    }
    /****
     * 方法 设置测试模式中的物体
     * 金属材质和包含了自定义箭头坐标的小球
     * 文字精灵
     */
    initTestBall(){
        var group = new THREE.Group();
        group.name = "testBall";
        this.scene.add(group);
        var testPosX = -0.395633500804813;
        var testPosY = 0.029835408062337;
        var testPosZ = 0.056637380330376;

        //初始化一个反射当前环境材质的小球
        const geometry = new THREE.SphereGeometry(0.05, 32, 10);
        const material = new THREE.MeshBasicMaterial({ envMap: this.envMap });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(testPosX, testPosY, testPosZ);

        //初始化一个箭头
        var arrow = createArrow();
        arrow.position.set(testPosX, testPosY, testPosZ);

        //初始化一个文字精灵
        var testText = createSprite({
            content: "环境金属测试球",
            fontsize: 50,
            fillStyle: '#000000',
        });
        testText.position.set(testPosX, testPosY - 0.13, testPosZ + 0.1);

        group.add(mesh, arrow, testText);
    }
}