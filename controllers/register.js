const jwt = require('jsonwebtoken');
const redisClient = require('./signin').redisClient;

const handleRegister =  (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('Incorrect form submission')
  }

  var hash = bcrypt.hashSync(password);

  // create transaction when you have to do more than two things at once
  db.transaction(trx => {
    trx.insert({ // use trx object instead of db
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => user[0])
    })
    .then(trx.commit) // if all pass then commit and add it
    .catch(err => trx.rollback) // if fail - rollback the changes
  })
  .catch(err => Promise.reject('Unable to register'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized')
    }
    return res.json({ id: reply })
  })
}

const assignToken = (email) => {
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  const { email, id } = user;
  const token = assignToken(email);
  return setToken(token, id)
  .then(() => {
    return { success: 'true', userId: id, token }
  })
  .catch(console.log)
}

const registerAuthentification = (req, res, db, bcrypt) => {

  return handleRegister(req, res, db, bcrypt)
    .then(data => {
      return data.id && data.email ? createSessions(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(er))
}

module.exports = {
  handleRegister
}
