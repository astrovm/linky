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
