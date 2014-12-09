var Books=[];

var Book_api = "22167e35f2cd71ee36835bba032fee38:1:70162819";

var currentCategory = null; 
var currentSortMethod = null;
// BestSellerListsOverview( "2014-11-29");
// BestSellerListNames()
// GetBestSellerList("combined-print-and-e-book-fiction");

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
			// console.log(data);
			resultArr = data.results;
			for(i=0;i<resultArr.length; i++){
				listName = resultArr[i].display_name;
				splitArr = listName.split("&");
				if(splitArr.length==2){
					$('#category').append("<li><a href=\"#\" onclick=\"GetBestSellerList(\'"+resultArr[i].list_name_encoded+"\')\" >"+splitArr[0]+"</br>&nbsp&nbsp&nbsp&nbsp&nbsp&amp"+splitArr[1]+"</a></li>");
				}else{
					$('#category').append("<li><a href=\"#\" onclick=\"GetBestSellerList(\'"+resultArr[i].list_name_encoded+"\')\" >"+listName+"</a></li>");
				}
			}
		}
	});
	 }, 500);
}

function BestSellerListsOverview(date)
{
	// optional date field 
	Books=[];
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
			console.log(data)
			Books=[];
			var i=0;
			var resultTemp=data.results;
			var listsTemp=resultTemp.lists;
			for(i=0; i<listsTemp.length;i++){
				var bookTemp= listsTemp[i].books[0];
				var book={
					"list_name":listsTemp[i]["list_name"],
					"bestsellers_date":resultTemp["bestsellers_date"],
					"published_date": listsTemp[i]["created_date"],
					"rank": bookTemp['rank'],
					"rank_last_week":0,
					"weeks_on_list":0,
					"primary_isbn10":bookTemp['primary_isbn10'],
					"primary_isbn13":bookTemp['primary_isbn13'],
					"publisher":bookTemp['publisher'],
					"author": bookTemp['author'],
					"contributor": bookTemp['contributor'],
					"description": bookTemp['description'],
					"publisher": bookTemp['publisher'],
					"title": bookTemp['title'],
					"book_image": listsTemp[i]['list_image'],
					"amazon_product_url":null,
					"isFavorate": false
				}
				// TODO: modify isFavorate according to store.js
				Books.push(book);
			}
			console.log(Books);
			$('#update').empty();
			$('#ListNameOnPage').empty();
			$('#ListDescOnPage').empty();
			for(i=0;i<Books.length;i++){
				var book=Books[i];
				if((i+1)%4==0){
					var addedHtml="<div class=\"row\"><div class=\"col-sm-3\">";
				}else{
					var addedHtml="<div class=\"col-sm-3\">";		
					}	
				var encoded_name = book.list_name.replace(/ /g, "-").toLowerCase();
				var inlistRank = book.rank;
				var searchAmazon = searchBestSellerList(encoded_name,inlistRank);
				book.amazon_product_url = searchAmazon;
					// console.log(book.list_name.replace(/ /g, "-").toLowerCase());
				addedHtml=addedHtml+"<div class=\"thumbnail book_pro\" style=\"float:left;\"><a target=\"_blank\" href=\"individualBook.html?data=bookimage:"+book.book_image+",bookname:"+book['title']+",bookauthor:"+book.author+",bookdesc:"+book['description']+",bookpublisher:"+book.publisher+",bookisbn:"+book.primary_isbn13+",bookamazon:"+book.amazon_product_url+"\" id=\"transToIndividual\"><img id=\"book-img\" src=\""+book['book_image']+"\" alt=\"\" style=\"display:inline; padding:6px\" height=\"80px\"> ";
                addedHtml=addedHtml+ "</a><div><h4 id=\"book-title\" class=\"book-title\">"+book['title']+"</h4><a id=\"book-list\" class=\"book-category\" href=\"#\" onclick=\"GetBestSellerList(\'"+encoded_name+"\')\">"+book.list_name+"</a><h5 id=\"book-rank-now\" class=\"book-desc\">Current Rank:  "+book["rank"]+"</h5>";
                if(book['rank_last_week']!=0){
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: "+book["rank_last_week"]+"</h5></div>";    
                }else{
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: -</h5></div>";    
                }                           
				// addedHtml=addedHtml+ "</div></div>";
				// TODO:add addFavo function
				addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Add to My Shelf</p></div>";
				$('#update').append(addedHtml);
			}
		}
	});
}

function searchBestSellerList(listname,rank){
	url = "http://api.nytimes.com/svc/books/v3/lists.jsonp?list-name="+listname+"&rank="+rank+"&api-key="+Book_api;

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

	// Not working yet!!!!!!!!!!!!!! //
	$("#dropdownSort").css("visibility","hidden");

	var date=null;

	BestSellerListNames();
	BestSellerListsOverview(date);

}

function GetBestSellerList(list_Name)
{ 
	//The function to get top 20 books for each category, can add optional publish-
	//date field


	// var bestSeller_List = "http://api.nytimes.com/svc/books/v3/lists/"+list_Name+".jsonp?api-key="+Book_api;
	// Caution: must use the encoded list name, i.e use '-' to replace the space, the list-
	// name returned has this field.
	$("#dropdownSort").css("visibility","visible");
	sort_by = currentSortMethod;
	currentCategory = list_Name;

	// var date = "2014-10-11";
	var date = store.get('published_date');

	var bestSeller_List = "http://api.nytimes.com/svc/books/v3/lists/";  
	if(date!=null ){
		bestSeller_List =bestSeller_List + date+"/";
	}
	bestSeller_List=bestSeller_List+list_Name+".jsonp?";
	if(sort_by!=null){
		bestSeller_List=bestSeller_List+"sort-by="+sort_by+"&api-key="+Book_api;
	}else{
		bestSeller_List=bestSeller_List+"api-key="+Book_api;
	}

	// This one is only for testing

	$.ajax({
		'url': bestSeller_List,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		// 'async': false,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			// console.log(data);
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
					"primary_isbn10":bookTemp['primary_isbn10'],
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
			
			$('#ListNameOnPage').empty();
			$('#ListNameOnPage').append(book.list_name);
			$('#ListDescOnPage').empty();
			$('#ListDescOnPage').append("Updated on "+book.published_date);
			$('#update').empty();
			for(i=0;i<Books.length;i++){
				var book=Books[i];
				if((i+1)%4==0){
					var addedHtml="<div class=\"row\"><div class=\"col-sm-3\">";
				}else{
					var addedHtml="<div class=\"col-sm-3\">";		
					}
				addedHtml=addedHtml+"<div class=\"thumbnail book_pro\" style=\"float:left;\"><a target=\"_blank\" href=\"individualBook.html?data=bookimage:"+book.book_image+",bookname:"+book['title']+",bookauthor:"+book.author+",bookdesc:"+book['description']+",bookpublisher:"+book.publisher+",bookisbn:"+book.primary_isbn13+",bookamazon:"+book.amazon_product_url+",bookcurrentrank:"+book.rank+",booklastrank:"+book.rank_last_week+"\" id=\"transToIndividual\"><img id=\"book-img\" src=\""+book['book_image']+"\" alt=\"\" style=\"display:inline; padding:6px\" height=\"80px\"> ";
                addedHtml=addedHtml+ "</a><div><h4 id=\"book-title\" class=\"book-title\">"+book['title']+"</h4><a id=\"book-list\" class=\"book-category\" href=\"#\" >"+book.list_name+"</a><h5 id=\"book-rank-now\" class=\"book-desc\">Current Rank:  "+book["rank"]+"</h5>";
                if(book['rank_last_week']!=0){
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: "+book["rank_last_week"]+"</h5></div>";    
                }else{
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: -</h5></div>";    
                }                           
				// addedHtml=addedHtml+ "</div></div>";
				// TODO:add addFavo function
				
				addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Add to My Shelf</p></div>";
				$('#update').append(addedHtml);
			}

		}
	}); 
}


function sortlist(sortorder){
	$("#dropdownSort").empty();
	if (sortorder==null){
		var sortword = "Sort By";
	}else{
		var sortword = "Sorted by: "+sortorder.replace(/-/g, " ").toUpperCase();
	}
	$("#dropdownSort").append(sortword);
	currentSortMethod=sortorder;
	GetBestSellerList(currentCategory);
}

function individualDetail(bookObject){
	console.log(bookObject);
	var imgUpdate = "<img src=\""+bookObject.book_image+"\" style=\"display:inline;margin:6px\" width=\"90%\"";
	$("#detailImg").empty();
	$("#detailImg").append(imgUpdate);
	var titleUpdate = bookObject['title'];
	$("#detail-title").empty();
	$("#detail-title").append(titleUpdate);
	var authorUpdate = bookObject.author;
	$("#detail-author").empty();
	$("#detail-author").append(authorUpdate);
	var descUpdate = bookObject['description'];
	$("#detail-desc").empty();
	$("#detail-desc").append(descUpdate);
	var publisherUpdt = bookObject.publisher;
	$("#detail-publisher").empty();
	$("#detail-publisher").append(publisherUpdt);
	var IsbnUpdate = "ISBN: "+book.primary_isbn13;
	$("#detail-isbn").empty();
	$("#detail-isbn").append(IsbnUpdate);
	var amazonlink = "";
	splitLink = bookObject.amazon_product_url.split("\\");
	for (i=0;i<splitLink.length;i++){
		amazonlink += splitLink[i];
	}
	var amazonLinkUpdt = "<a href=\""+amazonlink+"\"><img src=\"images/Amazon-logo.jpg\" width=\"14%\"></a>";
	$("#buy").empty();
	$("#buy").append(amazonLinkUpdt);
}

// function overviewTolist(not_coded_listname){
// 	lower_case = not_coded_listname.toLowerCase();
// 	encoded_listname=lower_case.replace(/ /g, "-");
// 	GetBestSellerList(encoded_listname);
// }


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
		// 'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': callback
	});
}

function init() {
	if (!store.enabled) {
		alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
		return
	}
	else{
		alert('store.js is enabled!')
		return
	}
	var items = new Store('list_name');
	items.set('list_name', 24);
}

var added_arr = []; // array to track if the book has been added to favourite or not
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
		added_arr[arg-1] = false; // Indeed remove book from favourite
	}else{
		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-after.png)";
		document.getElementById('add').innerHTML="Remove from shelf";
		added_arr[arg-1] = true;  // Indeed add book into favourite
		
	}

	if (store.get(Books[arg-1]['primary_isbn10'])!=null || store.get(Books[arg-1]['primary_isbn13'])!=null){
		if (store.get(Books[arg-1]['primary_isbn10'])!=null){
			store.remove(Books[arg-1]['primary_isbn10']);
		}
		else if (store.get(Books[arg-1]['primary_isbn13'])!=null){
			store.remove(Books[arg-1]['primary_isbn13']);
		}
	} 
}

