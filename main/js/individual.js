var datainurl = $.url().param('data');
var splitTemp = datainurl.split("bookimage:");
splitTemp = splitTemp[1].split(",bookname:");
var bookimage = splitTemp[0];
splitTemp = splitTemp[1].split(",bookauthor:");
var bookname = splitTemp[0];
splitTemp = splitTemp[1].split(",bookdesc:");
var bookauthor = splitTemp[0];
splitTemp = splitTemp[1].split(",bookpublisher:");
var bookdesc = splitTemp[0];
splitTemp = splitTemp[1].split(",bookisbn:");
var bookpublisher = splitTemp[0];
splitTemp = splitTemp[1].split(",bookamazon:");
var bookisbn = splitTemp[0];
splitTemp = splitTemp[1]split(",bookcurrentrank:");
var bookamazon = splitTemp[0];
splitTemp = splitTemp[1].split(",booklastrank:");
var bookcurrentrank = splitTemp[0];
var booklastrank = splitTemp[1];
var currentBook = {
	"bookimage":bookimage,
	"bookname":bookname,
	"bookauthor":bookauthor,
	"bookdesc":bookdesc,
	"bookpublisher":bookpublisher,
	"bookisbn":bookisbn,
	"bookamazon":bookamazon,
	"bookcurrentrank":bookcurrentrank,
	"booklastrank":booklastrank
};
console.log(currentBook);
$( document ).ready(function() {
  	individualDetail(currentBook);
});

function individualDetail(bookObject){
	$("#detailImg").empty();
	$("#detailImg").append("<img src=\""+bookObject.bookimage+"\" style=\"display:inline; margin:6px\" width=\"90%\">");
	$("#detail-title").empty();
	$("#detail-title").append(bookObject.bookname);
	$("#detail-author").empty();
	$("#detail-author").append("by "+bookObject.bookauthor);
	$("#detail-desc").empty();
	$("#detail-desc").append(bookObject.bookdesc);
	$("#detail-publisher").empty();
	$("#detail-publisher").append(bookObject.bookpublisher);
	$("#detail-isbn").empty();
	$("#detail-isbn").append("ISBN: "+bookObject.bookisbn);
	$("#buy").empty();
	if(bookObject.bookamazon!='undefined'){
		$("#buy").append("<a href=\""+bookObject.bookamazon+"\" target=_blank><img src=\"images/Amazon-Logo.jpg\" width=\"14%\">");
	}
	var chartObject = [{color:"#6c8dbb",data:[[1,bookObject.bookcurrentrank],[2,bookObject.booklastrank]]}];
	var option = { xaxis: { max: 5, ticks: [[1, "Last"],[2, "Current"]] },yaxis: {transform: function (v) { return -v; },inverseTransform: function (v) { return -v; }} };
	$.plot($("#ranktrend"),chartObject,option);
}



