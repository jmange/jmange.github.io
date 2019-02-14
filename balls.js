function initCanvas() {
	let canvas=document.getElementById('pit');
	canvas.width=document.getElementById('output_body').offsetWidth-2;
	canvas.height=document.getElementById('output_body').offsetHeight-2;
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1) ) + min; }
function randColor() {
	let letters = '0123456789AB'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * letters.length)];
    }
    return color;
}

function randomBall(color) {
	let b=new Ball(100, 100, randInt(-5,5), randInt(-5,5), randInt(5,25), color);
	while(b.vx==0)
		b.vx=randInt(-5,5);
	while(b.vy==0)
		b.vy=randInt(-5,5);
	balls.push(b);
}

function addRandomColorBall() {
	let c=randColor();
	randomBall(c);
}

function addRedBall() {
	randomBall('red');
}
function addBlueBall() {
	randomBall('blue');
}
function addGreenBall() {
	randomBall('green');
}

function clearBallPit() {
	balls=[];
}

let balls=[];
setInterval('animate()', 20);

function Ball(x, y, vx, vy, radius, color) {
	this.x=x;
	this.y=y;
	this.vx=vx;
	this.vy=vy;
	this.radius=radius;
	this.color=color;
}
function animate() {
	let canvas=document.getElementById('pit');
	if(canvas==null)
		return;

	// update all the positions
	for(let i=0; i<balls.length; i++) {
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		
		// hitting top
		if(balls[i].y < balls[i].radius) {
			balls[i].y=balls[i].radius;
			balls[i].vy*=-1;
		}

		// hitting bottom
		if(balls[i].y+balls[i].radius > canvas.height) {
			balls[i].y=canvas.height-balls[i].radius;
			balls[i].vy*=-1;
		}

		// hitting left
		if(balls[i].x < balls[i].radius) {
			balls[i].x=balls[i].radius;
			balls[i].vx*=-1;
		}

		// hitting right
		if(balls[i].x+balls[i].radius > canvas.width) {
			balls[i].x=canvas.width-balls[i].radius;
			balls[i].vx*=-1;
		}
	}

	// re-draw everything
	try {
		var context=canvas.getContext('2d');
	} catch(err) {
		return;
	}
	
	context.clearRect(0,0,canvas.width, canvas.height);
	for(let i=0; i<balls.length; i++) {
		context.beginPath();
		context.arc(balls[i].x, balls[i].y, balls[i].radius, 0, 2*Math.PI, false);
		context.fillStyle=balls[i].color;
		context.fill();
	}
}
