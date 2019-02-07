Decision Task Set Up
====================

## Local Environment Setup

To run locally you must have the following installed:
- [NodeJS](https://nodejs.org/en/download/)
- [MongoDB](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) (installation instructions on Mac)
- [NPM (Node Package Manager)](https://www.npmjs.com/get-npm) (installed with NodeJS)
- [Robo3T](https://robomongo.org/download) (optional)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
- On first install add a file named: `.env` to the project root and it should have one line containing: `MONGODB_URI='mongodb://localhost/decision-task'`
- Add Heroku remotes

```
heroku login

heroku git:remote -a empirical-project-v1
git remote rename heroku heroku-v1

heroku git:remote -a empirical-project-v2
git remote rename heroku heroku-v2
```

#### Running Locally:

Start MongoDB (in own terminal window)
`mongod`

Open new terminal window

Go to project in terminal on file system:
`cd ~/Desktop/decision-task-node`

Pull down latest files
`git pull`

Checkout branch you would like to work on:

Version 1
`git checkout master`

Version 2:
`git checkout start-v2-updates`

Make sure NodeJS dependencies are installed with NPM. (only run this if dependencies have changed)
`npm install`

Local Run with Heroku
`heroku local web`

App will be running at [http://localhost:5000/](http://localhost:5000/)

## Committing Changes

Open other terminal to commit any changes
`cd ~/Desktop/decision-task-node`

Commit all of your code and be sure they are in the appropriate branch.

Adds all files to be committed into version control:
`git add .`  or `git add FILE_NAME_HERE`

Commits the files with a message:
`git commit -m 'message about the changes you made go here'`

## Deploying with Heroku

Deploy:

V1:
`git push heroku-v1 master`  

V2:
`git push heroku-v2 start-v2-updates:master`

Check instance is running(optional):
`heroku ps:scale web=1`

Open page in web browser (or just navigate to decisionmakingtask.com):
`heroku open`

View Logs (should something on the server side goes wrong):
`heroku logs --tail`

Restarting Heroku:
```
heroku restart --remote heroku-v1
heroku restart --remote heroku-v1
```

### Git Workflow (optional)

1. Checkout a new branch from master `git checkout -b BRANCH_NAME_HERE`
2. Make changes to your files locally.
3. You stage the files you file you want to commit (or add/update in the git version control repository) `git add FILE_NAME_HERE`
4. Commit files to git using: `git commit -m 'MESSAGE_GOES_HERE'`
5. Push branch to github using `git push origin BRANCH_NAME_HERE`
6. Open Pull request and merge branch into master. (delete branch optional)
7. Checkout master locally `git checkout master`
8. Pull down changes from remote `git fetch`
9. Merge remote branch with local branch `git merge origin/master`

### Pull Down Changes Only (needs revision)

1. Go to project in terminal on file system:
`cd ~/Desktop/decision-task-node`
2. Pull down changes from remote `git fetch`
3. Merge remote branch with local branch `git merge origin/master` 
