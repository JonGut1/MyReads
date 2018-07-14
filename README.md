# MyReads app
---
#### _MyReads app for the Udacity fend course_

* [Installation](#installation)
* [About](#about)
* [Dependencies](#dependencies)

## Installation

To start the project, first yuo will have to clone MyReads repo. Then navigate to the project's directory with a console and type
```
npm install
```
then, if you want to run the project type
```
npm start
```
## About

The project was done as part of the Udacity fend course. Everything was done by me except for the BooksAPI.js file. This file handles fetches from book api.

This app let's you order the selected books onto certain shelves. There are 3 shelves: 'Currently Reading', 'Want To Read', 'Read'. Also you can get more books by opening a search screen and typing a word into an input field.

The books are fetched based on the code 'token' saved in your browser's local storage, thus the books will display changed information even after you restart your browser.

## Dependencies

Google fonts are used for the styling of the text "https://fonts.googleapis.com/css?family=Acme|Galada".

Bootstrap glyphicons are used for some of the icons in the app
"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css".

### npm dependencies

react-dom is used, because the app is buil in react.

react-router-dom is used so that routes could be present in the app.
```
npm install --save react-router-dom
```

react-scripts is used so to provide easy installation of the deppendencies, also for the app building and testing.

hisory so that browser history could be accessed.
```
npm install --save history
```

escape-string-regexp is used to extract the needed strigs from the url.
```
npm install --save escape-string-regexp
```
