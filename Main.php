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
	
	#up_legend
	{
		position:absolute;
		top:11%;
		width:20px;
		left:70%;
		height:15px;
		z-index:10;
	}
	
	#bottom_legend
	{
		position:absolute;
		top:57%;
		width:20px;
		left:70%;
		height:15px;
		z-index:10;
	}
	
</style> 

<link rel="stylesheet" type="text/css" href="dragresize/dragresize.css"></link> 
<link rel="stylesheet" type="text/css" id="listmenu-h"  href="fsmenu/listmenu_h.css" title="Horizontal 'Earth'" />
<link rel="stylesheet" type="text/css" id="fsmenu-fallback"  href="fsmenu/listmenu_fallback.css" />
<link rel="stylesheet" type="text/css" href="gwindow/gwindow.css" /> 
  
<script language="javascript" type="text/javascript" src="jquery-1.5.js"></script> 
<script language="javascript" type="text/javascript" src="degreeBasedRadialSortGraph.js"></script> 
<script language="javascript" type="text/javascript" src="selectBoxFunctionalities.js"></script> 
<script language="javascript" type="text/javascript" src="levelFunctionality.js"></script> 
<script language="javascript" type="text/javascript" src="helperFunctions.js"></script> 
<script language="javascript" type="text/javascript" src="handleMouseFunctions.js"></script> 
<script language="javascript" type="text/javascript" src="icicleGraph.js"></script>
<script language="javascript" type="text/javascript" src="expandableContent.js"></script>
<script language="javascript" type="text/javascript" src="dragresize/dragresize.js"></script>
<script language="javascript" type="text/javascript" src="flot/jquery.js"></script> 
<script language="javascript" type="text/javascript" src="flot/jquery.flot.js"></script> 
<script language="javascript" type="text/javascript" src="flot/jquery.flot.selection.js"></script> 
<script language="javascript" type="text/javascript" src="fsmenu/fsmenu.js"></script>
<script type="text/javascript" src="gwindow/gwindow.js"></script> 

<script>

 // ALL VARIABLES //
 
 var theElements = new Array();
 var adjacencyList = new Array();

 var userDefinedHighlightSelectedNodesExists = true;
 var userDefinedHighlightSelectedNodesExists_H = false;
 var contentCountThresholdValue = 1500;
 
 var OFFSETX = 0;
 var OFFSETY = -1 * document.height * 0.1;
 var OFFSETX_H = 0;
 var OFFSETY_H = -1 * document.height * 0.56;
 
 var canvas2;
 var isDown = false;
 var startX,startY,endX,endY;
 var theMode = "Content Count";
 
 var listMenu;
 var arrow = null;
 
 var canvas2_H;
 var isDown_H = false;
 var startX_H,startY_H,endX_H,endY_H;
 
 var counterr = 0;
 var counterr2 = 0;

 var stID,stdID2;
 var zoomed1 = false
 var zoomed2 = false
 var gwin;
 var chart_shown = false;
 
 var elements_In_Children = new Array();
 var index =  4 ; // 0,1,2,3 taken by root,P,F,C  respectively.
 
 var COUNTINPAGE = 50;
 
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
	
	<?php
	
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the regulon-ProbeID data...</center></div>';
			
		$dbhost = 'metnetdb.org:3306/';
		$dbname = 'achvas';
		$dbuser = 'guest';
		$dbpass = '';
		$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

		mysql_select_db($dbname);
		
		$query =  'SELECT RegulonID,ProbeID,Symbol FROM `aravindh`.`genes` where RegulonID!=0;';
		$result = mysql_query($query);
		if (!$result) 
		{
			die('Invalid query: ' . mysql_error());
		}
		else
		{
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) 
			{
				$RegIDProbes['' . $row[0]][] =''.$row[1];
				$ProbeSymbol['' . $row[1]]   =''.$row[2];
			}
		}
			
		mysql_close($conn);
		
	?>
	
	<?php
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing Regulon-ProbeID data...</center></div>';
		
		echo '<script>var RegulonProbeMap = new Array();';
		echo 'var ProbeSymbolMap = new Array();';
		
		foreach ($RegIDProbes as $key => $value)
		{
			foreach ($value as $val)
			{
				echo 'if(RegulonProbeMap["RegID'.$key.'"] == undefined)';
				echo ' RegulonProbeMap["RegID'.$key.'"] = new Array(); ';
				echo 'RegulonProbeMap["RegID'.$key.'"].push("'.$val.'");';
				
			}
		}
		
		foreach ($ProbeSymbol as $key => $value)
		{
			echo 'ProbeSymbolMap["'.$key.'"] = "'.$value.'";';
		}
		unset($RegIDProbes);
		
		echo '</script>'; 
	?>
	
	<?php
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
	
	<?php
	
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the Gene-Ontology DAG...</center></div>';
			
		$dbhost = 'localhost:3306/';
		$dbname = 'test';
		$dbuser = '';
		$dbpass = '';
		$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

		$listOfGOs = array();
		$GosChildren = array();
		mysql_select_db($dbname);
	
								
		$query =  'SELECT `go_term`,`children` FROM `test`.`pc_table`';
		$result = mysql_query($query);
		if (!$result) 
		{
			die('Invalid query: ' . mysql_error());
		}
		else
		{
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) 
			{
				$listOfGOs[] = $row[0];
				$GosChildren[] = $row[1];
			}
		}
	
		
		mysql_close($conn);
		
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading the pc_table complete</center></div>';
		
		
		unset($row);
		unset($query);
		unset($result);
		unset($dbhost);
		unset($dbname);
		unset($dbuser);
		unset($dbpass);
		unset($conn);
	?>
	
	
	<?php
	
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Loading Gene-Ontology Terms description</center></div>';
			
		$dbhost = 'localhost:3306/';
		$dbname = 'test';
		$dbuser = '';
		$dbpass = '';
		$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

		$entireListOfGOs = array();
		//$entireListOfGOsHash = array();
		$GosNames = array();
		$GosDescription = array();
		
		mysql_select_db($dbname);
	
		$query =  'SELECT id,name,description FROM `test`.`go_description_final`;';
		
		$result = mysql_query($query);
		if (!$result) 
		{
			die('Invalid query: ' . mysql_error());
		}
		else
		{
			//$counter = -1;
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) 
			{
				//$counter++;
				$entireListOfGOs[] = ''.$row[0];
				//$entireListOfGOsHash["".$row[0].""] = $counter;
				$GosNames[] = ''.$row[1];
				$GosDescription[] = ''. substr(''.$row[2],0,-2);
			}
		}
			
		mysql_close($conn);
		
		unset($row);
		unset($query);
		unset($result);
		unset($dbhost);
		unset($dbname);
		unset($dbuser);
		unset($dbpass);
		unset($conn);
	?>
	
	<?php
	
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing Gene-Ontology Terms Description variables</center></div>';
		 
		echo '<script>var elementsDesc = new Array();';
		echo 'var entireListOfGOs = new Array();';
		echo 'var entireListOfGOsHash = new Array();</script>';
		
		for($i=0;$i<1;$i++) //count($entireListOfGOs);$i++)
		{
			echo '<script>var obj = new Object;';
			echo 'var tempString = "" + "'.  $GosNames[$i]  .'"+"";';
			echo 'obj.name = tempString;';
			echo 'var tempStringDes = ""+ "'.  $GosDescription[$i]  .'"+"";';
			echo 'obj.description = tempStringDes;';
			echo 'elementsDesc.push(obj);';
			//echo 'entireListOfGOs.push("'.  $entireListOfGOs[$i]  .'");';
			echo 'var tempStringH = ""+ "'.  $entireListOfGOs[$i]  .'"+"";';
			echo 'entireListOfGOsHash[tempStringH] = '. $i .';</script>';
			if($i && $i % 5000 == 0)
				echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing Gene-Ontology Terms Description variables:   '. floor($i/count($entireListOfGOs)*100) .'%</center></div>';
		}
		unset($GosNames);
		unset($GosDescription);
		unset($entireListOfGOs);
	?>
	
	<?php
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing GO variables </center></div>';
		
		echo '<script>var elementstemp = new Array();</script>';
		echo '<script>var elementshash = new Array();</script>';
		echo '<script>var childrentemp = new Array();</script>';
		
		
		for($i=0;$i<count($listOfGOs);$i++)
		{
			echo '<script>elementstemp.push("' .$listOfGOs[$i]. '");</script>';
			echo '<script>elementshash["' .$listOfGOs[$i]. '"] = '.$i.';</script>';
			//echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing GO variables : '.$i.'/'.count($listOfGOs).'</center></div>';
		}
		
		echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing children of GO terms</center></div>';
		
		for($i=0;$i<count($GosChildren);$i++)
		{
			echo '<script>var tempNeigh = new Array();</script>';
			echo '<script>tempNeigh.push("' .$GosChildren[$i]. '");</script>';
			echo '<script>childrentemp.push(tempNeigh);</script>';
			//echo '<div style="background-color:gray;position:absolute;top:48%;left:0%;width:100%;color:white;"><center>Pushing children of GO terms: '.$i.'/'.count($GosChildren).'</center></div>';
		}
		
		unset($listOfGOs);
		unset($GosChildren);
	?>
	
<script>

 // ALL FUNCTIONS //

 
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
		drawCircle(canvas,RADIUS_OF_CIRCLES,theElements[selectedNodes[i]].X,theElements[selectedNodes[i]].Y,"#FF0000",theElements[selectedNodes[i]].name);
		
		var newoptn = document.createElement("OPTION");
		newoptn.text = theElements[selectedNodes[i]].name;
		newoptn.ind = selectedNodes[i]; // corresponds to the index in the alllist
		sList.options.add(newoptn);	
		
		aList.options[selectedNodes[i] - 1].selected = true;
		highlightChildren(selectedNodes[i]);
	}
	debText+="\n";
	debTA.value = debText;
 }
  
function createTheGraphContents()
{
	var canvasID = "myCanvas";
	var selectionCanvasID = "MyCanvas2";
	var theDebuggingTextAreaID = "debugTA";
	var contentCountThreshold = document.getElementById('thresh');
		
	var levelRanges = [[0,2],[3,4],[5,10],[11,20],[21,50],[51,500]];//,[501,12000]];
	
	var lRangesBox = document.getElementById('lRanges');
	
	for(var i=0;i<levelRanges.length;i++)
	{
		var newoptn = document.createElement("OPTION");
		newoptn.text = levelRanges[i];
		lRangesBox.options.add(newoptn);	
	}
	lRangesBox.size = 2;
	
	drawTheChart(canvasID,selectionCanvasID,levelRanges,undefined,undefined,theDebuggingTextAreaID,"Content Count"); //contents, degree - modes
	//displayDebugInformation();
 }
 
function init()
{
	//alert("name: "+elementsDesc[0].name + ",Des:"+elementsDesc[0].description);
	//alert(RegulonProbeMap["RegID1"].length);
	createTheGraphContents();
	populateSelectBox();
	labelCanvas_Top = document.getElementById("MyCanvas3");
	canvas2 = document.getElementById("MyCanvas2");
	canvas2.addEventListener("mousedown", handleMouseDown);
	canvas2.addEventListener("mouseup", handleMouseUp);
	canvas2.addEventListener("mousemove", handleMouseMove);
}
 
function createTheGraphContents_H()
{
	var canvasID = "myCanvass";
	var selectionCanvasID = "MyCanvass2";
	var theDebuggingTextAreaID = "debugTA";
	
	
	//elements_I = [{"name":"root","description":"none"},{"name":"a","description":"one"},{"name":"b","description":"two"},{"name":"c","description":"three"},{"name":"d","description":"four"},{"name":"e","description":"five"},{"name":"f","description":"six"},{"name":"g","description":"seven"}];
	//childrenList_I = [[1,2],[3,4],[3,6],[5],[5,7],[],[7],[]];
		
	drawTheChart_I(canvasID,selectionCanvasID,undefined,undefined,theDebuggingTextAreaID);
		
	displayDebugInformation_I();
}

var childrenList_H_2 = new Array();

function initializeArrays()
{
	var childrenList_H_ = new Array();
	for(var i=0;i<childrentemp.length;i++)
	{
		var tempList = new Array();
		tempList = childrentemp[i].toString().split(",");
		//alert(tempList.length);
		childrenList_H_.push(tempList);
	}
	childrentemp = [];
	
	// now, childrenList_H_ array has values in the form childrenList_H_[0][0] = "GO:123234"; childrenList_H_[0][1] = "GO:123232" etc
	
	
	for(var i=0;i<childrenList_H_.length;i++)
	{
		var tempList = new Array();
		for(var j=0;j<childrenList_H_[i].length;j++)
		{
			if(elementshash[childrenList_H_[i][j]] != undefined)
			{
				tempList.push(elementshash[childrenList_H_[i][j]]);
			}
		}
		childrenList_H_2.push(tempList);
	}
	childrenList_H_ = [];
	
	// now, childrenList_H_2 array has values in the form childrenList_H_2[0][0] = 0; childrenList_H_2[0][1] = 1 etc
	// the index corresponds to their location in the elementstemp array.
	
	// alert(elementstemp[20] +" ====>" + elementstemp[childrenList_H_2[20][0]] + "   ,  " + elementstemp[childrenList_H_2[20][1]]);
	
	var P = "GO:0008150";	// biological process
	var F = "GO:0003674";	// molecular function
	var C = "GO:0005575";	// cellular component
	var PIndex = elementshash[P];
	var FIndex = elementshash[F];
	var CIndex = elementshash[C];
		
	
	
	// inserting root,P,F,C 
	
	// proper_mode
	//elements_I = [{"name":"root","description":"The root of the Gene Ontology Hierarchy","alias":"theRoot","index":-1,"level":-1} , {"name":elementstemp[PIndex],"description":elementsDesc[entireListOfGOsHash[P]].description,"alias":""+elementsDesc[entireListOfGOsHash[P]].name+"(P)","index":PIndex,"level":0}, {"name":elementstemp[FIndex],"description":elementsDesc[entireListOfGOsHash[F]].description,"alias":""+elementsDesc[entireListOfGOsHash[F]].name+"(F)","index":FIndex,"level":0} , {"name":elementstemp[CIndex],"description":elementsDesc[entireListOfGOsHash[C]].description,"alias":""+elementsDesc[entireListOfGOsHash[C]].name+"(C)","index":CIndex,"level":0} ];
	
	// dev mode
	elements_I = [{"name":"root","index":-1,"description":"The root of the Gene Ontology Hierarchy"} , {"name":elementstemp[PIndex],"index":PIndex}, {"name":elementstemp[FIndex],"index":FIndex,"level":0} , {"name":elementstemp[CIndex],"index":CIndex,"level":0} ];
	
	childrenList_I = [[1,2,3],[],[],[]];
	
	//var debTA  = document.getElementById("LogTA");
	//debTA.value = debTA.value + "\n------------ P -----------\n";
	
	fillChildren(PIndex,1,0);	// (index of element in elementstemp and childrenList_H_2, index in childrenList_H )
	
	//debTA.value = debTA.value + "\n------------ F -----------\n";
	fillChildren(FIndex,2,0);
	
	//debTA.value = debTA.value + "\n------------ C -----------\n";
	fillChildren(CIndex,3,0);

	elements_In_Children = [];
	childrenList_H_2 = [];
	
}


function init_H()
{
	initializeArrays();
	populatePages();
	populateSelectBox_H();
	createTheGraphContents_H();
	canvas2_H = document.getElementById("MyCanvass2");
	//canvas2_H.addEventListener("mousedown", handleMouseDown_H);
	//canvas2_H.addEventListener("mouseup", handleMouseUp_H);
	//canvas2_H.addEventListener("mousemove", handleMouseMove_H);
}

function initializeChart()
{
$(function () {
    // setup plot
    function getData() {
        var d = [];
        for (var i = 1; i < theElements.length; ++i) {
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
			selectedNodes.push(item.dataIndex+1);
			highlightChildren(item.dataIndex+1);
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
			aList.options[i-1].selected = true;
						
			var newoptn = document.createElement("OPTION");
			newoptn.text = tf.value;
			newoptn.ind = i;
			sList.options.add(newoptn);	
			selectedNodes.push(i);
			highlightChildren(i);
			highlightSelectedNodes();
		}
	}
	
}

function select_GO()
{
	var tf = document.getElementById('GOTerm');
	var aList = document.getElementById("allList_GO");
	var sList = document.getElementById("selectedList_GO");
	var pageno = document.getElementById("pageno");
	
	
	for(var i=0;i<sList.options.length;i++)	// check if already selected
	{
		if(sList.options[i].text == tf.value) return;
	}
	
	for(var i=0;i<elements_I.length;i++)
	{
		
		if(elements_I[i].name == tf.value)
		{
			page = Math.ceil(i/COUNTINPAGE);
		
			if(i%COUNTINPAGE == 0)	page++;
		
			if(pageno.options[pageno.selectedIndex].text == page)
				aList.options[i%COUNTINPAGE].selected = true;
						
			var newoptn = document.createElement("OPTION");
			newoptn.text = tf.value;
			newoptn.ind = i;
			sList.options.add(newoptn);	
			selectedNodes_I.push(i);
			highlightChildren_I(i);
			highlightSelectedNodes_I();
		}
	}
}

function fullscreen1()
{
		var new_height;
		var scrollpanel = document.getElementById("omw_scrollpane");

		var otherscrollpanel = document.getElementById('omw_scrollpane_H')
		var button = document.getElementById('fullScreen');
		var otherZoomIn = document.getElementById('zoomin_I');
		var otherZoomOut = document.getElementById('zoomout_I');
		var otherFullScreen = document.getElementById('fullScreen2_H');
		var otherLevel = document.getElementById('level2');
		var otherLegend = document.getElementById('bottom_legend');
		
		if (zoomed1) 
		{
			new_height = "45%";
			otherscrollpanel.style.display = "block";
			otherZoomIn.style.display = "block";
			otherZoomOut.style.display = "block";
			otherFullScreen.style.display = "block";
			otherLevel.style.display = "block";
			otherLegend.style.display = "block";
		}
		else 
		{
			new_height = "89%";
			otherscrollpanel.style.display = "none";
			otherZoomIn.style.display = "none";
			otherZoomOut.style.display = "none";
			otherFullScreen.style.display = "none";
			otherLevel.style.display = "none";
			otherLegend.style.display = "none";
		}

		zoomed1 = !zoomed1;
		scrollpanel.style.height = new_height;
	
}

function fullscreen2()
{
		var new_height;
		var new_ypos,new_ypos2;
		var scrollpanel = document.getElementById("omw_scrollpane_H");

		var otherscrollpanel = document.getElementById('omw_scrollpane')
		var button = document.getElementById('fullScreen2_H');
		var otherZoomIn = document.getElementById('zoomin');
		var otherZoomOut = document.getElementById('zoomout');
		var otherFullScreen = document.getElementById('fullScreen');
		var otherLevel = document.getElementById('level');
		var zoomPanel = document.getElementById('zoom_panel2');
		var otherLegend = document.getElementById('up_legend');
		var theLegend = document.getElementById('bottom_legend');
		
		if (zoomed2) 
		{
			new_ypos = "56%";
			new_ypos2 = "57%";
			new_height = "43%";
			otherscrollpanel.style.display = "block";
			otherZoomIn.style.display = "block";
			otherZoomOut.style.display = "block";
			otherFullScreen.style.display = "block";
			otherLevel.style.display = "block";
			otherLegend.style.display = "block";
			OFFSETY_H = -1 * document.height * 0.56;
		}
		else 
		{
			new_ypos = "10%";
			new_ypos2 = "11%";
			new_height = "89%";
			otherscrollpanel.style.display = "none";
			otherZoomIn.style.display = "none";
			otherZoomOut.style.display = "none";
			otherFullScreen.style.display = "none";
			otherLevel.style.display = "none";
			otherLegend.style.display = "none";
			OFFSETY_H = -1 * document.height * 0.1;
		}

		zoomed2 = !zoomed2;
		
		scrollpanel.style.height = new_height;
		scrollpanel.style.top = new_ypos;
		theLegend.style.top = new_ypos2;
		zoomPanel.style.top = new_ypos;
}

function showDetails()
{

	var theSelectedList = document.getElementById('selectedList');
	var debTA  = document.getElementById(debuggingTextAreaID);
	var theInnerHTML ="</br><b><center>Details of the selected nodes</center></b></br><hr>";
	
		
	for(var i=0;i<theSelectedList.options.length;i++)
	{
		//if(theSelectedList.options[i].selected == true)
		//{
			theInnerHTML+=  "</br><b> Regulon Name : " 		+ theElements[theSelectedList.options[i].ind].name 			+  "</b></br></br>";
			
			theInnerHTML+= 	"<table width=\"100%\" border = 1>"+
							"<tr style=\" background-color:#AAAAAA\"><th>Property</th><th>Value</th></tr>";
			theInnerHTML+=  "<tr><td>Description</td><td>"  		+ theElements[theSelectedList.options[i].ind].description 	+  "</td></tr>";
			theInnerHTML+=  "<tr><td>Genes contained</td><td>" 		+ theElements[theSelectedList.options[i].ind].contentCount 	+  "</td></tr>";
			
			var neighbors = adjacencyList[theSelectedList.options[i].ind];
			theInnerHTML+=  "<tr><td>Number of Neighbors</td><td>" 	+ neighbors.length 											+  "</td></tr>";
			
			theInnerHTML+=  "<tr><td>Neighboring Regulons</td><td>";
			for(var j=0;j<neighbors.length;j++)
			{
				theInnerHTML += ""+ theElements[neighbors[j]].name;
				if(j<neighbors.length-1)theInnerHTML += ", ";
			}
			theInnerHTML += "</td></tr>";
			theInnerHTML += "</table></br><hr>";
		//}
		
	}
	
	
		
	/*var sdID = document.getElementById("viewChartID");

	if(details_shown==false)
	{
		details_shown = true;
		if(detailsWin==undefined)
		{*/
			detailsWin = new GWindow(null,"Details Window");
			detailsWin.setDockable(false);
			detailsWin.dock(false);
			detailsWin.showIcon(false);
			detailsWin.setSize(600,350,GWindow.UNDOCKED);
			detailsWin.setClosable(true,GWindow.UNDOCKED);
			
			detailsWin.getBodyElement().innerHTML = theInnerHTML;
			
		/*}
		else
		{
			detailsWin.show(true);
		}
		
		sdID.innerHTML = "Hide Details";
	}
	else
	{
		detailsWin.show(false);
		details_shown = false;
		
		sdID.innerHTML = "Show Details";
	}*/
}

function showDetails_GO()
{

	var theSelectedList = document.getElementById('selectedList_GO');
	var debTA  = document.getElementById(debuggingTextAreaID);
	var theInnerHTML ="</br><b><center>Details of the selected GO terms</center></b></br><hr>";
	
		
	for(var i=0;i<theSelectedList.options.length;i++)
	{
		theInnerHTML+=  "</br><b> GO Term ID : " 		+ elements_I[theSelectedList.options[i].ind].name 			+  "</b></br></br>";
		
		theInnerHTML+= 	"<table width=\"100%\" border = 1>"+
						"<tr style=\" background-color:#AAAAAA\"><th>Property</th><th>Value</th></tr>";
						
		theInnerHTML+=  "<tr><td>Name</td><td>"  				+ elements_I[theSelectedList.options[i].ind].alias 	+  "</td></tr>";
		theInnerHTML+=  "<tr><td>Depth</td><td>"  				+ elements_I[theSelectedList.options[i].ind].depth 	+  "</td></tr>";
		theInnerHTML+=  "<tr><td>Description</td><td>"  		+ elements_I[theSelectedList.options[i].ind].description 	+  "</td></tr>";
		
		theInnerHTML += "</table></br><hr>";
	}
		
	detailsWin = new GWindow(null,"Details Window");
	detailsWin.setDockable(false);
	detailsWin.dock(false);
	detailsWin.showIcon(false);
	detailsWin.setSize(600,350,GWindow.UNDOCKED);
	detailsWin.setClosable(true,GWindow.UNDOCKED);
	detailsWin.getBodyElement().innerHTML = theInnerHTML;
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

function toggleLegends()
{
	var l1 = document.getElementById("upL_V");
	var l2 = document.getElementById("bottomL_V");
	if(l1.style.display == "none")
	{
		l1.style.display = "block";
		l2.style.display = "block";
	}
	else
	{
		l1.style.display = "none";
		l2.style.display = "none";
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

<body onload="init(); init_H(); ">

	<!-- -->
	<!--div id="menudiv" style="position:absolute; display:none; top:50px; left:50px;z-index:10000;" onmouseover="javascript:overpopupmenu=true;" onmouseout="javascript:overpopupmenu=false;">
		<table width=82 cellspacing=1 cellpadding=0>
		  <tr><td>
			<table width=80 cellspacing=0 cellpadding=0>
			  <tr>
				<td id="desc" bgcolor="#FFFFAA" width="80" height="16" >The description goes here</td>
			  </tr>
			  
			</table>
		  </td></tr>
		</table>
	</div-->
	
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
				<li><a href="#" onclick="toggleLegends();">Toggle Legends</a></li>
			</ul>
		</li>
	</ul>
	
	<div>
		<div>	
			<div id="omw_scrollpane">
				<canvas id="MyCanvas3" width="1200px" height="1200px"  style="z-index: 3; position:absolute; left:0px; top:0px;"></canvas>	    
				<canvas id="MyCanvas2" width="1200px" height="1200px"  style="z-index: 4; position:absolute; left:0px; top:0px;" onmousemove="handleMouseOver(event)"></canvas>	    
				<canvas id="MyCanvas1" width="1200px" height="1200px"  style="z-index: 2; position:absolute; left:0px; top:0px;"></canvas>	    
				<canvas id="myCanvas" width="1200px" height="1200px"   style="z-index: 1; position:absolute; left:0px; top:0px;" name="superCanvas"  >ur browser doesnt support canvas element.. do something!Now!</canvas>
			</div>
			
			<div id="zoom_panel1">
				<button type="submit" id="zoomin"     style="z-index: 5;position:absolute;top:10px;left:10px;height:30px;"><img src = "zoom_in.png" width = "20px" height = "20px"></button>
				<button type="submit" id="zoomout"    style="z-index: 5;position:absolute;top:10px;left:50px;height:30px;"><img src="zoom_out.png" width = "20px" height = "20px"></button>
				<button type="submit" id="fullScreen" style="z-index: 5;position:absolute;top:10px;left:90px;height:30px;" onclick="fullscreen1();"><img src="fullscreen.png" width = "20px" height = "20px"></button>
				
				<div id = "level" style="z-index: 5;position:absolute;top:50px;left:10px;width:100px;background:white"> Regulon Level</div>
				
			</div>
		</div>
		
		<div id="up_legend"><div id="upL_V"><img src="reg_legend.jpg" ></div></div>
		<div id="bottom_legend"><div id="bottomL_V"><!--img src="go_legend.jpg" --></div></div>
		
		
		<div>
		
			<div id="omw_scrollpane_H">
				<canvas id="MyCanvass2" width="1200px" height="500px"  style="z-index: 7; position:absolute; left:0px; top:0px;"></canvas>	    
				<!--canvas id="MyCanvass1" width="1200px" height="500px"  style="z-index: 6; position:absolute; left:0px; top:0px;"></canvas-->	    
				<canvas id="myCanvass" width="1200px" height="500px"   style="z-index: 5; position:absolute; left:0px; top:0px;">ur browser doesnt support canvas element.. do something!Now!</canvas>
			</div>
			
			<div id="zoom_panel2">
				<button type="submit" id="zoomin_I"     style="z-index: 8;position:absolute;top:10px;left:10px;height:30px;"><img src = "zoom_in.png" width = "20px" height = "20px"></button>
				<button type="submit" id="zoomout_I"    style="z-index: 8;position:absolute;top:10px;left:50px;height:30px;"><img src="zoom_out.png" width = "20px" height = "20px"></button>
				<button type="submit" id="fullScreen2_H" style="z-index: 8;position:absolute;top:10px;left:90px;height:30px;" onclick="fullscreen2();"><img src="fullscreen.png" width = "20px" height = "20px" ></button>
				
				<div id = "level2" style="z-index: 8;position:absolute;top:50px;left:10px;width:100px;background:white">Gene Ontology</div>
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
				<td colspan=2><center><input type = "button" value= "Remove" onclick="removeSelected();"></input><input type = "button" value= "View Details" onclick= "showDetails();"></input><input type = "button" value= "View Genes" onclick="viewGenes()"></input></center></td>
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
			
				GO Term Enter: <input type = "textfield" value = "" id = "GOTerm">
				<br>
				<button type="submit" onclick = "select_GO();"> Select </button>
				<br><br>
	
				
				<table border= 0>
				<tr>
				<th>List of  GO terms:</th>
				<th>Selected GO terms:</th>
				</tr>
				
				<tr>
				<td>
					<center>
						<select id="allList_GO" size=5 multiple ></select> <br>
						page: <select id="pageno" size=1 ></select>
					</center>
				</td>
				<td><center><select id="selectedList_GO" size=5 multiple ></select></center></td>
				</tr>
				
				<tr>
				<td colspan=2><center><input type = "button" value= "Remove" onclick="removeSelected2();"></input><input type = "button" value= "View Details" onclick= "showDetails_GO();"></input></center></td>
				</tr>
				</table>
			</div>
		</div>
		
		
		<div style="border: 1px solid #000; padding: 0px; background: #EEEEEE; display: none">
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
	
	<div id="menudiv" style="position:absolute; display:none; top:0px; left:0px;z-index:10000;" onmouseover="javascript:overpopupmenu=true;" onmouseout="javascript:overpopupmenu=false;">
			<table width=112 cellspacing=1 cellpadding=0 bgcolor=lightgray>
			  <tr><td>
				<table width=110 cellspacing=0 cellpadding=0 border=1>

				  <tr>
					<td id="item1" bgcolor="#FFFFFF" width="110" height="16" onMouseOver="this.style.backgroundColor='#EFEFEF'" onMouseOut="this.style.backgroundColor='#FFFFFF'">  <a href="#" onclick="viewGenes();document.getElementById('menudiv').style.display='none';">View Genes</a></td>
				  </tr>
				  
				  <tr>
					<td id="item2" bgcolor="#FFFFFF" width="110" height="16" onMouseOver="this.style.backgroundColor='#EFEFEF'" onMouseOut="this.style.backgroundColor='#FFFFFF'" onclick="showDetails();document.getElementById('menudiv').style.display='none';">  <a href="#">View Details</a></td>
				  </tr>
				  
				  
				</table>
			  </td></tr>
			</table>
	</div>
	
	
	
	<!-- <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
	<textarea id="LogTA" cols="50" rows="10" name="LogTA"></textarea>-->
	
	
	
</body>

</html>