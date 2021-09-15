let postEditForm = document.getElementById('postEditForm'); 
postEditForm.addEventListener('submit',function(event) {
	let imageUpload = document.getElementById('imageUpload').files.length;
 	let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;
 	let imagesDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
	let newImagesTotal = existingImages - imagesDeletions + imageUpload;
	if( newImagesTotal > 4){
		event.preventDefault();
		let removalAmt = newImagesTotal - 4;
		alert(`You nedd to delete at least ${removalAmt} image${removalAmt === 1 ? '' : 's'}!`);
	}
});
