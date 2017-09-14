// Click Events

// Whenever someone clicks the "Scrape New Articles! button"
$("#scrapeBtn").on("click", function() {
  runScrape();

});



// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the pulled information on the page
    $("#articleRow").append(

      '<div class="card-panel teal col s12 m12"><div class="col s12 m4"><a class="link" href="' + data[i].link +
      '"><img src="' + data[i].image + 
      '" align="left" width="100%" margin="auto 0"></a></div><div class="col s12 m8"><span class="white-text" text-align="left"><a class="link" href="' + data[i].link +
      '"><h5 color="white">' + data[i].title +
      '</h5></a><p>' + data[i].summary +
      '</p></span></div><div class="col s12 m12"><div class="col s12 m4 left"><a class="waves-effect waves-light btn-large" width="100%"><i class="material-icons right">cloud</i>Save Article</a></div>' +
      '<div class="col s12 m8"><span class="white-text" text-align="left"><p>' + data[i].byline +
      '</p></span></div></div></div>'




    );
  }
});




// // Click Events


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .done(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });





// // Click event to add an article to the db
// $("#addArticle").on("click", function() {
//   $.ajax({
//     type: "POST",
//     url: "/submit",
//     dataType: "json",
//     data: {
//       title: $("#title").val(),
//       summary: $("#summary").val(),
//       byline: $("#byline").val(),
//       link: $(".link").val(),
//       image: $("#image").val()
//     }
//   })
//   .done(function(data) {
//     console.log(data);
//     getUnsaved();
//     $("#title").val("");
//     $("#summary").val("");
//     $("#byline").val("");
//     $(".link").val("");
//     $("#image").val("");
//   }
//   );
//   return false;
// });

// // Click event to mark an article as "saved"
// $(document).on("click", ".marksaved", function() {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     type: "GET",
//     url: "/marksave/" + thisId
//   });
//   $(this).parents("tr").remove();
//   getRead();
// });

// // Click event to mark an article as "unsaved"
// $(document).on("click", ".markunsaved", function() {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     type: "GET",
//     url: "/markunsaved/" + thisId
//   });
//   $(this).parents("tr").remove();
//   getUnsaved();
// });




// // Functions

// // Load unsaved articles and render them to the screen
// function getUnsaved() {
//   $("#unsaved").empty();
//   $.getJSON("/unsaved", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#unsaved").prepend("<tr><td>" + data[i].title + "</td><td>" + data[i].author +
//         "</td><td><button class='marksaved' data-id='" + data[i]._id + "'>Mark Saved</button></td></tr>");
//     }
//     $("#unsaved").prepend("<tr><th>Title</th><th>Author</th><th>Saved/Unsaved</th></tr>");
//   });
// }

// // Load saved articles and render them to the screen
// function getSaved() {
//   $("#saved").empty();
//   $.getJSON("/saved", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#saved").prepend("<tr><td>" + data[i].title + "</td><td>" + data[i].author +
//         "</td><td><button class='markunsaved' data-id='" + data[i]._id + "'>Mark Unsaved</button></td></tr>");
//     }
//     $("#saved").prepend("<tr><th>Title</th><th>Author</th><th>Saved/Unsaved</th></tr>");
//   });
// }

// // Calling our functions
// getUnsaved();
// getRead();
