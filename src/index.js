var Alexa = require('alexa-sdk');

const APP_ID = "amzn1.echo-sdk-ams.app.APP_ID";  // TODO replace with your app ID (OPTIONAL).
const skillName = "Netflix Browser";
const getContent = function(url) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    })
};
const bestMovie = function(arr, prop) {
    var max;
    for (var i=0 ; i < arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
};

const handlers = {
    "NetflixBrowserIntent": function () {

        var speechOutput = "";
        if(this.event.request.intent.slots.Actor.value.length > 0 ) {
            var that = this;
            //console.log(this.event.request.intent.slots.Actor.value);
            var url = 'http://www.netflixroulette.net/api/api.php?actor=' + this.event.request.intent.slots.Actor.value;
            console.log(url);
            speechContent = getContent(url)
                .then(function(html) {
                    //console.log(html); 
                    var movieData = JSON.parse(html);
                    if (movieData.length > 0)
                    {
                        var sum = 0; 
                        for(var i = 0; i < movieData.length; i++ ) {
                            sum += parseInt(movieData[i].rating, 10); //don't forget to add the base }
                        }
                        var bestMovieForActor = bestMovie(movieData, "rating");
                        //console.log(bestMovieForActor.show_title);
                        var avg = sum/movieData.length;
                        avg = Math.round(avg * 100) / 100
                        speechOutput = "Netflix is showing " + movieData.length + " movies with an average rating " 
                                        + avg + " acted by " 
                                        + that.event.request.intent.slots.Actor.value 
                                        + ". Recommend checking out " + bestMovieForActor.show_title; 
                    }
                    
                    that.emit(':tellWithCard', speechOutput, skillName, speechOutput);})
                .catch(function(err) { 
                    console.error(err);
                    speechOutput = "Sorry we could not find any movies with that actor. Please try a different actor";
                    that.emit(':tellWithCard', speechOutput, skillName, speechOutput);
                });
        } else {
            speechOutput = "I don't have anything interesting to share regarding what you've asked.";
            this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
        }
   },
 
    "AboutIntent": function () {
        var speechOutput = "The Netflix Browser is developed by Amogh Consultants Inc.";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },
 
    "AMAZON.HelpIntent": function () {
        var speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "Does Netflix Play Akshay Kumar movies. ";
        speechOutput += "Tell me about the skill developer. ";
        speechOutput += "You can also say stop if you're done. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },
 
    "AMAZON.StopIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
 
    "AMAZON.CancelIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
 
    "LaunchRequest": function () {
        var speechText = "";
        speechText += "Welcome to " + skillName + ".  ";
        speechText += "You can browse Netflix content by your favorite Actors.  ";
        var repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);
    }
 
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};