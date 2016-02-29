var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var mongodb = require("mongodb").MongoClient;
var url =
    "mongodb://localhost:27017/stagingManager";


var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: "/Books",
    Text: 'Book'
    }, {
    Link: "/Authors",
    Text: 'Author'
    }];

var bookRouter = express.Router();
var adminRouter = express.Router();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: "library"
}));
require("./src/config/passport")(app);

app.set("views", "./src/views");
app.set("view engine", "ejs");

var bookRouter = require("./src/routes/bookRoutes")(nav);
var adminRouter = require("./src/routes/adminRoutes")(nav);
var authRouter = require("./src/routes/authRoutes")(nav);
var stagingRouter = require("./src/routes/stagingRoutes")(nav);



app.use("/Books", bookRouter);
app.use("/Admin", adminRouter);
app.use("/Auth", authRouter);
app.use("/Staging", stagingRouter);

/*/app.get("/", function (req, resp) {
    resp.render("index", {
        title: "Hello from render",
        nav: [{
            Link: "/Books",
            Text: 'Books'
                                }, {
            Link: "/Authors",
            Text: 'Authors'
        }]
    });
});/*/

app.get("/", function (req, resp) {


    mongodb.connect(url, function (err, db) {
        var collection = db.collection("builds");

        collection.find({}).toArray(
            function (err, results) {
                var deployedBuild;
                console.log("Testing");
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i]);
                    if (results[i].deployed == true) {
                        deployedBuild = results[i];
                    }
                }

                db.close();
                resp.render("index", {
                    title: "Books",
                    nav: nav,
                    builds: results,
                    deployedBuild: deployedBuild
                });
            }
        );


    });


});


app.listen(port, function (err) {
    console.log("running server on port " + port);
});