const Users = require('./model');

exports.validateBody = (req, res, next) => {
  const {username, password} = req.body;
  if (username && password) {
    next();
  } else {
    res.status(400).json({
      message: 'username and password required'
    });
  }
};

exports.usernameFree = (req, res, next) => {
  Users.getByUsername(req.body.username)
    .then(user => {
      if (user) {
        res.status(400).json({
          message: 'username taken'
        });
      } else {
        next();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
