const handleSignin =  (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission')
  }

  db.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash); // returns true if correct credentials
    if (isValid) {
      return db.select('*').from('users') // always return
        .where('email', '=', email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'))
    } else {
      res.status(400).json('wrong email or password')
    }
  })
  .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin
}
