
var octTreeRegions = new Array();
var octTreeCounter = 0;
 
////////////////// functions //////////////////////
//
// initializeOctTree(x,y,width,height,level,parent)
// fallInRegion(region,x,y)
// regionToOctTreeNodes(selectedRegion,region)
// overlappingRegions(region1,region2)
// calculateIncrement(level)
// insertIntoOctTree(elementIndex,x,y,region)
// viewOctTree()
///////////////////////////////////////////////////


// DEPENDENT FUNCTIONS
 
 function initializeOctTree(x,y,width,height,level,parent)
 {
	
	var region0,region1,region2,region3;
	
	if(level == 0)
	{
		return;
 	}
	else
	{
		level--;
		
		////////// for region 0 ///////////
		
		region0 = new Object();
		region0.x = x;
		region0.y = y;
		region0.width = width/2;
		region0.height = height/2;
		region0.children = new Array();
		
		// check if this is the last level
		if(level <= 1) region0.isFinal = true;
		else region0.isFinal = false;
		
		// insert into the regions array
		octTreeRegions[octTreeCounter] = region0;
		
		// tell parent that i am your child
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		// increment octTreeCounter
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region0.x,region0.y,region0.width,region0.height,level,octTreeCounter-1);
		}
				
		
		////////// for region 1 ///////////		
		
		region1 = new Object();
		region1.x = x+width/2;
		region1.y = y;
		region1.width = width/2;
		region1.height = height/2;
		region1.children = new Array();
		
		if(level <= 1) region1.isFinal = true;
		else region1.isFinal = false;
		
		octTreeRegions[octTreeCounter] = region1;
		
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region1.x,region1.y,region1.width,region1.height,level,octTreeCounter-1);
		}
		
		
		region2 = new Object();
		region2.x = x;
		region2.y = y+height/2;
		region2.width = width/2;
		region2.height = height/2;
		region2.children = new Array();
		
		if(level <= 1) region2.isFinal = true;
		else region2.isFinal = false;
		
		octTreeRegions[octTreeCounter] = region2;
		
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region2.x,region2.y,region2.width,region2.height,level,octTreeCounter-1);
		}
		
		region3 = new Object();
		region3.x = x + width/2;
		region3.y = y + height/2;
		region3.width = width/2;
		region3.height = height/2;
		region3.children = new Array();
		
		if(level <= 1) region3.isFinal = true;
		else region3.isFinal = false;
		
		octTreeRegions[octTreeCounter] = region3;
		
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region3.x,region3.y,region3.width,region3.height,level,octTreeCounter-1);
		}
	}
 }
 
 function regionToOctTreeNodes(selectedRegion,region) // initially region should be 0
 {
	var region0,region1,region2,region3;
	
	if(region==0)
	{
		if(LEVELS_IN_OCT_TREE == 2)
		{
			region0 = octTreeRegions[0];
			region1 = octTreeRegions[1];
			region2 = octTreeRegions[2];
			region3 = octTreeRegions[3];
		}
		else
		{
			var c=0;
			var incr = calculateIncrement(LEVELS_IN_OCT_TREE);  //(1 + Math.pow(4,LEVELS_IN_OCT_TREE-2) + 4*(LEVELS_IN_OCT_TREE - 3));  // number of children within one biggest box
			region0 = octTreeRegions[c];
			c += incr
			region1 = octTreeRegions[c];
			c += incr;
			region2 = octTreeRegions[c];
			c += incr;
			region3 = octTreeRegions[c];
		}
	}
	else
	{
		region0 = octTreeRegions[region.children[0]];
		region1 = octTreeRegions[region.children[1]];
		region2 = octTreeRegions[region.children[2]];
		region3 = octTreeRegions[region.children[3]];
	}
	if(overlappingRegions(region0,selectedRegion))
	{
		if(region0.isFinal)
		{
			for(var i=0;i<region0.children.length;i++)
			{
				if(!alreadySelected(region0.children[i],selectedNodes) && fallInRegion(selectedRegion,theElements[region0.children[i]].X,theElements[region0.children[i]].Y))
				{
					selectedNodes.push(region0.children[i]);
				}
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region0);
		}
	}
	if(overlappingRegions(region1,selectedRegion))
	{
		if(region1.isFinal)
		{
			for(var i=0;i<region1.children.length;i++)
			{
				if(!alreadySelected(region1.children[i],selectedNodes) && fallInRegion(selectedRegion,theElements[region1.children[i]].X,theElements[region1.children[i]].Y))
					selectedNodes.push(region1.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region1);
		}
	}
	if(overlappingRegions(region2,selectedRegion))
	{
		if(region2.isFinal)
		{
			for(var i=0;i<region2.children.length;i++)
			{
				if(!alreadySelected(region2.children[i],selectedNodes) && fallInRegion(selectedRegion,theElements[region2.children[i]].X,theElements[region2.children[i]].Y))
					selectedNodes.push(region2.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region2);
		}
	}
	if(overlappingRegions(region3,selectedRegion))
	{
		if(region3.isFinal)
		{
			for(var i=0;i<region3.children.length;i++)
			{
				if(!alreadySelected(region3.children[i],selectedNodes) && fallInRegion(selectedRegion,theElements[region3.children[i]].X,theElements[region3.children[i]].Y))
					selectedNodes.push(region3.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region3);
		}
	}
 }
 
 function insertIntoOctTree(elementIndex,x,y,region)
 {
	
	if(region==0)
	{
		if(LEVELS_IN_OCT_TREE == 2)
		{
			region0 = octTreeRegions[0];
			region1 = octTreeRegions[1];
			region2 = octTreeRegions[2];
			region3 = octTreeRegions[3];
		}
		else
		{
			var c=0;
			var incr = calculateIncrement(LEVELS_IN_OCT_TREE);  //(1 + Math.pow(4,LEVELS_IN_OCT_TREE-2) + 4*(LEVELS_IN_OCT_TREE - 3));  // number of children within one biggest box
			region0 = octTreeRegions[c];
			c += incr
			region1 = octTreeRegions[c];
			c += incr;
			region2 = octTreeRegions[c];
			c += incr;
			region3 = octTreeRegions[c];
		}
	}
	else
	{
		region0 = octTreeRegions[region.children[0]];
		region1 = octTreeRegions[region.children[1]];
		region2 = octTreeRegions[region.children[2]];
		region3 = octTreeRegions[region.children[3]];
	}
	if(fallInRegion(region0,x,y))
	{
		if(region0.isFinal)
		{
			region0.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region0);
		}
	}
	else if(fallInRegion(region1,x,y))
	{
		if(region1.isFinal)
		{
			region1.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region1);
		}
	}
	else if(fallInRegion(region2,x,y))
	{
		if(region2.isFinal)
		{
			region2.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region2);
		}
	}
	else if(fallInRegion(region3,x,y))
	{
		if(region3.isFinal)
		{
			region3.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region3);
		}
	}
 }
 

//  INDEPENDENT FUNCTIONS
