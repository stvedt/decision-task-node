Decision Task Set Up
====================

This Project uses NodeJS and Heroku to Deploy

To run locally you must have the following installed:
- NodeJS
- NodeMon (optional)
- NPM

Run:
`npm install`
`nodemon server.js`

Run without NodeMon:
`node server.js`


## Heroku
ancient-savannah-21367
https://ancient-savannah-21367.herokuapp.com/ | https://git.heroku.com/ancient-savannah-21367.git

Deploy:
`git push heroku master`

Run Instance:
`heroku ps:scale web=1`

Open:
`heroku open`

View Logs:
`heroku logs --tail`
