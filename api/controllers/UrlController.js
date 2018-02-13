/**
 * UrlController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  redirectUrl: function (req, res) {
    const urlId = req.url.slice(1)
    const url = await sails.helpers.getUrl({ urlId: urlId })

      if (url != undefined) {
        res.set('Cache-Control', 'public, max-age=5')
        // Check if the URL has password and request it in that case
        if (url.password == null) {
          res.redirect(url.target)
        } else {
          res.view('layout')
        }
        if (url.teleId && url.teleAlerts) {
          const userAgent = require('useragent')
          const agent = userAgent.parse(req.headers['user-agent'])
          const teleParams = {
            ip: req.ip,
            geo: req.headers['cf-ipcountry'],
            agent: agent.toString(),
            teleId: url.teleId,
            urlAlias: url.id,
            target: url.target
          }
          sails.helpers.sendTelegramAlert(teleParams)
        }
      } else {
        return res.json("This alias doesn't exist.")
      }
    })
  },
  createUrl: async function (req, res) {
    const urlParams = {
      id: req.param('id'),
      target: req.param('target'),
      emailAlerts: req.param('emailAlerts'),
      teleAlerts: req.param('teleAlerts'),
      captcha: req.param('captcha'),
      password: req.param('password'),
      email: req.param('email')
    }

    const url = await sails.helpers.createUrl(urlParams)
    return res.json(url)
  },
  sendPass: function (req, res) {
    const urlParams = {
      id: req.param('id'),
      passwordAttempt: req.param('password')
    }

    const url = await sails.helpers.checkUrlPass(urlParams)
    return res.json(url)
  }
}
