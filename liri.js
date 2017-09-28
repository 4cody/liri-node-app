// Variables - require
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

// Variables - global
var tweetKey = keys.twitterKeys;
var spotKey = keys.spotifyKeys;
var input = process.argv;
var calc = parseFloat;
var op = input[2];
var mod = input[3];



// Variable - Initilize Twitter
var twitter = new twitter({
  consumer_key: tweetKey.consumer_key,
  consumer_secret: tweetKey.consumer_secret,
  access_token_key: tweetKey.access_token_key,
  access_token_secret: tweetKey.access_token_secret
});


// Variable - Initilize Spotifyvar spotify = new Spotify({
var spotify = new spotify({
  id: spotKey.id,
  secret: spotKey.secret
});


// Switch - to handle input
switch (op) {
  case 'tweets':
    getTweets();
    break;
  case 'song':
    getSong();
    break;
  case 'movie':
    getMovie();
    break;
};


// Function - Get tweets from Twitter
function getTweets() {
  // Variable - request.params()
  var params = {
    screen_name: '4Leeko'
  };

  // Get - Twitter API
  twitter.get('statuses/user_timeline', params, function (error, tweets, repsonse) {
    // If - no errors
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log('Tweeted on ' + tweets[i].created_at);
        console.log('"' + tweets[i].text + '"');
        console.log('');
      }
    } else {
      console.log(error);
    }
  });
};


// Function - Log input
function logData(log, color, halt) {
  // File - logoData logs...data
  fs.appendFileSync('log.txt', log + '\r\n');
  // If - on/off for logData
  if (!halt) {
    if (color !== undefined) {
      console.log(chalk[color](log));
    } else {
      console.log(log);
    }
  };
};

// Function - Get Spotify song info
function getSong() {
  // Variable - local
  var songName = '';
  var query = '';

  // For - Capture complete title
  for (var i = 3; i < input.length; i++) {
    // Build a string of song title
    var songName = input[i];
  }

  // If - Checks if song has been entered
  if (songName === '') {
    // Variable - searches for What's My Age Again
    var params = {
      type: 'track',
      query: "spheres of madness"
    };
    // Log
    console.log('figure it out..  here is one to help you think')
  }
  // Else - If query is populated
  else {
    // Variable - applies input to search
    var params = {
      type: 'track',
      query: songName
    };
    // Log
    console.log('Searching...');
  }

  // Search - Spotify API
  spotify.search(params, function (error, data) {
    // Variables - local
    var output = data.tracks.items;

    // If - no errors
    if (!error) {
      // Log 
      console.log('Here are some songs that match your search keyword.');

      // For - captures output
      for (var i = 0; i < output.length; i++) {
        // Return - returns feedback in place of null value
        var name = output[i].artists;
        var artist = [];
        // For - captures mutliple artists into array
        for (var a = 0; a < name.length; a++) {
          var multi = name[a].name;
          artist.push(' ' + multi);
        }
        // Log - data
        console.log('');
        console.log((i + 1 + ') ') + output[i].name);
        console.log('     Artist(s):' + artist);
        console.log('     Album: ' + output[i].album.name);
        console.log('     Preview: ' + output[i].preview_url)
      }
      // Else - if errors
    } else {
      console.log(error);
    }

  });
};

// Function - Get OMDB movie info
function getMovie() {
  // Variable - local
  var movieName = '';

  // For - Capture complete title
  for (var i = 3; i < input.length; i++) {
    // Build a string of movie title
    var movieName = input[i];
  }

  // If - Checks if movie has been entechalk.red
  if (movieName === '') {
    // Variable - searchs for Mr. Nobody if not
    movieName = 'mr nobody';
    // Log
    console.log('I see you could not choose a movie to search for.');
    console.log('Might I suggest an early 2010s bomb starring a post-op Courtney Cox?');
  }
  // Else - If movieName is populated
  else {
    // Log
    console.log('Searching...');
  }

  // Variable - API ref
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=40e9cece";

  // Request API - Get movie info
  request(queryUrl, function (error, response, body) {
    var omdb = JSON.parse(body);
    // If - no errors
    if (!error && response.statusCode === 200) {
      if (omdb.Response === "False") {
        console.log('I could not find the movie you searched for. Please try another title.');
      } else {
        console.log('Movie found!');
        console.log('');
        console.log(omdb.Title + ' (' + omdb.Year + ')');
        console.log(omdb.Actors);
        console.log('----------------');
        console.log('IMDB: ' + omdb.imdbRating + ' - Rotten Tomatoes: ' + omdb.Ratings[1].Value);
        console.log('Country(s): ' + omdb.Country + ' - Language(s): ' + omdb.Language);
        console.log('');
        console.log(omdb.Plot);
        console.log('Rated: ' + omdb.Rated);
        console.log('');
      }
    } else {
      console.log(error);
    }

  });
};