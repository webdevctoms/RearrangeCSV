function ReorderCSV(fileInputId,dropAreaId){
	this.fileInput = document.getElementById(fileInputId);
	this.dropArea = document.getElementById(dropAreaId);
	//the raw file data
	this.csvFile;
	this.csvArray = [];
	console.log(this.dropArea);
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

ReorderCSV.prototype.readFile = function(){
	let reader = new FileReader()

	reader.onload = function(event){
		let fileString = event.target.result;
		console.log(this.csvFile,fileString);
	}.bind(this);

	reader.readAsText(this.csvFile)
}

ReorderCSV.prototype.fileUploaded = function(event){
	event.preventDefault();	
	this.csvFile = event.target.files[0];
	console.log("file",this.csvFile);
	this.readFile();
}

ReorderCSV.prototype.fileDropped = function(event){
	
	event.preventDefault();
	console.log("files");
	this.csvFile = event.dataTransfer.items[0].getAsFile();
	console.log("file",this.csvFile);
	this.readFile();
}

function initCSVReorder(){
	let converter = new ReorderCSV("inputFile","drop_zone")
}

window.onload = initCSVReorder;