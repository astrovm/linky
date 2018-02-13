module.exports = {

  friendlyName: 'Create shorted URL',

  description: 'Send the data to create-url helper.',

  inputs: {
    id: {
      required: true,
      type: 'string'
    },
    target: {
      required: true,
      type: 'string'
    },
    emailAlerts: {
      required: true,
      type: 'boolean'
    },
    teleAlerts: {
      required: true,
      type: 'boolean'
    },
    captcha: {
      required: true,
      type: 'string'
    },
    password: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'URL was shorted successfully.',
    }
  },

  fn: async function (inputs, exits) {
    const urlParams = {
      id: this.req.param('id'),
      target: this.req.param('target'),
      emailAlerts: this.req.param('emailAlerts'),
      teleAlerts: this.req.param('teleAlerts'),
      captcha: this.req.param('captcha'),
      password: this.req.param('password'),
      email: this.req.param('email')
    }

    const url = await sails.helpers.createUrl(urlParams)
    return exits.success(url)
  }

}
