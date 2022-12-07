import * as THREE from 'three'

export default function createArrow() {
	const arrow = new THREE.Group()
	const length = 0.1
	const coneLength = length * 0.25
	const radius = 0.002
	const lineGeom = new THREE.CylinderGeometry(radius, radius, length, 32)
	const coneGeom = new THREE.ConeGeometry(radius * 2, coneLength, 32)
	const arrowX = new THREE.Mesh(lineGeom, new THREE.MeshPhongMaterial({ color: 0xE76C47 }))
	const coneX = new THREE.Mesh(coneGeom, new THREE.MeshPhongMaterial({ color: 0xE76C47 }))
	const arrowY = new THREE.Mesh(lineGeom, new THREE.MeshPhongMaterial({ color: 0xB8E74F }))
	const coneY = new THREE.Mesh(coneGeom, new THREE.MeshPhongMaterial({ color: 0xB8E74F }))
	const arrowZ = new THREE.Mesh(lineGeom, new THREE.MeshPhongMaterial({ color: 0x43B6F1 }))
	const coneZ = new THREE.Mesh(coneGeom, new THREE.MeshPhongMaterial({ color: 0x43B6F1 }))

	arrowX.rotation.z = 0.5 * Math.PI
	arrowX.position.x = 0.5 * length
	coneX.rotation.z = -Math.PI / 2
	coneX.position.x = length + coneLength / 2
	arrowY.position.y = 0.5 * length
	coneY.position.y = length + coneLength / 2
	arrowZ.rotation.x = 0.5 * Math.PI
	arrowZ.position.z = 0.5 * length
	coneZ.rotation.x = 0.5 * Math.PI
	coneZ.position.z = length + coneLength / 2

	arrow.add(arrowX)
	arrow.add(arrowY)
	arrow.add(arrowZ)
	arrow.add(coneX)
	arrow.add(coneY)
	arrow.add(coneZ)

	return arrow
}
