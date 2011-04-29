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
 