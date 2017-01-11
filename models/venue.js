const mongoose  = require('mongoose');

const venueSchema = new mongoose.Schema({
  venue: { type: String, required: true, unique: true},
  gigs: { type: Array },
  postcode: {type: String },
  lat: {type: String},
  lng: {type: String }
});
