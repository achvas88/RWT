<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
	<title>Test</title>
</head>

<style type="text/css">
	#omw_scrollpane
	{
		width:80%;
		height:45%;
		overflow:auto;
		background-color:white;
		position:absolute;
		top:10%;
		left:0px;
	}
	
	#zoom_panel1
	{
		position:absolute;
		top:10%;
		left:0px;
	}
	
	
	#omw_scrollpane_H
	{
		width:80%;
		height:43%;
		overflow:auto;
		background-color:white;
		position:absolute;
		top:56%;
		left:0px;
	}
	
	#zoom_panel2
	{
		position:absolute;
		top:56%;
		left:0px;
	}
	
	
	
	#debug
	{
		position:absolute;
		top:0px;
		width:20%;
		left:80%;
		height:100%;
	}
	
</style> 

<link rel="stylesheet" type="text/css" href="dragresize/dragresize.css"></link> 
<link rel="stylesheet" type="text/css" id="listmenu-h"  href="fsmenu/listmenu_h.css" title="Horizontal 'Earth'" />
<link rel="stylesheet" type="text/css" id="fsmenu-fallback"  href="fsmenu/listmenu_fallback.css" />
<link rel="stylesheet" type="text/css" href="gwindow/gwindow.css" /> 
  
<script language="javascript" type="text/javascript" src="jquery-1.5.js"></script> 
<script language="javascript" type="text/javascript" src="degreeBasedRadialSortGraph.js"></script> 
<script language="javascript" type="text/javascript" src="hierarchialGraph.js"></script>
<script language="javascript" type="text/javascript" src="expandableContent.js"></script>
<script language="javascript" type="text/javascript" src="dragresize/dragresize.js"></script>
<script language="javascript" type="text/javascript" src="flot/jquery.js"></script> 
<script language="javascript" type="text/javascript" src="flot/jquery.flot.js"></script> 
<script language="javascript" type="text/javascript" src="flot/jquery.flot.selection.js"></script> 
<script language="javascript" type="text/javascript" src="fsmenu/fsmenu.js"></script>
<script type="text/javascript" src="gwindow/gwindow.js"></script> 

<script type="text/javascript">

var dragresize = new DragResize('dragresize',
 { minWidth: 100, minLeft: 0, minTop: 0 });

dragresize.isElement = function(elm)
{
 if (elm.className && elm.className.indexOf('drsElement') > -1) return true;
};
dragresize.isHandle = function(elm)
{
 if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
};

dragresize.apply(document);

</script> 

<script>

var theElements = new Array();
var adjacencyList = new Array();

</script>
	
	<?php

		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the List Of Regulons...</center></div>';
				
		$elssss = array();
						
		$dbhost = 'metnetdb.org:3306/';
		$dbname = 'aravindh';
		$dbuser = 'guest';
		$dbpass = '';
		$counter = 0;
		$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

		mysql_select_db($dbname);

		$result = mysql_query('SELECT RegulonID,count(distinct(Symbol)) FROM `aravindh`.`genes` group by RegulonID');
		if (!$result) 
		{
			die('Invalid query: ' . mysql_error());
		}
		else
		{
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) 
			{
				$counter++;
				echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the List Of Regulons...'.$counter.'</center></div>';
							
				array_push($elssss,$row[0]);
			
			
				echo '<script>' .
				'var obj = new Object();' .
				'obj.name = "RegID' . $row[0] . '";' .
				'obj.description = "Regulon ID : ' . $row[0] . '";' .
				'obj.contentCount = ' . $row[1] . ';' .
				'theElements.push(obj);' .
				'</script>';
				
			}
			echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading complete...'.$counter.'</center></div>';
		}
		
		mysql_close($conn);
		unset($row);
	
	?>
	
	<!--	loading the regulon-regulon network -->
	
	<?php
	
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the regulon-regulon network...</center></div>';
			
		$dbhost = 'metnetdb.org:3306/';
		$dbname = 'achvas';
		$dbuser = 'guest';
		$dbpass = '';
		$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

		$listOfNeighbors = array();
		
		mysql_select_db($dbname);
	
								
		$neighborsList = array();
		$query =  'SELECT `Connected_Regs` FROM `achvas`.`reg_reg_table`';
		$result = mysql_query($query);
		if (!$result) 
		{
			die('Invalid query: ' . mysql_error());
		}
		else
		{
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) 
			{
				$neighborsList[] = ''.$row[0].'';
			}
		}
	
		
		mysql_close($conn);
		
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the regulon-regulon network completed</center></div>';
		
		
		unset($row);
		unset($elssss);
		unset($query);
		unset($result);
		unset($dbhost);
		unset($dbname);
		unset($dbuser);
		unset($dbpass);
		unset($conn);
	?>
	
	<?
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Initializing...</center></div>';
		
		echo '<script>var neighborsList = new Array();</script>';
		
		for($i=0;$i<count($neighborsList);$i++)
		{
			echo '<script>var tempNeigh = new Array();</script>';
			echo '<script>tempNeigh.push(' .$neighborsList[$i]. ');</script>';
			echo '<script>adjacencyList.push(tempNeigh);</script>';
		}

		unset($neighborsList);
	?>
	
	
<script>

 var userDefinedHighlightSelectedNodesExists = true;
 var userDefinedHighlightSelectedNodesExists_H = false;
 
 var OFFSETX = 0;
 var OFFSETY = -1 * document.height * 0.1;
 var OFFSETX_H = 0;
 var OFFSETY_H = -1 * document.height * 0.56;
 var contentCountThresholdValue = 1500;
  
 var canvas2;
 var isDown = false;
 var startX,startY,endX,endY;
 var theMode = "Content Count";
 
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
 
 function clearSelectedList()
 {
	var sList = document.getElementById("selectedList");
	var aList = document.getElementById("allList");
	while(sList.options.length>0)
	{
		aList.options[sList.options[0].ind].selected = false;
		sList.options.remove(0);
	}
 }
 
 function userDefinedHighlightSelectedNodes()
 {
 
	var sList = document.getElementById("selectedList");
	var aList = document.getElementById("allList");
	
	clearSelectedList();
	
	var debTA  = document.getElementById(debuggingTextAreaID);
	var debText = "\nSelected Nodes:";
	for(var i=0;i<selectedNodes.length;i++)
	{
		debText+=selectedNodes[i]+" ";
		drawCircle(canvas,RADIUS_OF_CIRCLES,theElements[selectedNodes[i]].X,theElements[selectedNodes[i]].Y,"#FF0000");
		
		var newoptn = document.createElement("OPTION");
		newoptn.text = theElements[selectedNodes[i]].name;
		newoptn.ind = selectedNodes[i]; // corresponds to the index in the alllist
		sList.options.add(newoptn);	
		
		aList.options[selectedNodes[i]].selected = true;
	}
	debText+="\n";
	debTA.value = debText;
 }
 
 function neighborListToAdjacencyList()
 {
	var lV =  document.getElementById("loadedValue");
	lV.innerHTML = "Converting Neighbor List To Adjacency List";
	
	for(var i=0;i<neighborsList.length;i++)
	{
		if(neighborsList[i].length == 1 && neighborsList[i][0] == "\"\"")
		{
			adjacencyList.push(new Array());
		}
		else
		{
			var theNeighbors = ''+neighborsList[i]+'';
			var neighborArray = theNeighbors.split(',');
			adjacencyList.push(neighborArray);
		}
	}
}
 
 function createTheGraphContents()
 {
	var canvasID = "myCanvas";
	var selectionCanvasID = "MyCanvas2";
	var theDebuggingTextAreaID = "debugTA";
	var contentCountThreshold = document.getElementById('thresh');
		
	
	//neighborListToAdjacencyList();
	
		
	//var adjacencyList = [[1,2],[0],[0,3],[2,4,5],[3],[3],[]];
	/*for(var i=0;i<theElements.length;i++)
	{
		var randList = new Array();
		
		var noofneighbors = Math.floor(Math.random()*10);
		
		for(var j=0;j<noofneighbors;j++)		// too rough.. these noofneighbors do not actually reflect on the actual number of neighbors.
		{
			var neighbor = Math.floor(Math.random()*theElements.length);
			if(neighbor != i && notAlreadyPresent(randList,neighbor))
			{
				randList.push(neighbor)
			}
		}
		
		adjacencyList.push(randList);
	}
	*/
	
	
	var levelRanges = [[0,2],[3,4],[5,10],[11,20],[21,50],[51,500],[501,12000]];
	
	var lRangesBox = document.getElementById('lRanges');
	
	for(var i=0;i<levelRanges.length;i++)
	{
		var newoptn = document.createElement("OPTION");
		newoptn.text = levelRanges[i];
		lRangesBox.options.add(newoptn);	
	}
	lRangesBox.size = 2;
	
	drawTheChart(canvasID,selectionCanvasID,levelRanges,undefined,undefined,theDebuggingTextAreaID,"Content Count"); //contents, degree - modes
	displayDebugInformation();
 }
 
 function parseStringToNumberArray( theString)
 {
		var stringArray = theString;
		var stringnum1 = "";
		var stringnum2 = "";
		var num1 = new Number();
		var num2 = new Number();
		var first = true;
		for(var j=0;j<stringArray.length;j++)
		{
			if(stringArray[j] == ",") 
			{
				first = false;
				continue;
			}
			if(first)
			{
				stringnum1 +=stringArray[j];
			}
			else
			{
				stringnum2 +=stringArray[j];
			}
		}
		
		num1 = stringnum1;
		num2 = stringnum2;
		
		var levelarray = new Array();
		levelarray.push(stringnum1);
		levelarray.push(stringnum2);
		return levelarray;
 }
 
 function editLevel()
 {
	var canvas = document.getElementById('myCanvas');
	var canvas1 = document.getElementById('MyCanvas1');
	var canvas2 = document.getElementById('MyCanvas2');
	var ctx = canvas.getContext("2d");
	var ctx1 = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var lRangesBox = document.getElementById('lRanges');
	
	var response = window.prompt('Enter the new range (format: [number],[number])');
	lRangesBox.options[lRangesBox.selectedIndex].text = response;
	
	var levelRanges = new Array(); 
	for(var i=0;i<lRangesBox.options.length;i++)
	{
		levelRanges.push(parseStringToNumberArray(lRangesBox.options[i].text));
	}
	
	for(var j=0;j<theElements.length;j++)	// nullify the initial angles of the theElements
	{
		theElements[j].angle = undefined;
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	ctx2.clearRect(0,0,canvas2.width,canvas2.height);
	
	drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Content Count"); //contents, degree - modes
	
 }
  
 function removeLevel()
 {
	var canvas = document.getElementById('myCanvas');
	var canvas1 = document.getElementById('MyCanvas1');
	var canvas2 = document.getElementById('MyCanvas2');
	var ctx = canvas.getContext("2d");
	var ctx1 = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	
	var lRangesBox = document.getElementById('lRanges');
	lRangesBox.options.remove(lRangesBox.selectedIndex);
	
	var levelRanges = new Array(); 
	for(var i=0;i<lRangesBox.options.length;i++)
	{
		levelRanges.push(parseStringToNumberArray(lRangesBox.options[i].text));
	}
	
	for(var j=0;j<theElements.length;j++)	// nullify the initial angles of the theElements
	{
		theElements[j].angle = undefined;
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	ctx2.clearRect(0,0,canvas2.width,canvas2.height);
	
	drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Content Count"); //contents, degree - modes
 }
 
 function addLevel()
 {
	var canvas = document.getElementById('myCanvas');
	var canvas1 = document.getElementById('MyCanvas1');
	var canvas2 = document.getElementById('MyCanvas2');
	var ctx = canvas.getContext("2d");
	var ctx1 = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var lRangesBox = document.getElementById('lRanges');
	
	var response = window.prompt('Enter the new range (format: [number],[number])');
	var newoptn = document.createElement("OPTION");
	newoptn.text = response;
	lRangesBox.options.add(newoptn);	
		
	
	var levelRanges = new Array(); 
	for(var i=0;i<lRangesBox.options.length;i++)
	{
		levelRanges.push(parseStringToNumberArray(lRangesBox.options[i].text));
	}
	
	for(var j=0;j<theElements.length;j++)	// nullify the initial angles of the theElements
	{
		theElements[j].angle = undefined;
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	ctx2.clearRect(0,0,canvas2.width,canvas2.height);
	
	drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Content Count"); //contents, degree - modes
 
 }

 function moveLevelUp()
 {
	var canvas = document.getElementById('myCanvas');
	var canvas1 = document.getElementById('MyCanvas1');
	var canvas2 = document.getElementById('MyCanvas2');
	var ctx = canvas.getContext("2d");
	var ctx1 = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var lRangesBox = document.getElementById('lRanges');
	
	//var response = window.prompt('Enter the new range (format: [number],[number])');
	//var newoptn = document.createElement("OPTION");
	//newoptn.text = response;
	//lRangesBox.options.add(newoptn);	
		
	if(lRangesBox.selectedIndex>0)
	{
		var temp = lRangesBox.options[lRangesBox.selectedIndex].text;
		lRangesBox.options[lRangesBox.selectedIndex].text = lRangesBox.options[lRangesBox.selectedIndex-1].text;
		lRangesBox.options[lRangesBox.selectedIndex-1].text = temp;
		lRangesBox.selectedIndex = lRangesBox.selectedIndex-1;
		
		var levelRanges = new Array(); 
		for(var i=0;i<lRangesBox.options.length;i++)
		{
			levelRanges.push(parseStringToNumberArray(lRangesBox.options[i].text));
		}
		
		for(var j=0;j<theElements.length;j++)	// nullify the initial angles of the theElements
		{
			theElements[j].angle = undefined;
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx1.clearRect(0,0,canvas1.width,canvas1.height);
		ctx2.clearRect(0,0,canvas2.width,canvas2.height);
		
		drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Content Count"); //contents, degree - modes
	} 
 }
 
 function moveLevelDown()
 {
	var canvas = document.getElementById('myCanvas');
	var canvas1 = document.getElementById('MyCanvas1');
	var canvas2 = document.getElementById('MyCanvas2');
	var ctx = canvas.getContext("2d");
	var ctx1 = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var lRangesBox = document.getElementById('lRanges');
	
	//var response = window.prompt('Enter the new range (format: [number],[number])');
	//var newoptn = document.createElement("OPTION");
	//newoptn.text = response;
	//lRangesBox.options.add(newoptn);	
		
	if(lRangesBox.selectedIndex<lRangesBox.options.length-1)
	{
		var temp = lRangesBox.options[lRangesBox.selectedIndex].text;
		lRangesBox.options[lRangesBox.selectedIndex].text = lRangesBox.options[lRangesBox.selectedIndex+1].text;
		lRangesBox.options[lRangesBox.selectedIndex+1].text = temp;
		lRangesBox.selectedIndex = lRangesBox.selectedIndex+1;
		
		var levelRanges = new Array(); 
		for(var i=0;i<lRangesBox.options.length;i++)
		{
			levelRanges.push(parseStringToNumberArray(lRangesBox.options[i].text));
		}
		
		for(var j=0;j<theElements.length;j++)	// nullify the initial angles of the theElements
		{
			theElements[j].angle = undefined;
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx1.clearRect(0,0,canvas1.width,canvas1.height);
		ctx2.clearRect(0,0,canvas2.width,canvas2.height);
		
		drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Content Count"); //contents, degree - modes
	} 
 }
 
 
 function updateMode()
 {
	var modes = document.getElementById('modes');
	var cmode = document.getElementById('cmode');
	var lRangesBox = document.getElementById('lRanges');
	var canvas = document.getElementById('myCanvas');
	var canvas1 = document.getElementById('MyCanvas1');
	var canvas2 = document.getElementById('MyCanvas2');
	var ctx = canvas.getContext("2d");
	var ctx1 = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	
	while(lRangesBox.options.length>0) lRangesBox.options.remove(0);
	
	for(var i=0;i<modes.options.length;i++)
	{
	
		if(modes.options[i].selected == true && theMode!=modes.options[i].value)
		{
			for(var j=0;j<theElements.length;j++)	// nullify the initial angles of the theElements
			{
				theElements[j].angle = undefined;
			}
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx1.clearRect(0,0,canvas1.width,canvas1.height);
			ctx2.clearRect(0,0,canvas2.width,canvas2.height);
			
			theMode=modes.options[i].value;
			cmode.innerHTML = theMode;
			if(theMode == "Degree")
			{
				var levelRanges = [[0,2],[3,5],[6,8],[9,10]];
				for(var i=0;i<levelRanges.length;i++)
				{
					var newoptn = document.createElement("OPTION");
					newoptn.text = levelRanges[i];
					lRangesBox.options.add(newoptn);	
				}
				lRangesBox.size = 2;
				drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Degree"); //contents, degree - modes
			}
			else if(theMode == "Content Count")
			{
				var levelRanges = [[0,2],[3,4],[5,10],[11,20],[21,50],[51,500],[501,12000]];
				for(var i=0;i<levelRanges.length;i++)
				{
					var newoptn = document.createElement("OPTION");
					newoptn.text = levelRanges[i];
					lRangesBox.options.add(newoptn);	
				}
				lRangesBox.size = 2;
				drawTheChart("myCanvas","MyCanvas2",levelRanges,undefined,undefined,"debugTA","Content Count"); //contents, degree - modes
			}
		}
	}
 }
 
 function notAlreadyPresent(randList,neighbor)
 {
	for(var i=0;i<randList.length;i++)
	{
		if(randList[i] == neighbor) return false;
	}
	return true;
 }
 
 var started = false;
  
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

var listMenu;
var arrow = null;

function createMenu()
{
	listMenu = new FSMenu('listMenu', true, 'display', 'block', 'none');
	listMenu.animations[listMenu.animations.length] = FSMenu.animFade;
	//listMenu.animations[listMenu.animations.length] = FSMenu.animSwipeDown;
	listMenu.animations[listMenu.animations.length] = FSMenu.animClipDown;
	listMenu.showOnClick = 1;
	
	if (document.createElement && document.documentElement)
	{
	 arrow = document.createElement('span');
	 arrow.appendChild(document.createTextNode('>'));
	 arrow.className = 'subind';
	}
	addReadyEvent(new Function('listMenu.activateMenu("listMenuRoot", arrow)'));
}

function init()
{
	createTheGraphContents();
	//initializeChart();
	populateSelectBox();
	//createMenu();
	canvas2 = document.getElementById("MyCanvas2");
	canvas2.addEventListener("mousedown", handleMouseDown);
	canvas2.addEventListener("mouseup", handleMouseUp);
	canvas2.addEventListener("mousemove", handleMouseMove);
}


 var canvas2_H;
 var isDown_H = false;
 var startX_H,startY_H,endX_H,endY_H;
 
function createTheGraphContents_H()
 {
	var canvasID = "myCanvass";
	var selectionCanvasID = "MyCanvass2";
	var theDebuggingTextAreaID = "debugTA";
	
	var theElements = [{"name":"root","description":"none"},{"name":"a","description":"one"},{"name":"b","description":"two"},{"name":"c","description":"three"},{"name":"d","description":"four"},{"name":"e","description":"five"},{"name":"f","description":"six"},{"name":"g","description":"seven"}];
	var children = [[1,2],[3,4],[3,6],[5],[5,7],[],[7],[]];
		
	drawTheChart_H(canvasID,selectionCanvasID,theElements,children,theDebuggingTextAreaID);
	displayDebugInformation_H();
}

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
 
function init_H()
{
	createTheGraphContents_H();

	canvas2_H = document.getElementById("MyCanvass2");
	canvas2_H.addEventListener("mousedown", handleMouseDown_H);
	canvas2_H.addEventListener("mouseup", handleMouseUp_H);
	canvas2_H.addEventListener("mousemove", handleMouseMove_H);
}


function viewDetails()
{
	var theSelectedList = document.getElementById('selectedList');
	var debTA  = document.getElementById(debuggingTextAreaID);
	var details = "Selected Nodes:\n\n";
	
	for(var i=0;i<theSelectedList.options.length;i++)
	{
		if(theSelectedList.options[i].selected == true)
		{
			details += "-----------------------\n";
			details += "Regulon Name: " + theElements[theSelectedList.options[i].ind].name +  "\n";
			details += "Description: " + theElements[theSelectedList.options[i].ind].description +  "\n";
			details += "Genes contained: " + theElements[theSelectedList.options[i].ind].contentCount +  "\n";
			
			var neighbors = adjacencyList[theSelectedList.options[i].ind];
			details += "Number of Neighbors: " + neighbors.length + "\n";
			
			details += "Neighboring Regulons: ";
			for(var j=0;j<neighbors.length;j++)
			{
				details += ""+ theElements[neighbors[j]].name;
				if(j<neighbors.length-1)details += ", ";
			}
			details += "\n";
		}
	}
	
	debTA.value = details;
}

function selectionAction(optn,ctrl)
{
   var theSelectedList = document.getElementById('selectedList');
   var theWholeList = document.getElementById('allList');
   
   if(!ctrl)
   {
   		while(theSelectedList.options.length>0)
		{
			theSelectedList.options.remove(0);
		}
		
		var newoptn = document.createElement("OPTION");
		newoptn.text = optn.text;
		newoptn.ind = optn.ind; // corresponds to the index in the alllist and the theElements array
		theSelectedList.options.add(newoptn);
		handleDeselection();
		selectedNodes.push(optn.ind);
		highlightSelectedNodes();
		return;
   }
	
   if(optn.selected) // if selected
   {
		//check if already in selected 
		var flag = 1;
   		for(var i=0;i<theSelectedList.options.length;i++)
		{
			if(theSelectedList.options[i].text == optn.text)	// if yes flag =0
			{
				flag = 0;
				break;
			}
		}
		if(flag == 1) // if not already selected
		{
			var newoptn = document.createElement("OPTION");
			newoptn.text = optn.text;
			newoptn.ind = optn.ind;
			theSelectedList.options.add(newoptn);	
			selectedNodes.push(optn.ind);
			highlightSelectedNodes();
		}
	}	
	else // if unselected
	{
		//check if in selected 
		for(var i=0;i<theSelectedList.options.length;i++)
		{
			if(theSelectedList.options[i].text == optn.text)	// if yes remove it
			{
				deselectNode(theSelectedList.options[i].ind);
				theSelectedList.options.remove(i);
				break;
			}
		}
	}
}


var counterr = -1;

function addOption(selectbox)
{
	sbox = document.getElementById(selectbox);
	var ta = document.getElementById("loadedValue");
	var taholder = document.getElementById("loading");
	taholder.style.display = "block";
	counterr++;
	if(counterr >= theElements.length)
	{
		if(stID!=undefined)
			clearInterval(stID);
		//ta.value = "Loaded " + theElements.length + " Regulons";
		ta.innerHTML = "<center>&nbsp; Loading complete &nbsp;</center>";
		taholder.style.display = "none";
		return;
	}
	
	ta.innerHTML = "<center>&nbsp; Loading : "+Math.floor((counterr+1)/theElements.length * 100)+"% &nbsp;</center>";
	
	var optn = document.createElement("OPTION");
	optn.text = theElements[counterr].name;
	optn.ind = counterr;
	optn.onclick = function(evt)
	{
		selectionAction(this,evt.ctrlKey);
	}
	sbox.options.add(optn);
	
}

var stID;

function populateSelectBox()
{
	//stID = setInterval("addOption('allList')",0);
	
	for(var i=0;i<theElements.length + 1;i++)
	{
		addOption('allList');
	}
	
}

function mouseSelect(e)
{

}

// POP UP MENU
function  ItemSelMenu(e)
{
  return false;
}

/*
<?php
		$sql = "SELECT category_id, category_name FROM categories ".
		"ORDER BY category_name";

		$rs = mysql_query($sql);

		while($row = mysql_fetch_array($rs))
		{
		  echo "<option value=\"".$row['category_id']."\">".$row['category_name']."\n  ";
		}
		?>
*/

function removeSelected()
{
	sbox = document.getElementById('selectedList');
	abox = document.getElementById('allList');
	
	for(var i=0;i<sbox.options.length;i++)
	{
		if(sbox.options[i].selected) 
		{
			abox.options[sbox.options[i].ind].selected = false;
			drawCircle(canvas,RADIUS_OF_CIRCLES,theElements[sbox.options[i].ind].X,theElements[sbox.options[i].ind].Y,"#33FF00");
			for(var j=0;j<selectedNodes.length;j++)
			{
				if(selectedNodes[j] == sbox.options[i].ind)
				{
					selectedNodes.splice(j,1);
				}
			}
			sbox.options.remove(i);
			//remove() ////////////////////////////////////////////
			i--;
		}
	}
}

function initializeChart()
{
$(function () {
    // setup plot
    function getData() {
        var d = [];
        for (var i = 0; i < theElements.length; ++i) {
            d.push([i, theElements[i].contentCount]);
        }
 
        return [
            { label: "Number of genes", data: d }
        ];
    }
 
    var options = {
	legend: { show: true },
        series: {
            lines: { show: false },
			points: { show: true }
		},
		xaxis: { ticks: []},
		grid: { hoverable: true, clickable: true },
		selection: { mode: "x" }
    };
 
    var startData = getData();
    
    var plot = $.plot($("#placeholder"), startData, options);
 
    // setup overview
    var overview = $.plot($("#overview"), startData, {
		legend: { show: false },
        series: {
            bars: { show: true, lineWidth: 1 },
            shadowSize: 0
        },
        
        grid: { color: "#AAA" },
        selection: { mode: "x" }
    });
 
    // now connect the two
    
    $("#placeholder").bind("plotselected", function (event, ranges) {
        // clamp the zooming to prevent eternal zoom
        if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
        if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
            ranges.yaxis.to = ranges.yaxis.from + 0.00001;
        
        // do the zooming
        plot = $.plot($("#placeholder"), getData(ranges.xaxis.from, ranges.xaxis.to),
                      $.extend(true, {}, options, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
                          yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
                      }));
        
        // don't fire event on the overview to prevent eternal loop
        overview.setSelection(ranges, true);
    });
	
    $("#overview").bind("plotselected", function (event, ranges) {
        plot.setSelection(ranges);
    });
	
	$("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) {
            
			unHighlightAllChildren();
			handleDeselection();
			selectedNodes.push(item.dataIndex);
			highlightChildren(item.dataIndex);
			highlightSelectedNodes();
			
            //plot.highlight(item.series, item.datapoint);
        }
    });
	
	function showTooltip(x, y, contents) {
        $('<div id="tooltip" style="">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
			'z-index': 2000,
            'background-color': '#EEE',
            opacity: 0.8
        }).appendTo("body").fadeIn(200);
    }
	
	var previousPoint = null;
    $("#placeholder").bind("plothover", function (event, pos, item) {
        
        
		if (item) {
			if (previousPoint != item.datapoint) {
				previousPoint = item.datapoint;
				
				$("#tooltip").remove();
				var x = item.datapoint[0],
					y = item.datapoint[1];
				
				showTooltip(item.pageX, item.pageY,
							item.series.label + " in " + theElements[x].name + " is " + y);
			}
		}
		else {
			$("#tooltip").remove();
			previousPoint = null;            
		}
        
    });
});
}

var test = new Array();
test["a"] = 0;
test["b"] = 1;
test["c"] = 2;
test["d"] = 3;


function viewGenes()
{
	var theLevel = document.getElementById('level');
	theLevel.innerHTML = "Gene Level";
	
	//alert(test["a"] + test["b"] + test["c"] + test["d"]);
	//if (test["asd"] == undefined) alert("oh yeah baby");
}

function select()
{
	var tf = document.getElementById('regID');
	var aList = document.getElementById("allList");
	var sList = document.getElementById("selectedList");
	
	for(var i=0;i<sList.options.length;i++)	// check if already selected
	{
		if(sList.options[i].text == tf.value) return;
	}
	
	for(var i=0;i<theElements.length;i++)
	{
		if(theElements[i].name == tf.value)
		{
			aList.options[i].selected = true;
						
			var newoptn = document.createElement("OPTION");
			newoptn.text = tf.value;
			newoptn.ind = i;
			sList.options.add(newoptn);	
			selectedNodes.push(i);
			highlightSelectedNodes();
		}
	}
	
}

var zoomed1 = false

function fullscreen1()
{
		var new_height;
		var scrollpanel = document.getElementById("omw_scrollpane");

		var otherscrollpanel = document.getElementById('omw_scrollpane_H')
		var button = document.getElementById('fullScreen');
		var otherZoomIn = document.getElementById('zoomin_H');
		var otherZoomOut = document.getElementById('zoomout_H');
		var otherFullScreen = document.getElementById('fullScreen2_H');
		var otherLevel = document.getElementById('level2');
		
		if (zoomed1) 
		{
			new_height = "45%";
			otherscrollpanel.style.display = "block";
			otherZoomIn.style.display = "block";
			otherZoomOut.style.display = "block";
			otherFullScreen.style.display = "block";
			otherLevel.style.display = "block";
		}
		else 
		{
			new_height = "89%";
			otherscrollpanel.style.display = "none";
			otherZoomIn.style.display = "none";
			otherZoomOut.style.display = "none";
			otherFullScreen.style.display = "none";
			otherLevel.style.display = "none";
		}

		zoomed1 = !zoomed1;
		scrollpanel.style.height = new_height;
	
}

var zoomed2 = false

function fullscreen2()
{
		var new_height;
		var new_ypos;
		var scrollpanel = document.getElementById("omw_scrollpane_H");

		var otherscrollpanel = document.getElementById('omw_scrollpane')
		var button = document.getElementById('fullScreen2_H');
		var otherZoomIn = document.getElementById('zoomin');
		var otherZoomOut = document.getElementById('zoomout');
		var otherFullScreen = document.getElementById('fullScreen');
		var otherLevel = document.getElementById('level');
		var zoomPanel = document.getElementById('zoom_panel2');
		
		if (zoomed2) 
		{
			new_ypos = "56%";
			new_height = "43%";
			otherscrollpanel.style.display = "block";
			otherZoomIn.style.display = "block";
			otherZoomOut.style.display = "block";
			otherFullScreen.style.display = "block";
			otherLevel.style.display = "block";
			OFFSETY_H = -1 * document.height * 0.56;
		}
		else 
		{
			new_ypos = "10%";
			new_height = "89%";
			otherscrollpanel.style.display = "none";
			otherZoomIn.style.display = "none";
			otherZoomOut.style.display = "none";
			otherFullScreen.style.display = "none";
			otherLevel.style.display = "none";
			OFFSETY_H = -1 * document.height * 0.1;
		}

		zoomed2 = !zoomed2;
		
		scrollpanel.style.height = new_height;
		scrollpanel.style.top = new_ypos;
		zoomPanel.style.top = new_ypos;
}


var gwin;
var chart_shown = false;

function changeThreshold()
{
  response = window.prompt("Enter New Threshold Value");
  if(!isNaN(response))
  {
	contentCountThresholdValue = response;
  }
  return;
}

function viewChart() {

	var vcID = document.getElementById("viewChartID");

	if(chart_shown==false)
	{
		chart_shown = true;
		if(gwin==undefined)
		{
			gwin = new GWindow(null,"Regulon - Gene Content Relationship Graph");
			gwin.setDockable(false);
			gwin.dock(false);
			gwin.showIcon(false);
			gwin.setSize(1000,200,GWindow.UNDOCKED);
			gwin.setClosable(false,GWindow.UNDOCKED);
			
			gwin.getBodyElement().innerHTML = 	"<div>"+
												"<div id=\"placeholder\" style=\"position:absolute;left:3%;width:70%;height:70%;z-index:100;top:20%\"></div>"+
												"<div id=\"miniature\" style=\"z-index:100;float:left;top:20%;\">"+
												"<div id=\"overview\" style=\"z-index:100;position:absolute;top:20%;width:20%;height:70%;left:75%\"></div></div></div>";
			initializeChart();
		}
		else
		{
			gwin.show(true);
		}
		
		vcID.innerHTML = "Hide Chart";
	}
	else
	{
		gwin.show(false);
		chart_shown = false;
		
		vcID.innerHTML = "View Chart";
	}
}


</script>

<!-- Visualization Mode -->
<!--div id="mode" style= "float:left;margin-left:10px;margin-top:20px;width:200px"> 
	<center>
		Visualization Mode : <div id="cmode">Content Count</div><br>
		<select id="modes">
		  <option name = "degree" value= "Degree">Degree</option>
		  <option name = "contentCount" value= "Content Count" selected>Content Count</option>
		</select>
		<br>
		<button type="submit" onclick = "updateMode();"> Update Mode</button>
	</center>
</div-->		

<body onload="init();init_H();">

	
	
	<!-- -->
	<div id="menudiv" style="position:absolute; display:none; top:50px; left:50px;z-index:10000;" onmouseover="javascript:overpopupmenu=true;" onmouseout="javascript:overpopupmenu=false;">
		<table width=82 cellspacing=1 cellpadding=0>
		  <tr><td>
			<table width=80 cellspacing=0 cellpadding=0>
			  <tr>
				<td id="desc" bgcolor="#FFFFAA" width="80" height="16" >The description goes here</td>
			  </tr>
			  
			</table>
		  </td></tr>
		</table>
	</div>
	
	<div id="loading" style="display:block;">
		<div style="background-color:gray;border: 1px solid #000;color:white;width:100%;opacity:0.4;z-index:5000;position:absolute;top:0px;left:0px;height:100%;"></div>	
		<div id="loadedValue" style="position:absolute;top:50%;left:45%;z-index:5001;background-color:white;border: 2px solid gray"><center><img src = 'loading.gif' ></center></div>
	</div>
	
	
	<div style="background-color:#000000;border: 1px solid #000;color:white;width:80%;position:absolute;top:0px;left:0px;height:10%;background-image:url('');background-position:right bottom;background-size:100%"><center><h3>Visualization Tool for Genomic Data</h3></center></div>	
	
	<ul class="menulist" id="listMenuRoot" style="position:absolute;top:10px;left:10px;height:30px;z-index: 10">
		<li>
			<a href="#" style="background-color:black"><img src = "configuration-icon.png" width = "20px" height = "20px"> </a>
			<ul>
				<li><a href="#">Set Species</a>
					<ul>
						<li><a href="#">Arabidopsis Thaliana</a></li>
						<li><a href="#">Human</a></li>
						<li><a href="#">Yeast</a></li>
					</ul>
				</li>
				<li><a href="#" onclick="viewChart();"><div id="viewChartID">View Chart</div></a></li>
				<li><a href="#" onclick="changeThreshold();">Set Threshold Value for Regulons</a></li>
			</ul>
		</li>
	</ul>
	
	<div>
		<div>	
			<div id="omw_scrollpane">
				<canvas id="MyCanvas2" width="1200px" height="1200px"  style="z-index: 3; position:absolute; left:0px; top:0px;" onmousemove="handleMouseOver(event)"></canvas>	    
				<canvas id="MyCanvas1" width="1200px" height="1200px"  style="z-index: 2; position:absolute; left:0px; top:0px;"></canvas>	    
				<canvas id="myCanvas" width="1200px" height="1200px"   style="z-index: 1; position:absolute; left:0px; top:0px;" name="superCanvas"  >ur browser doesnt support canvas element.. do something!Now!</canvas>
			</div>
			
			<div id="zoom_panel1">
				<button type="submit" id="zoomin"     style="z-index: 4;position:absolute;top:10px;left:10px;height:30px;"><img src = "zoom_in.png" width = "20px" height = "20px"></button>
				<button type="submit" id="zoomout"    style="z-index: 4;position:absolute;top:10px;left:50px;height:30px;"><img src="zoom_out.png" width = "20px" height = "20px"></button>
				<button type="submit" id="fullScreen" style="z-index: 4;position:absolute;top:10px;left:90px;height:30px;" onclick="fullscreen1();"><img src="fullscreen.png" width = "20px" height = "20px"></button>
				
				<div id = "level" style="z-index: 2;position:absolute;top:50px;left:10px;width:100px;background:white"> Regulon Level </div>
			</div>
		</div>
		
		<div>
		
			<div id="omw_scrollpane_H">
				<canvas id="MyCanvass2" width="1000px" height="1000px"  style="z-index: 7; position:absolute; left:0px; top:0px;"></canvas>	    
				<canvas id="MyCanvass1" width="1000px" height="1000px"  style="z-index: 6; position:absolute; left:0px; top:0px;"></canvas>	    
				<canvas id="myCanvass" width="1000px" height="1000px"   style="z-index: 5; position:absolute; left:0px; top:0px;">ur browser doesnt support canvas element.. do something!Now!</canvas>
			</div>
			
			<div id="zoom_panel2">
				<button type="submit" id="zoomin_H"     style="z-index: 8;position:absolute;top:10px;left:10px;height:30px;"><img src = "zoom_in.png" width = "20px" height = "20px"></button>
				<button type="submit" id="zoomout_H"    style="z-index: 8;position:absolute;top:10px;left:50px;height:30px;"><img src="zoom_out.png" width = "20px" height = "20px"></button>
				<button type="submit" id="fullScreen2_H" style="z-index: 8;position:absolute;top:10px;left:90px;height:30px;" onclick="fullscreen2();"><img src="fullscreen.png" width = "20px" height = "20px" ></button>
				
				<div id = "level2" style="z-index: 2;position:absolute;top:50px;left:10px;width:100px;background:white">Gene Ontology</div>
			</div>
		</div>
		
		
		<div id="anchor" style="width:0px; height:0px; margin:10px 10px 0px 0px; float:left; border:2px solid #000080; background:#c0c0ff"></div> 
		
		
	</div>
	
	
	<div id = "debug">
	
		<center>
			
		
		
		<div style="border: 1px solid #000; padding: 0px; background: #EEEEEE; ">
			<table border="0" cellspacing="0" cellpadding="2" width="100%" style="background: #000000; color: #FFFFFF; ">
				<tr>
					<td>Regulon Data</td>
					<td align="right">[<a title="show/hide" id="regulonData_link" href="javascript: void(0);" onclick="toggle(this, 'regulonData');"  style="text-decoration: none; color: #FFFFFF; ">-</a>]</td>
				</tr>
			</table>
			
			<div id="regulonData" style="padding: 3px;">
			
				Regulon Enter: <input type = "textfield" value = "" id = "regID">
				<br>
				<button type="submit" id="updateCoeff" onclick = "select();"> Select </button>
				<br><br>
				
				
				<table border= 0>
				<tr>
				<th>List of  Regulons:</th>
				<th>Selected Regulons:</th>
				</tr>
				
				<tr>
				<td><center><select id="allList" size=5 multiple ></select></center></td>
				<td><center><select id="selectedList" size=5 multiple ></select></center></td>
				</tr>
				
								
				<tr>
				<td colspan=2><center><input type = "button" value= "Remove" onclick="removeSelected();"></input><input type = "button" value= "View Details" onclick= "viewDetails();"></input><input type = "button" value= "View Genes" onclick="viewGenes()"></input></center></td>
				</tr>
				</table>
			</div>
		</div>
		
		<div style="border: 1px solid #000; padding: 0px; background: #EEEEEE; ">
			<table border="0" cellspacing="0" cellpadding="2" width="100%" style="background: #000000; color: #FFFFFF; ">
				<tr>
					<td>GO term Data</td>
					<td align="right">[<a title="show/hide" id="GOTermData_link" href="javascript: void(0);" onclick="toggle(this, 'GOTermData');"  style="text-decoration: none; color: #FFFFFF; ">-</a>]</td>
				</tr>
			</table>
			
			<div id="GOTermData" style="padding: 3px;">
			
				GO Term Enter: <input type = "textfield" value = "" id = "regID">
				<br>
				<button type="submit" onclick = "select2();"> Select </button>
				<br><br>
				
				
				<table border= 0>
				<tr>
				<th>List of  GO terms:</th>
				<th>Selected GO terms:</th>
				</tr>
				
				<tr>
				<td><center><select id="allList_GO" size=5 multiple ></select></center></td>
				<td><center><select id="selectedList_GO" size=5 multiple ></select></center></td>
				</tr>
				
				<tr>
				<td colspan=2><center><input type = "button" value= "Remove" onclick="removeSelected2();"></input><input type = "button" value= "View Details" onclick= "viewDetails2();"></input></center></td>
				</tr>
				</table>
			</div>
		</div>
		
		
		<div style="border: 1px solid #000; padding: 0px; background: #EEEEEE; ">
			<table border="0" cellspacing="0" cellpadding="2" width="100%" style="background: #000000; color: #FFFFFF; ">
				<tr>
					<td>Details</td>
					<td align="right">[<a title="show/hide" id="details_link" href="javascript: void(0);" onclick="toggle(this, 'details');"  style="text-decoration: none; color: #FFFFFF; ">-</a>]</td>
				</tr>
			</table>
			
			<div id="details" style="padding: 3px;">
				<textarea id="debugTA" cols="30" rows="5" name="debugTA"></textarea>
			</div>
		</div>
		<script language="javascript">toggle(getObject('details_link'), 'details');</script>
		
		
		<div style="border: 1px solid #000; padding: 0px; background: #EEEEEE; ">
			<table border="0" cellspacing="0" cellpadding="2" width="100%" style="background: #000000; color: #FFFFFF; ">
				<tr>
					<td>Level Editing</td>
					<td align="right">[<a title="show/hide" id="levelEditing_link" href="javascript: void(0);" onclick="toggle(this, 'levelEditing');"  style="text-decoration: none; color: #FFFFFF; ">-</a>]</td>
				</tr>
			</table>
		
			<div id="levelEditing" style="padding: 3px;">
				<div> 
					Levels:<br>
					<input type = "button" value= "Add" onclick="addLevel();"></input>
					<input type = "button" value= "Remove" onclick="removeLevel();"></input>
					<input type = "button" value= "Edit" onclick="editLevel();"></input>
					<br>
					<input type = "button" value= "Move Up" onclick="moveLevelUp();"></input>
					<input type = "button" value= "Move Down" onclick="moveLevelDown();"></input>
					
					<select id = "lRanges" size=2>
					</select>
				</div>
			</div>
		</div>
		<script language="javascript">toggle(getObject('levelEditing_link'), 'levelEditing');</script>
		
		
	</div>
	
	<!-- -->
	
	
	
</body>

</html>