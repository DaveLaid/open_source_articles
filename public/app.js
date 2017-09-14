// When you click the savenote button

// $(document).on("click", "#scrapeBtn", function() {
// 		window.setTimeout(function(){ window.location = "/index.html"; },3000);
// });


$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articleRow").append(
		'<div class="card-panel teal col s12 m12"><div class="col s12 m4"><a class="link" target="_blank" href="' + data[i].link + '"><img src="' + data[i].image + '" align="left" width="100%" margin="auto 0"></a></div>' +
		'<div class="col s12 m8"><span class="white-text" text-align="left"><a class="link" target="_blank" href="' + data[i].link + '"><h5 color="white">' + data[i].title + '</h5></a>' +
		'<p>' + data[i].summary + '</p></span></div>' +
		'<div class="col s12 m12"><div class="col s12 m4"><span class="white-text" text-align="left"><p>' + data[i].byline + '</p></span></div>' +
		'<div class="col s12 m8 left"><a class="waves-effect waves-light btn-large save" data-id="' + data[i]._id + '" width="100%"><i class="material-icons right">cloud</i>Save Article</a></div>' + 
		'</div></div>'


    );
  }

  console.log("--------------------------------");
  console.log("I GOT MY ARTICLES FROM MONGO DB!");
  console.log("--------------------------------");
});



$.getJSON("/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

  	var comment_id = data[i]._id;
    // Display the apropos information on the page
    $("#savedArticles").append(
		'<div class="card-panel teal col s12 m12"><div class="col s12 m4"><a class="link" target="_blank" href="' + data[i].link + '"><img src="' + data[i].image + '" align="left" width="100%" margin="auto 0"></a></div>' +
		'<div class="col s12 m8"><span class="white-text" text-align="left"><a class="link" target="_blank" href="' + data[i].link + '"><h5 color="white">' + data[i].title + '</h5></a>' +
		'<p>' + data[i].summary + '</p></span></div>' +
		'<div class="col s12 m12"><div class="col s12 m4"><span class="white-text" text-align="left"><p>' + data[i].byline + '</p></span></div>' +
		'<div class="col s12 m4 left"><a class="waves-effect waves-light btn-large delete" data-id="' + comment_id + '" width="100%">Remove from Saved</a></div>' + 
		'<div class="col s12 m4 left"><a class="waves-effect waves-light btn-large modal-trigger" data-target="' + comment_id + '" width="100%">Comments</a></div>' +
		'</div></div>'


    );
  }

  console.log("--------------------------------");
  console.log("I GOT MY 'SAVED' STUFF FROM MONGO DB!");
  console.log("--------------------------------");
});



// Click event to mark an article as saved
$(document).on("click", ".waves-effect.waves-light.btn-large.save", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/marksaved/" + thisId
  });
  $(this).parents("tr").remove();
  getSaved();
});

// Click event to mark an article as "unsaved"
$(document).on("click", ".waves-effect.waves-light.btn-large.delete", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "GET",
    url: "/markunsaved/" + thisId
  });
  $(this).parents("tr").remove();
  getUnsaved();
});


// Functions



// Loads comments onto the page
function getResults() {
  // Empty any text in the "modal-textbox" currently on the page
  $("#modal-textbox").empty();
  // Grab all of the current notes
  $.getJSON("/saved", function(data) {
    // For each note...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
      $("#modal-comments").prepend("<p class='dataentry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
        data[i]._id + "></span><span class=deleter>X</span></p>");
    }
  });
}

// Runs the getResults function as soon as the script is executed
getResults();



// When the #submitComment button is clicked
$(document).on("click", "#submitComment", function() {
	var thisId = $(this).attr("data-id");
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit/" + thisId,
    data: {
      comment: $("#modal-textbox").val()
    }
  })
  // If that API call succeeds, add the title and a delete button for the note to the page
  .done(function(data) {
    // Add the title and delete button to the #results section
    $("#modal-comments").prepend("<p class='dataentry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
        data[i]._id + "></span><span class=deleter>X</span></p>");
    // Clear the note and title inputs on the page
    $("#modal-textbox").empty();
  }
  );
});



// When user clicks the deleter button for a note
$(document).on("click", ".deleter", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#modal-comments").val("");
      // Make sure the #actionbutton is submit (in case it's update)
      // $("#actionbutton").html("<button id='makenew'>Submit</button>");
    }
  });
});









// // Load unsaved articles and render them to the screen
// function getUnsaved() {
//   $("#savedArticles").empty();
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
//   $("#articleRow").empty();
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
// getSaved();





$(document).on("click", "#scrapeBtn", function() {
		window.setTimeout(function(){ window.location = "/"; },3000);
});


