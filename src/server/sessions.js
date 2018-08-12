const randomString = require('random-base64-string');

module.exports.findOrCreateSession = async (sessionsCollection, userId) => {
  const session = await sessionsCollection.findOne({ userId });
  console.log(session);
  const sessionId = randomString(36);
  if (!session) {
    console.log('creating session');
    sessionsCollection
      .insertOne({
        userId,
        sessionId
      })
      .then(() => console.log('session created!'));
  } else {
    console.log('updating session');
    sessionsCollection
      .findOneAndUpdate(
        {
          userId
        },
        {
          $set: { sessionId }
        }
      )
      .then(() => console.log('session updated!'));
  }
  return sessionId;
};
