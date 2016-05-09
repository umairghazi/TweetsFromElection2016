# TweetsFromElection2016

This project focuses on builiding a web application which fetches tweet from Twitter's Live Streaming API, stores it in a mongo database and using queries can find the data within the database. 

We decided to fetch the tweets about the US Presidential Elections 2016 as the topic is always trending on twitter these days with almost 20-25 tweets being posted about it every second. The tweets are fetched with keywords - "Donald Trump","Hillary Clinton","Bernie Sanders","Elections 2016","US Presidential Elections", "Democrats", "Republicans" for now. 

### How to run this application?

1. Unzip the entire directory. The directory contains all the script as well as the database. 
2. Make sure you have node.js, npm (node package manager) and mongoDb installed in your machine.
3. Start up the mongod daemon process `>mongod` in terminal with `dbpath` of `data` directory provided in the application. Example: `mongod --dbpath *pathToWhereEverYouHaveDownloadedThisApplication*/twitterlivestream/data/`
3. Start another terminal window in the `twitterlivestream` directory and type `npm start`
4. The terminal will show the application connecting to local mongodb instance running on the machine and outputting the data from some sample queries such as `collection.find({})` which will return all the documents from the database and `collection.find({"tweet.text":{$all:[/.*trump.*/ , /.*hillary.*/]}})` which will return the documents having tweets containing words trump and hillary. 
5. If you want to download more data to the database with the live streaming API, then you need to un-comment lines 75-108 in app.js and run the application again using `npm start` command in terminal. 


### How to run the client?

1. Unzip the entire directory. The directory contains all the script as well as the database. 
2. Make sure you have node.js, npm (node package manager) and mongoDb installed in your machine.
3. Start up the mongod daemon process `>mongod` in terminal with `dbpath` of `data` directory provided in the application. Example: `mongod --dbpath *pathToWhereEverYouHaveDownloadedThisApplication*/twitterlivestream/data/`
3. Start another terminal window in the `twitterlivestream` directory and type `npm start`.
4. While both node server and mongod instance are running, head over to `http://localhost:3000/search/home`. The web page with search box will appear. 
5. Enter any string separated by spaces related to the topic of Elections 2016. The client will make an AJAX call to the backend API at  `http://localhost:3000/search/search?string=` and will add the search words to the URL. 
6. The backend returns the list of documents from MongoDB in the JSON format which the frontend script placed at public/js/script.js folder gets and iterates over and appends to the DOM. 
7. On clicking each of the tweet in the list, you get the detailed card showing more details about the tweet on the right. 

### Challenges we ran into 

1. Finding an alternative dataset - Getting list of recent tweets for the topic of Election 2016. We had to research Twitter's live streaming API and there was a lot of going back and forth between API and MongoDB. 

2. CORS issue - Once we started building client and started making AJAX calls to the backend, the browser refused to use the resource due to Cross-origin resource sharing issue. This happened even after serving the client on the same domain. Finally, we had to set header at server level to allow Cross-origin resource sharing. 

3. Node's MongoDb driver not finding documents with numbers - We couldn't make queries to MongoDb with numbers such as collection.find({"tweet.id":70665841}) or collection.find( "_id" : ObjectId("5722c2ab19f8390004d6ea96"), even though the same queries worked when using mongo client from terminal. This needs to be investigated. 
