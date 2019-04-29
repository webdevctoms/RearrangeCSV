Tests = {
	checkLength,
	checkKeys,
	checkCryeCodes
};
//check the initial lengths of the arrays after comma splitting
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
//check to see if columns were moved around correctly almost all columns should
//be empty after move except for the pant length column
function checkKeys(arr){
	console.log("checking keys");
	let incorrectIndexes = [];
	let pantLengthPattern = /long|regular|short|x-long/i;
	for(let key in variantProductMap){
		for(let i = 0;i < arr.length;i++){
			if(i !== 0){
				if(arr[i][key] !== "," && key !== "10"){
					//console.log(i,key,arr[i][key])
					incorrectIndexes.push(i);
				}
				//test to accomodate pant length = waist size
				//because the original pant length was moved to waist size and all pant lengths brought to 
				//column 11
				else if(key === "10" && !pantLengthPattern.test(arr[i][key]) && arr[i][key] !== ","){
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
//check crye adjusted item codes
function checkCryeCodes(arr){
	console.log("checking crye item codes");
	let cryePattern = /crye/i;
	const twoDigitPattern = /\d{2}[XLRS]{2}|\d{2}[XLRS]{1}/i;
	const oneDigitPattern = /\d{1}[a-zA-Z]{3}/;
	const threeLetterPattern = /[XLRSMDG]{1}[XLRSMDG]{1}[XLRS]{1}/;
	let failedItems = [];
	for(let i = 0;i < arr.length;i++){
		if(i !== 0){
			let row = arr[i];
			let itemCode = row[0];
			let vendor = row[5];
			if(twoDigitPattern.test(itemCode) && cryePattern.test(vendor)){
				failedItems.push(itemCode);
			}				
				
			else if(oneDigitPattern.test(itemCode) && cryePattern.test(vendor)){
				failedItems.push(itemCode);
			}

			else if(threeLetterPattern.test(itemCode) && cryePattern.test(vendor)){
				failedItems.push(itemCode);
			}
		}	
	}

	if(failedItems.length > 0){
		console.log("Crye item code test failed: ",failedItems);
	}else{
		console.log("crye item code test passed")
	}
}