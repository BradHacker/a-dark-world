const express = require("express");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const randomString = require("random-base64-string");
const passwordHash = require("password-hash");
let db, cookiesCollection, usersCollection;

MongoClient.connect(
  "mongodb://localhost:27017/",
  function(err, client) {
    if (err) throw err;

    db = client.db("db");
    cookiesCollection = db.collection("cookies");
    usersCollection = db.collection("users");

    usersCollection
      .findOne({
        isAdmin: true
      })
      .then(response => {
        if (!response) {
          password = passwordHash.generate("root");
          usersCollection
            .insertOne({
              username: "Admin",
              first_name: "Admin",
              last_name: "Admin",
              password,
              isAdmin: true
            })
            .then(response => {
              console.info("Insert One Finished");
              console.info(response);
            });
        }
      });
  }
);

const app = express();

app.use("/static", express.static("public/res"));
app.use(express.static("dist"));

app.get("/api/v1/users", (req, res) => {
  usersCollection
    .find()
    .project({ password: 0 })
    .toArray()
    .then(response => {
      res.json({ users: response });
    });
});

app.get("/api/v1/users/:id", (req, res) => {
  usersCollection
    .find({
      _id: new mongo.ObjectId(req.params.id)
    })
    .project({ _id: 0, password: 0 })
    .toArray()
    .then(user => {
      console.info("RESPONSE");
      console.info(user);
      if (user[0]) {
        console.log(user[0]);
        res.json(user[0]);
        return;
      } else {
        res.json({
          errors: {
            message: "User not found"
          }
        });
      }
    });
});

app.get("/api/v1/login", (req, res) => {
  usersCollection.findOne({ username: req.query.username }).then(user => {
    if (user && passwordHash.verify(req.query.password, user.password)) {
      cookiesCollection.findOne({ userId: user._id }).then(cookie => {
        if (!cookie) {
          let val = randomString(36);
          cookiesCollection
            .insertOne({
              userId: user._id,
              val
            })
            .then(() => {
              res.json({ cookie: val, user });
            });
        } else {
          //console.info("Cookie already found");
          res.json({ cookie: cookie.val, user });
        }
      });
    } else {
      res.status(401).json({
        status: 401,
        errors: {
          message: "Username or password incorrect"
        }
      });
    }
  });
});

app.get("/api/v1/uids/:guid", (req, res) => {
  cookiesCollection
    .findOne({
      val: req.params.guid
    })
    .then(cookie => {
      if (cookie) {
        res.json(cookie);
      } else {
        res.status(404).json({
          errors: {
            message: "GUID Not Found"
          }
        });
      }
    });
});

app.listen(8080, () => console.log("Listening on port 8080!"));
