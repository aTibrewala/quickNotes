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

// DEFAULT route, redirects to INDEX route
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

// INDEX route
app.get("/blogs", function(req, res) {
  blog.find({}, function(err, blogs) {
    if (err) {
      console.log("Cannot fetch blogs");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// NEW route
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

// CREATE route
app.post("/blogs", function(req, res) {
  blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log("Error creating new blog.");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("quickNotes server is running!");
});
