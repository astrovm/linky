module.exports = {

  friendlyName: 'Get URL',

  description: 'Finds the url in the database and return the saved object.',

  inputs: {
    urlId: {
      type: 'string',
      example: 'QHqQHU',
      description: 'The alias of the shorted url.',
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'The object of the url that was find in the database.',
      outputType: 'object'
    }

  },

  fn: async function (inputs, exits) {
    Url.findOne({ where: { id: inputs.urlId } }).exec((err, url) => {
      if (err) throw err
      // Send back the result through the success exit.
      return exits.success(url)
    })
  }
}
