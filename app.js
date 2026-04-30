
var express=require('express');
var app=express();
var path=require('path');
var bodyparser=require('body-parser');
const { compile } = require('ejs');
require('dotenv').config();

// Add cache control middleware for static assets
app.use((req, res, next) => {
    // Cache images for 1 week (604800 seconds)
    if (req.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        res.set('Cache-Control', 'public, max-age=604800, immutable');
        // Enable GZIP compression for images via headers
        res.set('Vary', 'Accept-Encoding');
    }
    // Cache CSS and JS for 1 week
    else if (req.url.match(/\.(css|js)$/i)) {
        res.set('Cache-Control', 'public, max-age=604800');
        res.set('Vary', 'Accept-Encoding');
    }
    // Don't cache HTML (revalidate always)
    else if (req.url.match(/\.html$/i) || req.url === '/') {
        res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    next();
});

app.use(express.static(path.join(__dirname, '/public')));

app.use(require("express-session")({
	secret:"divesh abhishek",
	resave:false,
	saveUninitialized: false
}));

app.use(express.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({extended:true,limit: '50mb'}));
var port=process.env.PORT || 3000;
app.listen(port,process.env.IP,function(){
	console.log("server started.");
});

app.get('/search',function(req,res){
        res.render("search.ejs",{key:process.env.APIKEY,q:undefined,p:1,str:req.query.str});
});

app.get('/trending',function(req,res){
    res.render("trending.ejs",{key:process.env.APIKEY});
});
app.get('/',function(req,res){
    res.render("home.ejs",{key:process.env.APIKEY});
});


app.post('/',function(req,res){
    var query = req.body.query;
    console.log(query);
    res.render("search.ejs",{key:process.env.APIKEY,q:query,p:2,str:undefined});
});


app.get('/genre',function(req,res){
    res.render("genre.ejs",{key:process.env.APIKEY,id:req.query.id});
});

app.get('*', function(req, res){
    console.log('page not found');
    res.render("404.ejs");
  });