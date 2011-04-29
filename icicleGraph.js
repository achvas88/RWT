 //******************************************************************************************************//
 // Javascript file that holds the datastructure and functionalities of the degreeBasedRadialSortGraph   //
 //******************************************************************************************************//
 
 //Dependencies

 //website : http://www.phpied.com/rgb-color-parser-in-javascript/
 document.write("<script type=\"text/javascript\" src=\"rgbcolor.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"common_functions.js\"></script>");
 document.write("<script type=\"text/javascript\" src=\"handleEvents_icicles.js\"></script>");
 
 ///////////// Datastructure /////////////////////////////////////////////////////////////////////

 // the canvas_I
 var canvas_I,canvas2_I;
 
 var LEVEL_HEIGHT = 20;
 
 // holds the elements_I present in each level
 var levelElements_I = new Array();
 
 // adjacencyList is a 2D array . 
 // Rows indicate the different elements_I
 // columns indicate the neighbors of the elements_I
 // each value is an object containing the description, location
 var childrenList_I = new Array();
 
 var elements_I = new Array();
 
 // for displaying debugging information
 var debuggingTextAreaID_I;
 
 // list of selected Node indices
 var selectedNodes_I = new Array();
 
 var highlightedChildren_I = new Array();
 
 var MAX_DEPTH = -1;
 ///////////// Functions //////////////////////////////////////////////////////////////////////////
 
 
 function populateLevelElements_I(parentIndex,depth)  
 {
	if(levelElements_I[depth])
	{
		for(var i=0;i<levelElements_I[depth].length;i++)
		{
			if(levelElements_I[depth][i] == parentIndex) return;
		}
	}
	else
	{
		levelElements_I[depth] = new Array();
	}
	levelElements_I[depth].push(parentIndex);
	
	if(childrenList_I[parentIndex] == undefined)childrenList_I[parentIndex] = new Array();
	
	for(var i=0;i<childrenList_I[parentIndex].length;i++)
	{
		populateLevelElements_I(childrenList_I[parentIndex][i],depth+1);
	}
 }
 
 
 function determineDepth(parentIndex,depth)  
 {
	if(MAX_DEPTH<depth)MAX_DEPTH = depth;
	
	if(childrenList_I[parentIndex] == undefined)return;
	
	for(var i=0;i<childrenList_I[parentIndex].length;i++)
	{
		determineDepth(childrenList_I[parentIndex][i],depth+1);
	}
 }
 
 function drawTheChart_I(theCanvasID,selectionCanvasID,theElements,theChildren,theDebuggingTextAreaID)
 {
	canvas_I  = document.getElementById(theCanvasID);
	canvas2_I = document.getElementById(selectionCanvasID);
	debuggingTextAreaID_I = theDebuggingTextAreaID;
	
	drawChart_I();
	
	canvas2_I.addEventListener("dblclick", handleDblClick_I,false);
	canvas2_I.addEventListener("click", handleMouseClick_I);
	document.getElementById("zoomin_I").addEventListener("click",handleZoomIn_I);
	document.getElementById("zoomout_I").addEventListener("click",handleZoomOut_I);
}
 
 function handleDblClick_I()
 {
	
 }
 
 function clearOldData()
 {
	for(var i=0;i<elements_I.length;i++)
	{
		elements_I[i].X = undefined;
	}
 }
 
 function redrawChart_I()
 {
	clearOldData();
	drawChart_I();
	highlightSelectedNodes_I();
 }
 
 function displayDebugInformation_I()
 {
	var debTA  = document.getElementById(debuggingTextAreaID_I);
	var debugText = "\n+++++++++++";
	
	for(var i =0 ; i<levelElements_I.length;i++)
	{
		debugText +="\n" + i +":"; 
		for(var j=0;j<levelElements_I[i].length;j++)
		{
			debugText += levelElements_I[i][j]+" ";
		}
	}
	debTA.value = debTA.value +debugText;
 }
 
 function drawChart_I()
 {
	
	if(MAX_DEPTH == -1)
	{
		determineDepth(0,0);
		MAX_DEPTH++;	// to account for starting off from index 0
	}
	
	LEVEL_HEIGHT = canvas_I.height/MAX_DEPTH;
	
	elements_I[0].X = 0;
	elements_I[0].Y = 0;
	elements_I[0].WIDTH = canvas_I.width;
	
	drawLevels_I(0,0,0,LEVEL_HEIGHT,canvas_I.width,0);
 }


 function drawElement(left,top,width,height)
 {
	drawRect(canvas_I,left,top,width,height,"#33FF00","black");
 }
 
 function drawChildrenOfElement(index,left,top,bottom,right,depth)
 {
    var width = right-left;
	var height = bottom-top;
	var listOfChildren = childrenList_I[index];
	
	if(listOfChildren == undefined || listOfChildren.length == 0)	// no children , then return
	{
		return;
	}
	else	// has children , so draw them
	{
		
		// determine size of children
			
		var totalChildrenOfChildren = 0;
			
		for(var i=0;i<listOfChildren.length;i++)
		{
			if(childrenList_I[listOfChildren[i]])
				totalChildrenOfChildren += childrenList_I[listOfChildren[i]].length;
			else
				totalChildrenOfChildren += 1;
		}
		
				
		for(var i=0,x=left;i<listOfChildren.length;i++)
		{
			var ratioOfTotalWidthOfParent;
			
			if(childrenList_I[listOfChildren[i]])
				ratioOfTotalWidthOfParent = (childrenList_I[listOfChildren[i]].length / totalChildrenOfChildren);
			else 
				ratioOfTotalWidthOfParent = 1 / totalChildrenOfChildren;
				
			var widthOfThisElement = ratioOfTotalWidthOfParent * width;
			
			if(elements_I[listOfChildren[i]].X ==  undefined) // means this element was not previously defined 
			{
				elements_I[listOfChildren[i]].X = x;
				elements_I[listOfChildren[i]].Y = top + LEVEL_HEIGHT;
				elements_I[listOfChildren[i]].WIDTH = widthOfThisElement;
				
				
				if(i == listOfChildren.length-1)
				drawLevels_I(listOfChildren[i],x,top + LEVEL_HEIGHT,bottom + LEVEL_HEIGHT,right,depth+1);
				
				drawLevels_I(listOfChildren[i],x,top + LEVEL_HEIGHT,bottom + LEVEL_HEIGHT,x+widthOfThisElement,depth+1);
			}
			
			x+=widthOfThisElement;	
		}
	}
 }
 
 function drawLevels_I(index,left,top,bottom,right,depth)
 {
	
	if(levelElements_I[depth] == undefined)
		levelElements_I[depth]= new Array();
	levelElements_I[depth].push(index);
	
	var width = right-left;
	var height = bottom-top;
	
	drawElement(left,top,width,height);
	drawChildrenOfElement(index,left,top,bottom,right,depth);
 }


function handleMouseClick_I(evt) {

	unHighlightAllChildren_I();

	var debTA  = document.getElementById(debuggingTextAreaID_I);
		
	var context=canvas_I.getContext("2d");
	
	var x, y;

    // Get the mouse position relative to the canvas_I element.
    if (evt.layerX || evt.layerX == 0) { // Firefox
      x = evt.layerX;
      y = evt.layerY;
    } else if (evt.offsetX || evt.offsetX == 0) { // Opera
      x = evt.offsetX;
      y = evt.offsetY;
    }
		
	context.moveTo(x, y);
	var imgd = context.getImageData(x,y, 1, 1);
	var pix = imgd.data;
			
	for(var i =0;i<pix.length;i+=4)
	{
		var val1 = pix[i]; // red
		var val2 = pix[i+1]; // green
		var val3 = pix[i+2]; // blue
	}
	
	if((val1 == 51 && val2 == 255 && val3 == 0) || (val1 == 255 && val2 == 0 && val3 == 0) || (val1 == 255 && val2 == 255 && val3 == 0))
	{
		var levelAt = determineLevel_I(y);
		
		var levelContents = levelElements_I[levelAt];
		
		for(var i=0;i<levelContents.length;i++)
		{
			var regionOfElement = new Object();
			regionOfElement.x = elements_I[levelContents[i]].X;
			regionOfElement.y = elements_I[levelContents[i]].Y;
			regionOfElement.width = elements_I[levelContents[i]].WIDTH;
			regionOfElement.height = LEVEL_HEIGHT;
			
			if(fallInRegion(regionOfElement,x,y))
			{
				if((val1 == 51 && val2 == 255 && val3 == 0) || (val1 == 255 && val2 == 255 && val3 == 0)) // if unselected
				{
					if(!evt.ctrlKey)
					{
						handleDeselection_I();
					}
					selectedNodes_I.push(levelContents[i]);
					highlightChildren_I(levelContents[i]);
					highlightSelectedNodes_I();
					break;
				}
				else 	// if selected
				{
					if(evt.ctrlKey)	// selected again with ctrl key down should deselect the node
					{
						deselectNode_I(levelContents[i]);
						break;
					}
					else	//selected again without pressing the ctrl key should clear all selected other than this
					{
						handleDeselection_I();
						selectedNodes_I.push(levelContents[i]);
						highlightChildren_I(levelContents[i]);
						highlightSelectedNodes_I();
						break;
					}
				}
			}
		}
	}
} 

function determineLevel_I(y)
 {
	return (Math.floor(y/LEVEL_HEIGHT));
 }

 function unHighlightAllChildren_I()
 {
	for(var i=0;i<highlightedChildren_I.length;i++)
	{
		unHighlightChild_I(highlightedChildren_I[i]);
	}
	highlightedChildren_I = [];
 } 

 function unHighlightChild_I(index)
 {
	var x = elements_I[index].X;
	var y = elements_I[index].Y;
	var width = elements_I[index].WIDTH;
	var height = LEVEL_HEIGHT;
	
	drawRect(canvas_I,x,y,width,height,"#33FF00","black");
 }

 function highlightChildren_I(index)
 {
	var children = childrenList_I[index];
	if(children == undefined) return;
	for(var i=0;i<children.length;i++)
	{
		if(!alreadySelected(children[i],selectedNodes_I))
		{
			highlightChild_I(children[i]);
			highlightedChildren_I.push(children[i]);
		}
	}
 }

 function highlightChild_I(index)
 {
	var x = elements_I[index].X;
	var y = elements_I[index].Y;
	var width = elements_I[index].WIDTH;
	var height = LEVEL_HEIGHT;
	
	drawRect(canvas_I,x,y,width,height,"#FFFF00","blue");
 } 
  