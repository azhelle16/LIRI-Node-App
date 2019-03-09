//PACKAGES
require("dotenv").config();
var keys = require("./keys")
var req = require("axios")
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var moment = require("moment")
var fs = require("fs")

/*
 #######################################################################
 #
 #  FUNCTION NAME : 
 #  AUTHOR        : 
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : 
 #  PARAMETERS    : 
 #
 #######################################################################
*/

//GLOBAL VARIABLES
var command = process.argv[2]
var input = process.argv.slice(3).join(" ")
var url
baseCommand(0)

/*
 #######################################################################
 #
 #  FUNCTION NAME : baseCommand
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 03, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 05, 2019 PST
 #  REVISION #    : 2
 #  DESCRIPTION   : switch function for the command and the input
 #  PARAMETERS    : flag
 #
 #######################################################################
*/

function baseCommand(flag) {
	
	switch (command.toLowerCase()) {
		default:
			console.log("\n"+command+" is currently not available. Please contact System Administrator.\n")
		break;
		case "concert-this":
			if (input == "" || input == undefined) {
				console.log("\nPlease provide artist/band name.\n")
				return
			}
			url = "https://rest.bandsintown.com/artists/"+input+"/events?app_id=codingbootcamp"
			sendQuery(url,1,flag)
		break;
		case "spotify-this-song":
			if (input == "" || input == undefined) {
				input = "The Sign"
			}
			sendQuery(url,2,flag)
		break;
		case "movie-this":
			if (input == "" || input == undefined) {
				input = "Mr. Nobody"
			}
			url = "https://www.omdbapi.com/?t="+input+"&y=&plot=short&apikey=trilogy"
			sendQuery(url,3,flag)
		break;
		case "do-what-it-says":
			timestamp = getDates();
			writeFile("LOG TIME STARTS: "+timestamp+"\n\n")
			writeFile("COMMAND: "+command+"\n")
			var content = fs.readFileSync("random.txt", 'utf-8');
			var cArr = content.split("\n")
			for (var n = 0; n < cArr.length-1; n++) {
				console.log("\n"+command+" : "+cArr[n])	
				command = cArr[n].split(",")[0]
				input = cArr[n].split(",")[1]
				writeFile("INPUT: "+command+" : "+input+"\n\n");			
				baseCommand(1)
			}
		break;
	}

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : sendQuery 
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 03, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 05, 2019 PST
 #  REVISION #    : 2
 #  DESCRIPTION   : sends url to collect data
 #  PARAMETERS    : url,flag,flag2
 #
 #######################################################################
*/

function sendQuery(url,flag,flag2) {

	switch (flag) {
		case 1: case 3:
			req.get(url)
			.then(function (response) {
				if (response.data == "" || response.data.length == 0 || response.data.Response == "False") {
					console.log("\n\nNo available data at this moment.\n\n")
				} else {
					switch (flag) {
						case 1:			
							if (!flag2) {				
								timestamp = getDates();
								writeFile("LOG TIME STARTS: "+timestamp+"\n\n")
								writeFile("COMMAND: "+command+"\n")
								writeFile("INPUT: "+input+"\n\n") 
							} 
							printConcertDetails(response.data);
						break;
						case 3: 	
							if (!flag2) {						
								timestamp = getDates();
								writeFile("LOG TIME STARTS: "+timestamp+"\n\n")
								writeFile("COMMAND: "+command+"\n")
								writeFile("INPUT: "+input+"\n\n")
							} 
							printMovieDetails(response.data);
						break
					}
				  }
			})
			.catch(function (error) {
			    console.log("\n\nERROR: "+error+"\n\n");
			});
		break;
		case 2:
			spotify.search({ type: 'track', query: input}, function(err, data) {
	  			if (err) {
	    			return console.log('\n\nError occurred: ' + err+"\n\n");
	  			}	 
	  			var data = JSON.parse(JSON.stringify(data))
				items = data.tracks.items
				if (items.length == 0) {
					console.log("\n\nNo available data at this moment.\n\n")
					return
				}	
				if (!flag2) {						
					timestamp = getDates();

					writeFile("LOG TIME STARTS: "+timestamp+"\n\n")
					writeFile("COMMAND: "+command+"\n")
					writeFile("INPUT: "+input+"\n\n")
				}
				spotifyThisSong(items); 
				//writeFile(JSON.stringify(data,null,2))
			});	
		break;	
	}

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : printConcertDetails
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 03, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 05, 2019 PST
 #  REVISION #    : 2 
 #  DESCRIPTION   : prints concert information for selected artists
 #  PARAMETERS    : json data
 #
 #######################################################################
*/

function printConcertDetails(data) {

	console.log("\nCONCERT EVENTS FOR "+input.toUpperCase()+"\n\n")
	writeFile("CONCERT EVENTS FOR "+input.toUpperCase()+"\n\n")

	for (var i = 0; i < data.length; i++) {
		console.log("VENUE NAME  :  "+data[i].venue.name)
		writeFile("VENUE NAME  :  "+data[i].venue.name+"\n")
		if (data[i].venue.region == "" || data[i].venue.region == " ") {
			console.log("LOCATION    :  "+data[i].venue.city+", "+data[i].venue.country)
			writeFile("LOCATION    :  "+data[i].venue.city+", "+data[i].venue.country+"\n")
		} else {
			console.log("LOCATION    :  "+data[i].venue.city+", "+data[i].venue.region+" "+data[i].venue.country)
			writeFile("LOCATION    :  "+data[i].venue.city+", "+data[i].venue.region+" "+data[i].venue.country+"\n")
		  }
		console.log("DATE        :  "+moment.utc(data[i].datetime).format('MM/DD/YYYY')+"\n")
		writeFile("DATE        :  "+moment.utc(data[i].datetime).format('MM/DD/YYYY')+"\n\n")
	}

	timestamp = getDates();
	writeFile("LOG TIME ENDS: "+timestamp+"\n\n")

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : spotifyThisSong
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 03, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 05, 2019 PST
 #  REVISION #    : 2
 #  DESCRIPTION   : prints out the track information into a human readable format
 #  PARAMETERS    : json data
 #
 #######################################################################
*/

function spotifyThisSong(items) {

	console.log("\nTRACK INFORMATION FOR "+input.toUpperCase()+"\n\n")
	writeFile("TRACK INFORMATION FOR "+input.toUpperCase()+"\n\n")

	for (var i = 0; i < items.length; i++) {
		console.log("SONG NAME     :  "+items[i].name)
		writeFile("SONG NAME     :  "+items[i].name+"\n")
		console.log("ARTIST        :  "+items[i].artists[0].name)
		writeFile("ARTIST        :  "+items[i].artists[0].name+"\n")
		console.log("ALBUM         :  "+items[i].album.name)
		writeFile("ALBUM         :  "+items[i].album.name+"\n")
		if (items[i].preview_url == null || items[i].preview_url == "") {
			console.log("PREVIEW LINK  :  No available preview\n")
			writeFile("PREVIEW LINK  :  No available preview\n\n")
		} else {
			console.log("PREVIEW LINK  :  "+items[i].preview_url+"\n")
			writeFile("PREVIEW LINK  :  "+items[i].preview_url+"\n\n")
		  }
	}

	timestamp = getDates();
	writeFile("LOG TIME ENDS: "+timestamp+"\n\n")

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : printMovieDetails
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 03, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 05, 2019 PST
 #  REVISION #    : 2
 #  DESCRIPTION   : prints movie information
 #  PARAMETERS    : json data
 #
 #######################################################################
*/

function printMovieDetails(data) {

    console.log("\nTitle\t\t: "+data.Title)
    writeFile("Title\t\t: "+data.Title+"\n")
    console.log("Released Year\t: "+data.Year)
    writeFile("Released Year\t: "+data.Year+"\n")
    console.log("Ratings:")
    writeFile("Ratings:\n")
    for (var m = 0; m < data.Ratings.length; m++) {
    	if (data.Ratings[m].Source == "Internet Movie Database" || data.Ratings[m].Source == "Rotten Tomatoes") {
    		console.log("\t"+data.Ratings[m].Source+" : "+data.Ratings[m].Value)
    		writeFile("\t"+data.Ratings[m].Source+" : "+data.Ratings[m].Value+"\n")
    	}
    }
    console.log("Country\t\t: "+data.Country)
    writeFile("Country\t\t: "+data.Country+"\n")
    console.log("Language\t: "+data.Language)
    writeFile("Language\t: "+data.Language+"\n")
    console.log("Actors\t\t: "+data.Actors)
    writeFile("Actors\t\t: "+data.Actors+"\n")
    console.log("Plot\t\t: "+data.Plot+"\n")
    writeFile("Plot\t\t: "+data.Plot+"\n\n")

    timestamp = getDates();
	writeFile("LOG TIME ENDS: "+timestamp+"\n\n")
}

/*
 #######################################################################
 #
 #  FUNCTION NAME : getDates
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 04, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : returns a human readable format of date and time for the logs
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function getDates() {

	var d = new Date()
	var mm = d.getMonth()+1
	var dd = d.getDate()
	var hh = d.getHours()
	var mins = d.getMinutes()
	var ss = d.getSeconds()
	if (mm < 10)
		mm = "0"+mm
	if (dd < 10)
		dd = "0"+dd
	if (hh < 10)
		hh = "0"+hh
	if (mins < 10)
		mins = "0"+mins
	if (ss < 10)
		ss = "0"+ss
	return mm+"-"+dd+"-"+d.getFullYear()+" "+hh+":"+mins+":"+ss

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : writeFile
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 04, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 05, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : writes data to a file
 #  PARAMETERS    : string
 #
 #######################################################################
*/

function writeFile(data) {

	if(!fs.existsSync("log.txt")) {
		//console.log("\n\nFile not found. Creating log.txt.\n\n");

		fs.writeFileSync("./log.txt",data)
		// if(fs.existsSync("bank.txt")) {
		// 	console.log("File created!\n\n");
		// }

	} else {

		fs.appendFileSync("./log.txt",data)

	  }

}
