var book = store.get('book_detail');
console.log(book);
$( document ).ready(function() {
  	individualDetail(book);
});

function individualDetail(bookObject){
	$("#detailImg").empty();
	$("#detailImg").append("<img src=\""+bookObject.book_image+"\" style=\"display:inline; margin:6px\" width=\"90%\">");
	$("#detail-title").empty();
	$("#detail-title").append(bookObject['title']);
	$("#detail-author").empty();
	$("#detail-author").append("by "+bookObject.author);
	$("#detail-desc").empty();
	$("#detail-desc").append(bookObject['description']);
	$("#detail-publisher").empty();
	$("#detail-publisher").append(bookObject.publisher);
	$("#detail-isbn").empty();
	$("#detail-isbn").append("ISBN: "+bookObject.primary_isbn13);
	$("#buy").empty();
	if(bookObject.amazon_product_url!=null){
		$("#buy").append("<a href=\""+bookObject.amazon_product_url+"\" target=_blank><img src=\"images/Amazon-Logo.png\" width=\"14%\">");
	}
	store.remove('book_detail');
}



