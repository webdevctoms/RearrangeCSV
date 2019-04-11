Tests = {
	checkSplitLengths:checkLength
};

function checkLength(arr,arrLength){
	//console.log("test",length);
	let incorrectIndexes = [];
	for(let i = 0;i < arr.length;i++){
		try{
			if(arr[i].length !== arrLength){
				incorrectIndexes.push(i);
				console.log("error at: ",i);
			}
		}
		catch(error){
			console.log(i);
			console.log(error);
		}
		
	}

	if(incorrectIndexes.length === 0){
		console.log("Length test passed");
	}
}