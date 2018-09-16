const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const handleSignin =  (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return rPromise.reject('incorrect form submission')
  }

  return db.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash); // returns true if correct credentials
    if (isValid) {
      return db.select('*').from('users') // always return
        .where('email', '=', email)
        .then(user => user[0])
        .catch(err => Promise.reject('unable to get user'))
    } else {
      Promise.reject('wrong email or password')
    }
  })
  .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = () => {
    console.log('auth ok');
}

const signToken = (email) => {
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' }) // TODO: environmental vars
}

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email)
  return { success: 'true', userId: id, token }
}

const sigininAuthentification = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId() :
  handleSignin(db, bcrypt, req, res)
    .then(data => {
      return data.id && data.email ? createSessions(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  sigininAuthentification
}
