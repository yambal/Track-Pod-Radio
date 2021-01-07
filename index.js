var express = require("express");
var app = express();
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
    res.json({url: req.query.url})
});