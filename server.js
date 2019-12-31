require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
MOVIEDEX = require('./MOVIEDEX.json')
const app = express();

// Middleware pipeline; keep helmet before cors.

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet());
app.use(cors());

// Validating the bearer token

app.use(function validateBearerToken(req, res, next) {

  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({error: 'Unauthorized request'})
  }

  // move to the next middleware
  next()

})

//////////////////////////////////
//////////////////////////////////
////////// GET /  ////////////////
//////////////////////////////////
//////////////////////////////////

app.get('/', (req, res) => {
  res.send(`Nothing to see here. Try http://localhost:${portNo}/movie instead`);
});

//////////////////////////////////
//////////////////////////////////
////////// GET /movie ////////////
//////////////////////////////////
//////////////////////////////////

function handleGetMovies(req, res) {

    let response = MOVIEDEX;
    
    // Filter our movies by genre if genre query param is present
    if (req.query.genre) {
        response = response.filter(movie =>
        // Lowercase then compare to make search case-insensitive
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    // Filter our movies by country if country query param is present
    if (req.query.country) {
        response = response.filter(movie => 
        // Lowercase then compare to make search case-insensitive
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    // Filter our movies by avg_vote if avg_vote query param is present
    if (req.query.avg_vote) {

      // Coerce query string to number to validate param
      let numberizedVote = parseFloat(req.query.avg_vote)
      
      // If the value the user provided is not a number, is less than 0
      // or is bigger than 10, reject it. Also NaN is a number? So convert
      // numberizedVote back to a string and see if it evaluates to
      // 'NaN', since comparing to NaN doesn't seem to work
      if (typeof(numberizedVote) !== 'number' || numberizedVote.toString() === 'NaN' || numberizedVote < 0 || numberizedVote > 10) {
        return res
          .status(400)
          .send('Rating must be a number from 1 to 10, optionally with a single decimal value, i.e. 6.8.');
      }

      response = response
        // Filter the list for movies with an avg_vote greater than or
        // equal to the value provided by the user
        .filter(movie => 
          movie.avg_vote >= numberizedVote
        )
        // And then sort them using a comparison function
        .sort((a, b) => (a.avg_vote > b.avg_vote) ? 1 : (a.avg_vote === b.avg_vote) ? ((a.avg_vote > b.avg_vote) ? 1 : -1) : -1 )
        // And then put the list in descending order
        .reverse()
    }
    
    res.json(response)
    
}

app.get('/movie', handleGetMovies)

//////////////////////////////////
//////////////////////////////////
///// EXPRESS ERROR HANDLING /////
//////////////////////////////////
//////////////////////////////////

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

//////////////////////////////////
//////////////////////////////////
//// LISTEN ON SPECIFIED PORT ////
//////////////////////////////////
//////////////////////////////////

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});