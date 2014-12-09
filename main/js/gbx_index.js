var Books=[];
var AllBooksInFavoListsDic=[];
var FavoBooks =[]; 

var Book_api = "22167e35f2cd71ee36835bba032fee38:1:70162819";

var currentCategory = null; 
var currentSortMethod = null;
var pickeddate = null;
// BestSellerListsOverview( "2014-11-29");
// BestSellerListNames()
// GetBestSellerList("combined-print-and-e-book-fiction");


function ShowRecommendation(){
	 	// Display Recommendation list.

		$('#update').empty();							// Empty the frame to prepare load for 
		$('#changedate').css("visibility","hidden");	// Recommendation list
		$('#ListNameOnPage').empty();
		$('#ListDescOnPage').empty();
		$('#dropdownSort').css("visibility","hidden");
			
		//Empty case
		if(Object.getOwnPropertyNames(FavoBooks).length==1){
			// When there is no favourite books added.
			console.log("hello world!");
			$("#update").append("<div class=\"jumbotron\"><h2>No Recommendation Yet</h2><p>Add your favorite books to the shelf, we will recommend more for you! :)</p></div>");
		}
		else{
			// Scan through the recommended list and display the results.
			console.log("has recommended content!")
			console.log(Object.getOwnPropertyNames(FavoBooks).length);
			var i=0;
			for(var listName in AllBooksInFavoListsDic){
				var books=AllBooksInFavoListsDic[listName];
				for(var book in books){
				book=books[book];

				if((i+1)%4==0){
					var addedHtml="<div class=\"row\"><div class=\"col-sm-3\">";
				}else{
					var addedHtml="<div class=\"col-sm-3\">";		
					}	
				var encoded_name = book.list_name.replace(/ /g, "-").toLowerCase();

				var inlistRank = book.rank;

				addedHtml=addedHtml+"<div class=\"thumbnail book_pro\" style=\"float:left;\"><a target=\"_blank\" href=\"individualBook.html\" onclick=\"updateDetailPage("+i+")\" id=\"transToIndividual\"><img id=\"book-img\" src=\""+book['book_image']+"\" alt=\"\" style=\"display:inline; padding:6px\" height=\"80px\"> ";
                addedHtml=addedHtml+ "</a><div><h4 id=\"book-title\" class=\"book-title\">"+book['title']+"</h4><a id=\"book-list\" class=\"book-category\" href=\"#\" onclick=\"GetBestSellerList(\'"+encoded_name+"\')\">"+book.list_name+"</a><h5 id=\"book-rank-now\" class=\"book-desc\">Current Rank:  "+book["rank"]+"</h5>";
                if(book['rank_last_week']!=0){
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: "+book["rank_last_week"]+"</h5></div>";    
                }else{
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: -</h5></div>";    
                }                           
				
				var key="";
				if(book['primary_isbn13']!='None'){
					key=book['primary_isbn13'];
				}
				else{
					key=book['primary_isbn10'];
				}		
				// this book is not in favo list
				if(store.get(key)==null){
					//TODO add html	
					addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo_from_remcommend("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Add to My Shelf</p></div>";
				}
				else{
					//TODO add html
					addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo_from_remcommend("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Remove from My Shelf</p></div>";
				}

				$('#update').append(addedHtml);

				if(store.get(key)==null){
					// When the book is not in the favorite list
					var section_id="favo_icon"+i;
					document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-before.png)";
				}
				else{
					// When the book is in the favorite list
					var section_id="favo_icon"+i;
					document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-after.png)";
				}

				i++;
				}
			}
		}


}

function BestSellerListNames()
{
	// Retrieve all the categories of books.
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

function newoverviewdate(){
	// Retrieve the date input to search for previous bestsellers
	var newdate = $("#datepicker")[0].value;
	pickeddate = newdate;
	InitialPage();
	$("#datepicker")[0].value = "";
}


function BestSellerListsOverview(date)
{
	// Retrieve the overview of the best sellers

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

			// Display the overview in the list
			for(i=0;i<Books.length;i++){
				var book=Books[i];
				if((i+1)%4==0){
					var addedHtml="<div class=\"row\"><div class=\"col-sm-3\">";
				}else{
					var addedHtml="<div class=\"col-sm-3\">";		
					}	
				var encoded_name = book.list_name.replace(/ /g, "-").toLowerCase();
				var inlistRank = book.rank;

				addedHtml=addedHtml+"<div class=\"thumbnail book_pro\" style=\"float:left;\"><a target=\"_blank\" href=\"individualBook.html\" onclick=\"updateDetailPage("+i+")\" id=\"transToIndividual\"><img id=\"book-img\" src=\""+book['book_image']+"\" alt=\"\" style=\"display:inline; padding:6px\" height=\"80px\"> ";
                addedHtml=addedHtml+ "</a><div><h4 id=\"book-title\" class=\"book-title\">"+book['title']+"</h4><a id=\"book-list\" class=\"book-category\" href=\"#\" onclick=\"GetBestSellerList(\'"+encoded_name+"\')\">"+book.list_name+"</a><h5 id=\"book-rank-now\" class=\"book-desc\">Current Rank:  "+book["rank"]+"</h5>";
                if(book['rank_last_week']!=0){
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: "+book["rank_last_week"]+"</h5></div>";    
                }else{
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: -</h5></div>";    
                }                           
				
				var key="";
				if(book['primary_isbn13']!='None'){
					key=book['primary_isbn13'];
				}
				else{
					key=book['primary_isbn10'];
				}		
				// this book is not in favo list
				if(store.get(key)==null){
					//TODO add html	
					addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Add to My Shelf</p></div>";
				}
				else{
					//TODO add html
					addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Remove from My Shelf</p></div>";
				}

				$('#update').append(addedHtml);

				if(store.get(key)==null){
					//TODO add html	
					var section_id="favo_icon"+i;
					document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-before.png)";
				}
				else{
					//TODO add html
					var section_id="favo_icon"+i;
					document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-after.png)";
				}

			}
		}
	});
}

function InitialPage()
{
	// This function is used to call BestsellerListNames and BestSellerListsOverview
	// for the initial page.

	$("#dropdownSort").css("visibility","hidden");
	$("#commentwell").css("visibility","hidden");
	$("#changedate").css("visibility","visible");
	var date=pickeddate;

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
	$("#changedate").css("visibility","hidden");
	$("#commentwell").css("visibility","hidden");
	sort_by = currentSortMethod;
	currentCategory = list_Name;

	// var date = "2014-10-11";
	var date = pickeddate;

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

			// Display the list retrieved

			$('#ListNameOnPage').empty();
			$('#ListNameOnPage').append(book.list_name);
			$('#ListDescOnPage').empty();
			$('#ListDescOnPage').append("Updated on "+book.published_date);
			$('#update').empty();
			for(i=0;i<Books.length;i++){
				var book=Books[i];
				//store.set('book_detail', book);
				if((i+1)%4==0){
					var addedHtml="<div class=\"row\"><div class=\"col-sm-3\">";
				}else{
					var addedHtml="<div class=\"col-sm-3\">";		
					}
				addedHtml=addedHtml+"<div class=\"thumbnail book_pro\" style=\"float:left;\"><a target=\"_blank\" href=\"individualBook.html\" onclick=\"updateDetailPage("+i+")\" id=\"transToIndividual\"><img id=\"book-img\" src=\""+book['book_image']+"\" alt=\"\" style=\"display:inline; padding:6px\" height=\"80px\"> ";
                addedHtml=addedHtml+ "</a><div><h4 id=\"book-title\" class=\"book-title\">"+book['title']+"</h4><a id=\"book-list\" class=\"book-category\" href=\"#\" >"+book.list_name+"</a><h5 id=\"book-rank-now\" class=\"book-desc\">Current Rank:  "+book["rank"]+"</h5>";
                if(book['rank_last_week']!=0){
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: "+book["rank_last_week"]+"</h5></div>";    
                }else{
                	addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: -</h5></div>";    
                }                           
				// addedHtml=addedHtml+ "</div></div>";
				
				//add Favo tag
				var key="";
				if(book['primary_isbn13']!='None'){
					key=book['primary_isbn13'];
				}
				else{
					key=book['primary_isbn10'];
				}		
				// this book is not in favo list
				if(store.get(key)==null){
					//TODO add html	
					addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Add to My Shelf</p></div>";
				}
				else{
					//TODO add html
					addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Remove from My Shelf</p></div>";
				}

				$('#update').append(addedHtml);

				if(store.get(key)==null){
					//TODO add html	
					var section_id="favo_icon"+i;
					document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-before.png)";
				}
				else{
					//TODO add html
					var section_id="favo_icon"+i;
					document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-after.png)";
				}

			}

		}
	}); 
}

function updateDetailPage(bookindex){
	// Store the book detail of a certain book which the user wants to see more.
	console.log(bookindex);
	store.set('book_detail', Books[bookindex]);
}

function sortlist(sortorder){
	// Function to do sorting by different parameters.
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

// var added_arr = []; // array to track if the book has been added to favourite or not
function add_favo(arg){
	var ele;
	ele = "favo_icon" + arg;

	var key;

	// Adding favourite book into the store.js.

	// console.log("1234");

	if (Books[arg]['primary_isbn13']!="None"){
		key = Books[arg]['primary_isbn13'];
	}
	else{
		key = Books[arg]['primary_isbn10'];
	}


	var book = Books[arg];
	var valid_key;
	if(book["primary_isbn13"]!="None"){
		valid_key=book["primary_isbn13"];
	}else{
		valid_key=book["primary_isbn10"]; 		
 	}
	//remove
	if (store.get(key)!=null){
		store.remove(key);

		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-before.png)";
	 	document.getElementById('add'+arg).innerHTML="Add to My shelf";

	 	delete FavoBooks[book["list_name"]][valid_key];
	 	console.log(Object.getOwnPropertyNames(FavoBooks[book["list_name"]]).length);
	 	if( Object.getOwnPropertyNames(FavoBooks[book["list_name"]]).length ==1){
	 		delete FavoBooks[book["list_name"]];
	 		delete AllBooksInFavoListsDic[book["list_name"]];

	 	}

	}
	//add
	else if (store.get(key)==null){
		store.set(key, Books[arg]);

		// console.log(key);

		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-after.png)";
	 	document.getElementById('add'+arg).innerHTML="Remove from shelf";

		if(FavoBooks[book["list_name"]]!=null){
			FavoBooks[book["list_name"]][valid_key]=book;
		}
		else{
			FavoBooks[book["list_name"]]=[];
			FavoBooks[book["list_name"]][valid_key]=book;
			AllBooksInFavoListsDic[book["list_name"]]=[];
			for(var i=0;i<5;i++){
				AllBooksInFavoListsDic[book["list_name"]].push(Books[i]);
			}
		}
	} 

	console.log(FavoBooks);
	console.log(AllBooksInFavoListsDic);

}



function add_favo_from_remcommend(arg){
	var ele;
	ele = "favo_icon" + arg;

	var key;

	// console.log("1234");

	if (Books[arg]['primary_isbn13']!="None"){
		key = Books[arg]['primary_isbn13'];
	}
	else{
		key = Books[arg]['primary_isbn10'];
	}

	if (store.get(key)!=null){
		store.remove(key);

		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-before.png)";
	 	document.getElementById('add'+arg).innerHTML="Add to My shelf";
	}
	else if (store.get(key)==null){
		store.set(key, Books[arg]);

		// console.log(key);

		document.getElementById(ele).style.backgroundImage = "url(../main/images/bookmark-after.png)";
	 	document.getElementById('add'+arg).innerHTML="Remove from shelf";
	} 
}


function DisplayMyShelf()
{
	// Function to display the bookshelf.
	var i = 0;

	Books = [];

	$("#dropdownSort").css("visibility","hidden");

	$('#ListNameOnPage').empty();
	$('#ListNameOnPage').append("My BookShelf");
	$('#ListDescOnPage').empty();
	// $('#ListDescOnPage').append("Updated on "+book.published_date);
	$('#update').empty();

	store.forEach(function(key, val){
		if(key!="book_detail"){
			if(val['title']!=null){
				Books.push(val);
				if((i+1)%4==0){
					var addedHtml="<div class=\"row\"><div class=\"col-sm-3\">";
				}else{
					var addedHtml="<div class=\"col-sm-3\">";		
				}
				addedHtml=addedHtml+"<div class=\"thumbnail book_pro\" style=\"float:left;\"><a target=\"_blank\" href=\"individualBook.html\" onclick=\"updateDetailPage("+i+")\" id=\"transToIndividual\"><img id=\"book-img\" src=\""+val['book_image']+"\" alt=\"\" style=\"display:inline; padding:6px\" height=\"80px\"> ";
        	    addedHtml=addedHtml+ "</a><div><h4 id=\"book-title\" class=\"book-title\">"+val['title']+"</h4><a id=\"book-list\" class=\"book-category\" href=\"#\" >"+val['list_name']+"</a><h5 id=\"book-rank-now\" class=\"book-desc\">Current Rank:  "+val["rank"]+"</h5>";	
			}
	
			if(val['rank_last_week']!=0){
        		addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: "+val["rank_last_week"]+"</h5></div>";    
        	}else{
        		addedHtml=addedHtml+ "<h5 id=\"book-rank-last\" class=\"book-desc\">Last Week: -</h5></div>";    
        	}
	
        	// Adding the favourite flag
        	addedHtml=addedHtml+ "<div class=\"add-favo\"><div class=\"favo-icon\" id=\"favo_icon"+i+"\" onClick=\"add_favo("+i+")\" title=\"favorite\" style=\"margin:6px;\"></div><p id=\"add"+i+"\" style=\"display:inline;float:left;margin-top:6px;color:#ad6f59\">Remove from My Shelf</p></div>";  
        	$('#update').append(addedHtml);
        	var section_id="favo_icon"+i;
			document.getElementById(section_id).style.backgroundImage = "url(../main/images/bookmark-after.png)";
	
			i++;
		}
		
	})
}