var express = require("express");
var mongodb = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
var stagingRouter = express.Router();
var router = function (nav) {
    var url =
        "mongodb://localhost:27017/stagingManager";


    stagingRouter.route("/")
        .get(function (req, resp) {


            mongodb.connect(url, function (err, db) {
                var collection = db.collection("builds");

                collection.find({}).toArray(
                    function (err, results) {
                        resp.render("index", {
                            title: "Books",
                            nav: nav,
                            books: results
                        });
                    }
                );


            });


        });

    stagingRouter.route("/build/:id")
        .get(function (req, resp) {

            var id = new objectId(req.params.id);
            mongodb.connect(url, function (err, db) {
                var collection = db.collection("builds");

                collection.findOne({
                        _id: id
                    },
                    function (err, results) {
                        resp.render("bookView", {
                            title: "Books",
                            nav: nav,
                            book: results
                        });
                    }
                );


            });



        });

    stagingRouter.route("/build")
        .post(function (req, res) {
            console.log(req.body);
            mongodb.connect(url, function (err, db) {
                var now = new Date();
                var build = {
                    number: req.body.number,
                    artifactId: req.body.artifactId,
                    deployed: req.body.deployed,
                    createdDate: now
                };
                if (build.deployed == null)
                    build.deployed = false;
                var collection = db.collection("builds");
                if (build.number != null && build.artifactId != null) {
                    collection.insert(build,
                        function (err, results) {

                        });
                }
                else{
                    console.log("Something was null");
                }
                db.close();
                res.sendStatus(200);



            });
        });


    return stagingRouter;

}
module.exports = router;