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
- Obfuscate to User actual Choice Problem Number
- CSV or cleaner export
- Create new session when all choice problems are completed.
- Move pages Object to JSON file.
- Work on results ordering

- Choice problem urls in order
- Breakout sample from finals into separate Steps (make actual decision)
- Display values in buttons
- Decimals show to hundredths two decimals
- Styling pass/make it look good.


### For later release

- Questionnaire Support
