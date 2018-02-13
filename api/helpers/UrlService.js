const countries = require('country-list')()
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELE_TOKEN, { polling: true })

bot.onText(/\/?getid/i, function (msg, match) {
  var fromId = msg.from.id
  var chatId = msg.chat.id
  var opts = {
    reply_to_message_id: msg.message_id
  }

  bot.sendMessage(chatId, 'User ID: ' + fromId + '\nChat ID: ' + chatId, opts)
})

bot.onText(/\/?alert (.+)/i, function (msg, match) {
  var fromId = msg.from.id
  var chatId = msg.chat.id
  var opts = {
    reply_to_message_id: msg.message_id
  }
  var params = match[1].split(/\s+/)
  var aliasParam = params[0]
  var secretKeyParam = params[1]
  var query = { id: aliasParam }
  var update = { teleid: chatId, telealerts: true, updatedAt: Date.now() }
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

module.exports = {
  teleAlert: function (teleParams) {
    if (teleParams.geo) {
      teleParams.geo = countries.getName(teleParams.geo)
    }
    bot.sendMessage(teleParams.teleid, teleParams.ip + ' with ' + teleParams.agent + ' in ' + teleParams.urlAlias + ' ==> ' + teleParams.target + ' from ' + teleParams.geo)
  },

  sendPass: function (urlParams, next) {
    UrlService.getUrl(urlParams.id, function (url) {
      if (url) {
        // Compare a plaintext password attempt against an already-encrypted version.
        Passwords.checkPassword({
          passwordAttempt: urlParams.passwordAttempt,
          encryptedPassword: url.password
        }).exec({
          // An unexpected error occurred.
          error: function (err) {
            next('An unexpected error occurred.')
          },
          // Password attempt does not match already-encrypted version
          incorrect: function () {
            next('Incorrect password.')
          },
          // OK.
          success: function () {
            var params = {
              urlRedirectTarget: url.target
            }
            next(params)
          }
        })
      } else {
        next('This alias not exists.')
      }
    })
  }
}
