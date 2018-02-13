module.exports = {

  friendlyName: 'Send telegram alert',

  description: '',

  inputs: {

  },

  exits: {

  },

  fn: async function (inputs, exits) {
    const countries = require('country-list')()
    const TelegramBot = require('node-telegram-bot-api')
    const bot = new TelegramBot(process.env.TELE_TOKEN, { polling: true })

    bot.onText(/\/?getid/i, function (msg, match) {
      const fromId = msg.from.id
      const chatId = msg.chat.id
      const opts = {
        reply_to_message_id: msg.message_id
      }

      bot.sendMessage(chatId, 'User ID: ' + fromId + '\nChat ID: ' + chatId, opts)
    })

    bot.onText(/\/?alert (.+)/i, function (msg, match) {
      const fromId = msg.from.id
      const chatId = msg.chat.id
      const opts = {
        reply_to_message_id: msg.message_id
      }
      const params = match[1].split(/\s+/)
      const aliasParam = params[0]
      const secretKeyParam = params[1]
      const query = { id: aliasParam }
      const update = { teleId: chatId, teleAlerts: true, updatedAt: Date.now() }
      Url.findOne({ where: query }).exec(function (err, url) {
        if (url == undefined) {
          bot.sendMessage(chatId, 'Alias not exists.', opts)
        } else if (url.teleid == chatId) {
          if (url.telealerts != true) {
            update = { telealerts: true, updatedAt: Date.now() }
            Url.update(query, update).exec(function (err, url) {
              if (err) {
                bot.sendMessage(chatId, 'Server error.', opts)
              } else {
                bot.sendMessage(chatId, aliasParam + ' alerts ON.', opts)
              }
            })
          } else {
            update = { telealerts: false, updatedAt: Date.now() }
            Url.update(query, update).exec(function (err, url) {
              if (err) {
                bot.sendMessage(chatId, 'Server error.', opts)
              } else {
                bot.sendMessage(chatId, aliasParam + ' alerts OFF.', opts)
              }
            })
          }
        } else if (secretKeyParam === undefined) {
          bot.sendMessage(chatId, 'Include secret key after alias.', opts)
        } else if (url.id == aliasParam) {
          Url.update(query, update).exec(function (err, url) {
            if (err) {
              bot.sendMessage(chatId, 'Server error.', opts)
            } else {
              bot.sendMessage(chatId, 'Done, we\'ll send alerts of http://linky.tk/' + aliasParam, opts)
            }
          })
        } else {
          bot.sendMessage(chatId, 'Incorrect secret key.', opts)
        }
      })
    })

    if (inputs.geo) {
      inputs.geo = countries.getName(inputs.geo)
    }

    bot.sendMessage(inputs.teleId, inputs.ip + ' with ' + inputs.agent + ' in ' + inputs.urlAlias + ' ==> ' + inputs.target + ' from ' + inputs.geo)

    return exits.success()
  }

}
