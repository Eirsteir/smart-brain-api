const redisClient = require('./signin').redisClient;

const handleSignout = (req, res) => {
  const { authorization } = req.headers;
  return authorization ? deleteAuthTokenId(req, res, token) : res.json('Successfully signed out');
}

const deleteAuthTokenId = (req, res, token) => {
  return redisClient.del(token, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unable to remove token')
    }
    return res.json('Successfully deleted token')
  })
}

module.exports = {
  handleSignout
}
