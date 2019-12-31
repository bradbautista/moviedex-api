# moviedex-api
Sample movie API

This server listens on port 8000 for GET requests to the endpoint /movie/, with three optional query parameters. If no queries are present, it will return a selection of apps and information about them. It requires an authorization token to function. To use it, generate your own token and place it in an .env file in the server's root directory via the text API_TOKEN='yourApiToken'.

Valid queries include genre, country and avg_vote. 

Queries for genre and country will return any results that match the provided string. avg_vote is a number on a 10-point scale, either whole or with a decimal, i.e. 5 or 6.8. Queries for avg_vote will return matches with scores equal to and greater than the provided number.
