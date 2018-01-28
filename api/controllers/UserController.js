/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var Authentication = require('machinepack-sessionauth');

module.exports = {
  getUserLogged: function(req, res) {
    // Check whether the current user is logged in.
    Authentication.checkLogin({
    }).exec({
      // An unexpected error occurred.
      error: function (err){
        res.json(err);
      },
      // The requesting user is not logged in.
      otherwise: function (){
        res.json(false);
      },
      // OK.
      success: function (result){
        res.json(result);
      },
    });
  },
  addUser: function(req, res) {
    var userParams = {
      username: req.param('username'),
      password: req.param('password'),
      email: req.param('email')
    }

    UserService.addUser(userParams, function(success) {
      if (success.id) {
        // Log in as the specified user.
        Authentication.login({
          id: success.id,
        }).exec({
          // An unexpected error occurred.
          error: function (err){
            res.json(err);
          },
          // OK.
          success: function (){
            res.json('OK');
          },
        });
      } else {
        res.json(success);
      }
    });
  },
  removeUser: function(req, res) {
    var username = (req.body.username) ? req.body.username : undefined
    UserService.removeUser(username, function(success) {
      res.json(success);
    });
  }
};
