$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

var added_arr = [];
function add_favo(arg){
	var ele;
	ele = "favo_icon" + arg;

	//check global varable favorite
	//if added then remove from favorite
	//if not add to favorite

	if(added_arr.length<=arg-1){
		added_arr[arg-1]=false;
	}
	if(added_arr[arg-1]) {
		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-before.png)";
		document.getElementById('add').innerHTML="Add to My shelf";
		added_arr[arg-1] = false;
	}else{
		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-after.png)";
		document.getElementById('add').innerHTML="Remove from shelf";
		added_arr[arg-1] = true;
	}
}