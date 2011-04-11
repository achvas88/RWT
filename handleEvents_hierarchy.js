
////////////////// functions //////////////////////
//
// handleMouseClick(evt)
// handleSelection_H(startX,startY,endX,endY)
// handleDeselection_H()
// handleZoomIn()
// handleZoomOut()
// 
///////////////////////////////////////////////////


function handleSelection_H(startX,startY,endX,endY)
 {
	var minX = Math.min(startX,endX);
	var maxX = Math.max(startX,endX);
	
	var minY = Math.min(startY,endY);
	var maxY = Math.max(startY,endY);
	
	var centerX = canvas_H.width/2;
	var centerY = canvas_H.height/2;
	//var distanceFromCenter = Math.sqrt(Math.pow(,2) + Math.pow(,2));
	var selectedRegion = new Object();
	selectedRegion.x = minX;
	selectedRegion.y = minY;
	selectedRegion.width = maxX-minX;
	selectedRegion.height = maxY-minY;
	
	regionToOctTreeNodes_H(selectedRegion,0); // x,y,width,height
	
	highlightSelectedNodes_H();
 }
 
 function handleDeselection_H()
 {
	if(selectedNodes_H.length>0)
	{
		for(var i=0;i<selectedNodes_H.length;i++)
		{
			drawCircle(canvas_H,RADIUS_OF_CIRCLES_H,elements_H[selectedNodes_H[i]].X,elements_H[selectedNodes_H[i]].Y,"#33FF00");
		}
		selectedNodes_H = [];
	}
 }
 
 function handleZoomIn_H()
 {
	
	canvas_H.width+=20;
	canvas_H.height+=20;
	//canvas1_H.width+=20;
	//canvas1_H.height+=20;
	canvas2_H.width+=20;
	canvas2_H.height+=20;
	
	HORIZONTAL_SPACING += 5;
	VERTICAL_SPACING += 5;
	
	redrawChart_H();
	
	centerScrollbar("omw_scrollpane_H",canvas_H);
 }
 
 function handleZoomOut_H()
 {
	
	canvas_H.width-=20;
	canvas_H.height-=20;
	//canvas1_H.width-=20;
	//canvas1_H.height-=20;
	canvas2_H.width-=20;
	canvas2_H.height-=20;
	
	HORIZONTAL_SPACING -= 5;
	VERTICAL_SPACING -= 5;
	
	redrawChart_H();
	
	centerScrollbar("omw_scrollpane_H",canvas_H);
 }
 