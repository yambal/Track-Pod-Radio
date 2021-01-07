var express = require("express")
var app = express()

var FeedParser = require('feedparser')
var fetch = require('node-fetch')
var request = require('request');

const PORT = process.env.PORT || 5000


var server = app.listen(PORT, function(){
    console.log("Node.js is listening to PORT:" + server.address().port)
});


app.get("/api", function(req, res, next){
    // res.json({url: req.query.url})
    const feed = req.query.url || 'https://www.nhk.or.jp/r-news/podcast/nhkradionews.xml'

    return parseFeed(feed)
        .then((feeds) => {
            const enc = feeds[0]["rss:enclosure"] || feeds[0].enclosure
            const encUrl = enc["@"].url

            return getBin(encUrl)
                .then((bin) => {
                    res.writeHead(200, {'Content-Type': 'audio/mpeg'});
                    res.write(bin.toString('binary'), 'binary');
                    res.end()
                })
                .catch(()=>{
                    res.json({encUrl: 'cant bin'})
                })
        })
        .catch(() => {
            res.json({encUrl: 'reject'})
        })
});

const getBin = (url) => {
    console.log('---------- getBin ----------');
    console.log(url);
    return new Promise((resolve, reject) => {
        console.log(41)
        request({
            url: url, 
            encoding: null
        }, (err, res, data) => {
            console.log(45)
            if (err) {
                console.error(29, err);
                reject(err)
            } else {
                console.error(33, res.statusCode);
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject('can\'t process.')
                }
            }
        });
    })
}

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
