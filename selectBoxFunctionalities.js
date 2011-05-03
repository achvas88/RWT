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
		highlightChildren(optn.ind);
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
			highlightChildren(optn.ind);
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

function selectionAction_H(optn,ctrl)
{
   var theSelectedList = document.getElementById('selectedList_GO');
   var theWholeList = document.getElementById('allList_GO');
   
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
		handleDeselection_I();
		selectedNodes_I.push(optn.ind);
		//highlightChildren_I(optn.ind);
		highlightSelectedNodes_I();
		return;
   }
	
	// control is pressed
	
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
			selectedNodes_I.push(optn.ind);
			//highlightChildren_I(optn.ind);
			highlightSelectedNodes_I();
		}
	}	
	else // if unselected
	{
		//check if in selected 
		for(var i=0;i<theSelectedList.options.length;i++)
		{
			if(theSelectedList.options[i].text == optn.text)	// if yes remove it
			{
				deselectNode_I(theSelectedList.options[i].ind);
				theSelectedList.options.remove(i);
				break;
			}
		}
	}
}

function addOption(selectbox,elements)
{
	sbox = document.getElementById(selectbox);
	var ta = document.getElementById("loadedValue");
	var taholder = document.getElementById("loading");
	taholder.style.display = "block";
	//counterr++;
	
	
	for(var count=0;count<200,counterr<elements.length;count++,counterr++)
	{
		var optn = document.createElement("OPTION");
		optn.text = elements[counterr].name;
		optn.ind = counterr;
		optn.onclick = function(evt)
		{
			selectionAction(this,evt.ctrlKey);
		}
		sbox.options.add(optn);
	}
	
	if(counterr >= elements.length)
	{
		if(stID!=undefined)
			clearInterval(stID);
		ta.innerHTML = "<center>&nbsp; Loading complete &nbsp;</center>";
		taholder.style.display = "none";
		return;
	}
	else
	{
		ta.innerHTML = "<center>&nbsp; Loading : "+Math.floor((counterr+1)/elements.length * 100)+"% &nbsp;</center>";
	}
}

function addOption_H(selectbox,pageno)
{
	sbox = document.getElementById(selectbox);
	
	while(sbox.options.length>0)
	{
		sbox.options.remove(0);
	}
		
	for(var counter=(pageno-1)*COUNTINPAGE,count=0;counter<elements_I.length,count<COUNTINPAGE;count++,counter++)
	{
		var optn = document.createElement("OPTION");
		optn.text = elements_I[counter].name;
		optn.ind = counter;
		optn.onclick = function(evt)
		{
			selectionAction_H(this,evt.ctrlKey);
		}
		sbox.options.add(optn);
	}
}

function selectionAction_Page(optn)
{
	addOption_H('allList_GO',optn.text);
}

function addOption_Page(selectbox,pageno)
{
	sbox = document.getElementById(selectbox);
	
	var optn = document.createElement("OPTION");
	optn.text = pageno;
	sbox.options.add(optn);
}

function populateSelectBox()
{
	counterr = 1; 													//// element 0 is unclassified
	//stID = setInterval("addOption('allList',theElements)",1);
	for(var i=0;i<theElements.length + 1;i++)		
	{
		addOption('allList',theElements);
	}
}

function populateSelectBox_H()
{
	addOption_H('allList_GO',1);
}

function populatePages()
{
	var noofpages = Math.ceil(elements_I.length/COUNTINPAGE);
	
	for(var i=0;i<noofpages;i++)
	{
		addOption_Page('pageno',i+1);
	}
	
	sbox = document.getElementById('pageno');
	sbox.onchange = function(evt)
	{
		addOption_H('allList_GO',this.options[this.selectedIndex].text);
	}
}

function removeSelected()
{
	sbox = document.getElementById('selectedList');
	abox = document.getElementById('allList');
	
	for(var i=0;i<sbox.options.length;i++)
	{
		if(sbox.options[i].selected) 
		{
			abox.options[sbox.options[i].ind - 1].selected = false;
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

