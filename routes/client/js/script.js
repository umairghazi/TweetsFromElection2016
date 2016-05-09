console.log('start');

function sa(e){
	var searchQuery = $("#searchBox").val();
	var finalQuery = new Array();
	var searchText = searchQuery.split(" ");
	var url = "http://127.0.0.1:3000/search/search?";
	console.log(searchText.length);
	if(searchText.length === 1){
		url+="string="+searchText[0];
	}else{
	for(text in searchText){
		url+="string="+searchText[text]+"&";
	}
}
	console.log(url);
	$.ajaxSetup({'cache':true});

	$.ajax({
		type: "GET",
		//http://localhost:3000/search/search?string=trump&string=love&string=a
		url:url,
		error: function(){
			console.log("some error");
		},
		success:function(data){
			console.log(data);
		}
	});


}