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
        .then(user => {
          res.json(user[0])
      })
    })
    .then(trx.commit) // if all pass then commit and add it
    .catch(err => trx.rollback) // if fail - rollback the changes
  })
  .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
  handleRegister
}
