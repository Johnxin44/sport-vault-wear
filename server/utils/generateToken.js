const jwt = require('jsonwebtoken')

// Creates a signed JWT containing the user's ID
// Used on login/register so the client can authenticate future requests
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

module.exports = generateToken
