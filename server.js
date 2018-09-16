const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Cross-origin HTTP request
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

// Setup environmental variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => { res.status(200).json('all good') })
app.post('/signin', signin.sigininAuthentification(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})


// TODO:
//  - remove token from browser on signout and delete token from redis database
