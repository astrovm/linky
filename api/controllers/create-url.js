createUrl: async function (req, res) {
  const urlParams = {
    id: req.param('id'),
    target: req.param('target'),
    emailAlerts: req.param('emailAlerts'),
    teleAlerts: req.param('teleAlerts'),
    captcha: req.param('captcha'),
    password: req.param('password'),
    email: req.param('email')
  }

  const url = await sails.helpers.createUrl(urlParams)
  return res.json(url)
},
