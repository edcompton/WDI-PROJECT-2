const mongoose  = require('mongoose');
const Venue     = require('../models/venue');
const config    = require('../config/config');
const rp        = require('request-promise');
const Gig       = require('../models/gig');

mongoose.connect(config.db);

//  London marketId=202
//  LA marketId=27
//  NY marketId=35

const options = {
  uri: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&radius=10000&marketId=27&size=500&classificationName=Music',
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
};

// function saveGigs(obj) {
//   var gig = obj;
//   var count = 0;
//   gig.forEach(function(gig, index, gigs) {
//     Gig.create({
//       name: gig.name,
//       image: gig.images[0].url,
//       date: gig.dates.start.localDate,
//       venuename: gig._embedded.venues[0].name
//     }, function() {
//       count++;
//       console.log('Gig ' + count + ' was saved');
//       if (count === gigs) return process.exit();
//     });
//   });
// }

// function populateGigs() {
//   Gig.collection.drop();
//   rp(options)
//   .then(function(string) {
//     var obj = string._embedded.events;
//     saveGigs(obj);
//   });
// }

function saveVenues(obj) {
  var venue = obj.events;
  var count = 0;
  venue.forEach(function(venue, index, venues) {
    if (venue._embedded.venues[0].location) {
      Venue.create({
        name: venue._embedded.venues[0].name,
        gigs: [],
        postcode: venue._embedded.venues[0].postalCode,
        lat: venue._embedded.venues[0].location.latitude,
        lng: venue._embedded.venues[0].location.longitude,
        ticketmasterId: venue._embedded.venues[0].id,
        marketId: venue._embedded.venues[0].markets[0].id
      }, function() {
        count++;
        console.log('Venue ' + count + ' was saved');
        if (count === venues) return process.exit();
      });
    } else {
      Venue.create({
        name: venue._embedded.venues[0].name,
        gigs: [],
        postcode: venue._embedded.venues[0].postalCode,
        ticketmasterId: venue._embedded.venues[0].id,
        marketId: venue._embedded.venues[0].markets[0].id
      }, function() {
        console.log(venue._embedded.venues[0].name + ' is fucked');
        count++;
        console.log('Venue ' + count + ' was saved');
        if (count === venues.length) return process.exit();
      });
    }
  });
}

// LONDON VENUES DATABASE FUNCTION
// function saveVenues(obj) {
//   var venue = obj.events;
//   var count = 0;
//   venue.forEach(function(venue, index, venues) {
//     if (venue._embedded.venues[0].location) {
//       if (venue._embedded.venues[0].markets[0].id === '202') {
//         Venue.create({
//           name: venue._embedded.venues[0].name,
//           gigs: [],
//           postcode: venue._embedded.venues[0].postalCode,
//           lat: venue._embedded.venues[0].location.latitude,
//           lng: venue._embedded.venues[0].location.longitude,
//           ticketmasterId: venue._embedded.venues[0].id,
//           marketId: venue._embedded.venues[0].markets[0].id
//         }, function() {
//           count++;
//           console.log('Venue ' + count + ' was saved');
//           if (count === venues) return process.exit();
//         });
//       } else {
//         Venue.create({
//           name: venue._embedded.venues[0].name,
//           gigs: [],
//           postcode: venue._embedded.venues[0].postalCode,
//           lat: venue._embedded.venues[0].location.latitude,
//           lng: venue._embedded.venues[0].location.longitude,
//           ticketmasterId: venue._embedded.venues[0].id,
//           marketId: venue._embedded.venues[0].markets[1].id
//         }, function() {
//           count++;
//           console.log('Venue ' + count + ' was saved');
//           if (count === venues) return process.exit();
//         });
//       }
//     } else {
//       Venue.create({
//         name: venue._embedded.venues[0].name,
//         gigs: [],
//         postcode: venue._embedded.venues[0].postalCode,
//         ticketmasterId: venue._embedded.venues[0].id,
//         marketId: venue._embedded.venues[0].markets[0].id
//       }, function() {
//         console.log(venue._embedded.venues[0].name + ' is fucked');
//         count++;
//         console.log('Venue ' + count + ' was saved');
//         if (count === venues.length) return process.exit();
//       });
//     }
//   });
// }

function getVenues() {
  // Venue.collection.drop();
  rp(options)
  .then(function(string) {
    var obj = string._embedded;
    saveVenues(obj);
  });
}

getVenues();

// populateGigs();



// name: { type: String, required: true, unique: true},
// gigs: { type: Array },
// postcode: {type: String },
// lat: {type: String},
// lng: {type: String }


// function saveVenues(obj) {
//   var venue = obj.events;
//   var count = 0;
//   venue.forEach(function(venue, index, venues) {
//     // Gig.find({ venuename: venue._embedded.venues[0].name }, (err, data) =>
//     // console.log(data.forEach(function (value, index) {
//     //   console.log(value);
//     // })));
//     if (venue._embedded.venues[0].location) {
//       Venue.create({
//         name: venue._embedded.venues[0].name,
//         gigs: Gig.find({ venuename: venue._embedded.venues[0].name }, (err, data) => {
//           data.forEach(function (value, index) {
//           return value;
//         });}),
//         postcode: venue._embedded.venues[0].postalCode,
//         lat: venue._embedded.venues[0].location.latitude,
//         lng: venue._embedded.venues[0].location.longitude
//       }, function() {
//         count++;
//         console.log('Venue ' + count + ' was saved');
//         if (count === venues) return process.exit();
//       });
//     } else {
//       Venue.create({
//         name: venue._embedded.venues[0].name,
//         gigs: Gig.find({ venuename: venue._embedded.venues[0].name }, (err, data) => {
//           data.forEach(function (value, index) {
//           return value;
//         });}),
//         postcode: venue._embedded.venues[0].postalCode
//       }, function() {
//         console.log(venue._embedded.venues[0].name + ' is fucked');
//         count++;
//         console.log('Venue ' + count + ' was saved');
//         if (count === venues.length) return process.exit();
//       });
//     }
//   });
//
// }
