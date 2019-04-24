function ReorderCSV(fileInputId,dropAreaId,testButtonID){
	this.fileInput = document.getElementById(fileInputId);
	this.dropArea = document.getElementById(dropAreaId);
	this.testButton = document.getElementById(testButtonID);
	//the raw file data
	this.csvFile;
	this.commaSplitArr = [];
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
	}.bind(this),false)

}

ReorderCSV.prototype.runTests = function(event){
	try{
		Tests.checkSplitLengths(this.commaSplitArr,this.commaSplitArr[0].length);
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
	console.log(csvContent);
	return encodedUri
}

ReorderCSV.prototype.createDownload = function(csvData){
	let downloadLink = document.getElementById("downloadLink");
	downloadLink.classList.remove("hide");
	downloadLink.setAttribute("href",csvData);
	downloadLink.setAttribute("download", "new_data.csv");
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