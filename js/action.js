var count=0;
var circle1;
var circle2;
var circle3;
var circle4;
window.onload = function(){
	circle1 = document.getElementById("circle1");
 	circle2 = document.getElementById("circle2");
 	circle3 = document.getElementById("circle3");
 	circle4 = document.getElementById("circle4");
	if(window.addEventListener)
	window.addEventListener("click",choice,false);
	else
	window.attachEvent("click",choice); 
}
function choice(){
	count++;
	switch(count){
		case 1 :
			drawCircle();
		break;
		case 2 :
			changeColor();
		break;
		case 3 :
			readyLocation();
		break;
		default :

		break;
	}
}
function drawCircle(){
	var explain = document.getElementById("explain");
	explain.innerHTML = "用CSS3画圆很简单，利用一个div就可以了<br>"+
	"首先设置边框:border: 1px solid #000000;<br>"+
	"然后使用圆角的属性就OK，只要设置为50%就会变为圆形了,代码如下:<br>"+
	"-moz-border-radius: 50%;<br>"+
	"-webkit-border-radius:50%;<br>"+
	"border-radius: 50%; ";

}	

function changeColor(){
	circle1.style.background = "-webkit-linear-gradient(left,#008ae3,#02314f)";
	circle1.style.background = "-moz-linear-gradient(left,#008ae3,#02314f)";
	circle2.style.background = "-webkit-linear-gradient(right,#11ff17,#074908)";
	circle2.style.background = "-moz-linear-gradient(right,#11ff17,#074908)";
	circle3.style.background = "-webkit-linear-gradient(left,#dcf723,#e2ea0d)";
	circle3.style.background = "-moz-linear-gradient(left,#dcf723,#e2ea0d)";
	circle4.style.background = "-webkit-linear-gradient(right,#fb2900,#b7270a)";
	circle4.style.background = "-moz-linear-gradient(right,#fb2900,#b7270a)";
	var explain = document.getElementById("explain");
	explain.innerHTML="颜色渐变使用了CSS3的属性，代码如下:<br>"+
	"-webkit-linear-gradient(left,#008ae3,#02314f)<br>"+
	"-moz-linear-gradient(left,#008ae3,#02314f)<br>"+
	"linear-gradient(left,#008ae3,#02314f)<br><br>"+
	"linear(线性变化)-gradient(渐变的属性)(颜色变化的方便，开始颜色，结束颜色)";
}
function readyLocation(){
	var explain = document.getElementById("explain");
	explain.innerHTML = "本来想用JS写点动画出来跟大家分享下，但时间比较仓促，所以还是很丑，以后漂亮点再点大家分享，呵呵！"+
	"虽然只是做了一点，但我算是研究了一下JS引擎里面的机制的东西，因为是自己去摸索的，所以感触很深！我得出的结论是：<br>"+
	"没有你做不到的，只有你不想做的。。。。。。<br><br><br><br>"+
	"假如你对js的线程有兴趣的，可以浏览下：<br>http://blog.csdn.net/noonnightstorm/article/details/8090319<br>"+
	"版权所有:@HCI  @任重致远-MR梁广彬";

	var interavl=100;
	var time1 = setInterval(function(){
		if(interavl==500) 
		clearInterval(time1);
		modifyCSS(circle4,"height",-10);
		modifyCSS(circle4,"width",-10);
		modifyCSS(circle4,"top",+5);
		modifyCSS(circle4,"left",+5);
		modifyCSS(circle3,"height",-20);
		modifyCSS(circle3,"width",-20);
		modifyCSS(circle3,"top",+10);
		modifyCSS(circle3,"left",+10);
		modifyCSS(circle2,"height",-30);
		modifyCSS(circle2,"width",-30);
		modifyCSS(circle2,"top",+15);
		modifyCSS(circle2,"left",+15);
		modifyCSS(circle1,"height",-40);
		modifyCSS(circle1,"width",-40);
		modifyCSS(circle1,"top",+20);
		modifyCSS(circle1,"left",+20);
		interavl+=100;
	},100);
	setTimeout(function(){interavl=100;},560);
	setTimeout(function(){
		var time2 = setInterval(function(){
			if(interavl==500)
			clearInterval(time2);
			modifyCSS(circle1,"top",-30);
			modifyCSS(circle2,"left",+30);
			modifyCSS(circle3,"top",+30);
			modifyCSS(circle4,"left",-30);
			interavl+= 100;
		},100);
	},1000);
}

function modifyCSS(obj,prop,variable){
	var value;
	if(obj.currentStyle){
		value = obj.currentStyle[prop].toString();
	}
	else if(window.getComputedStyle){
		prop = prop.replace(/([A-Z])/g,"-$1");
		prop = prop.toLowerCase();
		value = document.defaultView.getComputedStyle(obj,null)[prop].toString();
	}
	value = parseInt(value.substring(0,value.length-2))+variable;
	if(prop=="top")
	obj.style.top = value+"px";
	else if(prop=="left")
	obj.style.left = value+"px";
	else if(prop=="width")
	obj.style.width = value+"px";
	else if(prop=="height")
	obj.style.height = value+"px";
}


/*function GetCurrentStyle (obj, prop) {     
    if (obj.currentStyle) {        
        return obj.currentStyle[prop];     
    }     
    else if (window.getComputedStyle) {        
        prop = prop.replace (/([A-Z])/g, "-$1");           
        prop = prop.toLowerCase ();        
        return document.defaultView.getComputedStyle (obj,null)[prop];     
    }      
    return null;   
}*/   

