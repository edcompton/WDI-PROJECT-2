<img src="https://cloud.githubusercontent.com/assets/20629455/23824362/2c9817c2-066d-11e7-8988-7b1eefc6d628.jpg"> <img src="https://cloud.githubusercontent.com/assets/20629455/23824363/2ddeaa7e-066d-11e7-8630-f7c890c9f1c1.png"> 


<h1>WDI Project 2: <a style="text-decoration:none;" href="https://wdi-gigfinder.herokuapp.com/">Gigfinder</h1></a>

This web app was built for my second project whilst enrolled on the Web Development Immersive course at General Assembly. 

##Brief

We were challenged to use an external Web API merged with the Google Maps JavaScript API to create a map based Single Page Application.

As an MVP, the app needed to:

- Be served by our own Express.js web server.

- Create a Web API linked via Mongoose to a MongoDB database.

- Plot the data gained from the external Web API of our choice onto a Google map via the Google Maps API's markers.

##Local Setup

Clone or download the repository and navigate to it's root in terminal.
run npm i, mongod, node db/seeds.js and gulp.
Navigate to http://localhost:7000.

##Technologies Used

#####Back-end

Node.js, Express.js, Mongoose, MongoDB, Google Maps JavaScript API, Spotify API, Ticketmaster API, gulp.js.

#####Front-end

JavaScript, jQuery, HTML, CSS, SCSS.


##Overview

As an avid live music fan I've often thought it would be useful to have the location of each venue mapped out, so that it would be easy to see the closest gigs to your area. I therefore decided that as an MVP for the project I should aim to populate a map of London with the location of all mainstream and quirky music venues. 

As this would be a relatively quick task with the right data I decided to include a list of all upcoming gigs for each venue when clicked.

I expanded this idea during the final days of the project, adding spotify for each artist's touring album and a method for buying tickets to the gigs.

##Mechanics
###Landing page of the website


In order to populate the map with gig venues, I seeded a static list of venue locations from the ticketmaster API, on the basis that these were unlikely to change on a frequent basis. On opening the app the page then loads these seeded venues to the map, for one of London, LA or New York depending on your location.


<img src="/Users/edmundcompton/Desktop/Screen Shot 2017-05-02 at 10.42.19.png">


###Info Window showing upcoming gigs
When a venue is selected, a front end ajax request is made to the ticketmaster API in order to populate all upcoming gigs for that venue over the next 3 months, displaying these within a customised info window.

<img src="/Users/edmundcompton/Desktop/Screen Shot 2017-05-02 at 10.47.39.png">


###Sliding spotify sidebar with the latest album from the artist

When one of these gigs is selected, another front end ajax request is made to the spotify API, passing in the name of the artist to receive back their most recent album, on the basis that over 50% of the time this will be the album they are touring with, allowing the user to listen to the music that is most likely to be played at the gig. 

<img src="/Users/edmundcompton/Desktop/Screen Shot 2017-05-02 at 10.47.46.png">


###Modal to display additional artist info and open new window for ticket purchases

When 'gig information' is selected from the left hand sidebar, another front end ajax request is made to the Ticketmaster and Spotify APIs, in order to populate the gig information modal that overlays the screen. The user can then see related artists, click through to the artist's spotify page, or navigate to the ticketmaster page to buy tickets to the event.  

<img src="/Users/edmundcompton/Desktop/Screen Shot 2017-05-02 at 10.47.54.png">


###Search by artist to display global tour

The user can input an artist into the search bar at the top right of the screen to check for any upcoming gigs an artist may be playing. On search, another ajax request will be made to the Ticketmaster API to populate the world map with any gigs for an upcoming artist, allowing the user to see the world tour for that artist. If there are no upcoming gigs for an artist, an animation will trigger to the left of the search bar to let the user know this. 

<img src="/Users/edmundcompton/Desktop/Screen Shot 2017-05-02 at 11.06.44.png">


###Use the City and Genere selectors to check out upcoming gigs in New York, LA and London

Finally, the user can choose their city and genre from the selectors on the navigation bar at the top of the screen. This will then populate the map with any upcoming gigs for London, LA, or New York for the genre selected by the user. Leaving the right hand selector on 'genre' will search all musical genres for that city.

<img src="/Users/edmundcompton/Desktop/Screen Shot 2017-05-02 at 11.11.02.png">

##Challenges

The main challenge I encountered was how to pass information between APIs during asynchronous ajax requests. When building this project I had limited experience of how asynchronosity worked in javascript, meaning that I was often left with undefined variables or additional ajax requests receiving no data back from an API.

By making my app object orientated I managed to assign anything I needed to a key of the global app object, making it accessable later in the process.

##Wins

Getting each venue to populate the upcoming gigs dynamically based on the information I received back from the ticketmaster API was a massive win. Getting my head around this method allowed me to then use similar requests for my sidebar and modals.

Additionally, making the data received from the ticketmaster API compatible with the GET request I was making to spotify's API for the album was a particular highlight.

##Additional features to implement

1. Integrate other APIs, such as Songkick, into the app. Ticketmaster has a great API, but at the moment the app is limited only to events listed by Ticketmaster. Inherently these are ticketed events at a cost to the user; it would be great to be able to display free gigs and festivals within the app in addition to these.

2. Find a way of dynamically adding cities to the selector on the navbar at the top of the page.

3. Add OAuth2 into the app itself - at the moment the user is redirected to spotify's authorisation page; it would be great to be able to do this in app, as I have in later projects.