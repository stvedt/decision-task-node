Decision Task Set Up
====================

This Project uses NodeJS, Express, Mongoose and Heroku

To run locally you must have the following installed:
- NodeJS
- NodeMon (optional)
- NPM

Local Run:

`npm install`

`nodemon server.js`

Run without NodeMon:
`node server.js`

Local Run with Heroku
`heroku local web`

## Heroku
empirical-project
https://empirical-project.herokuapp.com/ | https://git.heroku.com/empirical-project.git

Deploy:
`git push heroku master`

Run Instance:
`heroku ps:scale web=1`

Open:
`heroku open`

View Logs:
`heroku logs --tail`

### Next Steps

- Create new session when all choice problems are completed.
- Work on results ordering
- Samples and decisions have $?


### For later release

- Questionnaire Support
- Cleaner export
