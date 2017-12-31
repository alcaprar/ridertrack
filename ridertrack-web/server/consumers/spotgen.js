var request = require('superagent');
var url = require('url');
var async = require('async');

var Event = require('../models/event');
var Positions = require('../models/positions');

var consumer = {
    /**
     * Starts the consumer for spot gen 3.
     * It starts an interval that scrapes data every 5 minutes.
     * Every time it also checks the status of the event, scraping only for ongoing event.
     * It gets the positions from spot gen feed and checks if they are already stored.
     *
     * Inspired here https://github.com/grantfowler/node-spot-map/blob/master/controllers/maps.js
     * @param enrollment
     */
    start: function (enrollment) {
        var eventId = enrollment.eventId;
        var userId = enrollment.userId;

        var scrapingInterval = null;

        // every 5 minutes try to get data.
        // first check if the event is still ongoing.
        // if is finished clear the timeout
        scrapingInterval = setInterval(function () {
            Event.findEventById(eventId, function (err, event) {
                if(err){
                    console.log('[Consumer][Spotgen][Check event status] error:', err)
                }else{
                    // event found, check the status
                    if(event.status === 'ongoing'){
                        // the event is still ongoing
                        // get data from spot api
                        // id of the feed to scrape
                        var spotFeedId = enrollment.device.deviceId;
                        // base url of spot gen api
                        var spotBaseUrl = {
                            protocol: 'https',
                            host: 'api.findmespot.com',
                            pathname: '/spot-main-web/consumer/rest-api/2.0/public/feed/' + spotFeedId + '/message.json'
                        };

                        // get data from spot api
                        request
                            .get(url.format(spotBaseUrl))
                            .end(function(res) {
                                if (res.ok) {
                                    var result = res.body;

                                    if(result.response.errors){
                                        // the feed returned an error
                                        console.log('[Consumer][Spotgen][Get data from api] error: ', result.response.errors)
                                    }else{
                                        // the feed returned some data
                                        var spotPoints = result.response.feedMessageResponse.messages.message;

                                        if(spotPoints.length > 0){
                                            // there are some positions in the feed
                                            // check if they are already in the db

                                            // get last user positions
                                            Positions.getPositionsOfUser(userId, function (err, userPositions) {
                                                if(err){
                                                    console.log('[Consumer][Spotgen][get last position] error: ', err);

                                                    // try to add the position without checking against the previous ones
                                                }else{
                                                    // check if there is a lastPosition and if the one received is already stored
                                                    console.log('[Consumer][Spotgen][check last positions] Spot unixTime: ', spotPoints[spotPoints.length - 1].unixTime, 'Last position timestamp: ', userPositions.lastPosition.timestamp);
                                                    if(userPositions.lastPosition && spotPoints[spotPoints.length - 1].unixTime == userPositions.lastPosition.timestamp) {
                                                        //no new points
                                                        console.log("[Consumer][Spotgen][check last positions]  last points are equal; do nothing.");
                                                    }else{
                                                        //list of timestamps of all the positions
                                                        var usersPositionsTimestamps = [];
                                                        for(let i = 0; i < userPositions.positions.length; i++){
                                                            usersPositionsTimestamps.push(userPositions.positions[i].timestamp)
                                                        }

                                                        // try to store each point in the feed
                                                        async.each(spotPoints, function (point, callback) {
                                                            if(usersPositionsTimestamps.indexOf(point.unixTime) > -1){
                                                                // position exists. do nothing
                                                            }else{
                                                                var positionToAdd = {
                                                                    lat: point.latitude,
                                                                    lng: point.longitude,
                                                                    timestamp: point.unixTime
                                                                };
                                                                Positions.add(eventId, userId, positionToAdd, function (err) {
                                                                    if(err){
                                                                        console.log('[Consumer][Spotgen][store point] error: ', err)
                                                                    }
                                                                    // call the async callback
                                                                    callback()
                                                                })
                                                            }
                                                        }, function (err) {
                                                            if(err){
                                                                console.log('[Consumer][Spotgen][store points] error: ', err)
                                                            }else{
                                                                console.log('[Consumer][Spotgen][store points] finished to store points.')
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }else{
                                            // there are no points in the feed
                                            console.log('[Consumer][Spotgen][Iterate points] error: no points found in the feed.')
                                        }
                                    }
                                }
                            });
                    }else{
                        // the event has finished
                        // stop the timeout
                        clearInterval(scrapingInterval)
                    }
                }
            })
        }, 5 * 60 * 1000);

    }
};

module.exports = consumer;
