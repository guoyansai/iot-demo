import * as THREE from 'three'
import createSprite from "./createSprite.js";
import createArrow from "./createArrow.js";

/*****
 * 绘制一个路径点
 * @param position 当前路径点放入的位置
 * @param content 当前路径点的名称
 */
export default function createPoint(parameters){
    let defaultPos = {
        x: 0,
        y: 0,
        z: 0
    }
    let position = parameters.hasOwnProperty("position") ? parameters["position"] : defaultPos;
    let content = parameters.hasOwnProperty("content") ? parameters["content"] : 'point';

    const geometry = new THREE.SphereGeometry(0.014, 40, 40);
    const material = new THREE.MeshPhongMaterial({ color: 0xbfbd1d });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.name = content;

    let tempText = createSprite({
        content: content.toUpperCase(),
        fontsize: 40,
        fillStyle: '#000000',
    });
    tempText.position.set(0, 0, 0.04);
    mesh.add(tempText);
    var arrow = createArrow();
    mesh.add(arrow);
   
    return mesh;
}