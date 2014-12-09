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
	SearchBookReview(bookObject.primary_isbn13);
	$("#buy").empty();
	if(bookObject.amazon_product_url!=null){
		$("#buy").append("<a href=\""+bookObject.amazon_product_url+"\" target=_blank><img src=\"images/Amazon-Logo.png\" width=\"14%\">");
	}
	//store.remove('book_detail');
}

function SearchBookReview(isbn)
{
	// 'data' passed in could be 'isbn13', title or book name.

	// var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&title="+data+"&api-key="+Book_api;
	// // Search by title

	// var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&isbn="+data+"&api-key="+Book_api;
	// // Search by ISBN

	var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&isbn="+isbn+"&api-key="+Book_api;
	// For testing

	$.ajax({
		'url': url,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			console.log(data);
			var comments = data.results;
			if(comments.length==0){
				$("#commentBody").empty();
				$("#commentBody").append("None.");
			}else{
				for(i=0;i<comments.length;i++){
					$("#commentBody").empty();
					$("#commentBody").append("<p>"+comments[i]['summary']+"</p><h5>by "+comments[i].byline+"</h5 style=\"margin-bottom:10px;margin-top:-10px\"><p>"+comments[i].publication_dt+"</p>");
				}
			}
			//SearchArticle(data);
			// Turns out the effect of the article search API is worse than the summary
			// "summary" of the book review itself
		}
	});
}
