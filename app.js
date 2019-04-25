var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/quickNotes");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// MONGOOSE/ MODEL CONFIG
var quickNotesSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var blog = mongoose.model("Blog", quickNotesSchema);

//RESTFUL ROUTES

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  blog.find({}, function(err, blogs) {
    if (err) {
      console.log("Cannot fetch blogs");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("quickNotes server is running!");
});
