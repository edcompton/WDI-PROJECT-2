const Venue = require('../models/venue');

function venuesIndex(req, res) {
  Venue.find({}, (err, venues) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ venues: venues });
  });
}

// function venuesShow(req, res) {
//   Venue.findById(req.params.id).forEach()
// }
//
// function userShow(req, res) {
//   User.findById(req.params.id).populate(['projects']).exec((err, user) => {
//     if (err) return res.status(500).json({ message: err});
//     if (!user) return res.status(500).json({ message: 'no user to show'});
//     return res.status(201).json(user);
//   });
// }

module.exports = {
  index: venuesIndex
};
