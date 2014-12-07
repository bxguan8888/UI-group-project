var book = {
"list_name": "Combined Print and E-Book Fiction",
"bestsellers_date": "2014-11-29",
"published_date": "2014-12-14",
"rank": 1,
"rank_last_week":0,   //if value == 0, then dont display.
“weeks_on_list”:0,   //if 0, dont display
“primary_isbn13”:null,
“publisher”:null,
"author": "James Patterson",
"contributor": "by  James Patterson",
"description": "Detective Alex Cross\u2019s family is kidnapped by a madman who wants to turn Cross into a perfect killer.",
"publisher": "Little, Brown",
"title": "HOPE TO DIE",
“book_image”: null,
“amazon_product_url”:null,   //if null, dont display
“isFavorate”: false
};

function updateMainPage(){
	$("#update").append("<div class=\"col-sm-4\">");
	$("#update").append("<div class=\"thumbnail book_pro\" style=\"float:left\">");
}