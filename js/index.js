function ReorderCSV(fileInputId,dropAreaId){
	this.fileInput = document.getElementById(fileInputId);
	this.dropArea = document.getElementById(dropAreaId);
	//the raw file data
	this.csvFile;
	this.csvArray = [];
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
}
//not capturing last column, guess just add it manually
ReorderCSV.prototype.splitByCommas = function(newLineArr){
	//const commaRegex = /\"*(.*?)(?:\"*\,)/g;
	const commaRegex = /\"(.*?)(?<!\")(?:\"\,)|\"(.*?)(?:\"{3}\,)|(.*?)(?:\,)/g;
	let commaSplitArr = [];
	for(let i = 0;i < newLineArr.length;i++){
		let sanitizedString = newLineArr[i].replace(/\"{3}/g,'"');
		let rowMatches = sanitizedString.match(commaRegex);
		commaSplitArr.push(rowMatches);		
	}

	commaSplitArr.pop();
	Tests.checkSplitLengths(commaSplitArr,commaSplitArr[0].length);
	return commaSplitArr;
}

ReorderCSV.prototype.readFile = function(){
	let reader = new FileReader()

	reader.onload = function(event){
		let fileString = event.target.result;
		let newLineSplitFile = fileString.split("\n");
		//console.log(newLineSplitFile);
		let commaSplitArr = this.splitByCommas(newLineSplitFile);
		console.log(commaSplitArr);
		
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
	let converter = new ReorderCSV("inputFile","drop_zone")
}

window.onload = initCSVReorder;