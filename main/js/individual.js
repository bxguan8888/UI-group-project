//This javascrip is responsible for updating the detail information page for an individual book

var book = store.get('book_detail');//retrieval selected book from store.js
console.log(book);
$( document ).ready(function() {
  	individualDetail(book);//once the individual page is loaded, it automatically update the information field of the book
});

//update book information in its individal page
function individualDetail(bookObject){
	//book cover image
	$("#detailImg").empty();
	$("#detailImg").append("<img src=\""+bookObject.book_image+"\" style=\"display:inline; margin:6px\" width=\"90%\">");
	//book name
	$("#detail-title").empty();
	$("#detail-title").append(bookObject['title']);
	//book author
	$("#detail-author").empty();
	$("#detail-author").append("by "+bookObject.author);
	//book description
	$("#detail-desc").empty();
	$("#detail-desc").append(bookObject['description']);
	//publisher
	$("#detail-publisher").empty();
	$("#detail-publisher").append(bookObject.publisher);
	//isbn
	$("#detail-isbn").empty();
	$("#detail-isbn").append("ISBN: "+bookObject.primary_isbn13);
	//based on isbn, search all reviews regarding on the book
	SearchBookReview(bookObject.primary_isbn13);
	//amazon link for purchasing the book
	$("#buy").empty();
	if(bookObject.amazon_product_url!=null){
		$("#buy").append("<a href=\""+bookObject.amazon_product_url+"\" target=_blank><img src=\"images/Amazon-Logo.png\" width=\"14%\">");
	}
}

//search for reviews for the book, based on isbn
function SearchBookReview(isbn)
{
	//  can pass in isbn, title or book name.

	var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&isbn="+isbn+"&api-key="+Book_api;

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
				$("#commentBody").append("None.");//if no comments found
			}else{
				for(i=0;i<comments.length;i++){
					$("#commentBody").empty();
					$("#commentBody").append("<p>"+comments[i]['summary']+"</p><h5>by "+comments[i].byline+"</h5 style=\"margin-bottom:10px;margin-top:-10px\"><p>"+comments[i].publication_dt+"</p>");
				}
			}
		}
	});
}
