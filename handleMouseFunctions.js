function handleMouseDown(evt)
 {
	if(!evt.ctrlKey)
	{
		handleDeselection();	
	}
	
	var scrollbar = document.getElementById("omw_scrollpane");
	
	isDown = true;
	startX = OFFSETX + scrollbar.scrollLeft + evt.clientX;
	startY = OFFSETY + scrollbar.scrollTop + evt.clientY;
 }
 
 function handleMouseUp(evt)
 {
 	var scrollbar = document.getElementById("omw_scrollpane");
	
	endX = OFFSETX + scrollbar.scrollLeft + evt.clientX;
	endY = OFFSETY + scrollbar.scrollTop + evt.clientY;
	isDown = false;
	handleSelection(startX,startY,endX,endY);
 }
 

 function handleMouseMove(evt)
 {	
	var scrollbar = document.getElementById("omw_scrollpane");
	
 	var ctx = canvas2.getContext("2d");
	ctx.clearRect(0,0,canvas2.width,canvas2.height);
		
	if(isDown)
	{
		ctx.strokeStyle = "rgba(50,50,50,0.4)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(startX,								startY);
		ctx.lineTo(OFFSETX + scrollbar.scrollLeft + evt.clientX,	startY);
		ctx.lineTo(OFFSETX + scrollbar.scrollLeft + evt.clientX,	OFFSETY + scrollbar.scrollTop +evt.clientY);
		ctx.lineTo(startX,								OFFSETY + scrollbar.scrollTop +evt.clientY);
		ctx.closePath();
		ctx.stroke();
	}
		
 }

 function handleMouseOver(evt) {
	
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");
	
	var x, y;

    // Get the mouse position relative to the canvas element.
    if (evt.layerX || evt.layerX == 0) { // Firefox
      x = evt.layerX;
      y = evt.layerY;
    } else if (evt.offsetX || evt.offsetX == 0) { // Opera
      x = evt.offsetX;
      y = evt.offsetY;
    }
	//x = evt.clientX,y = evt.clientY;
	context.moveTo(x, y);
	var imgd = context.getImageData(x,y, 1, 1);
	var pix = imgd.data;
	
	for(var i =0;i<pix.length;i+=4)
	{
		var val1 = pix[i]; // red
		var val2 = pix[i+1]; // green
		var val3 = pix[i+2]; // blue
	}
	
	//var locr = document.getElementById('col');
	//locr.value = val1 + ":" +val2 +":" +val3; 
	
}

///////////////////////////////////////////  hierarchial drawing Canvas ///////////////////////////////////


function handleMouseDown_H(evt)
 {
	//unHighlightAllChildren_H();
	
	if(!evt.ctrlKey)
	{
		handleDeselection_H();	
	}
	
	var scrollbar = document.getElementById("omw_scrollpane_H");
	
	isDown_H = true;
	startX_H = OFFSETX_H + scrollbar.scrollLeft + evt.clientX;
	startY_H = OFFSETY_H + scrollbar.scrollTop + evt.clientY;
 }
 
 function handleMouseUp_H(evt)
 {
 	var scrollbar = document.getElementById("omw_scrollpane_H");
	
	endX_H = OFFSETX_H + scrollbar.scrollLeft + evt.clientX;
	endY_H = OFFSETY_H + scrollbar.scrollTop + evt.clientY;
	isDown_H = false;
	handleSelection_H(startX_H,startY_H,endX_H,endY_H);
 }
 

 function handleMouseMove_H(evt)
 {	
	var scrollbar = document.getElementById("omw_scrollpane_H");
	
 	var ctx = canvas2_H.getContext("2d");
	ctx.clearRect(0,0,canvas2_H.width,canvas2_H.height);
		
	if(isDown_H)
	{
		ctx.strokeStyle = "rgba(50,50,50,0.4)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(startX_H,startY_H);
		ctx.lineTo(OFFSETX_H + scrollbar.scrollLeft + evt.clientX,startY_H);
		ctx.lineTo(OFFSETX_H + scrollbar.scrollLeft + evt.clientX,OFFSETY_H + scrollbar.scrollTop +evt.clientY);
		ctx.lineTo(startX_H,OFFSETY_H + scrollbar.scrollTop +evt.clientY);
		ctx.closePath();
		ctx.stroke();
	}
		
 }
 