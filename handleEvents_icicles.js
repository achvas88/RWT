
////////////////// functions //////////////////////
//
// handleMouseClick(evt)
// handleSelection_I(startX,startY,endX,endY)
// handleDeselection_I()
// handleZoomIn()
// handleZoomOut()
// 
///////////////////////////////////////////////////


function handleSelection_I(startX,startY,endX,endY)
 {
	var minX = Math.min(startX,endX);
	var maxX = Math.max(startX,endX);
	
	var minY = Math.min(startY,endY);
	var maxY = Math.max(startY,endY);
	
	var centerX = canvas_I.width/2;
	var centerY = canvas_I.height/2;
	//var distanceFromCenter = Math.sqrt(Math.pow(,2) + Math.pow(,2));
	var selectedRegion = new Object();
	selectedRegion.x = minX;
	selectedRegion.y = minY;
	selectedRegion.width = maxX-minX;
	selectedRegion.height = maxY-minY;
	
	regionToOctTreeNodes_I(selectedRegion,0); // x,y,width,height
	
	highlightSelectedNodes_I();
 }
 
 function handleDeselection_I()
 {
	unHighlightAllChildren_I();
	
	if(selectedNodes_I.length>0)
	{
		for(var i=0;i<selectedNodes_I.length;i++)
		{
			//drawCircle(canvas_I,RADIUS_OF_CIRCLES_I,elements_I[selectedNodes_I[i]].X,elements_I[selectedNodes_I[i]].Y,"#33FF00");
			drawRect(canvas_I,elements_I[selectedNodes_I[i]].X, elements_I[selectedNodes_I[i]].Y,elements_I[selectedNodes_I[i]].WIDTH,LEVEL_HEIGHT,"#33FF00","black");
			
			var left = elements_I[selectedNodes_I[i]].X;
			var top = elements_I[selectedNodes_I[i]].Y;
			var width = elements_I[selectedNodes_I[i]].WIDTH;
			var height = LEVEL_HEIGHT;
			
			if(width>70)
			{
				drawRect(canvas_I,(left+width/2)-35,top+height/2-10,70,20,"#eee","black");
				
				ctx.fillStyle    = '#000';
				ctx.font         = 'italic 10px';
				ctx.textBaseline = 'top';
				
				ctx.fillText(elements_I[selectedNodes_I[i]].name,(left+width/2)-30,top+height/2-5);
			}
		}
		selectedNodes_I = [];
	}
 }
 
 function handleZoomIn_I()
 {
	
	canvas_I.width+=200;
	//canvas_I.height+=200;
	//canvas1_I.width+=20;
	//canvas1_I.height+=20;
	canvas2_I.width+=200;
	//canvas2_I.height+=200;
	
	redrawChart_I();
	
	//centerScrollbar("omw_scrollpane_H",canvas_I);
 }
 
 function handleZoomOut_I()
 {
	
	canvas_I.width-=200;
	//canvas_I.height-=200;
	//canvas1_I.width-=20;
	//canvas1_I.height-=20;
	canvas2_I.width-=200;
	//canvas2_I.height-=200;
	
	redrawChart_I();
	
	//centerScrollbar("omw_scrollpane_H",canvas_I);
 }
 