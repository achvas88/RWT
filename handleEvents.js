
////////////////// functions //////////////////////
//
// handleMouseClick(evt)
// handleSelection(startX,startY,endX,endY)
// handleDeselection()
// handleZoomIn()
// handleZoomOut()
// 
///////////////////////////////////////////////////


function handleSelection(startX,startY,endX,endY)
 {
	var minX = Math.min(startX,endX);
	var maxX = Math.max(startX,endX);
	
	var minY = Math.min(startY,endY);
	var maxY = Math.max(startY,endY);
	
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	//var distanceFromCenter = Math.sqrt(Math.pow(,2) + Math.pow(,2));
	var selectedRegion = new Object();
	selectedRegion.x = minX;
	selectedRegion.y = minY;
	selectedRegion.width = maxX-minX;
	selectedRegion.height = maxY-minY;
	
	regionToOctTreeNodes(selectedRegion,0); // x,y,width,height
	
	highlightSelectedNodes();
 }
 
 function handleDeselection()
 {
	if(selectedNodes.length>0)
	{
		for(var i=0;i<selectedNodes.length;i++)
		{
			drawCircle(canvas,RADIUS_OF_CIRCLES,theElements[selectedNodes[i]].X,theElements[selectedNodes[i]].Y,"#33FF00");
		}
		selectedNodes = [];
	}
 }
 
 function handleZoomIn()
 {
	
	canvas.width+=20;
	canvas.height+=20;
	canvas1.width+=20;
	canvas1.height+=20;
	canvas2.width+=20;
	canvas2.height+=20;
	
	redrawChart();
	
	centerScrollbar("omw_scrollpane",canvas);
 }
 
 function handleZoomOut()
 {
	
	canvas.width-=20;
	canvas.height-=20;
	canvas1.width-=20;
	canvas1.height-=20;
	canvas2.width-=20;
	canvas2.height-=20;
	
	redrawChart();
	
	centerScrollbar("omw_scrollpane",canvas);
 }
 
 