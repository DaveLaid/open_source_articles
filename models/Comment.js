// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Comment schema
var CommentSchema = new Schema({
  // Just a string
  comment: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  }
});

// Mongoose will automatically save the ObjectIds of the notes
// These ids will be referred to in the Article model

// Create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
