module.exports.findUserByUsername = (collection, username) => collection.findOne({ username });
