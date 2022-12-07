<template>
	<div ref="container" class="container" id="container"></div>
	<div class="home_button_box">
		<el-button type="primary" round size="large" @click="changeShowaction(0)">Manual Joint</el-button>
		<el-button type="primary" round size="large" @click="changeShowaction(1)">Manual Cart</el-button>
		<el-button type="primary" round size="large" @click="changeShowaction(2)">proarams</el-button>
	</div>
	<!-- manual joint -->
	<ul class="action_list" v-show="showactionFlag == 0">
		<el-switch
			size="large"	
			v-model="testMode"
			active-text="开发模式"
			inactive-text="生产模式"
			@change="handelSwitch"/>
		<li v-for="(item, index) in link1DirectionList">
			<div class="action_list_title">{{ item.name }}</div>
			<div class="action_list_box">
				<el-switch
					size="small"	
					v-model="item.direction"
					active-text="正向"
					inactive-text="反向"
					@change="handelDirection($event, index)"/>
				<div>轴体方向是：{{ item.axis }}</div>
			</div>

			<div class="action_list_actions">
				<el-slider
					v-model="item.value"
					show-input
					:min="item.min"
					:max="item.max"
					:step="0.01"
					@input="sliderInput($event, item.key, item.axis)"/>
			</div>
		</li>
	</ul>
	<!-- manual cart -->
	<ul class="action_list" v-show="showactionFlag == 1"></ul>
	<!-- proarams -->
	<ul class="action_list" v-show="showactionFlag == 2">
		<li>
			<div class="action_list_title">数据结构：</div>
			<div class="action_list_actions">
				<el-tree
					:data="geometryTree"
					v-model="activeGeometry"
					default-expand-all
					highlight-current
					:expand-on-click-node="false"
					@node-click="clickTreeNode">
					<template #default="{ node, data }">
						<i class="el-icon">
							<component :is="data.icon"></component>
						</i>
						<i style="padding-left: 4px">{{ data.label }}</i>
					</template>
				</el-tree>
			</div>
		</li>
		<li>
			<el-button type="primary" :icon="CirclePlusFilled" @click="doAddPoint">addPoint</el-button>
			<el-button type="primary" :icon="CirclePlusFilled" @click="doAddProgram">addProgram</el-button>
			<div class="action_list_actions">
				<div class="clearfix" style="margin-bottom: 30px">
					<div class="left">
						<el-button 
							:icon="Rank" size="large" round text bg  
							:type="isPointMotion=='move'?'primary':''"
							@click="doMove">移动</el-button>
					</div>
					<div class="right">
						<div class="laber_title">x</div>
						<div>
							<el-input-number v-model="motionMove.x" :min="-10000" :max="10000" @click="doMotionMove" :disabled="!isActiveControl" controls-position="right"/>
							<i class="unit_text">mm</i>
						</div>
						<div class="laber_title">y</div>
						<div>
							<el-input-number v-model="motionMove.y" :min="-10000" :max="10000" @click="doMotionMove" :disabled="!isActiveControl" controls-position="right"/>
							<i class="unit_text">mm</i>
						</div>
						<div class="laber_title">z</div>
						<div>
							<el-input-number v-model="motionMove.z" :min="-10000" :max="10000" @click="doMotionMove" :disabled="!isActiveControl" controls-position="right"/>
							<i class="unit_text">mm</i>
						</div>
					</div>
				</div>
				<div class="clearfix">
					<div class="left">
						<el-button 
							:icon="Refresh" size="large" round text bg  
							:type="isPointMotion=='rotate'?'primary':''"
							@click="doRotate">旋转</el-button>
					</div>
					<div class="right">
						<div class="laber_title">psi</div>
						<div>
							<el-input-number v-model="motionRotate.x" :min="-370" :max="370" @click="doMotionRotate" :disabled="!isActiveControl" controls-position="right"/>
							<i class="unit_text">deg</i>
						</div>
						<div class="laber_title">theat</div>
						<div>
							<el-input-number v-model="motionRotate.y" :min="-370" :max="370" @click="doMotionRotate" :disabled="!isActiveControl" controls-position="right"/>
							<i class="unit_text">deg</i>
						</div>
						<div class="laber_title">phi</div>
						<div>
							<el-input-number v-model="motionRotate.z" :min="-370" :max="370" @click="doMotionRotate" :disabled="!isActiveControl" controls-position="right"/>
							<i class="unit_text">deg</i>
						</div>
					</div>
				</div>
			</div>
		</li>
	</ul>
</template>

<script setup>
	import { onMounted, ref, inject, watch, toRaw, reactive } from "vue";
	import { CirclePlusFilled, Rank, Refresh } from "@element-plus/icons-vue";
	import { ElMessage } from 'element-plus';

	// 自定义方法组件等
	import CreateModel from './creator/create3Dmodel.js'
	import { convRadian } from "./utils/util.js";

	/***************************************************************************************************************************
	 * 变量 申明设置
	 * ************************************************************************************************************************/
	const positiveNumber = Number(Math.PI.toFixed(2)*2); //正值
	const negativeNumber = Number(-Math.PI.toFixed(2)*2); //负值
	let showactionFlag = ref(0); 
	let link1DirectionList = reactive([
			{
				key: "Link1",
				name: "轴体一（link1）",
				direction: true,
				value: 0,
				min: 0,
				max: 0
			},
			{
				key: "Link2",
				name: "轴体二（link2）",
				direction: true,
				value: 0,
				min: 0,
				max: 0
			},
			{
				key: "Link3",
				name: "轴体三（link3）",
				direction: true,
				value: 0,
				min: 0,
				max: 0
			},
			{
				key: "Link4",
				name: "轴体四（link4）",
				direction: true,
				value: 0,
				min: 0,
				max: 0
			},
			{
				key: "Link5",
				name: "轴体五（link5）",
				direction: true,
				value: 0,
				min: 0,
				max: 0
			},
			{
				key: "Link6",
				name: "轴体六（link6）",
				direction: true,
				value: 0,
				min: 0,
				max: 0
			},
		]);
	let handleNum = ref(0);
	let geometryTree = reactive([
			{
				label: "world",
				icon: 'Shop',
				type: "world",
				children: [
						{
							label: "robot",
							icon: 'Lock',
							type: "robot",
							children: [
								// {
								// 	label: "P1",
								// 	icon: 'Flag',
								// }, //for example
							]
						}
					]
			}
		]);
	let activeGeometry = ref("robot"); 
	let testMode = ref(true); 
	let model3D; 
	let firstDatas; 
	let isPointMotion = ref(null); 
	let motionMove = reactive({
			x: 0,
			y: 0,
			z: 0
		});
	let motionRotate = reactive({
			x: 0,
			y: 0,
			z: 0
		});
	let isActiveControl = ref(false); 

	/***************************************************************************************************************************
	 * 获取父级数据
	 * ************************************************************************************************************************/
	let getDatas = reactive({});
	getDatas = inject("sendData");

	let firstInit = watch(() => getDatas, (newValue, oldValue) => {
		var theNewValue = toRaw(newValue);
		if(theNewValue.config && theNewValue.visualTrace){
			firstDatas = theNewValue;
			create3DModel(); 
			firstInit(); 

			if(testMode){
				handelSwitch(true);
			}
		}
	}, {deep: true}) 


	/***************************************************************************************************************************
	 * 方法 申明设置
	 * ************************************************************************************************************************/
	/*****
	 * 方法 显示隐藏操作栏
	 * @param index 表示显示哪个操作栏
	 */
	function changeShowaction(index) {
		showactionFlag.value = showactionFlag.value == index ? null : index;
	}
	/*****
	 * 回调 轴体运动滑块操作时触发的方法
	 * @param val 滑块当前的值
	 * @param name 当前操作杆的对象名
	 * @param dir 当前轴运动的方向对应名
	 */
	function sliderInput(val, name, dir) {
		model3D.changeTheObject({ axis: dir }, name, val);
	}
	/*****
	 * 方法 创建3d模型
	 */
	function create3DModel(){
		model3D = new CreateModel({
			container: 'container',
			config: firstDatas.config,
			visualTrace: firstDatas.visualTrace,
			handlerPointMove: (pos)=>{
				motionMove.x = pos.x;
				motionMove.y = pos.y;
				motionMove.z = pos.z;
			},
			handlerPointRotate: (rot)=>{
				motionRotate.x = rot.x;
				motionRotate.y = rot.y;
				motionRotate.z = rot.z;
			}
		});
		
		getInteractiveData();
	}
	/****
	 * 方法 处理交互数据
	 */
	function getInteractiveData(){
		var barList = model3D.initBarDatas();
		barList.forEach((item, index)=>{
			link1DirectionList[index].axis = item.axis;
			link1DirectionList[index].directionFlag = item.directionFlag;
		});
		
		link1DirectionList.forEach((item, index)=>{
			handelDirection(true, index);
		})
	}
	/******
	 * 回调 展示测试模块改变时的方法
	 * @param state true测试模式 false展示模式
	 */
	function handelSwitch(state){
		model3D.isTestPattern(state);
	}
	/**
	 * 回调 当前轴的旋转方向
	 * @param flag 当前的值 true正向 false反向
	 * @param index 当前调整的轴体索引
	 */
	function handelDirection(flag, index){
		var tempMax, tempMin, tempValue;
		var tempDirection = link1DirectionList[index].directionFlag; 

		if(tempDirection == 1){
			if(flag){
				tempMin = 0 ;
				tempMax = positiveNumber ;
				tempValue = tempMin;
			}else{
				tempMin = negativeNumber ;
				tempMax = 0 ;
				tempValue = tempMax;
			}
		}else{
			if(flag){
				tempMin = negativeNumber ;
				tempMax = 0 ;
				tempValue = tempMax;
			}else{
				tempMin = 0 ;
				tempMax = positiveNumber ;
				tempValue = tempMin;
			}
		}

		link1DirectionList[index].min = tempMin;
		link1DirectionList[index].max = tempMax;
		link1DirectionList[index].value = tempValue;
	}
	/****
	 * 方法 添加一个路径点
	 */
	function doAddPoint(){
		model3D.drawAPoint();
		geometryTree[0].children[0].children.push({
						label: "point" + (geometryTree[0].children[0].children.length+1),
						icon: 'Flag',
						type: "point"
					});	

		isPointMotion.value = "null";
	}
	/***
	 * 方法 添加一个轨迹点文件
	 */
	function doAddProgram(){
		var tempPoints = model3D.getPointsInfo();
		console.log(tempPoints, "tempPoints");
	}
	/****
	 * 回调 当前树结构被点击了
	 * @param node 当前被点击节点数据
	 */
	function clickTreeNode(node){
		var displayFlag = node.type=='point'?true:false;
		model3D.setPointControl({
			displayFlag: displayFlag,
			label: node.label
		});

		isActiveControl.value = displayFlag;
		isPointMotion.value = "move";
	}
	/****
	 * 方法 点击了移动路径点模式
	 */
	function doMove(){
		if( !isActiveControl.value ){
			ElMessage({
				showClose: true,
				message: '请先选择一个路径点',
				type: 'warning',
			})
			return;
		}

		isPointMotion.value = 'move';
		model3D.changePointControlType( 'move' );
	}
	/***
	 * 方法 点击了旋转路径点模式
	 */
	function doRotate(){
		if( !isActiveControl.value ){
			ElMessage({
				showClose: true,
				message: '请先选择一个路径点',
				type: 'warning',
			})
			return;
		}

		isPointMotion.value = 'rotate';	
		model3D.changePointControlType( 'rotate' );
	}
	/*****
	 * 方法 点击了移动位置的input
	 */
	function doMotionMove(){
		model3D.changePointMotion({
				type: 'move',
				value: {
					x: motionMove.x,
					y: motionMove.y,
					z: motionMove.z
				}
			})		
	}
	/****
	 * 方法 点击了旋转物体的input
	 */
	function doMotionRotate(){
		model3D.changePointMotion({
				type: 'rotate',
				value: {
					x: motionRotate.x,
					y: motionRotate.y,
					z: motionRotate.z
				}
			})
	}
</script>

<style scoped lang="scss">
	$commonColor: '#009fa8';
	.clearfix { clear:both; overflow: hidden; }

	.container {
		width: 1680px;
		height: 900px;
	}
	.home_button_box {
		position: fixed;
		top: 960px;
		right: calc(100% - 1680px);
		text-align: center;
	}
	.action_list {
		width: 340px;
		height: 900px;
		background-color: #fff;
		position: absolute;
		left: 50px;
		top: 50px;
		margin: 0;
		list-style: none;
		color: #2d3748;
		padding: 20px 20px 0 20px;
		box-sizing: border-box;
		font-size: 14px;
		box-shadow: 0px 0px 20px #656565;
	}
	.action_list{
		li {
			padding: 20px 0;
			border-bottom: 1px dashed #333;
		}
	}
	.action_list_box{
		display: flex;
		align-items: center;
		justify-content: space-between
	}
	.action_list_title {
		font-weight: bold;
		font-size: 15px;
		padding-bottom: 4px;
	}
	.action_list_actions {
		padding-top: 4px;
	}
	.action_list_actions {
		.left {
			float: left;
			padding-top: 22px;
		}
		.right {
			float: right;
		}
	}
	.laber_title {
		padding: 12px 0 7px 2px;
	}
	.unit_text {
		color: $commonColor;
		margin-left: 2px;
		font-size: 10px;
	}
</style>
