import * as THREE from 'three'
import { ceilPowerOfTwo } from 'three/src/math/MathUtils'

/*****
 * 绘制一个文字精灵
 * @param content 文字精灵的内容
 * @param fontsize 显示字体尺寸
 * @param fillStyle 字体的颜色
 */
export default function createSprite(parameters) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	var fontStyle = parameters.fontsize + 'px 思源黑体';
	var fontContents = (parameters.content || "").toString().split("\n");
	var fontHeight = getFontHeight(fontStyle); 
	console.log(fontHeight, 'fontHeight');
	var fontHeightRatio = 1.2;
	var _align = new THREE.Vector2(0,0);
	var _horizontalPadding = 0;
	var _verticalPadding = 0;
	var fontBoxHeight = fontHeight + fontHeight * fontHeightRatio * (fontContents.length - 1);

	ctx.font = fontStyle;
	var textWidth = Math.max.apply(null, fontContents.map(function (line) { 
		return Math.ceil(ctx.measureText(line).width); 
	}));
	canvas.width = Math.max(2, ceilPowerOfTwo(textWidth + (2 * _horizontalPadding)));
	canvas.height = Math.max(2, ceilPowerOfTwo(fontBoxHeight + (2 * _verticalPadding)));
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = parameters.fillStyle;
	
	if (_align.x === 1)
		ctx.textAlign = 'left';

	else if (_align.x === 0){
		ctx.textAlign = 'center';

	}else{
		ctx.textAlign = 'right';
	}
		
	ctx.font = fontStyle;
	ctx.textBaseline = 'top';
	var x = textWidth * (0.5 - _align.x * 0.5);
	var y = 0.5 * ((fontHeight * fontHeightRatio) - fontHeight);
	for (var i = 0; i < fontContents.length; i++) {
		ctx.fillText(fontContents[i], x + _horizontalPadding, (fontHeight * fontHeightRatio * i) + _verticalPadding + y);
	}

	var texture,
		material,
		sprite;
	texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	
	material = new THREE.SpriteMaterial({ map: texture });
	sprite = new THREE.Sprite(material);

	var contentLength = getConLength(fontContents[0]);
	var scaleX = canvas.width/(parameters.fontsize*14*3);
	var scaleY = canvas.height/(parameters.fontsize*14*3);
	sprite.scale.set(scaleX, scaleY, 1);

	sprite.center.x = (0.5 - _align.x * 0.5) * textWidth / canvas.width;
	sprite.center.y = 1 - (_align.y * 0.5 + 0.5) * fontBoxHeight / canvas.height;

	function changeContent(){
		console.log("修改一下");
	}

	return sprite;
}

/*****
 * 方法 计算当前字体和字号下的canvas高度
 * @param fontStyle canvas的字体样式
 */
function getFontHeight(fontStyle) {
	var fontBoxHeight;
	var body = document.getElementsByTagName('body')[0];
	var div = document.createElement('div');
	var text = document.createTextNode('Thisistesting');
	div.appendChild(text);
	div.style = "font:" + fontStyle + ";position:absolute;top:0;left:0;";
	body.appendChild(div);
	fontBoxHeight = div.offsetHeight;
	body.removeChild(div);
	return fontBoxHeight;
}
/*****
 * 方法 计算字符串的长度的长度
 * @param string 需要计算的字符串
 * 英文字母1个 中文算2个
 */
function getConLength(string){
	var len = 0;
	for(var i=0; i<string.length; i++) {
		var reg = /[^\x00-\xff]/ig;
		if(string[i].match(reg) != null){
			len += 2;
		}else{
			len += 1;
		}
	}
	return len;
}