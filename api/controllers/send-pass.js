sendPass: function (req, res) {
  const urlParams = {
    id: req.param('id'),
    passwordAttempt: req.param('password')
  }

  const url = await sails.helpers.checkUrlPass(urlParams)
  return res.json(url)
}
