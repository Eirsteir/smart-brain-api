const handleRegister =  (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
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
        .catch(err => Promise.reject('Unable to register'))
      })
    })
    .then(trx.commit) // if all pass then commit and add it
    .catch(err => trx.rollback) // if fail - rollback the changes
  })
  .catch(err => Promise.reject('Unable to register'))
}

const registerAuthentification = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return handleRegister(req, res, db, bcrypt)
    .then(data => {
      return data.id && data.email ? createSessions(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  handleRegister
}
