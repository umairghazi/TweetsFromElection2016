# TweetsFromElection2016

This project focuses on builiding a web application which fetches tweet from Twitter's Live Streaming API, stores it in a mongo database and using queries can find the data within the database. 

We decided to fetch the tweets about the US Presidential Elections 2016 as the topic is always trending on twitter these days with almost 20-25 tweets being posted about it every second. The tweets are fetched with keywords - "Donald Trump","Hillary Clinton","Bernie Sanders","Elections 2016","US Presidential Elections" for now. 

### How to run this application?

1. Unzip the entire directory. The directory contains all the script as well as the database. 
2. Make sure you have node.js, npm (node package manager) and mongoDb installed in your machine.
3. Start up the mongod daemon process `>mongod` in terminal with `dbpath` of `data` directory provided in the application. Example: `mongod --dbpath *pathToWhereEverYouHaveDownloadedThisApplication*/twitterlivestream/data/`
3. Start another terminal window in the `twitterlivestream` directory and type `npm start`
4. The terminal will show the application connecting to local mongodb instance running on the machine and outputting the data from some sample queries such as `collection.find({})` which will return all the documents from the database and `collection.find({"tweet.text":{$all:[/.*trump.*/ , /.*hillary.*/]}})` which will return the documents having tweets containing words trump and hillary. 
5. If you want to download more data to the database with the live streaming API, then you need to un-comment lines 75-108 and run the application again using `npm start` command in terminal. 


