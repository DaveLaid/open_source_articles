/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var http = require ('http');
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
// Requiring our Note and Article models
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

// Our scraping tools
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

// Database configuration with mongoose
// mongoose.connect("mongodb://localhost/opensource");
mongoose.connect("mongodb://heroku_zbj0pml7:qj647s6rkjth99aqi43lj1ak3b@ds133814.mlab.com:33814/heroku_zbj0pml7");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://opensource.com/tags/gaming", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.panel-display.teaser.clearfix").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Save the text of the scrapped elements in variables
      result.title = $(this).children("div.teaser__second").children().children().children("a").text();

      result.summary = $(this).children("div.teaser__second").children().children().children().children().children("div").text();

      var byline1 = $(this).children("div.teaser__second").children().children().children().children("span.byline__date").text();

      var byline2 = $(this).children("div.teaser__second").children().children().children().children("span.byline__author").children("a").text();

      result.byline = byline1 + " | " + byline2;

      result.link = "https://opensource.com" + $(this).children("div.teaser__second").children().children().children("a").attr("href");

      result.image = $(this).children("div.teaser__first").children().children().children().children().children("a").children("img.teaser-wide").attr("src");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

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
  // res.send("Scrape Complete");
  res.redirect("/");
  // Tell the browser that we finished scraping the text
    console.log("---------------");
    console.log("Scrape Complete");
    console.log("---------------");
});





// This will get the articles we scraped from mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({ "saved": false }, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      // return (doc);
      res.json(doc);
    }
  });
});




// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the comments associated with it
  .populate("comment")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});




// Create a new Comment or replace an existing Comment
app.post("/submit/:id", function(req, res) {
  // Create a new Comment and pass the req.body to the entry
  var newComment = new Comment(req.body);

  // comment.saved = true;

  // And save the new note the db
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's comment
      Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});




// Find all books marked as saved
app.get("/saved", function(req, res) {
  // Go into the mongo collection, and find all docs where "saved" is true
  Article.find({ "saved": true }, function(error, found) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the articles we found to the browser as a json
    else {
      res.json(found);
    }
  });
 
});



// Mark a book as having been read
app.get("/marksaved/:id", function(req, res) {
  // Remember: when searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // Update a doc in the articles collection with an ObjectId matching
  // the id parameter in the url
  Article.update({
    "_id": mongojs.ObjectId(req.params.id)
  }, {
    // Set "saved" to true for the book we specified
    $set: {
      "saved": true
    }
  },
  // When that's done, run this function
  function(error, edited) {
    // show any errors
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the result of our update to the browser
    else {
      console.log(edited);
      res.send(edited);
    }
  });
 
});


// Mark a book as having been not read
app.get("/markunsaved/:id", function(req, res) {
  // Remember: when searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // Update a doc in the books collection with an ObjectId matching
  // the id parameter in the url
  Article.update({
    "_id": mongojs.ObjectId(req.params.id)
  }, {
    // Set "read" to false for the book we specified
    $set: {
      "saved": false
    }
  },
  // When that's done, run this function
  function(error, edited) {
    // Show any errors
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the result of our update to the browser
    else {
      console.log(edited);
      res.send(edited);
    }
  });

});


// Handle form submission, save submission to mongo
app.post("/submit", function(req, res) {
  console.log(req.body);
  // Insert the note into the notes collection
  Comment.insert(req.body, function(error, saved) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the note back to the browser
    // This will fire off the success function of the ajax request
    else {
      res.send(saved);
    }
  });
});



// Retrieve results from mongo
app.get("/all", function(req, res) {
  // Find all notes in the notes collection
  Comment.find({}, function(error, found) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send json of the notes back to user
    // This will fire off the success function of the ajax request
    else {
      res.json(found);
    }
  });
});


// Select just one note by an id
app.get("/find/:id", function(req, res) {

  // When searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))

  // Find just one result in the notes collection
  Comment.findOne({
    // Using the id in the url
    "_id": mongojs.ObjectId(req.params.id)
  }, function(error, found) {
    // log any errors
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the note to the browser
    // This will fire off the success function of the ajax request
    else {
      // console.log(found);
      res.send(found);
    }
  });
});


// Delete One from the DB
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  Comment.remove({
    "_id": mongojs.ObjectID(req.params.id)
  }, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});





// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});
