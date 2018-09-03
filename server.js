const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Fill in requirements
const db = knex({
  client: 'DB_CLIENT',
  connection: {
    host : '127.0.0.1',
    user : 'USER',
    password : 'PASSWORD', 
    database : 'DB_NAME'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(db.users) })

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// in terminal: set PORT=3000 --> npm start
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
