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

### Git Workflow

1. checkout a new branch from master `git checkout -b BRANCH_NAME_HERE`
2. Make changes to your files locally.
3. You stage the files you file you want to commit (or add/update in the git version control repository) `git add FILE_NAME_HERE`
4. Commit files to git using: `git commit -m 'MESSAGE_GOES_HERE'`
5. Push branch to github using `git push origin BRANCH_NAME_HERE`
6. Open Pull request and merge branch into master. (delete branch optional)
7. Checkout master locally `git checkout master`
8. Pull down changes from remote `git fetch`
9. Merge remote branch with local branch `git merge origin/master`

### Pull Down Changes Only

1. Go to project in terminal on file system:
`cd ~/Desktop/decision-task-node`
2. Pull down changes from remote `git fetch`
3. Merge remote branch with local branch `git merge origin/master`

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
