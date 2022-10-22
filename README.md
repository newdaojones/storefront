# Storefront App

This project was bootstrapped forked from Member Dashboard's wallet-connect-v2 branch

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### Deploy to test/prod envs `./deploy.sh`
    
You can deploy to the test env or prod by using
    ./deploy.sh test
    ./deploy.sh prod

## QR Code library
### How to use local copy that needs overflow:visible change
    git checkout or copy the node_modules/lib directory, and build it. 

### Link libraries react to the main project react and build
go into the library folder (deps/lib), and link react library to the projects, like in https://reactjs.org/warnings/invalid-hook-call-warning.html
    
    cd node_modules/react; yarn link; cd ../..
    cd deps/react-qr-reader; yarn link react; cd ../..

    cd node_modules/react-dom; yarn link; cd ../..
    cd deps/react-qr-reader; yarn link react-dom

    yarn install
    cd ../..


### Link library from folder
Adjust packages.json to point to folder
    
    "react-qr-reader": "file:deps/react-qr-reader",

Link library to folder

    cd deps/react-qr-reader; yarn link
    cd ../..; yarn link react-qr-reader
    yarn install

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
