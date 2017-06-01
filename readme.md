Decision Task Set Up
====================

## Local Environment Setup

To run locally you must have the following installed:
- [NodeJS](https://nodejs.org/en/download/)
- [MongoDB](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) (installation instructions on Mac)
- [NPM (Node Package Manager)](https://www.npmjs.com/get-npm) (installed with NodeJS)
- Heroku CLI

#### Running Locally:
Start MongoDB (in own terminal window)
`mongod`

Go to project in terminal on file system:
`cd ~/Desktop/decision-task-node`

Make sure NodeJS dependencies are installed with NPM. (only run this if dependencies have changed)
`npm install`

Local Run with Heroku
`heroku local web`

## Deploying with Heroku
Commit all of your code and be sure they are in the master branch.

Adds all files to be committed into version control:
`git add .`

Commits the files with a message:
`git commit -m 'message about the changes you made go here'`

Deploy:
`git push heroku master`

Check instance is running(optional):
`heroku ps:scale web=1`

Open page in web browser (or just navigate to decisionmakingtask.com):
`heroku open`

View Logs (should something on the server side goes wrong):
`heroku logs --tail`

### Next Steps

- Create new session when all choice problems are completed.
- Work on results ordering
- Samples and decisions have $?
- Prevent multiple sample values from showing at same time.
- Add finish screen.
- Handle instruction screen undefined error


### For later release

- Questionnaire Support
- Cleaner export
- Ensure running with just node.js works
