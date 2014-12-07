var Books=[];

var Book_api = "22167e35f2cd71ee36835bba032fee38:1:70162819";

function BestSellerListNames()
{
	setTimeout(function () {
		var url = "http://api.nytimes.com/svc/books/v3/lists/names.jsonp?callback=books&api-key="+Book_api;
	
		$.ajax({
			'url': url,
			'method': 'GET',
			'jsonpCallback' : 'books',
			'cache': true,
			'dataType': 'jsonp',
			'success': function(data, textStats, XMLHttpRequest){
				console.log(data);
	
				store.set('list_name', data);
				var name = store.get('list_name');

				console.log(name);
				
			}
		});
	},1000);

}

function BestSellerListsOverview(date)
{
	// optional date field 
	var url = "";

	if(date==null){ // may need to be changed to "==''" later
		url = "http://api.nytimes.com/svc/books/v3/lists/overview.jsonp?callback=books&api-key="+Book_api;
	}
	else{
		url = "http://api.nytimes.com/svc/books/v3/lists/overview.jsonp?callback=books&published_date="+date+"&api-key="+Book_api;
	}

	$.ajax({
		'url': url,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			console.log(data);
			
		}
	});
}

function InitialPage()
{
	// This function is used to call BestsellerListNames and BestSellerListsOverview
	// for the initial page.

	
	var date; // Extract from the html element and store in store.js for later use
	store.set('published_date', date);

	BestSellerListNames();
	BestSellerListsOverview(date);

}

function GetBestSellerList(list_Name, sort_by, sort_order)
{ 
	//The function to get top 20 books for each category, can add optional publish-
	//date field


	// var bestSeller_List = "http://api.nytimes.com/svc/books/v3/lists/"+list_Name+".jsonp?api-key="+Book_api;
	// Caution: must use the encoded list name, i.e use '-' to replace the space, the list-
	// name returned has this field.

	var bestSeller_List = "http://api.nytimes.com/svc/books/v3/lists/combined-print-and-e-book-fiction.jsonp?api-key="+Book_api;
	// This one is only for testing

	var date = store.get('published_date');

	// var date = "2014-05-06";

	if(date!=null){
		bestSeller_List =bestSeller_List + date+"/";
	}

	bestSeller_List=bestSeller_List+list_Name+".jsonp?";

	if(sort_by!=null){
		if(sort_order!=null){
			bestSeller_List=bestSeller_List+"sort-by="+sort_by+ "&sort-order=" + sort_order;
		}else{
			bestSeller_List=bestSeller_List+"sort-by="+sort_by;
		}

		bestSeller_List=bestSeller_List+"&api-key="+Book_api;

	}else{
		if(sort_order!=null){
			bestSeller_List=bestSeller_List+"sort-order=" + sort_order+"&api-key="+Book_api;
		}else{
			bestSeller_List=bestSeller_List+"api-key="+Book_api;
		}
	}

	$.ajax({
		'url': bestSeller_List,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		// 'async': false,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			console.log(data);

			Books=[];
			var i=0;
			var resultTemp=data["results"];
			var booksTemp=data["results"]["books"];
			for(i=0; i<booksTemp.length;i++){
				var bookTemp= booksTemp[i];
				var book={
					"list_name":resultTemp["list_name"],
					"bestsellers_date":resultTemp["bestsellers_date"],
					"published_date": resultTemp["published_date"],
					"rank": bookTemp['rank'],
					"rank_last_week":bookTemp['rank_last_week'],
					"weeks_on_list":bookTemp['weeks_on_list'],
					"primary_isbn13":bookTemp['primary_isbn13'],
					"publisher":bookTemp['publisher'],
					"author": bookTemp['author'],
					"contributor": bookTemp['contributor'],
					"description": bookTemp['description'],
					"publisher": bookTemp['publisher'],
					"title": bookTemp['title'],
					"book_image": bookTemp['book_image'],
					"amazon_product_url":bookTemp['amazon_product_url'],
					"isFavorate": false
				}
				// TODO: modify isFavorate according to store.js
				Books.push(book);
			}
			console.log(Books);
		}
	}); 
}

function SearchBookReview(data)
{
	// 'data' passed in could be 'isbn13', title or book name.

	// var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&title="+data+"&api-key="+Book_api;
	// // Search by title

	// var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&isbn="+data+"&api-key="+Book_api;
	// // Search by ISBN

	var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&title=REVIVAL&api-key="+Book_api;
	// For testing

	$.ajax({
		'url': url,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			console.log(data);

			SearchArticle(data);
			// Turns out the effect of the article search API is worse than the summary
			// "summary" of the book review itself
		}
	});
}

function SearchArticle(review_data)
{
	var article_api_key = "f51ebf30eff56e3dc5584bc8d2c5e8db:7:70162819";

	var article_URL = "http://www.nytimes.com/2014/11/14/books/stephen-kings-revival.html";

	var encodeURL = encodeURIComponent(article_URL);

	var URL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?";

	URL = URL+"fq=web_url:(\""+encodeURL+"\")&api-key="+article_api_key;

	$.ajax({
		'url': URL,
		'method': 'GET',
		'cache': true,
		'dataType': 'json',
		'success': function(data, textStats, XMLHttpRequest){
			console.log(data);
		}
	});
}

function BestSellerHistory(book_name)
{
	// This function is used to retrieve history ranking of certain book
	// var book_name1 = book_name;

	// var encode_bookname = book_name.split(' ');
	// var len = encode_bookname.length;
	// var bookname = "";

	// for (var i=0; i<len; i++){
	// 	bookname = bookname + "+" + encode_bookname[i];
	// }

	// var url = "http://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?callback=books&title=THE+GOLDFINCH&api-key="+Book_api;

	var url = "http://api.nytimes.com/svc/books/v3/lists/best-sellers/history.jsonp?title=THE+GOLDFINCH&api-key="+Book_api;
	// For test
	// Caution about the format of the book title passed in

	var callback = function(res){
		console.log(res);
	}

	$.ajax({
		'url': url,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': callback
	});
}

// init()
function init() {
	if (!store.enabled) {
		alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
		return
	}
	// else{
	// 	alert('store.js is enabled!')
	// 	return
	// }

	// var items = new Store('list_name');

	store.set('list_name', 24);

	var name = store.get('list_name');
	console.log(name);

}

