function FilterItemCodes(dropZoneID){
	this.dropZone = document.getElementById(dropZoneID);
	//console.log("test",this.dropZone);
	this.setEventListeners();
	this.itemCodesCSV;
	this.itemCodes = {};
};

FilterItemCodes.prototype.setEventListeners = function() {
	this.dropZone.addEventListener("drop",function(e){
		console.log("Test");
		this.fileDropped(e);
	}.bind(this),false);

	//need this to prevent default downloading of file
	this.dropZone.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);

};

FilterItemCodes.prototype.assignItemCodes = function(itemCodesArray){
	for(let i = 0;i < itemCodesArray.length;i++){
		this.itemCodes[itemCodesArray[i]] = String(itemCodesArray[i]);
	}
}

FilterItemCodes.prototype.removeBlanks = function(newLineArray){
	let newArray = [];
	for(let i = 0;i < newLineArray.length; i++){
		//console.log(newLineArray[i].length);
		if(newLineArray[i].length === 1 || newLineArray[i].length === 0){
			continue;
		}
		newArray.push(newLineArray[i]);
	}
	return newArray;
}

FilterItemCodes.prototype.filterByItemCodes = function(arr){
 	let filteredArray = [];
 	if(Object.keys(this.itemCodes).length > 0){

 	}
 	else{
 		
 		return filteredArray;
 	}
 	return filteredArray;
}

FilterItemCodes.prototype.readFile = function(){
	let reader = new FileReader()

	reader.onload = function(event){
		let fileString = event.target.result;
		let newLineSplitFile = fileString.split("\n");
		let blanksRemovedArray = this.removeBlanks(newLineSplitFile);
		this.assignItemCodes(blanksRemovedArray);
		console.log(this.itemCodes);
		
	}.bind(this);

	reader.readAsText(this.itemCodesCSV)
};

FilterItemCodes.prototype.fileDropped = function(event){
	
	event.preventDefault();

	this.itemCodesCSV = event.dataTransfer.items[0].getAsFile();
	this.readFile();
};

