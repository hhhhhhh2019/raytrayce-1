"use strict"
//векторная математика
function vec(x, y, z) {
	if (x == null || x == undefined) return {
		x: 0, y: 0, z: 0
	}
	else {
		if (y == null || y == undefined) return {
			x: x, y: x, z: x
		}
		if (z != null || z != undefined) return {
			x: x, y: y, z: z
		}
		throw new SyntaxError();
	}
}

function sum(a, b) {
	return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z}
}

function sub(a, b) {
	return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z}
}

function mul(a, b) {
	//проверка на вектор
	if (b.x != null || b.x != undefined) {
	if (b.y != null || b.y != undefined) {
	if (b.z != null || b.z != undefined) {
		return vec(a.x * b.x, a.y * b.y, a.z * b.z);
	}}}
	//проверка на число
	if (!isNaN(parseInt(b))) return vec(a.x * b, a.y * b, a.z * b);
}

function div(a, b) {
	//проверка на вектор
	if (b.x != null || b.x != undefined) {
	if (b.y != null || b.y != undefined) {
	if (b.z != null || b.z != undefined) {
		return vec(a.x / b.x, a.y / b.y, a.z / b.z);
	}}}
	//проверка на число
	if (!isNaN(parseInt(b))) return vec(a.x / b, a.y / b, a.z / b);
}

function size(v) {
	return (v.x ** 2 + v.y ** 2 + v.z ** 2) ** 0.5;
	//return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}

function normalize(v) {
	return div(v, size(v));
}

function dot(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function distance(a, b) {
	return size(sub(a, b));
}

function abs(v) {
	return vec(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
}

function rotate_x(p, a, o=p) {
	let b = Math.cos(a);
	let c = Math.sin(a);
	return vec(
		p.x,
		o.y + b * (p.y - o.y) - c * (p.z - o.z),
		o.z + c * (p.y - o.y) + b * (p.z - o.z));
}

function rotate_y(p, a, o=p) {
	let b = Math.cos(a);
	let c = Math.sin(a);
	return vec(
		o.x + b * (p.x - o.x) - c * (p.z - o.z),
		p.y,
		o.z + c * (p.x - o.x) + b * (p.z - o.z));
}

function rotate_z(p, a, o=p) {
	let b = Math.cos(a);
	let c = Math.sin(a);
	return vec(
		o.x + b * (p.x - o.x) - c * (p.y - o.y),
		o.y + c * (p.x - o.x) + b * (p.y - o.y),
		p.z);
}

//обьекты
class Sphere {
	constructor(p, r, c, i = false) {
		this.pos = p;
		this.rad = r;
		this.color = c;
		this.iverse = i;
		this.rotate = vec();
	}
	
	intersect(d, o) {
		let B = 2 * dot(sub(o, this.pos), d);
		let Discr = B * B - 4 * (dot(sub(o, this.pos), sub(o, this.pos)) - this.rad * this.rad);
		if (Discr <= 0) return null;
		let t1 = Math.abs((-B - Discr ** 0.5) * 0.5);
		let t2 = Math.abs((B - Discr ** 0.5) * 0.5);
		return sum(o, mul(d, Math.min(t1, t2)));
	}
	
	norm(p) {
		if (this.inverse)
			return normalize(sub(this.pos, p));
		return normalize(sub(p, this.pos));
	}
}

class Box {
	constructor(p, s, c, i = false) {
		this.pos = p;
		this.size = s;
		this.color = c;
		this.inverse = i;
		this.rotate = vec();
	}
	
	intersect(dir, o) {
		let w = this.size.x * 0.5;
		let h = this.size.y * 0.5;
		let d = this.size.z * 0.5;
		
		o = sub(o, this.pos);
		
		o = rotate_x(o, this.rotate.x, this.pos);
		o = rotate_y(o, this.rotate.y, this.pos);
		o = rotate_z(o, this.rotate.z, this.pos);
		
		dir = rotate_x(dir, this.rotate.x);
		dir = rotate_y(dir, this.rotate.y);
		dir = rotate_z(dir, this.rotate.z);
		
		let x; let y; let z;
		
		x = o.x + dir.x * ( h - o.y ) / dir.y;
		z = o.z + dir.z * ( h - o.y ) / dir.y;
		if( ( x < h ) && ( x > -h ) && ( z < h ) && ( z > -h ) )
		return true;
		
		x = o.x + dir.x * ( -h - o.y ) / dir.y;
		z = o.z + dir.z * ( -h - o.y ) / dir.y;
		if( ( x < h ) && ( x > -h ) && ( z < h ) && ( z > -h ) )
		return true;
		
		z = o.z + dir.z * ( w - o.x ) / dir.x;
		y = o.y + dir.y * ( w - o.x ) / dir.x;
		if( ( z < w ) && ( z > -w ) && ( y < w ) && ( y > -w ) )
		return true;
	
		z = o.z + dir.z * ( -w - o.x ) / dir.x;
		y = o.y + dir.y * ( -w - o.x ) / dir.x;
		if(z < w){
		if(z > -w){
		if(y < w){
		if(y > -w){
		return true;}}}}
		
		x = o.x + dir.x * ( d - o.z ) / dir.z;
		y = o.y + dir.y * ( d - o.z ) / dir.z;
		if(x < d){
		if(x > -d){
		if(y < d){
		if(y > -d){
		return true;}}}}
		
		x = o.x + dir.x * ( -d - o.z ) / dir.z;
		y = o.y + dir.y * ( -d - o.z ) / dir.z;
		if(x < d){
		if(x > -d){
		if(y < d){
		if(y > -d){
		return true;}}}}
		
		return null;
	}
	
	norm(p) {
		/*p = rotate_x(p, -this.rotate.x, this.pos);
		p = rotate_y(p, -this.rotate.y, this.pos);
		p = rotate_z(p, -this.rotate.z, this.pos);*/
		
		let r = vec();
		p = sum(p, mul(this.pos, -1));
		
		let w = this.size.x * 0.5;
		let h = this.size.y * 0.5;
		let d = this.size.z * 0.5;
		
		if (h == p.y) r = vec(0, 1, 0);
		else if (-h == p.y) r = vec(0, -1, 0);
		else if (w == p.x) r = vec(1, 0, 0);
		else if (-w == p.x) r = vec(-1, 0, 0);
		else if (d == p.z) r = vec(0, 0, 1);
		else if (-d == p.z) r = vec(0, 0, -1);
		else return vec();
		
		if (this.inverce) r = mul(r, -1);
		
		return r;
	}
}

function light(p, ld) {
	return 1 - (dot(p, ld) * 0.5 + 0.5);
}

function render(x, y, camera, scene) {
	let c = vec();
	let d = normalize(vec(x, y, 1));
	if (camera.rotate.x != 0)
		d = rotate_x(d, camera.rotate.x);
	if (camera.rotate.y != 0)
		d = rotate_y(d, camera.rotate.y);
	if (camera.rotate.z != 0)
		d = rotate_z(d, camera.rotate.z);
	
	let m = 100;
	let coll = 0;
	let Record = Infinity;
	let obj = null;
	let point = null;
	let orig = camera.pos;
	
	for (let o of scene) {
		let p = o.intersect(d, camera.pos);
		if (p) {
			let dist = sub(orig, p);
			dist = Math.abs(dist.x+dist.y+dist.z);
			if (dist < Record) {
				obj = o;
				point = p;
				Record = dist;
			}
		}
	}
	
	if (obj) c = mul(obj.color, mul(vec(255), light(obj.norm(point), vec(-1, 1, 1))));
	return c;
}

var cnv = document.createElement("canvas");
cnv.style.width = document.body.clientWidth;
cnv.style.height = document.body.clientHeight;
cnv.width = Math.floor(document.body.clientWidth/5);
cnv.height = Math.floor(document.body.clientHeight/5);
document.body.appendChild(cnv);
var ctx = cnv.getContext("2d");

var r = cnv.width / cnv.height;

var fpsp = document.getElementById("fps");

var scene = [
	//new Sphere(vec(0, 0, 3), 1, vec(1, 0.7, 0.5)),
	//new Sphere(vec(1, -1, 3), 1.2, vec(0.73, 0.8, 0.2))
]

for (let i = 0; i < 100; i++) {
  scene.push(new Sphere(
    vec((Math.random()*2-1)*5, (Math.random()*2-1)*5, (Math.random()*2-1)*5),
    Math.random()+0.5,
    vec(Math.random()+0.1, Math.random()+0.1, Math.random()+0.1)
    ));
}

var frames = 0;

function fpsc() {
	fpsp.innerHTML = "fps: " + frames;
	frames = 0;
}

var canvasData = ctx.getImageData(0, 0, cnv.width, cnv.height);

function drawPixel (x, y, r, g, b) {
    var index = (x + y * cnv.width) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = 255;
}
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}

function main() {
	for (let j = 0; j < cnv.height; j++) {
		for (let i = 0; i < cnv.width; i++) {
			let x = i / cnv.width * 2 - 1;
			let y = j / cnv.height * 2 - 1;
			x *= r;
			let c = render(x, y, {pos: vec(0, 0, 0), rotate: vec()}, scene);
			drawPixel(i, j, c.x, c.y, c.z);
		}
	}
	
//	scene[0].rotate.y+=0.1;
	
	frames++;
	updateCanvas();
	setTimeout(main, 0);
}

function TimeIt() {
    var self = this;

    function howLong(iterations, testFunction) {
        var results = [];
        var total = 0;
        for (var i = 0; i < iterations; i++) {
            var start = performance.now();
            testFunction();
            var end = performance.now();
            var duration = end - start;
            results.push(duration);
            total += duration;
        }
        var result = {
                results : results,
                total : total,
                avg : total / results.length
        }
        return result;
    }
    self.howLong = howLong;
}

//var time = new TimeIt();

setInterval(fpsc, 1000);
main();
/*console.log(time.howLong(100, function() {
	//drawPixel(0, 0, 10, 255, 200);
	updateCanvas()
}).total);*/