const randomString = require('random-base64-string');

module.exports.findOrCreateSession = (sessionsCollection, userId) => {
  const session = sessionsCollection.findOne({ userId });
  const sessionId = randomString(36);
  if (!session) {
    sessionsCollection.insertOne({
      userId,
      sessionId
    });
  } else {
    sessionsCollection.findOneAndUpdate(
      {
        userId
      },
      {
        $set: { sessionId }
      }
    );
  }
  return sessionId;
};
