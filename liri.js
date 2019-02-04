// require("dotenv").config();
// var keys = require("./keys.js");
// var spotify = new spotify(keys.spotify);
// var omdb = new omdb(keys.omdb);
// var bandsInTown = new bandsInTown(keys.bandsInTown);

// ----------NPM------------//
const env = require("dotenv").config();
const key = require('./keys.js');
const request = require("request");
const fs = require("fs");

//-------API Specific npm------//
var Spotify = require("node-spotify-api");
var OMDB = require('omdb');
var bandsInTown = require('bandsintown')(APP_ID);

//-------API KEYS------//
var spotify = new Spotify(keys.spotify);
var omdb = new OMDB(keys.OMDB);
var bandsintown = new bandsInTown(keys.bandsInTown);

//-----LIRI COMMANDS----//
var nodeArgs = process.argv;
var inputCmd = process.argv[2];
var inputQuery;
var inputTemp;

//concatenating longer inputs 
if (nodeArgs.length >= 4) {
    for (let i = 3; i < nodeArgs.length; i++) {
        inputTemp = inputTemp + " " + nodeArgs[i];
    }
    var inputQuery = inputTemp.replace('undefined ', ' ');

} else {
    inputQuery = process.argv[3];
}

//---- API query variables----//
var params = "";
var outputNum = 1;

//-----Formatting-----//
var border = "\n==============================\n";
var hr = "\n-------------------------------\n";
var br = "\n";

//----------- GET READY -----------//
if (inputQuery && inputCmd) {
    console.log(border + "\tYou Requested: " + inputQuery + border);
} else if (inputCmd != "do what it says") {
    console.log(border + "\tYou Requested Liri's choice " + border);
}

//-------FUNCTIONS-------//
//-------Spotify---------//
//'spotify this song'
//this will show the following information about the song in you terminal/bash window
//artist(s)
//Song Name

function spotifyThisSong() {
    var query = "";

    if (inputQuery === undefined) {
        query = "I want it that way";
    } else {
        query = inputQuery;
    }
    spotify.search({ type: 'track', query: query, limit: 1 }, function (err, data) {
        if (err) {
            throw err;
        }
        var artistName = data.tracks.items[0].album.artists[0].name;
        var albumName = data.tracks.items[0].album.name;
        var songName = data.tracks.items[0].name;
        var songURL = data.tracks.items[0].external_urls.spotify;

        console.log(border
            + "Artist's name: " + artistName + br
            + "Album name: " + albumName + br
            + "Song name: " + songName + br
            + "Song URL: " + songURL
            + border);
    });
};
//----------OMDB------------//
//'movie-this'
//this will output the following information to you terminal/bash window:
//title of the movie
//Year the movie came out
// IMDB rating
// rotten tomatoes rating of the movie
// Country where the movie was produced.
// Language of the movie.
// Plot of the movie.
// Actors in the movie.
// **********
// If the user doesn't type in a movie, the program will output data for the movie "Mr. Nobody"

function movieThis() {
    var movieQuery;

    if (inputQuery === undefined) {
        movieQuery = "Mr. Nobody";
        var queryURL = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
        console.log("For Testing: " + queryURL + " (Mr. Nobody)");
    } else {
        movieQuery = inputQuery;
    }
    // console.log("The movie you requested: " + movieQuery);
    var queryURL = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

    request(queryURL, (err, res, body) => {
        if (err) throw err;
        if (!err && res.statusCode === 200) {
            var title = JSON.parse(body).Title;
            var releaseDate = JSON.parse(body).Released;
            var country = JSON.parse(body).Country;
            var language = JSON.parse(body).Language;
            var plot = JSON.parse(body).Plot;
            var actors = JSON.parse(body).Actors;

            //Check for ratings
            var rateIMDB;
            var rateRT;

            if (JSON.parse(body).Ratings[0]) {
                rateIMDB = JSON.parse(body).imdbRating;
            } else {
                rateIMDB = "Unrated";
            }

            if (JSON.parse(body).Ratings[1]) {
                rateRT = JSON.parse(body).Ratings[1].Value;
            } else {
                rateRT = "Unrated";
            }

            console.log(border + "Title: " + title + hr
                + "Released: " + releaseDate + br
                + "Rating: " + rateIMDB + br
                + "Rotten Tomatoes Rating: " + rateRT + br
                + "Country: " + country + br
                + "Language: " + language + hr
                + "Plot: " + plot + hr
                + "Actors: " + actors + border);
        }
    });
};

//---------------DO WHAT IT SAYS--------------//
//`do-what-it-says`
// Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
// Feel free to change the text in that document to test out the feature for other commands

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, res) {
        if (err) throw err;
        var data = res.split(",");
        //console.log(data);
        inputRequest = data[1].trim();
        var inputType = data[0];

        inputQuery = inputRequest;

        console.log(border + "\tYou Requested: " + inputQuery + border);

        switch (inputType) {
            //Twitter API
            case 'my-tweets':
                tweetThis();
                break;

            //Spotify API
            case 'spotify-this-song':
                spotifyThisSong();
                break;

            //OMDB API
            case 'movie-this':
                movieThis();
                break;
        }
    }
    )
};


//----------------HERES A LOG-----------------//
// log.txt
// In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// Make sure you append each command you run to the `log.txt` file. 
// Do not overwrite your file each time you run a command.
//check bank exercise


//-----------------DO THE THING----------------//

switch (inputCmd) {
    //Twitter API
    case 'my-tweets':
        myTweets();
        break;

    //Spotify API
    case 'spotify-this-song':
        spotifyThisSong();
        break;

    //OMDB API
    case 'movie-this':
        movieThis();
        break;

    //DO WHAT IT SAYS
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log(border
            + "If you want me to do something, you have to tell me"
            + border
            + "\tHere's a hint: "
            + hr + br
            + "Lookup a tweet, type 'node liri.js my-tweets [profile name]'" + br
            + "Lookup a song, type 'node liri.js spotify-this-song  [song name]" + br
            + "lookup a movie, type 'node liri.js movie-this [movie name]'" + br
            + "Read from the .txt prompt, type 'do-what-it-says'" + br + hr
            + "So what would you like me to do?" + border);

}