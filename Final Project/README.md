# Song Tracker

## Overview

Every week, college radio stations across the nation send out a chart featuring the top 30 songs played and the top 5 additions to the new music library for that given week. The way it has always been done in the past, the Music Director compiles this list by manually reviewing all the posted playlists for the week and making note of repeated songs. This method is very inefficient and can take hours. Furthermore, labels and promotion agencies often ask for 'tracking' numbers to see if their albums have been added to the new music library and if so, how many times they have been played.

Song Tracker is a web app that allows the user to keep track of songs played and compiles the top 30 chart for them. Once they have registered and logged in, they can input all the playlists to be considered -- the app will organize each song into several properties (Artist, Title, Album, Label, Plays). The user will have the option to sort them based on these properties, create the weekly chart, or see a previous week's chart.


## Data Model

The application will store Users, Charts, and Songs

* users can have multiple charts (via references)
* each list can have multiple songs (by embedding)

An Example User:

```javascript
{
  username: "MusicDirector"
  hash: //a password hash
  charts: // an array of references to Songs elements
}
```

An Example Chart with Embedded Songs:

```javascript
{
    user: //a reference to a User object
  name: "WNYU Weekly Chart for October 23, 2017"
  songs: [
    {artist: "Colleen" , title: "Separating", album: "a flame my love, a frequency", label: "Thrill Jockey" , plays: 3},
    {artist: "Al Massireen" , title: "Sah", album: "Habibi Funk 006", label: "Habibi Funk", plays: 2},
    {artist: "E-Saggila", title: "In the Snake", album: "Lux Campaign", label: "Opal Tapes", plays: 2}
  ]
  createdAt: //timestamp
}
```


## [Link to Commented First Draft Schema](db.js) 


## Wireframes (photos in documentation folder)

/charts/create -- fields to enter title, author, and playlists

/charts -- a page that shows all charts 

/charts/slug -- a page showing specific weeks plays -- gives options to sort and make top 30 chart

/plays -- a page that displays a table showing the top plays for every song ever submitted under this username

## Site map

in documentation folder

## User Stories or Use Cases

1. as a non-regiestered user, I can make a new account
2. as a user, I can log in
3. as a user, I can see my previous charts
4. as a user, I can input playlists
5. as a user, I can make a top 30 chart
6. as a user, I can keep track and access all the songs played

## Research Topics


* (5 points) Integrate user authentication
    * using passport to authenticate a user account
    * passport-local to set up a username and password
* (3 points) Unit testing with JavaScript
    * using Mocha to set up unit tests
* (2 points) Use a CSS framework throughout the site
    * using Bootstrap to create a theme across the pages

10 points total out of 8 required points


## [Link to Initial Main Project File](app.js) 


## Annotations / References Used

1. [bootstrap overview](http://getbootstrap.com/docs/4.0/examples/)
2. [passport overview](http://www.passportjs.org/docs)
3. [mocha testing](https://github.com/mochajs/mocha)