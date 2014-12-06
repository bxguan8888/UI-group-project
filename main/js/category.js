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
			console.log(data);
			resultArr = data.results;
			for(i=0;i<resultArr.length; i++){
				listName = resultArr[i].display_name;
				console.log(listName);
			}
		}
	});
	// }, 1000);
}
