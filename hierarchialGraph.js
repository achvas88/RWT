 //******************************************************************************************************//
 // Javascript file that holds the datastructure and functionalities of the degreeBasedRadialSortGraph   //
 //******************************************************************************************************//
 
 //Dependencies

 //website : http://www.phpied.com/rgb-color-parser-in-javascript/
 document.write("<script type=\"text/javascript\" src=\"rgbcolor.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"common_functions.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"octTree_hierarchy.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"handleEvents_hierarchy.js\"></script>");
 
 ///////////// Datastructure /////////////////////////////////////////////////////////////////////

 var LEVELS_IN_OCT_TREE_H = 5; // has to be a minimum of 2 
 var HORIZONTAL_SPACING = 50;
 var VERTICAL_SPACING = 50;
 var RADIUS_OF_CIRCLES_H;
 var octTreeRegions_H = new Array();
 var octTreeCounter_H = 0;
 var highlightedChildren_H = new Array();
 var userDefinedHighlightSelectedNodesExists_H = 0;
 
 // the canvas_H
 var canvas_H,canvas2_H;
 

 // holds the elements_H present in each level
 var levelElements_H = new Array();
 
 // adjacencyList is a 2D array . 
 // Rows indicate the different elements_H
 // columns indicate the neighbors of the elements_H
 // each value is an object containing the description, location
 var childrenList_H = new Array();
 
 var elements_H = new Array();
 
 // for displaying debugging information
 var debuggingTextAreaID_H;
 
 // list of selected Node indices
 var selectedNodes_H = new Array();
 
 ///////////// Functions //////////////////////////////////////////////////////////////////////////
 
 
 function populateLevelElements_H(parentIndex,depth)
 {
	if(levelElements_H[depth])
	{
		for(var i=0;i<levelElements_H[depth].length;i++)
		{
			if(levelElements_H[depth][i] == parentIndex) return;
		}
		levelElements_H[depth].push(parentIndex);
	}
	else
	{
		levelElements_H[depth] = new Array();
		levelElements_H[depth].push(parentIndex);
	}
	
	for(var i=0;i<childrenList_H[parentIndex].length;i++)
	{
		populateLevelElements_H(childrenList_H[parentIndex][i],depth+1);
	}
 }
 
 function drawTheChart_H(theCanvasID,selectionCanvasID,theElements,theChildren,theDebuggingTextAreaID)
 {
	
	canvas_H  = document.getElementById(theCanvasID);
	canvas2_H = document.getElementById(selectionCanvasID);
	elements_H = theElements;
	childrenList_H = theChildren;
	debuggingTextAreaID_H = theDebuggingTextAreaID;
	RADIUS_OF_CIRCLES_H = Math.min((0.00001*canvas.width*canvas.height),10);
	
	
	drawChart_H();
	
	
	canvas2_H.addEventListener("dblclick", handleDblClick_H,false);
	canvas2_H.addEventListener("click", handleMouseClick_H);
	document.getElementById("zoomin_H").addEventListener("click",handleZoomIn_H);
	document.getElementById("zoomout_H").addEventListener("click",handleZoomOut_H);
		
 }
 
 function handleDblClick_H()
 {
	alert("double clicked");
 }
 
 function redrawChart_H()
 {
	octTreeRegions_H = [];
	RADIUS_OF_CIRCLES_H = Math.min((0.00001*canvas.width*canvas.height),10);
		
	maxWidth = calculateMaxCanvasWidth(RADIUS_OF_CIRCLES_H,HORIZONTAL_SPACING);
	canvas_H.width = Math.max(maxWidth,canvas_H.width); 
	canvas2_H.width = Math.max(maxWidth,canvas_H.width); 
	
	maxHeight = calculateMaxCanvasHeight(RADIUS_OF_CIRCLES_H,VERTICAL_SPACING);
	canvas_H.height = Math.max(maxHeight,canvas_H.height); 
	canvas2_H.height = Math.max(maxHeight,canvas_H.height); 
	
	var canvasWidth = canvas_H.width;
	var canvasHeight = canvas_H.height;
	var centerx = canvasWidth/2;
	var centery = canvasWidth/2;
	
	octTreeCounter_H = 0;
	initializeOctTree_H(0,0,canvas_H.width,canvas_H.height,LEVELS_IN_OCT_TREE_H,-1);
	drawOctTreeRegions(canvas_H,LEVELS_IN_OCT_TREE_H);
	
	for(var i = 0;i<levelElements_H.length;i++)
	{
		drawLevel_H(i,centerx,centery,HORIZONTAL_SPACING,VERTICAL_SPACING);
	}
	
	connectThemAll_H();
	highlightSelectedNodes_H();
	
 }
 
 function displayDebugInformation_H()
 {
	var debTA  = document.getElementById(debuggingTextAreaID_H);
	var debugText = "\n+++++++++++";
	
	for(var i =0 ; i<levelElements_H.length;i++)
	{
		debugText +="\n" + i +":"; 
		for(var j=0;j<levelElements_H[i].length;j++)
		{
			debugText += levelElements_H[i][j]+" ";
		}
	}
	debTA.value = debTA.value +debugText;
	
	/*debugText = "";
	debugText += canvas_H.id +":"+elements_H.length+"\n";
	
	for (var i=0;i<childrenList_H.length;i++)
	{
		debugText += "\n----------\n";
		debugText += elements_H[i].name + "-" + elements_H[i].description + ":";
		
		var elementNeighbors = adjacencyList[i];
		for(var j=0;j<elementNeighbors.length;j++)
		{
			debugText += elements_H[elementNeighbors[j]].name +" ";
		}
	}
	debTA.value = debTA.value +debugText;*/
 }
 
 
 function connectThemAll_H()
 {
	for(var i=0;i<childrenList_H.length;i++)
	{
		var theChildren = childrenList_H[i];
		for (var j=0;j<theChildren.length;j++)
		{
			drawLine(canvas_H,elements_H[i].X,elements_H[i].Y,elements_H[theChildren[j]].X,elements_H[theChildren[j]].Y,0,1,0.5);
		}
	}
 }
 
 function calculateMaxCanvasWidth(RADIUS_OF_CIRCLES_H,HORIZONTAL_SPACING)
 {
	var maxElementsInALevel = 0;
	for(var i=0;i<levelElements_H.length;i++)
	{
		if(maxElementsInALevel<levelElements_H[i].length) maxElementsInALevel = levelElements_H[i].length;
	}
	
	return ((RADIUS_OF_CIRCLES_H*2*maxElementsInALevel) + (maxElementsInALevel+1)*HORIZONTAL_SPACING);
 }
 
 function calculateMaxCanvasHeight(VERTICAL_SPACING)
 {
	return ((levelElements_H.length + 1) * VERTICAL_SPACING);
 }
 
 function drawChart_H()
 {
	populateLevelElements_H(0,0);
	
	maxWidth = calculateMaxCanvasWidth(RADIUS_OF_CIRCLES_H,HORIZONTAL_SPACING);
	canvas_H.width = Math.max(maxWidth,canvas_H.width); 
	canvas2_H.width = Math.max(maxWidth,canvas_H.width); 
	
	maxHeight = calculateMaxCanvasHeight(RADIUS_OF_CIRCLES_H,VERTICAL_SPACING);
	canvas_H.height = Math.max(maxHeight,canvas_H.height); 
	canvas2_H.height = Math.max(maxHeight,canvas_H.height); 
	
	var canvasWidth = canvas_H.width;
	var canvasHeight = canvas_H.height;
	var centerx = canvasWidth/2;
	var centery = canvasHeight/2;
	
	octTreeCounter_H = 0;
	initializeOctTree_H(0,0,canvas_H.width,canvas_H.height,LEVELS_IN_OCT_TREE_H,-1);
	drawOctTreeRegions(canvas_H,LEVELS_IN_OCT_TREE_H);
	
	for(var i = 0;i<levelElements_H.length;i++)
	{
		drawLevel_H(i,centerx,centery,HORIZONTAL_SPACING,VERTICAL_SPACING);
	}
	
	connectThemAll_H();
	viewOctTree(debuggingTextAreaID_H,octTreeRegions_H);
}


 function drawLevel_H(index,centerX,centerY,h_space,v_space)
 {
	
	var context=canvas_H.getContext("2d");
	
	context.lineWidth=1;
	context.strokeStyle="black"; // line color
	
	var initX = centerX - ((levelElements_H[index].length - 1)/2 * h_space); 
	var initY = (index + 1) * v_space; 
	
	for(var i=0;i<levelElements_H[index].length;i++)
	{
		var x = initX + h_space * i;
		var y = initY;
			
		elements_H[levelElements_H[index][i]].X = x;
		elements_H[levelElements_H[index][i]].Y = y;
		
		insertIntoOctTree_H(levelElements_H[index][i],x,y,0);
		
		drawCircle(canvas_H,RADIUS_OF_CIRCLES_H,x,y,"#33FF00");
	}

}
  
 function determineLevel_H(x,y)
 {
	var distanceFromTop = y;
	var widthOfLevel = VERTICAL_SPACING;
	
	lowerLevel = (Math.floor(distanceFromTop/widthOfLevel)) - 1;
	higherLevel = (Math.ceil(distanceFromTop/widthOfLevel)) - 1; 
	
	if(lowerLevel == -1) return 0;
	
	heightOfLowerLevel = (lowerLevel+1) * widthOfLevel;
	heightOfHigherLevel = (higherLevel+1) * widthOfLevel;
	
	if ((distanceFromTop - heightOfLowerLevel) <  (heightOfHigherLevel - distanceFromTop)) return lowerLevel;
	else
	{
		if (higherLevel<levelElements_H.length)	return higherLevel;
		else return lowerLevel;
	}
 }
 
function handleMouseClick_H(evt) {

	unHighlightAllChildren_H();

	var debTA  = document.getElementById(debuggingTextAreaID_H);
		
	var context=canvas_H.getContext("2d");
	
	var x, y;

    // Get the mouse position relative to the canvas_H element.
    if (evt.layerX || evt.layerX == 0) { // Firefox
      x = evt.layerX;
      y = evt.layerY;
    } else if (evt.offsetX || evt.offsetX == 0) { // Opera
      x = evt.offsetX;
      y = evt.offsetY;
    }
	//x = evt.clientX,y = evt.clientY;
	var scrollbar = document.getElementById("omw_scrollpane");
	//x += scrollbar.scrollLeft;
	//y += scrollbar.scrollTop;
	context.moveTo(x, y);
	var imgd = context.getImageData(x,y, 1, 1);
	var pix = imgd.data;
	
	var regionOfPress = new Object();
	regionOfPress.x = x-RADIUS_OF_CIRCLES_H;
	regionOfPress.y = y-RADIUS_OF_CIRCLES_H;
	regionOfPress.width  = RADIUS_OF_CIRCLES_H*2;
	regionOfPress.height  = RADIUS_OF_CIRCLES_H*2;			// based on hardcoded values for radius of the circle. should be changed once that is made automatic based on size of graph
	
	for(var i =0;i<pix.length;i+=4)
	{
		var val1 = pix[i]; // red
		var val2 = pix[i+1]; // green
		var val3 = pix[i+2]; // blue
	}
	
	//var locr = document.getElementById('col');
	//locr.value = val1 + ":" +val2 +":" +val3; 
	
	if((val1 == 51 && val2 == 255 && val3 == 0) || (val1 == 255 && val2 == 0 && val3 == 0))
	{
		var levelAt = determineLevel_H(x,y);
		
		var levelContents = levelElements_H[levelAt];
		
		for(var i=0;i<levelContents.length;i++)
		{
			if(fallInRegion(regionOfPress,elements_H[levelContents[i]].X,elements_H[levelContents[i]].Y))
			{
				if(val1 == 51 && val2 == 255 && val3 == 0) // if unselected
				{
					selectedNodes_H.push(levelContents[i]);
					highlightChildren_H(levelContents[i]);
					highlightSelectedNodes_H();
					break;
				}
				else 	// if selected
				{
					if(evt.ctrlKey)	// selected again with ctrl key down should deselect the node
					{
						deselectNode_H(levelContents[i]);
						break;
					}
					else	//selected again without pressing the ctrl key should clear all selected other than this
					{
						handleDeselection_H();
						selectedNodes_H.push(levelContents[i]);
						highlightChildren_H(levelContents[i]);
						highlightSelectedNodes_H();
						break;
					}
				}
			}
		}
	}
}

function highlightChildren_H(index)
{
	var children = childrenList_H[index];
	for(var i=0;i<children.length;i++)
	{
		if(!alreadySelected(children[i],selectedNodes_H))
		{
			highlightChild_H(children[i]);
			highlightedChildren_H.push(children[i]);
		}
	}
}

function unHighlightAllChildren_H()
{
	for(var i=0;i<highlightedChildren_H.length;i++)
	{
		unHighlightChild_H(highlightedChildren_H[i]);
	}
	highlightedChildren_H = [];
}

function highlightChild_H(index)
{
	var x = elements_H[index].X;
	var y = elements_H[index].Y;
	
	var ctx = canvas_H.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES_H, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	
}

function unHighlightChild_H(index)
{
	var x = elements_H[index].X;
	var y = elements_H[index].Y;
	
	var ctx = canvas_H.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES_H, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	ctx.fillStyle = "#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES_H, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}