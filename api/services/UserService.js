var Passwords = require('machinepack-passwords');

module.exports = {
  getUser: function(userName, next) {
    User.findOne({ where: { username: userName } }).exec(function(err, user) {
      if(err) throw err;
      next(user);
    });
  },
  addUser: function(userParams, next) {
    UserService.getUser(userParams.username, function(user) {
      if (user) {
        next("This username isn't available.");
      } else {
        // encryptPassword
        if (userParams.password) {
          // Encrypt a string using the BCrypt algorithm.
          Passwords.encryptPassword({
          password: userParams.password,
          }).exec({
            // An unexpected error occurred.
            error: function (err) {
              next("An unexpected error occurred.");
            },
            // OK.
            success: function (result) {
              userParams.password = result;
              User.create(userParams).exec(function(err, user) {
                if(err) throw err;
                next(user);
              });
            },
          });
        } else {
          User.create(userParams).exec(function(err, user) {
            if(err) throw err;
            next(user);
          });
        }
      }
    });
  },
  removeUser: function(username, next) {
    User.destroy({username: username}).exec(function(err, user) {
      if(err) throw err;
      next(user);
    });
  }
};
