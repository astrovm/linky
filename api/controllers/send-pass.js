module.exports = {

  friendlyName: 'Send pass to helper',

  description: 'Send the password to check pass helper.',

  inputs: {
    id: {
      required: true,
      type: 'string'
    },
    passwordAttempt: {
      required: true,
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Password is correct.'
    }
  },

  fn: async function (inputs, exits) {
    const urlParams = {
      id: this.req.param('id'),
      passwordAttempt: this.req.param('password')
    }

    const url = await sails.helpers.checkUrlPass(urlParams)
    return exits.success(url)
  }

}
