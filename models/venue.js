const mongoose  = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  gigs: {type: Array },
  postcode: {type: String },
  lat: {type: String },
  lng: {type: String },
  ticketmasterId: { type: String },
  marketId: {type: String}
});

module.exports = mongoose.model('Venue', venueSchema);
