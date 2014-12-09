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
var bookamazon = splitTemp[1];
var currentBook = {
	"bookimage":bookimage,
	"bookname":bookname,
	"bookauthor":bookauthor,
	"bookdesc":bookdesc,
	"bookpublisher":bookpublisher,
	"bookisbn":bookisbn,
	"bookamazon":bookamazon
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
}



