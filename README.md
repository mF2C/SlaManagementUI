# SLA Management UI

UI for the mF2C SLA Management component.

## Description

The UI shows the following information:

* (in progress)

The SLA Management UI is a React application that depends on CIMI to obtain the information about ServiceInstances, Agreements, Violations... The connection with CIMI is done through an Nginx, used both in development and production.

## Development

The following steps may be used for development.

1. Execute `npm start`. 

   The React application is now running on http://localhost:3000.

2. Execute `./start.sh`. 
   
   This starts an Nginx container (configuration in `resources/default.conf.dev`) that expects the React application running at http://172.17.0.1:3000 and a CIMI server (or an SSH tunnel to it) at http://172.17.0.1:10443. 
   
   **NOTE**: Check the IP to access the local host from the container, and modify `default.conf.dev` if needed.

3. You can now develop locally and see the changes immediately at [http://localhost:8000](http://localhost:8000)

## Production



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.



## Credits

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
