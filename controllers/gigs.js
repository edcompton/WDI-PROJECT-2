const Gig = require('../models/gig');

function gigsIndex(req, res) {
  Gig.find({}, (err, gigs) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ gigs: gigs });
  });
}

module.exports = {
  index: gigsIndex
};
