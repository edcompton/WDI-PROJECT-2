const mongoose  = require('mongoose');

const gigSchema = new mongoose.Schema({
  name: { type: String, required: true},
  image: { type: String },
  date: { type: String },
  venuename: { type: String }
});

module.exports = mongoose.model('Gig', gigSchema);
