console.log('start');

function sa(e){
	var searchQuery = $("#searchBox").val();
	console.log(searchQuery);
	for(str in searchQuery){
		console.log(searchQuery[str]);
	}
	$.ajax({
		type: "GET",
		url:'localhost:3000/search/search/string='+searchQuery,
		data:{format:'json'},
		error: function(){
			console.log("some error");
		},
		success:function(data){
			console.log(data);
		}
	});


}