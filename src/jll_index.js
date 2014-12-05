var Book_api = "22167e35f2cd71ee36835bba032fee38:1:70162819";

function getBestList(){

	var url = "http://api.nytimes.com/svc/books/v3/lists/names.jsonp?callback=books&api-key="+Book_api;

	$.ajax({
		'url': url,
		'method': 'GET',
		'jsonpCallback' : 'books',
		'cache': true,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest){
			console.log(data);
			// console.log(data['results'][0]['list_name_encoded']);

			BestSeller(data);

			
		}
	});

	// var url = "http://api.nytimes.com/svc/books/v3/reviews.jsonp?callback=books&title=REVIVAL&api-key="+Book_api;

	// $.ajax({
	// 	'url': url,
	// 	'method': 'GET',
	// 	'jsonpCallback' : 'books',
	// 	'cache': true,
	// 	'dataType': 'jsonp',
	// 	'success': function(data, textStats, XMLHttpRequest){
	// 		console.log(data);
	// 	}
	// });

}

function BestSeller(data){
	var len = data['num_results'];

	for(var i=0; i<len; i++){
		var list_name = data['results'][i]['list_name_encoded'];

		var bestSeller_List = "http://api.nytimes.com/svc/books/v3/lists/"+list_name+".json?api-key="+Book_api;

		$.ajax({
			'url': bestSeller_List,
			'method': 'GET',
			// 'jsonpCallback' : 'books',
			'cache': true,
			'async': false,
			'dataType': 'json',
			'success': function(data2, textStats2, XMLHttpRequest2){
				console.log(data2);
			}
		}); 
	}
}