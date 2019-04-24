Tests = {
	checkLength,
	checkKeys
};

function checkLength(arr,arrLength){
	console.log("checking length");
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

function checkKeys(arr){
	console.log("checking keys");
	let incorrectIndexes = [];
	
	for(let key in variantProductMap){
		for(let i = 0;i < arr.length;i++){
			if(i !== 0){
				//console.log(i,key,arr[i][key])
				if(arr[i][key] !== ","){
					incorrectIndexes.push(i);
				}
			}
		}
	}
	
	if(incorrectIndexes.length === 0){
		console.log("key test passed");
	}
	else{
		console.log("Error indexes: ",incorrectIndexes);
	}

}