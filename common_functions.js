
////////////////// functions //////////////////////
//
// rndColor()
// drawGuideCircle(theCanvas,radius)
// drawCircle(x,y,rgb)
// drawLine(x1,y1,x2,y2,value,thickness,transparency)
// alreadySelected(i,selNodes)
// centerScrollbar(scrollPanelIDString)
// highlightSelectedNodes()
// deselectNode(i)
// 
///////////////////////////////////////////////////


// INDEPENDENT


 
 function viewOctTree(dbTaID,OTRegions)
 {
	var debTA  = document.getElementById(dbTaID);
	debugText = "\nOCT-TREE HIERARCHY\n\n";
	for(var i=0;i<OTRegions.length;i++)
	{
		debugText+=i+" :";
		var ch = OTRegions[i].children;
		for(var j=0;j<ch.length;j++)
		{
			debugText += ch[j] + ",";
		}
		debugText += "\n";
	}
	debTA.value = debTA.value +debugText;
 }
 
  function drawOctTreeRegions(theCanvas,levels_in_Oct_tree)
 {
	var div = Math.pow(2,levels_in_Oct_tree-1);
	var divWidth = theCanvas.width/div;
	var divHeight = theCanvas.height/div;
	for(var i=1;i<div;i++)
	{
		drawLine(theCanvas,i*divWidth,0,i*divWidth,theCanvas.height,0,1,0.1);
		drawLine(theCanvas,0,i*divHeight,theCanvas.width,i*divHeight,0,1,0.1);
	}
 }
 
 

 function fallInRegion(region,x,y)
 {
	return (x>=region.x && x<=(region.x+region.width) && y>=region.y && y<=(region.y+region.height));
 }
 
 function overlappingRegions(region1,region2)
 {
	// if one of the points of one of the regions lies entirely within another region, then overlapping
	
	// for region1 against region2
	if((region1.x >= region2.x && region1.x <= (region2.x + region2.width)) && (region1.y >= region2.y && region1.y <= region2.y + region2.height)) return true;
	if(((region1.x+region1.width) >= region2.x && (region1.x+region1.width) <= (region2.x + region2.width)) && (region1.y >= region2.y && region1.y <= (region2.y + region2.height))) return true;
	if((region1.x >= region2.x && region1.x <= (region2.x + region2.width)) && ((region1.y+region1.height) >= region2.y && (region1.y+region1.height) <= (region2.y + region2.height))) return true;
	if(((region1.x+region1.width) >= region2.x && (region1.x+region1.width) <= (region2.x + region2.width)) && ((region1.y+region1.height) >= region2.y && (region1.y+region1.height) <= (region2.y + region2.height))) return true;
		
	// for region2 against region1	
	if((region2.x >= region1.x && region2.x <= (region1.x + region1.width)) && (region2.y >= region1.y && region2.y <= region1.y + region1.height)) return true;
	if(((region2.x+region2.width) >= region1.x && (region2.x+region2.width) <= (region1.x + region1.width)) && (region2.y >= region1.y && region2.y <= (region1.y + region1.height))) return true;
	if((region2.x >= region1.x && region2.x <= (region1.x + region1.width)) && ((region2.y+region2.height) >= region1.y && (region2.y+region2.height) <= (region1.y + region1.height))) return true;
	if(((region2.x+region2.width) >= region1.x && (region2.x+region2.width) <= (region1.x + region1.width)) && ((region2.y+region2.height) >= region1.y && (region2.y+region2.height) <= (region1.y + region1.height))) return true;

	// if none of the points of one region is within the other , there is still a possibility of overlap, if the regions overlap each other like a cross. 
	
	// region1 being the longer horizonral region and region 2 being the taller vertical region
	if(region2.x>=region1.x && (region2.x + region2.width <= region1.x + region1.width) && region2.y< region1.y && (region2.y + region2.height > region1.y + region1.height)) return true;
	
	// region2 being the longer horizonral region and region 2 being the taller vertical region
	if(region1.x>=region2.x && (region1.x + region1.width <= region2.x + region2.width) && region1.y< region2.y && (region1.y + region1.height > region2.y + region2.height)) return true;
	
	// cannot think of more conditions in which this test might fail . If anything comes up, add them here.
	
	return false;
 }
 
 function calculateIncrement(level)
 {
	if(level<=2) return 1;
	else
	{
		return 1+ 4*calculateIncrement(level-1);
	}
 }
 
 function drawLine(thecanvas,x1,y1,x2,y2,value,thickness,transparency) //  if u wanna directly mention numbers for thickness ,  set value = 0
 {
	var r=0,g=0,b=0;
	
	if(value>0)
		r = Math.round(value * 255);
	else 
		g = Math.round(-1* value * 255);
		
	//var color = new RGBColor("rgb("+r+","+g+","+b+")");
	var ctx = thecanvas.getContext("2d");
	
	if(value)
		ctx.lineWidth = value * 5;
	else 
		ctx.lineWidth = thickness;
		
	ctx.strokeStyle = "rgba("+r+","+g+","+b+","+transparency+")"
	ctx.beginPath();
	ctx.moveTo(x1, y1); 
	ctx.lineTo(x2, y2); 
	ctx.closePath();
	ctx.stroke();
 }
 
 function rndColor() 
 {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
 }
 
 function drawGuideCircle(theCanvas,radius)
 {
	var ctx = theCanvas.getContext("2d");

	var r = Math.round(Math.random()*256);
	var g = Math.round(Math.random()*256);
	var b = Math.round(Math.random()*256);
	var a = 0.3;
	
	var colorString = "rgba(" +r.toString()+ "," +g.toString()+ "," +b.toString()+ "," +a+ ")";
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = colorString;
	//draw a circle
	ctx.beginPath();
	ctx.arc(theCanvas.width/2, theCanvas.height/2, radius, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.stroke();
	//ctx.fill();
 }
 
 function drawCircle(theCanvas,circleRadius,x,y,rgb)
 {
	var ctx = theCanvas.getContext("2d");

	ctx.fillStyle = rgb;
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, circleRadius, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
 }
 
 function alreadySelected(i,selNodes)
 {
	for (var j=0;j<selNodes.length;j++)
	{
		if(selNodes[j] == i) return true;
	}
	return false;
 }
 
 function centerScrollbar(scrollPanelIDString,theCanvas)
 {
	var scrollbar = document.getElementById(scrollPanelIDString);
	var val;
	var styleProp="width";
	
	if (scrollbar.currentStyle)
		val = scrollbar.currentStyle[styleProp];
	else if (window.getComputedStyle)
		val = document.defaultView.getComputedStyle(scrollbar,null).getPropertyValue(styleProp);
	
	var scrollbarwidth = val.substring(0,val.length-2);
	
	if (scrollbarwidth< theCanvas.width)
	{
		scrollbar.scrollLeft =(theCanvas.width - scrollbarwidth)/2;
		scrollbar.scrollTop = (theCanvas.height - scrollbarwidth)/2;
	}
 }
  
  
 // DEPENDENT
 
 function highlightSelectedNodes()
 {
	if(userDefinedHighlightSelectedNodesExists == 1)
	{
		userDefinedHighlightSelectedNodes();
	}
	else
	{
		var debTA  = document.getElementById(debuggingTextAreaID);
		var debText = "\nSelected Nodes:";
		for(var i=0;i<selectedNodes.length;i++)
		{
			debText+=selectedNodes[i]+" ";
			drawCircle(canvas,RADIUS_OF_CIRCLES,theElements[selectedNodes[i]].X,theElements[selectedNodes[i]].Y,"#FF0000");
		}
		debText+="\n";
		debTA.value = debText;
	}
 }
  
function deselectNode(i)	// this 'i' refers to the index in the theElements array
{
	drawCircle(canvas,RADIUS_OF_CIRCLES,theElements[i].X,theElements[i].Y,"#33FF00");
	for(var j=0;j<selectedNodes.length;j++)
	{
		if(selectedNodes[j] == i)
		{
			selectedNodes.splice(j,1);
		}
	}
	highlightSelectedNodes();
}

function highlightSelectedNodes_H()
 {
	if(userDefinedHighlightSelectedNodesExists_H == 1)
	{
		userDefinedHighlightSelectedNodes_H();
	}
	else
	{
		var debTA  = document.getElementById(debuggingTextAreaID_H);
		var debText = "\nSelected Nodes:";
		for(var i=0;i<selectedNodes_H.length;i++)
		{
			debText+=selectedNodes_H[i]+" ";
			drawCircle(canvas_H,RADIUS_OF_CIRCLES_H,elements_H[selectedNodes_H[i]].X,elements_H[selectedNodes_H[i]].Y,"#FF0000");
		}
		debText+="\n";
		debTA.value = debText;
	}
 }
  
function deselectNode_H(i)	// this 'i' refers to the index in the theElements array
{
	drawCircle(canvas_H,RADIUS_OF_CIRCLES_H,elements_H[i].X,elements_H[i].Y,"#33FF00");
	for(var j=0;j<selectedNodes_H.length;j++)
	{
		if(selectedNodes_H[j] == i)
		{
			selectedNodes_H.splice(j,1);
		}
	}
	highlightSelectedNodes_H();
}
