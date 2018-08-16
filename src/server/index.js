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
  { useNewUrlParser: true },
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
              firstName: 'Admin',
              lastName: 'Admin',
              password,
              isAdmin: true,
              createdAt: new Date()
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
      res.json(response);
    });
});

app.get('/api/v1/users/:id', (req, res) => {
  usersCollection
    .find({
      _id: new mongo.ObjectId(req.params.id)
    })
    .project({ password: 0 })
    .toArray()
    .then((user) => {
      if (user[0]) {
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

app.put('/api/v1/users/:id', (req, res) => {
  const {
    username, firstName, lastName, lastModified, modifiedBy
  } = req.body;
  const { id } = req.params;
  if (!username || !firstName || !lastName) {
    res.status(422).json({
      errors: {
        username: username ? undefined : 'no username provided',
        firstName: firstName ? undefined : 'no first name provided',
        lastName: lastName ? undefined : 'no last name provided',
        message: 'Some fields were left blank'
      }
    });
  } else {
    usersCollection
      .findOne({
        $and: [{ username }, { _id: { $ne: new mongo.ObjectId(id) } }]
      })
      .then((user) => {
        console.log(user);
        if (user) {
          res.status(422).json({
            errors: {
              username: 'Username already in use',
              message: 'Username already in use'
            }
          });
        } else {
          usersCollection
            .findOneAndUpdate(
              { _id: new mongo.ObjectId(id) },
              {
                $set: {
                  username,
                  firstName,
                  lastName,
                  lastModified,
                  modifiedBy
                }
              },
              {
                projection: { password: 0 }
              }
            )
            .then((newUser) => {
              res.json({ ...newUser.value });
            });
        }
      });
  }
});

app.delete('/api/v1/users/:id', (req, res) => {
  const { id } = req.params;
  usersCollection.findOneAndDelete({ _id: new mongo.ObjectId(id) }).then(
    (user) => {
      res.json(user);
    },
    (err) => {
      res.status(500).json({
        errors: {
          ...err,
          message: 'An Unkown Error Has Occurred'
        }
      });
    }
  );
});

app.put('/api/v1/checkUsername', (req, res) => {
  const { username, id } = req.body;
  if (username) {
    usersCollection
      .findOne({
        $and: [{ username }, { _id: { $ne: new mongo.ObjectId(id) } }]
      })
      .then((user) => {
        if (user) {
          res.status(422).json({
            errors: {
              username: 'Username already in use'
            }
          });
        } else {
          res.status(200).send();
        }
      });
  } else {
    res.status(422).json({
      errors: {
        username: 'Username is blank'
      }
    });
  }
});

app.get('/api/v1/sessions/:sessionId', (req, res) => {
  sessionsCollection
    .findOne(
      {
        sessionId: req.params.sessionId
      },
      { fields: { _id: 0 } }
    )
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
        res.json({ sessionId, userId: user._id });
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
