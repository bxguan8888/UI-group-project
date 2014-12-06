$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});


function add_favo(arg){
	var ele;
	ele = "favo_icon" + arg;

	//check global varable favorite
	//if added then remove from favorite
	//if not add to favorite

	document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-after.png)";
}