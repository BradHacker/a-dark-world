const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const randomString = require("random-base64-string");
let db, cookiesCollection, usersCollection;

MongoClient.connect(
  "mongodb://localhost:27017/",
  function(err, client) {
    if (err) throw err;

    db = client.db("db");
    cookiesCollection = db.collection("cookies");
    usersCollection = db.collection("users");

    let admins = usersCollection
      .find({
        isAdmin: true
      })
      .toArray();

    if (admins.length === 0) {
      usersCollection.insertOne({
        username: "Admin",
        isAdmin: true
      });
    }
  }
);

const app = express();

app.use(express.static("dist"));

app.post("/api/v1/login", (req, res, next) => {
  let user = usersCollection.findOne({ username: req.body.username });
  if (user) {
    let cookie = cookiesCollection.findOne({ userId: user._id });
    if (cookie) {
      document.cookie = `userCookie=${cookie.val}`;
    } else {
      let val = randomString(36);
      cookiesCollection.insertOne({
        userId: user._id,
        val
      });
      document.cookie = `userCookie=${val}`;
    }
  } else {
    let userId = usersCollection.insertOne({ username: req.body.username })
      .insertedId;
    let val = randomString(36);
    cookiesCollection.insertOne({
      userId: userId,
      val
    });
    document.cookie = `userCookie=${val}`;
  }
});

app.listen(8080, () => console.log("Listening on port 8080!"));
