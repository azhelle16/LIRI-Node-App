# LIRI-Bot

### Description

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

### How It Works

This application has 4 available commands and are as follows:

	a. spotify-this-song 
			- display information about the given track
	b. movie-this
			- display information about the given movie
	c. concert-this
			- display information about the given artist / band's line up of events
	b. do-what-it says
			- reads from a file then perform the command

	Sample: node liri.js <command> <input>

	If the command is not available, the app will prompt the user to contact the System Administrator for further assistance.

The app also writes on a file called "log.txt". It includes the command, input and data returned by the api.

Screenshots of how the app works is under /images folder.

### APIs / Packages used

Spotify - https://www.npmjs.com/package/node-spotify-api

Axios - https://www.npmjs.com/package/axios (will be used for the movie and concert APIs)

OMDB - http://www.omdbapi.com

Concerts - http://www.artists.bandsintown.com/bandsintown-api

Moment - https://www.npmjs.com/package/moment (for datetime formatting)

DotEnv - https://www.npmjs.com/package/dotenv

### Note

User needs to provide it's own Spotify ID and Spotify Secret to run the app
