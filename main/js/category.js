var Book_api = "779f3cf0d073334d30843f366d4d11aa%3A5%3A70161474";
function BestSellerListNames()
{
	// setTimeout(function () {
	var url = "http://api.nytimes.com/svc/books/v3/lists/names.jsonp?callback=books&api-key="+Book_api;

	$.ajax({
		'url': url,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			resultArr = data.results;
			for(i=0;i<resultArr.length; i++){
				listName = resultArr[i].display_name;
				splitArr = listName.split("&");
				if(splitArr.length==2){
					$('#category').append("<li><a href=\"#\">"+splitArr[0]+"</br>&nbsp&nbsp&nbsp&nbsp&nbsp&amp"+splitArr[1]+"</a></li>");
				}else{
					$('#category').append("<li><a href=\"#\">"+listName+"</a></li>");
				}
			}
		}
	});
	// }, 1000);
}
