module.exports = {

  friendlyName: 'Check URL password',

  description: '',

  inputs: {

  },

  exits: {

  },

  fn: async function (inputs, exits) {
    const url = await sails.helpers.getUrl({ urlId: inputs.id })
    if (url) {
        // Compare a plaintext password attempt against an already-encrypted version.
      const Passwords = require('machinepack-passwords')
      Passwords.checkPassword({
        passwordAttempt: inputs.passwordAttempt,
        encryptedPassword: url.password
      }).exec({
          // An unexpected error occurred.
        error: function (err) {
          return exits.success('An unexpected error occurred.')
        },
          // Password attempt does not match already-encrypted version
        incorrect: function () {
          return exits.success('Incorrect password.')
        },
          // OK.
        success: function () {
          const params = {
            urlRedirectTarget: url.target
          }
          return exits.success(params)
        }
      })
    } else {
      return exits.success('This alias not exists.')
    }
  }
}
