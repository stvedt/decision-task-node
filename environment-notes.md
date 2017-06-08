All websites are hosted on a server.

Server is just a computer set up to provide files to a web browser and run related tasks

Each server and it's configuration, tasks, etc is considered an environment.

Servers are hosted by third-party companies like: godaddy, heroku, rackspace, amazon

Typical Environments
- Local (development occurs)
- Staging/Test (conduct testing on a hosted environment)
- Production/Live

Same technologies are being used and should be almost identical across environments.
Environments should also always be running independently from one another.

A server should:
- Host static files like html, css and javascript.
- Host and run our database, Mongo, SQL, Postgres.
- Handle requests for the above information/assets.

Local
- mongodb
- node

Remote
- node
- mongodb (mlab mongodb)

Git (version control)
- this only stores our source code
- git is used to send our source code to each environment as we tell it to.
