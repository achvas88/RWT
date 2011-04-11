
var octTreeRegions_H = new Array();
var octTreeCounter_H = 0;
 
////////////////// functions //////////////////////
//
// drawOctTreeRegions_H()
// initializeOctTree_H(x,y,width,height,level,parent)
// fallInRegion(region,x,y)
// regionToOctTreeNodes_H(selectedRegion,region)
// overlappingRegions(region1,region2)
// calculateIncrement(level)
// insertIntoOctTree_H(elementIndex,x,y,region)
// viewOctTree()
///////////////////////////////////////////////////
  
 function initializeOctTree_H(x,y,width,height,level,parent)
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
		octTreeRegions_H[octTreeCounter_H] = region0;
		
		// tell parent that i am your child
		if(parent!=-1)
		{
			octTreeRegions_H[parent].children.push(octTreeCounter_H);
		}
		
		// increment octTreeCounter_H
		octTreeCounter_H++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree_H(region0.x,region0.y,region0.width,region0.height,level,octTreeCounter_H-1);
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
		
		octTreeRegions_H[octTreeCounter_H] = region1;
		
		if(parent!=-1)
		{
			octTreeRegions_H[parent].children.push(octTreeCounter_H);
		}
		
		octTreeCounter_H++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree_H(region1.x,region1.y,region1.width,region1.height,level,octTreeCounter_H-1);
		}
		
		
		region2 = new Object();
		region2.x = x;
		region2.y = y+height/2;
		region2.width = width/2;
		region2.height = height/2;
		region2.children = new Array();
		
		if(level <= 1) region2.isFinal = true;
		else region2.isFinal = false;
		
		octTreeRegions_H[octTreeCounter_H] = region2;
		
		if(parent!=-1)
		{
			octTreeRegions_H[parent].children.push(octTreeCounter_H);
		}
		
		octTreeCounter_H++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree_H(region2.x,region2.y,region2.width,region2.height,level,octTreeCounter_H-1);
		}
		
		region3 = new Object();
		region3.x = x + width/2;
		region3.y = y + height/2;
		region3.width = width/2;
		region3.height = height/2;
		region3.children = new Array();
		
		if(level <= 1) region3.isFinal = true;
		else region3.isFinal = false;
		
		octTreeRegions_H[octTreeCounter_H] = region3;
		
		if(parent!=-1)
		{
			octTreeRegions_H[parent].children.push(octTreeCounter_H);
		}
		
		octTreeCounter_H++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree_H(region3.x,region3.y,region3.width,region3.height,level,octTreeCounter_H-1);
		}
	}
 }
   
 function regionToOctTreeNodes_H(selectedRegion,region) // initially region should be 0
 {
	var region0,region1,region2,region3;
	
	if(region==0)
	{
		if(LEVELS_IN_OCT_TREE_H == 2)
		{
			region0 = octTreeRegions_H[0];
			region1 = octTreeRegions_H[1];
			region2 = octTreeRegions_H[2];
			region3 = octTreeRegions_H[3];
		}
		else
		{
			var c=0;
			var incr = calculateIncrement(LEVELS_IN_OCT_TREE_H);  //(1 + Math.pow(4,LEVELS_IN_OCT_TREE_H-2) + 4*(LEVELS_IN_OCT_TREE_H - 3));  // number of children within one biggest box
			region0 = octTreeRegions_H[c];
			c += incr
			region1 = octTreeRegions_H[c];
			c += incr;
			region2 = octTreeRegions_H[c];
			c += incr;
			region3 = octTreeRegions_H[c];
		}
	}
	else
	{
		region0 = octTreeRegions_H[region.children[0]];
		region1 = octTreeRegions_H[region.children[1]];
		region2 = octTreeRegions_H[region.children[2]];
		region3 = octTreeRegions_H[region.children[3]];
	}
	if(overlappingRegions(region0,selectedRegion))
	{
		if(region0.isFinal)
		{
			for(var i=0;i<region0.children.length;i++)
			{
				if(!alreadySelected(region0.children[i],selectedNodes_H) && fallInRegion(selectedRegion,elements_H[region0.children[i]].X,elements_H[region0.children[i]].Y))
				{
					selectedNodes_H.push(region0.children[i]);
				}
			}
		}
		else
		{
			regionToOctTreeNodes_H(selectedRegion,region0);
		}
	}
	if(overlappingRegions(region1,selectedRegion))
	{
		if(region1.isFinal)
		{
			for(var i=0;i<region1.children.length;i++)
			{
				if(!alreadySelected(region1.children[i],selectedNodes_H) && fallInRegion(selectedRegion,elements_H[region1.children[i]].X,elements_H[region1.children[i]].Y))
					selectedNodes_H.push(region1.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes_H(selectedRegion,region1);
		}
	}
	if(overlappingRegions(region2,selectedRegion))
	{
		if(region2.isFinal)
		{
			for(var i=0;i<region2.children.length;i++)
			{
				if(!alreadySelected(region2.children[i],selectedNodes_H) && fallInRegion(selectedRegion,elements_H[region2.children[i]].X,elements_H[region2.children[i]].Y))
					selectedNodes_H.push(region2.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes_H(selectedRegion,region2);
		}
	}
	if(overlappingRegions(region3,selectedRegion))
	{
		if(region3.isFinal)
		{
			for(var i=0;i<region3.children.length;i++)
			{
				if(!alreadySelected(region3.children[i],selectedNodes_H) && fallInRegion(selectedRegion,elements_H[region3.children[i]].X,elements_H[region3.children[i]].Y))
					selectedNodes_H.push(region3.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes_H(selectedRegion,region3);
		}
	}
 }
 
 function insertIntoOctTree_H(elementIndex,x,y,region)
 {
	
	if(region==0)
	{
		if(LEVELS_IN_OCT_TREE_H == 2)
		{
			region0 = octTreeRegions_H[0];
			region1 = octTreeRegions_H[1];
			region2 = octTreeRegions_H[2];
			region3 = octTreeRegions_H[3];
		}
		else
		{
			var c=0;
			var incr = calculateIncrement(LEVELS_IN_OCT_TREE_H);  //(1 + Math.pow(4,LEVELS_IN_OCT_TREE_H-2) + 4*(LEVELS_IN_OCT_TREE_H - 3));  // number of children within one biggest box
			region0 = octTreeRegions_H[c];
			c += incr
			region1 = octTreeRegions_H[c];
			c += incr;
			region2 = octTreeRegions_H[c];
			c += incr;
			region3 = octTreeRegions_H[c];
		}
	}
	else
	{
		region0 = octTreeRegions_H[region.children[0]];
		region1 = octTreeRegions_H[region.children[1]];
		region2 = octTreeRegions_H[region.children[2]];
		region3 = octTreeRegions_H[region.children[3]];
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
			insertIntoOctTree_H(elementIndex,x,y,region0);
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
			insertIntoOctTree_H(elementIndex,x,y,region1);
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
			insertIntoOctTree_H(elementIndex,x,y,region2);
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
			insertIntoOctTree_H(elementIndex,x,y,region3);
		}
	}
 }
 
 