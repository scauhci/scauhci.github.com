var model;
var bike;
var incremental=0;
var timer;

if(!model)
model={};
model.create = function(){};
model.create.prototype = {
	cxt : null,
	canvas : null,
	init: function (){
		canvas = document.getElementById("mycanvas");
		canvas.width = 1300;
		canvas.height = 700;
		cxt = canvas.getContext("2d");
	},
	drawLine : function (x1,y1,x2,y2){
		cxt.beginPath();
		cxt.moveTo(x1,y1);
		cxt.lineTo(x2,y2);
		cxt.closePath();
		cxt.stroke();
	},
	drawCircle : function (centerX, centerY, radius){
		cxt.beginPath();
		cxt.strokeStyle = "rgb(0,0,0)";
		cxt.arc(centerX,centerY,radius,0,Math.PI*2,false);
		cxt.closePath();
		cxt.stroke();
	},
	drawRect : function (x,y,width,height){
		cxt.beginPath();
		cxt.strokeStyle = "rgb(0,0,0)";
		cxt.strokeRect(x,y,width,height);
		cxt.closePath();
		cxt.stroke();
	},
	clearCanvas : function (){
		cxt.fill();
		cxt.clearRect(0,0,1300,700);
	}
};

window.onload = function (){
	bike = new model.create();
	bike.init();
	//先初始化一辆单车
	draw();
}

function start(){
	timer = setInterval("draw()",100);
}

function draw(){
	//先清除canvas
	bike.clearCanvas();
	//第1部分
	bike.drawLine(980+incremental,280,930+incremental,380);
	//第2部分
	bike.drawLine(955+incremental,330,990+incremental,370);
	//第3部分
	bike.drawLine(990+incremental,370,990+incremental,420);
	//第4部分
	bike.drawLine(990+incremental,420,950+incremental,500);
	//第5部分
	bike.drawCircle(950+incremental,500,50);
	//第6部分
	bike.drawLine(990+incremental,395,1200+incremental,395);
	//第7部分
	bike.drawLine(1080+incremental,370,1080+incremental,395);
	//第8部分
	bike.drawRect(1040+incremental,355,80,15);
	//第9部分
	bike.drawLine(1150+incremental,395,1200+incremental,500);
	//第10部分
	bike.drawCircle(1200+incremental,500,50);
	//第11部分
	bike.drawRect(1200+incremental,387,60,15);

	//k约等于25根号2，稍微用圆的方程算算就OK
	var k = 35.3;

	//第12,13,14,15部分
	if(incremental%2==0){
		//第12部分
		bike.drawLine(950+incremental,450,950+incremental,550);
		//第13部分
		bike.drawLine(900+incremental,500,1000+incremental,500);
		//第14部分
		bike.drawLine(1200+incremental,450,1200+incremental,550);
		//第15部分
		bike.drawLine(1150+incremental,500,1250+incremental,500);
	}
	else{
		//第12部分
		bike.drawLine(950+incremental-k,500-k,950+incremental+k,500+k);
		//第13部分
		bike.drawLine(950+incremental+k,500-k,950+incremental-k,500+k);
		//第14部分
		bike.drawLine(1200+incremental-k,500-k,1200+incremental+k,500+k);
		//第15部分
		bike.drawLine(1200+incremental+k,500-k,1200+incremental-k,500+k);
	}

	incremental = incremental-5;
	if(incremental<-650)
		clearInterval(timer);
}