var next=0;
var last=0;
var stemArray = new Array();
window.onload=function(){
	heightlight();
}
function heightlight(){
	var stem = document.getElementById("code").innerHTML;
	deal(stem);
}
function deal(stem){
	stem=stem.replace(/\\n/g,"<br>");
	alert(stem);
}

