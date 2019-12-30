require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
POKEDEX = require('./MOVIEDEX.json')
const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());


console.log(process.env.API_TOKEN)

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

const portNo = 8000

app.listen(portNo, () => {
    console.log(`Server listening on port ${portNo}`);
});