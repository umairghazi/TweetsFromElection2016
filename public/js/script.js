/*
had to setup a global array as a workaround as mongo didn't
search using ids and numbers.
*/
var globalArray = new Array(); 
var globalDetailedCard = "";

/*
The magic happens here. 
The search string is split into an array with all the strings 
entered by the user and sent to the backend.
*/

function sa(e){
	var searchQuery = $("#searchBox").val();
	var searchText = searchQuery.split(" ");
	var url = "http://127.0.0.1:3000/search/search?"; //the backend API
	if(searchText.length === 1){ //the search string is just one word
		url+="string="+searchText[0];
	}else{
	for(text in searchText){ //if there are multiple words in the query
		url+="string="+searchText[text]+"&";
	}
}
	$.ajaxSetup({'cache':true});

	$.ajax({
		type: "GET",
		url:url,
		error: function(){
			console.log("some error"); //backend didn't respond
		},
		success:function(data){
			$("#tweetList").empty(); //clear the div if it contains anything
			var tweetCardList = new Array();
			$(data).each(function(index){
				globalArray.push(data[index]); //send everything to globalarray 
				var objectId = data[index]._id;
				var profilePicture = data[index].tweet.profileImage;
				var userName = data[index].tweet.userName;
				var tweetTextShort = data[index].tweet.text.substring(0,60)+".......";
				tweetCardList.push(createTweetList(objectId,profilePicture,userName,tweetTextShort)); // createTweetList will create html template with the different tweet variables
			});
			$("#tweetList").append(tweetCardList); // push the whole list into DOM
		}
	});
}


function createTweetList(objectId,profilePicture,userName,tweetTextShort){
	//the html for tweet list
	var tweetList = '<a class="list-group-item pjax" data-tweetId="'+objectId+'" onclick="createDetailedCard(this);">'+
						'<img src="'+profilePicture+'" class="img-rounded pull-left" onerror="imgError(this);"/>'+
							'<h4 class="list-group-item-heading">'+userName+'</h4>'+
								'<p class="list-group-item-text">'+tweetTextShort+'</p>'+
					'</a>';
	return tweetList;

}

//on click of each item in tweet list, below method is called to 
//show more details of a tweet.
function createDetailedCard(data){
console.log(data);
var id = $(data).attr('data-tweetId');
for(obj in globalArray){
	if(globalArray[obj]._id == id){
		console.log(globalArray[obj]);
		var objectId 		= globalArray[obj]._id;
		var profilePicture  = globalArray[obj].tweet.profileImage;
		var userName 		= globalArray[obj].tweet.userName;
		var tweetText    	= globalArray[obj].tweet.text;
		//below line finds any text with http and converts it into a link
		var link  			= tweetText.replace(/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig, '<a href=$1>$1</a>');
		//below link finds any text starting with # and converts it into a twitter hashtag
		var hashtagAndLink  = link.replace(/#(\S*)/g, '<a href="http://twitter.com/#!/search/$1">#$1</a>');
		var tweetTime 	    = globalArray[obj].tweet.createdAt;
		var source	 	    = globalArray[obj].tweet.source;
		var location		= globalArray[obj].tweet.location;
		var comments 		= globalArray[obj].tweet.comment;
		console.log(comments);
		var displayComment 	= "<ul>";
		
		
		if(comments){
			for(comment in comments){
			displayComment += "<li>"+comments[comment].comment + "&nbsp&nbsp&nbsp" + comments[comment].time.substr(0,25)+"</li>";
		}
		}else{
			displayComment += "0 commments. Start the conversation...";
		}
		displayComment+= "</ul>";
		//html template for detailed tweet card
		globalDetailedCard = '<div class="col-sm-7 bootcards-cards hidden-xs" id="listDetails">'+
				
				'<div id="contactCard">'+
					'<div class="panel panel-default">'+
						'<div class="panel-heading clearfix">'+
							'<h3 class="panel-title pull-left">Tweet Details</h3>'+
							'<div class="btn-group pull-right visible-xs">'+
							'</div>	'+
						'</div>'+

						'<div class="list-group">'+
							'<div class="list-group-item">'+
								'<img src="'+profilePicture+'" onerror="imgError(this);" class="img-rounded pull-left">'+
								'<label>Name</label>'+
								'<h4 class="list-group-item-heading">'+userName+'</h4>'+
							'</div>'+
							'<div class="list-group-item">'+
								'<label>Tweeted At</label>'+
								'<h4 class="list-group-item-heading">'+ tweetTime +'</h4>'+
							'</div>'+
							'<div class="list-group-item">'+
								'<label>Tweet Text</label>'+
								'<h4 class="list-group-item-heading">'+ hashtagAndLink +'</h4>'+
							'</div>'+
							'<div class="list-group-item">'+
								'<label>Source</label>'+
								'<h4 class="list-group-item-heading">'+ source +'</h4>'+
							'</div>'+
							'<div class="list-group-item">'+
								'<label>Location</label>'+
								'<h4 class="list-group-item-heading">'+ location +'</h4>'+
							'</div>'+
							'<div class="list-group-item">'+
								'<label>Comments</label>'+
								'<p class="list-group-item-heading">'+ displayComment +'</p>'+
							'<div class="panel-body">'+
								'<div class="search-form">'+
									'<div class="row">'+
							    		'<div class="col-xs-9">'+
									      '<div class="form-group">'+
										      '<input type="text" class="form-control" id="comment" placeholder="Add comments...">'+
									      '</div>'+
							    		'</div>'+
									    '<div class="col-xs-3">'+
											'<a class="btn btn-primary btn-block" data-objid= '+ objectId +' onclick="submitComment(this);">'+
												'<i class="fa fa-plus"></i> '+
												'<span>Add</span>'+
											'</a>'+
									    '</div>'+
									'</div>	'+					    
								'</div>	'+
								'</div>'+				
							'</div>'+
						'</div>	'+	
					'</div>'+
				'</div>'+
			'</div>';

			$("#listDetails").remove();
			$("#cardsGoHere").append(globalDetailedCard);
			}
		}
	}


//if an image doesn't exist, below methods replaces the image with 
//a placeholder image
function imgError(image) {
    image.onerror = "";
    image.src = "/images/placeholder.jpg";
    return true;
}


function submitComment(e){
	var tweetId = $(e).attr('data-objid');
	var comment = $("#comment").val();
	var data = {id:tweetId,comment:comment,time: new Date()};
	
	$.ajax({
      type: 'POST',
      url: "http://127.0.0.1:3000/search/postComment",
      data: data,   
      success: function(resultData) { 
      	console.log(resultData);
      },
      error: function(data){
      	console.log("error");
      }
  });
}