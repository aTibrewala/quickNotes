var express = require("express"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  app = express(),
  request = require("request"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/quickNotes", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //Should be written after bodyParser
app.use(methodOverride("_method"));

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
  res.render("new", { captcha: res.recaptcha });
});

// CREATE route
app.post("/blogs", function(req, res) {
  console.log("captcha" + req.body["g-recaptcha-response"]);
  if (
    req.body["g-recaptcha-response"] == undefined ||
    req.body["g-recaptcha-response"] == "" ||
    req.body["g-recaptcha-response"] == null
  ) {
    res.redirect("/error");
  }

  var secretKey = "<SECRET-KEY>";

  var verifyURL =
    "https://google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    req.body["g-recaptcha-response"] +
    "&remoteip=" +
    req.connection.remoteAddress;

  request(verifyURL, (error, response, body) => {
    body = JSON.parse(body);

    if (body.success !== undefined && !body.success) {
      res.redirect("/error");
    }

    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newBlog) {
      if (err) {
        console.log("Error creating new blog.");
        res.redirect("/error");
      } else {
        res.redirect("/blogs");
      }
    });
  });
});

// SHOW route
app.get("/blogs/:id", function(req, res) {
  blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log("Error finding blog.");
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT route
app.get("/blogs/:id/edit", function(req, res) {
  blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// UPDATE route
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE route
app.delete("/blogs/:id", function(req, res) {
  blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("quickNotes server is running!");
});
