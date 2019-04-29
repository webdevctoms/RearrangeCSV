function ReorderCSV(fileInputId,dropAreaId,testButtonID){
	this.fileInput = document.getElementById(fileInputId);
	this.dropArea = document.getElementById(dropAreaId);
	this.testButton = document.getElementById(testButtonID);
	//the raw file data
	this.csvFile;
	this.commaSplitArr = [];
	this.reorderedArray = [];
	this.setEventListeners();
}

ReorderCSV.prototype.setEventListeners = function(){
	this.fileInput.addEventListener("change",function(e){
		console.log("tesdt");
		this.fileUploaded(e);
	}.bind(this),false);

	this.dropArea.addEventListener("drop",function(e){
		//e.preventDefault();
		this.fileDropped(e);
	}.bind(this),false);
	//need this to prevent default downloading of file
	this.dropArea.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);

	this.testButton.addEventListener("click",function(e){
		e.preventDefault();
		this.runTests(e);
	}.bind(this),false);

}

ReorderCSV.prototype.runTests = function(event){
	try{
		//check length after comma splitting data
		Tests.checkLength(this.commaSplitArr,this.commaSplitArr[0].length);
		Tests.checkKeys(this.reorderedArray);
	}
	catch(err){
		console.log("error testing ",err);
	}
	
} 

ReorderCSV.prototype.createCSV = function(arr){
	let lineArray = [];
	//console.log(arr);
	arr.forEach(function(rowArr,index){
		let row = rowArr.join("");
		lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + row:row);	
		//lineArray.push(row);
	});
	let csvContent = lineArray.join("\n");
	let encodedUri = encodeURI(csvContent);
	//console.log(csvContent);
	return encodedUri
}

ReorderCSV.prototype.createDownload = function(csvData){
	let downloadLink = document.getElementById("downloadLink");
	downloadLink.classList.remove("hide");
	downloadLink.setAttribute("href",csvData);
	downloadLink.setAttribute("download", "new_data.csv");
}
//return fixed sub string
ReorderCSV.prototype.fixItemCodeSubString = function(subString,index){
	
}

ReorderCSV.prototype.fixItemCodes = function(itemCode){
	//2 digits will represent waist size and 2 letters length of pant
	//fix waist size mixed with pant length 
	//eg 50000-BK-42R
	//eg 28-xl or 28-l
	let newItemCode = itemCode;
	const twoDigitPattern = /\d{2}\w{2}|\d{2}\w{1}/i;
	//these should be 2xl etc and the last digit should be length
	//fix shirt size mixed with length with only 1 digit
	//eg 50025-RG-2XLL
	//eg 2xl-r
	const oneDigitPattern = /\d{1}\w{3}/i;
	//50001-MC-2XR  need pattern for these?

	//these should be XL plus length
	//fix shirt size mixed with length with no digits
	//50001-BK-LGL
	//eg xl-l
	const threeLetterPattern = /[XLRSMDG]{1}[XLRSMDG]{1}[XLRS]{1}/;
	let spliceIndex = 0;
	let splitItemCode = itemCode.split("-");
	switch(itemCode){
		case twoDigitPattern.test(itemCode):
			let subString = splitItemCode[splitItemCode.length - 1];
			spliceIndex = 2;
			break;

		case oneDigitPattern.test(itemCode):
			spliceIndex = 3;
			let subString = splitItemCode[splitItemCode.length - 1];
			break;

		case threeLetterPattern.test(itemCode):
			spliceIndex = 2;
			let subString = splitItemCode[splitItemCode.length - 1];
			break;	
	}

	return newItemCode;

}

ReorderCSV.prototype.reorderColumns = function(commaSplitArr){
	let reorderedArray = [];
	//i = rows
	for(let i = 0;i < commaSplitArr.length;i++){
		let rowArray = commaSplitArr[i];
		if(i !== 0){
			//k = columns
			for(let k = 0;k < commaSplitArr[i].length; k++){

				if(variantProductMap[k] && commaSplitArr[i][k] !== ","){

					//11 and 10 means a waist size under pant length
					if(commaSplitArr[i][variantProductMap[k]] !== ",") {console.log("two sets of data",commaSplitArr[i][k],i,k,variantProductMap[k]);}
					let destinationIndex = variantProductMap[k];
					//move datat to the new locations
					commaSplitArr[i][destinationIndex] = commaSplitArr[i][k];
					//set old data location to nothing
					commaSplitArr[i][k] = ",";
					
				}
			}

			rowArray = commaSplitArr[i];
		}
		reorderedArray.push(rowArray);
	}
	console.log("reorderd array: ",reorderedArray);
	return reorderedArray;
}

//not capturing last column, guess just add it manually
ReorderCSV.prototype.splitByCommas = function(newLineArr){
	//const commaRegex = /\"*(.*?)(?:\"*\,)/g;
	const commaRegex = /\"(.*?)(?<!\")(?:\"\,)|\"(.*?)(?:\"{3}\,)|(.*?)(?:\,)/g;
	let commaSplitArr = [];
	for(let i = 0;i < newLineArr.length;i++){
		//issues with matching 3 " so just remove any cases of 3 "
		let sanitizedString = newLineArr[i].replace(/\"{3}/g,'"').replace(/\#/g,"");
		let rowMatches = sanitizedString.match(commaRegex);
		commaSplitArr.push(rowMatches);		
	}

	commaSplitArr.pop();
	
	return commaSplitArr;
}

ReorderCSV.prototype.readFile = function(){
	let reader = new FileReader()

	reader.onload = function(event){
		let fileString = event.target.result;
		let newLineSplitFile = fileString.split("\n");
		//console.log(newLineSplitFile);
		this.commaSplitArr = this.splitByCommas(newLineSplitFile);
		console.log(this.commaSplitArr);
		
		this.reorderedArray = this.reorderColumns(this.commaSplitArr);

		let csvData = this.createCSV(this.commaSplitArr);
		this.createDownload(csvData);
		
	}.bind(this);

	reader.readAsText(this.csvFile)
}

ReorderCSV.prototype.fileUploaded = function(event){
	event.preventDefault();	
	this.csvFile = event.target.files[0];
	this.readFile();
}

ReorderCSV.prototype.fileDropped = function(event){
	
	event.preventDefault();
	this.csvFile = event.dataTransfer.items[0].getAsFile();
	this.readFile();
}

function initCSVReorder(){
	let converter = new ReorderCSV("inputFile","drop_zone","testData");
}

window.onload = initCSVReorder;