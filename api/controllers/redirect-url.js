module.exports = {

  friendlyName: 'Redirect url',

  description: 'Handle shorted links.',

  inputs: {
    urlId: {
      required: true,
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Redirect to target.'
    }
  },

  fn: async function (inputs, exits) {
    const urlId = this.req.url.slice(1)
    const url = await sails.helpers.getUrl({ urlId: urlId })

    if (url != undefined) {
      this.res.set('Cache-Control', 'public, max-age=5')
        // Check if the URL has password and request it in that case
      if (url.password == null) {
        this.res.redirect(url.target)
      } else {
        this.res.view('layout')
      }
      if (url.teleId && url.teleAlerts) {
        const userAgent = require('useragent')
        const agent = userAgent.parse(this.req.headers['user-agent'])
        const teleParams = {
          ip: this.req.ip,
          geo: this.req.headers['cf-ipcountry'],
          agent: agent.toString(),
          teleId: url.teleId,
          urlAlias: url.id,
          target: url.target
        }
        sails.helpers.sendTelegramAlert(teleParams)
      }
    } else {
      this.res.json("This alias doesn't exist.")
      return exits.success()
    }
  }
}
