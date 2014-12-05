//22167e35f2cd71ee36835bba032fee38:1:70162819
function getBestList(){
	var Book_api = "22167e35f2cd71ee36835bba032fee38:1:70162819";

	// var url = "http://api.nytimes.com/svc/books/v3/lists/names.jsonp?api-key="+Book_api;

	var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&title=REVIVAL&api-key="+Book_api;

	// $.ajax({
	// 	'url': url,
	// 	'method': 'GET',
	// 	'cache': true,
	// 	'dataType': 'jsonp',
	// 	'success': function(data, textStats, XMLHttpRequest){
	// 		console.log(data);
	// 	}
	// });

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