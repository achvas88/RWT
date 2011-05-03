 //******************************************************************************************************//
 // Javascript file that holds the datastructure and functionalities of the degreeBasedRadialSortGraph   //
 //******************************************************************************************************//
 
 //Dependencies

 //website : http://www.phpied.com/rgb-color-parser-in-javascript/
 document.write("<script type=\"text/javascript\" src=\"rgbcolor.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"common_functions.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"octTree.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"handleEvents.js\"></script>");
 
 ///////////// Datastructure /////////////////////////////////////////////////////////////////////

 var LEVELS_IN_OCT_TREE = 5; // has to be a minimum of 2 
 var RADIUS_OF_CIRCLES;
 var highlightedChildren = new Array();
 
 // to access width and height information and to draw on the canvas object
 var canvasID;
 
 // the canvas
 var canvas,canvas1,canvas2;	// canvas - actual drawing canvas, canvas1 - edges canvas, canvas3 - selectionbox canvas
 
 // determines the ranges of the levels in the graph
 var levelRanges = new Array();
 
 // holds the elements present in each level
 var levelElements = new Array();
 
 // adjacencyList is a 2D array . 
 // Rows indicate the different elements
 // columns indicate the neighbors of the elements
 // each value is an object containing the description, location
 //var adjacencyList = new Array();
 
 //var elements = new Array();
 
 // for displaying debugging information
 var debuggingTextAreaID;
 
 // list of selected Node indices
 var selectedNodes = new Array();
 
 ///////////// Functions //////////////////////////////////////////////////////////////////////////
 // 
 // populateLevelElements(mode)
 // drawTheChart(theCanvasID,selectionCanvasID,TheLevelRanges,theElements,theAdjacencyList,theDebuggingTextAreaID)
 // redrawChart()
 // displayDebugInformation()
 // connectThemAll()
 // drawChart()
 // drawLevel(index,centerX,centerY,radius)
 // determineLevel(x,y)
 //
 //////////////////////////////////////////////////////////////////////////////////////////////////
 
 function populateLevelElements(mode)
 {
	for(var j=0;j<levelRanges.length;j++)
	{
		levelElements[j] = new Array();
	}
	
	if(mode == "Degree")
	{
		for(var i=0;i<theElements.length;i++)
		{
			putIn = false;
			for(var j=0;j<levelRanges.length;j++)
			{
				if(adjacencyList[i].length >= levelRanges[j][0] && adjacencyList[i].length <= levelRanges[j][1])
				{
					levelElements[j].push(i);
					putIn = true;
					break;
				}
			}
			if(!putIn) // if value doesnt fit into any of the level ranges
			{
				// do something
			}
		}
	}
	else if(mode == "Content Count")
	{
		for(var i=0;i<theElements.length;i++)
		{
			putIn = false;
			for(var j=0;j<levelRanges.length;j++)
			{
					
				if(theElements[i].contentCount >= levelRanges[j][0] && theElements[i].contentCount <= levelRanges[j][1])
				{
					levelElements[j].push(i);
					putIn = true;
					break;
				}
			}
			if(!putIn) // if value doesnt fit into any of the level ranges
			{
				// do something
			}
		}
	}
	var debTA  = document.getElementById(debuggingTextAreaID);
	var debugText = "\n+++++++++++";
	
	for(var i =0 ; i<levelRanges.length;i++)
	{
		debugText +="\n" + i +":"; 
		for(var j=0;j<levelElements[i].length;j++)
		{
			debugText += levelElements[i][j]+" ";
		}
	}
	debTA.value = debTA.value +debugText;
 }
 
 function drawUnclassifiedNodes()
 {
	var context=canvas.getContext("2d");
	
	context.lineWidth=1;
	context.strokeStyle="black"; // line color
	context.fillStyle="lightgray"; // line color
	context.fillRect(canvas.width-175, canvas.height-50 , 135, 25);
	context.strokeRect(canvas.width-175, canvas.height-50 , 135, 25);
	
	context.fillStyle="black"; // line color
	context.font = "bold 10px sans-serif";
	context.fillText("Unclassified Node : Reg0", canvas.width-170, canvas.height-35);
 }
 
var ie  = document.all
var ns6 = document.getElementById&&!document.all
var isMenu  = false ;
var menuSelObj = null ;
var overpopupmenu = false;

function mouseSelect(e)
{
  var obj = ns6 ? e.target.parentNode : event.srcElement.parentElement;
  if( isMenu )
  {
    if( overpopupmenu == false )
    {
      isMenu = false ;
      overpopupmenu = false;
      document.getElementById('menudiv').style.display = "none" ;
      return true ;
    }
    return true ;
  }
  return false;
}

// POP UP MENU
function  showContextMenu(e)
{  

  var obj = ns6 ? e.target.parentNode : event.srcElement.parentElement; 
      menuSelObj = obj ;
  if (ns6)
  {
    document.getElementById('menudiv').style.left = e.clientX+document.body.scrollLeft+"px";
    document.getElementById('menudiv').style.top = e.clientY+document.body.scrollTop+"px";
  } else
  {
    document.getElementById('menudiv').style.pixelLeft = event.clientX+document.body.scrollLeft;
    document.getElementById('menudiv').style.pixelTop = event.clientY+document.body.scrollTop;
  }
  document.getElementById('menudiv').style.display = "";
  document.getElementById('item1').style.backgroundColor='#FFFFFF';
  document.getElementById('item2').style.backgroundColor='#FFFFFF';
  isMenu = true;
  return false ;
}
   
 function drawTheChart(theCanvasID,selectionCanvasID,TheLevelRanges,theElements,theAdjacencyList,theDebuggingTextAreaID,mode)
 {
	
	canvasID = theCanvasID;
	canvas  = document.getElementById(canvasID);
	canvas1 = document.getElementById("MyCanvas1");
	canvas2 = document.getElementById(selectionCanvasID);
	theMode = mode;
	
	levelRanges = TheLevelRanges;
	//elements = theElements;
	//adjacencyList = theAdjacencyList;
	debuggingTextAreaID = theDebuggingTextAreaID;
	RADIUS_OF_CIRCLES = Math.min((0.00001*canvas.width*canvas.height),10);
	
	if(octTreeRegions != undefined) octTreeRegions = [];
	
	drawChart();
	
	drawUnclassifiedNodes();
	
	canvas2.oncontextmenu = showContextMenu;
	canvas2.addEventListener("click", handleMouseClick);
	document.getElementById("zoomin").addEventListener("click",handleZoomIn);
	document.getElementById("zoomout").addEventListener("click",handleZoomOut);
 }
 
 function redrawChart()
 {
	octTreeRegions = [];
	//RADIUS_OF_CIRCLES = (0.00003*canvas.width*canvas.height);
	var canvasWidth = canvas.width;
	var radiusDecrement = (canvasWidth/2)/levelRanges.length;
	levelRadius = canvasWidth/2 - 20;
	var centerx = canvasWidth/2;
	var centery = canvasWidth/2;
	
	octTreeCounter = 0;
	initializeOctTree(0,0,canvas.width,canvas.height,LEVELS_IN_OCT_TREE,-1);
	drawOctTreeRegions(canvas,LEVELS_IN_OCT_TREE);
	
	for(var i = 0;i<levelRanges.length;i++)
	{
		drawLevel(i,centerx,centery,levelRadius);
		levelRadius-=radiusDecrement;
	}
	
	//connectThemAll();
	
	highlightSelectedNodes();
	
 }
   
 function displayDebugInformation()
 {
	var debTA  = document.getElementById(debuggingTextAreaID);
	var debugText = "";
	debugText += canvas.id +":"+theElements.length+"\n";
	
	for (var i=0;i<adjacencyList.length;i++)
	{
		debugText += "\n----------\n";
		debugText += theElements[i].name + "-" + theElements[i].description + ":";
		
		var elementNeighbors = adjacencyList[i];
		for(var j=0;j<elementNeighbors.length;j++)
		{
			debugText += theElements[elementNeighbors[j]].name +" ";
		}
	}
	debTA.value = debTA.value +debugText;
	//createGraph();
 }
   
 
 function connectThemAll()
 {
	for(var i=0;i<adjacencyList.length;i++)
	{
		var neighbors = adjacencyList[i];
		for (var j=0;j<neighbors.length;j++)
		{
			drawLine(canvas,theElements[i].X,theElements[i].Y,theElements[neighbors[j]].X,theElements[neighbors[j]].Y,0,1,0.1);
		}
	}
 }
 
 function drawChart()
 {
	populateLevelElements(theMode);
	
	var canvasWidth = canvas.width;
	var radiusDecrement = (canvasWidth/2)/levelRanges.length;
	levelRadius = canvasWidth/2 - 20;
	var centerx = canvasWidth/2;
	var centery = canvasWidth/2;
	
	octTreeCounter = 0;
	initializeOctTree(0,0,canvas.width,canvas.height,LEVELS_IN_OCT_TREE,-1);
	drawOctTreeRegions(canvas,LEVELS_IN_OCT_TREE);
	
	for(var i = 0;i<levelRanges.length;i++)
	{
		drawLevel(i,centerx,centery,levelRadius);
		levelRadius-=radiusDecrement;
	}
	
	//connectThemAll();
	viewOctTree(debuggingTextAreaID,octTreeRegions);
	
 }

 function drawLevel(index,centerX,centerY,radius)
 {
	
	var context=canvas.getContext("2d");
	
	context.lineWidth=1;
	context.strokeStyle="black"; // line color
	
	var degree = Math.PI * 2 / levelElements[index].length;
	var initDegree = Math.random() * 2 * Math.PI;
	
	drawGuideCircle(canvas,radius);
	
	for(var i=0;i<levelElements[index].length;i++)
	{
		if(isNaN(theElements[levelElements[index][i]].angle))
		{
			theElements[levelElements[index][i]].angle = initDegree; // would be used for zooming in
		}
		else
		{
			initDegree = theElements[levelElements[index][i]].angle;
		}
		
		var x = radius * Math.cos(initDegree); // x = r*cos(teta)
		var y = radius * Math.sin(initDegree); // x = r*cos(teta)
			
		theElements[levelElements[index][i]].X = x+centerX;
		theElements[levelElements[index][i]].Y = y+centerY;
		
		insertIntoOctTree(levelElements[index][i],x+centerX,y+centerY,0);
		
		drawCircle(canvas,RADIUS_OF_CIRCLES,x+centerX,y+centerY,"#33FF00");
		
		initDegree+=degree;
	}

}
   
 function determineLevel(x,y)
 {
	var centerX = canvas.width/2;
	var centerY = canvas.width/2;
	
	var distanceFromCenter = Math.sqrt(Math.pow((x - centerX),2) + Math.pow((y - centerY),2));
	var widthOfLevel= (canvas.width/2)/levelRanges.length;
	
	lowerLevel = (Math.floor(distanceFromCenter/widthOfLevel));
	higherLevel = (Math.ceil(distanceFromCenter/widthOfLevel))
	radiusOfLowerLevel = (lowerLevel+1) * widthOfLevel;
	radiusOfHigherLevel = (higherLevel+1) * widthOfLevel;
	
	if ((distanceFromCenter - radiusOfLowerLevel) <  (radiusOfHigherLevel - distanceFromCenter)) return lowerLevel;
	else
	{
		if (higherLevel<levelRanges.length)	return higherLevel;
		else return lowerLevel;
	}
 }
 
function handleMouseClick(evt) {

	unHighlightAllChildren();
	
	var debTA  = document.getElementById(debuggingTextAreaID);
		
	var context=canvas.getContext("2d")
	
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
	var scrollbar = document.getElementById("omw_scrollpane");
	//x += scrollbar.scrollLeft;
	//y += scrollbar.scrollTop;
	context.moveTo(x, y);
	var imgd = context.getImageData(x,y, 1, 1);
	var pix = imgd.data;
	
	var regionOfPress = new Object();
	regionOfPress.x = x-RADIUS_OF_CIRCLES;
	regionOfPress.y = y-RADIUS_OF_CIRCLES;
	regionOfPress.width  = RADIUS_OF_CIRCLES*2;
	regionOfPress.height  = RADIUS_OF_CIRCLES*2;			// based on hardcoded values for radius of the circle. should be changed once that is made automatic based on size of graph
	
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
		var levelAt = determineLevel(x,y);
		if(levelAt<levelRanges.length)
		{
			var levelContents = levelElements[levelRanges.length-1-levelAt];
			
			for(var i=0;i<levelContents.length;i++)
			{
				if(fallInRegion(regionOfPress,theElements[levelContents[i]].X,theElements[levelContents[i]].Y))
				{
					if(val1 == 51 && val2 == 255 && val3 == 0) // if unselected
					{
						selectedNodes.push(levelContents[i]);
						highlightChildren(levelContents[i]);
						highlightSelectedNodes();
						break;
					}
					else 	// if selected
					{
						if(evt.ctrlKey)	// selected again with ctrl key down should deselect the node
						{
							deselectNode(levelContents[i]);
							break;
						}
						else	//selected again without pressing the ctrl key should clear all selected other than this
						{
							handleDeselection();
							selectedNodes.push(levelContents[i]);
							highlightChildren(levelContents[i]);
							highlightSelectedNodes();
							break;
						}
					}
				}
			}
		}
	}
}

function highlightChildren(index)
{
	
	var context=canvas1.getContext("2d");
	
	context.lineWidth=1;
	context.strokeStyle="black"; // line color
	
	var children = adjacencyList[index];
	for(var i=0;i<children.length;i++)
	{
		drawLine(canvas1,theElements[children[i]].X,theElements[children[i]].Y,theElements[index].X,theElements[index].Y,0,1,0.5);
		
		if(!alreadySelected(children[i],selectedNodes))
		{
			highlightChild(children[i]);
			highlightedChildren.push(children[i]);
		}
	}
}

function unHighlightAllChildren()
{
	
	var context=canvas1.getContext("2d");
	
	context.clearRect(0 , 0 , canvas1.width , canvas1.height);
	
	for(var i=0;i<highlightedChildren.length;i++)
	{
		unHighlightChild(highlightedChildren[i]);
	}
	highlightedChildren = [];
}

function highlightChild(index)
{
	var x = theElements[index].X;
	var y = theElements[index].Y;
	
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	
}

function unHighlightChild(index)
{
	var x = theElements[index].X;
	var y = theElements[index].Y;
	
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	ctx.fillStyle = "#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
