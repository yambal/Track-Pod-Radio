var express = require("express");
var app = express();

var FeedParser = require('feedparser');

const PORT = process.env.PORT || 5000


var server = app.listen(PORT, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var photoList = [
    {
        id: "001",
        name: "photo001.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo001.jpg"
    },{
        id: "002",
        name: "photo002.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo002.jpg"
    }
]

app.get("/api", function(req, res, next){
    // res.json({url: req.query.url})
    return parseFeed('https://www.nhk.or.jp/r-news/podcast/nhkradionews.xml')
        .then((feeds) => {
            const enc = feeds[0]["rss:enclosure"] || feeds[0].enclosure
            const encUrl = enc["@"].url
            res.json({encUrl: encUrl})
        })
});

//
const parseFeed = (url) => {
    console.error(url);
   return new Promise((resolve, reject) => {
    var req = fetch(url)
    var feedparser = new FeedParser();
  
    let feeds = []
    req.then(function (res) {
      if (res.status !== 200) {
        throw new Error('Bad status code');
      }
      else {
        res.body.pipe(feedparser);
      }
    }, function (err) {
  
    });
  
    feedparser.on('error', function (error) {
  
    });
  
    feedparser.on('readable', function () {
      var stream = feedparser;
      var item;
     
      while (item = stream.read()) {
        feeds.push(item)
      }
    });
  
    feedparser.on('end', function() {
      console.log('---------- parser end ----------');
      resolve(feeds)
    });
   })
}
