// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  
  title: {
    type: String,
    required: true,
    unique: true
  },

  summary: {
    type: String
  },

  byline: {
    type: String
  },

  link: {
    type: String
  },

  image: {
    type: String
  },

  saved: {
    type: Boolean,
    default: false
  },
  // This only saves one comment's ObjectId, ref refers to the Comment model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }

});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;

