/**
 * UrlController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  redirectUrl: function (req, res) {
    var urlId = req.url.slice(1);

    UrlService.getUrl(urlId, function(url) {
      if (url != undefined) {
        res.set('Cache-Control', 'public, max-age=5');
        // Check if the URL has password and request it in that case
        if (url.password == null) {
          res.redirect(url.target);
        } else {
          res.view('layout');
        }
        if (url.teleid && url.telealerts) {
          var useragent = require('useragent');
          var agent = useragent.parse(req.headers['user-agent']);
          var teleParams = {
            ip: req.ip,
            geo: req.headers['cf-ipcountry'],
            agent: agent.toString(),
            teleid: url.teleid,
            urlAlias: url.id,
            target: url.target
          }
          UrlService.teleAlert(teleParams);
        }
      } else {
        return res.json("This alias doesn't exist.");
      }
    });
  },
  createUrl: function (req, res) {
    var urlParams = {
      id: req.param('id'),
      target: req.param('target'),
      emailalerts: req.param('emailalerts'),
      telealerts: req.param('telealerts'),
      captcha: req.param('captcha'),
      password: req.param('password'),
      email: req.param('email')
    }

    UrlService.createUrl(urlParams, function(url) {
      return res.json(url);
    });
  },
  sendPass: function (req, res) {
    var urlParams = {
      id: req.param('id'),
      passwordAttempt: req.param('password')
    }

    UrlService.sendPass(urlParams, function(url) {
      return res.json(url);
    });
  }
};
