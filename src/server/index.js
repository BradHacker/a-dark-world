/* eslint-disable no-param-reassign */
const express = require('express');
const mongo = require('mongodb');

const { MongoClient } = mongo;
const bcrypt = require('bcrypt');
const { findOrCreateSession } = require('./sessions');

let db;
let sessionsCollection;
let usersCollection;
const globalSaltRounds = 10;

MongoClient.connect(
  'mongodb://localhost:27017/',
  (err, client) => {
    if (err) throw err;

    db = client.db('db');
    sessionsCollection = db.collection('sessions');
    usersCollection = db.collection('users');

    usersCollection
      .findOne({
        isAdmin: true
      })
      .then((response) => {
        if (!response) {
          const password = bcrypt.hashSync('root', globalSaltRounds);
          usersCollection
            .insertOne({
              username: 'Admin',
              first_name: 'Admin',
              last_name: 'Admin',
              password,
              isAdmin: true
            })
            .then(() => {
              console.info('Added default Admin');
            });
        }
      });
  }
);

const app = express();

app.use('/static', express.static('public/res'));
app.use(express.static('dist'));
app.use(express.json());

app.get('/api/v1/users', (req, res) => {
  usersCollection
    .find()
    .project({ password: 0 })
    .toArray()
    .then((response) => {
      res.json({ users: response });
    });
});

app.get('/api/v1/users/:id', (req, res) => {
  usersCollection
    .find({
      _id: new mongo.ObjectId(req.params.id)
    })
    .project({ _id: 0, password: 0 })
    .toArray()
    .then((user) => {
      console.info('RESPONSE');
      console.info(user);
      if (user[0]) {
        console.log(user[0]);
        res.json(user[0]);
      } else {
        res.json({
          errors: {
            message: 'User not found'
          }
        });
      }
    });
});

app.get('/api/v1/sessions/:sessionId', (req, res) => {
  sessionsCollection
    .findOne({
      sessionId: req.params.sessionId
    })
    .then((session) => {
      if (session) {
        res.json(session);
      } else {
        res.status(404).json({
          errors: {
            message: 'Session ID Not Found'
          }
        });
      }
    });
});

app.post('/api/v1/login', (req, res) => {
  usersCollection.findOne({ username: req.body.username }).then((user) => {
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      if (typeof user._id !== typeof mongo.ObjectId) {
        user._id = new mongo.ObjectId(user._id);
      }
      findOrCreateSession(sessionsCollection, user._id).then((sessionId) => {
        delete user.password;
        res.json({ sessionId, user });
        usersCollection.findOneAndUpdate({ _id: user._id }, { $set: { lastLogin: new Date() } });
      });
    } else {
      res.status(401).json({
        status: 401,
        errors: {
          message: 'Username or password incorrect'
        }
      });
    }
  });
});

app.post('/api/v1/signup', (req, res) => {
  const {
    username, password, firstName, lastName
  } = req.body;
  if (!password || !username) {
    res.status(422).json({
      errors: {
        username: username ? undefined : 'username blank',
        password: password ? undefined : 'password blank'
      }
    });
  } else {
    usersCollection.findOne({ username }).then((user) => {
      if (user || password.length < 8) {
        res.status(422).json({
          errors: {
            username: !user ? undefined : 'username duplicated',
            password: password.length >= 8 ? undefined : 'password must be 8 characters'
          }
        });
      } else {
        usersCollection
          .insertOne({
            username,
            password: bcrypt.hashSync(password, globalSaltRounds),
            firstName,
            lastName
          })
          .then(({ insertedId }) => {
            if (typeof insertedId !== typeof mongo.ObjectId) {
              insertedId = new mongo.ObjectId(insertedId);
            }
            findOrCreateSession(sessionsCollection, insertedId).then((sessionId) => {
              res.status(201).send({ insertedId, sessionId });
            });
          });
      }
    });
  }
});

app.listen(8080, () => console.log('Listening on port 8080!'));
