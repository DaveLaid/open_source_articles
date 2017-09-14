// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Requiring our Article and Comment models
var Article = require("./models/article.js");
var Comment = require("./models/comment.js");

// Database configuration
var databaseUrl = "opensource";
var collections = ["articles"];


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/opensource");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("openUri", function() {
  console.log("Mongoose connection successful.");
});



// // Main route (simple Hello World Message)
// app.get("/", function(req, res) {
//   res.send("all");
// });



// function runScrape() {

    // A GET request to scrape the OpenSource website
  app.get("/", function(req, res) {
    // First, we grab the body of the html with request
    request("https://opensource.com/tags/gaming", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.panel-display.teaser.clearfix").each(function(i, element) {


      // Save an empty result object
      var results = {};


      // Save the text of the scrapped elements in variables
      results.title = $(this).children("div.teaser__second").children().children().children("a").text();

      results.summary = $(this).children("div.teaser__second").children().children().children().children().children("div").text();

      results.byline1 = $(this).children("div.teaser__second").children().children().children().children("span.byline__date").text();

      results.byline2 = $(this).children("div.teaser__second").children().children().children().children("span.byline__author").children("a").text();

      results.link = "https://opensource.com" + $(this).children("div.teaser__second").children().children().children("a").attr("href");

      results.image = $(this).children("div.teaser__first").children().children().children().children().children("a").children("img.teaser-wide").attr("src");


        // Using Article model, create a new entry
        // This effectively passes the result object to the entry (and the captured data)
        var entry = new Article(results);

        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });

      });
    });
    // Tell the browser that we finished scraping the text
    console.log("---------------");
    console.log("Scrape Complete");
    console.log("---------------");
  });

// };



// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {

  Article.find({}, function(error, doc){
    res.send(doc);
  });

});




// // This will grab an article by it's ObjectId
// app.get("/articles/:id", function(req, res) {

//   // Finish the route so it finds one article using the req.params.id,
//   Article.findById(req.params.id)
//   .populate("comment")
//   .exec(function(error, doc){
//     res.json(doc);
//   });

//   // and run the populate method with "comment",

//   // then responds with the article with the note included

// });


// // Create a new note or replace an existing note
// app.post("/articles/:id", function(req, res) {

// var newNote = new Note(req.body);
//   // save the new note that gets posted to the Notes collection
//   newNote.save(function(error, doc){
//     Article.findOneAndUpdate({_id: req.params.id}, {$set: {"notes": doc._id}}, {new: true}, function(err, newdoc){
//       res.json(newdoc);
//     });
//   });

//   // then find an article from the req.params.id

//   // and update it's "note" property with the _id of the new note

// });





// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
