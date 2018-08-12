My Portfolio
============

The code behind my professional profile site.
---------------------------------------------

## Environment Variables
- run command `export PORTFOLIO_ENV=...`
- gitignored .env file with the following:
  - `MAILGUN`: Mailgun API key
  - `DBNAME`

## Get it Running
- `nvm install`
- `nvm use`

- `yarn install`
- `sudo mongod --fork --logpath /var/log/mongodb/mongod.log`
- `sudo systemctl enable redis-server`
- `sudo systemctl start redis-server`

## NPM scripts
Preface with `nvm exec`
