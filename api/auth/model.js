const db = require('../../data/dbConfig');

exports.add = function ({username, password}) {
  return db('users')
    .insert({username, password})
    .then(id => {
      return db('users')
        .where({id})
        .first();
    });
};
