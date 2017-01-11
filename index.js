//1. Install all the relevant packages and require them

//2. Build a model that takes in the criteria our database is looking for

//3. Get the the point that a map is rendered on the page

//4. Build a seed file that incorporates all of the Ticketmaster data into a database of venues

//5. Generate dummy data and populate the panel for each marker on click

//6. Return the gig data and create a loop that looks through each of the venue IDs and returns gigs for each venue based on the venue ID from the gig search matching an ID in the database. WILL HAVE TO BE A GIG ARRAY FOR THE GIG ENTRY

//7. Populate the gigs for the venues on a button click so it's not done on page refresh...could lead to issues with call limits?

//8.

const express       = require('express');
const morgan        = require('morgan');
const app           = express();
const mongoose      = require('mongoose');
const cors          = require('cors');
const config        = require('./config/config');
const bodyParser    = require('body-parser');
const router        = require('./config/routes');

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(config.db);

app.use('/api', router);
app.use('/', router);

app.listen(config.port, console.log(`listening on port ${config.port}`));
