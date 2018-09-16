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

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => { res.send("ITS WORKING") })
app.post('/signin', signin.sigininAuthentification(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', (req, res) => { profile.handleProfileUpdate(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
