const Venue = require('../models/venue');

function venuesIndex(req, res) {
  Venue.find({}, (err, venues) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ venues: venues });
  });
}

module.exports = {
  index: venuesIndex
};
