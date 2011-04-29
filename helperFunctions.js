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
 
 function notAlreadyPresent(randList,neighbor)
 {
	for(var i=0;i<randList.length;i++)
	{
		if(randList[i] == neighbor) return false;
	}
	return true;
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

function changeThreshold()
{
  response = window.prompt("Enter New Threshold Value");
  if(!isNaN(response))
  {
	contentCountThresholdValue = response;
  }
  return;
}


function fillChildren(parentIndex,index_in_cList,level)
{
	var childArray = childrenList_H_2[parentIndex];
	
	/*if(childArray.length == 0) 				// when a node has no children ... 
	{
		if(childrenList_H[index_in_cList] == undefined) 
		{
			childrenList_H[index_in_cList] = new Array();
		}
		return;
	}*/

	
	for(var i=0;i<childArray.length;i++)
	{
		var flag = false;
		for(var j=0;j<level;j++)
		{
			// if the child links to a parent then dont add that parent 
			// in a DAG this situation shouldnt arise. 
			// but as far as i understand the dataset given will have loops of children linking to parents as every node has a child.
			// anyways just for precaution even if thats not the case
			
			if(elements_In_Children[j][childArray[i]] != undefined) 
			{
				flag = true ;
				break;  
			}
																			   
		}
		
		if(flag) continue;
		
		if(elements_In_Children[level] == undefined || elements_In_Children[level][childArray[i]] == undefined)
		{
			if(elements_In_Children[level] == undefined) elements_In_Children[level] = new Array();
			elements_I[index] = {"name":elementstemp[childArray[i]],"description":"","index":childArray[i]};
			elements_In_Children[level][childArray[i]] = index;
			if(childrenList_I[index_in_cList] == undefined) childrenList_I[index_in_cList] = new Array();
			childrenList_I[index_in_cList].push(index);
			index++;
			fillChildren(childArray[i],index-1,level+1);
		}
		else
		{
			if(childrenList_I[index_in_cList] == undefined) childrenList_I[index_in_cList] = new Array();
			childrenList_I[index_in_cList].push(elements_In_Children[level][childArray[i]]);
		}
	}
}

