# Blueprintnotincluded-backend
The server for [Blueprintnotincluded](https://github.com/simonlourson/blueprintnotincluded)

## Setting up the environnement
Create a `.env` file (see [dotenv](https://www.npmjs.com/package/dotenv)) in the project directory with the following available environment variables:
* `ENV_NAME`: could be set to `development`
* `PUBLIC_DIR`: The root folder of the front end files. Default to 
* `JWT_SECRET`： As its name. Just give it a dummy string if not in production
* `CAPTCHA_SITE`: Can be omitted in development mode
* `CAPTCHA_SECRET`: Can be omitted in development mode
* `BROWSE_INCREMENT`: Limit of the number of blueprints in the browse pop-up


## Start the server
```
node run dev
```
