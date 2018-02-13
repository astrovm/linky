module.exports = {

  friendlyName: 'Create URL',

  description: 'Short the given URL.',

  inputs: {
    id: {
      type: 'string',
      example: 'QHqQHU',
      description: 'The alias of the shorted url.',
      required: false
    },
    target: {
      type: 'string',
      example: 'https://google.com/',
      description: 'The url to be shorted.',
      required: true
    },
    teleAlerts: {
      type: 'boolean',
      example: true,
      description: 'Activate/desactivate telegram alerts.',
      required: false
    },
    password: {
      type: 'string',
      example: '123456',
      description: 'The password to access the url.',
      required: false
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'The object of the url that was created in the database.',
      outputType: {}
    }
  },

  fn: async function (inputs, exits) {
    // Validate custom alias, If -custom alias- is not defined generate a random one
    if (!inputs.id) {
      inputs.id = require('randomstring').generate(6)
    } else if (inputs.id.match(/\.+/)) {
      return exits.success("Aliases can't contain points.")
    }

    const url = await sails.helpers.getUrl({ urlId: inputs.id })

    if (url) {
      return exits.success("This alias isn't available.")
    } else {
      // Validate that the url it's not empty and has http in front - if not, add it
      if (!inputs.target) {
        return exits.success('Insert a URL.')
      }

      if (inputs.teleAlerts) {
        inputs.secretKey = require('randomstring').generate()
      }

      const URLs = require('machinepack-urls')
      URLs.resolve({
        url: inputs.target
      }).exec({
        // An unexpected error occurred.
        error: function (err) {
          return exits.success('An unexpected error occurred.')
        },
        // The provided URL is not valid.
        invalid: function () {
          return exits.success('The provided URL is not valid.')
        },
        // OK.
        success: function (res) {
          inputs.target = res
          // encryptPassword
          if (inputs.password) {
            // Encrypt a string using the BCrypt algorithm.
            const Passwords = require('machinepack-passwords')
            Passwords.encryptPassword({
              password: inputs.password
            }).exec({
              // An unexpected error occurred.
              error: function (err) {
                return exits.success('An unexpected error occurred.')
              },
              // OK.
              success: function (result) {
                inputs.password = result
                Url.create(inputs).exec(function (err, url) {
                  if (err) throw err
                  return exits.success(url)
                })
              }
            })
          } else {
            Url.create(inputs).exec(function (err, url) {
              if (err) throw err
              return exits.success(url)
            })
          }
        }
      })
    }
  }
}
