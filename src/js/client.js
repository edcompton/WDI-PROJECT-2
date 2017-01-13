const googleMap = googleMap || {};
const google = google;

googleMap.openNav = function(e) {
  console.log(document.getElementById('mySidenav'));
  if (document.getElementById('mySidenav') !== null) {
    $('#sideNavAll').remove();
  }
  var artist = '';
  var artist = ($(e.target).text());
  console.log(artist);
  $.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist`).done((data) => {
    var artistId = '';
    var artistId = data.artists.items[0].id;
    console.log(artistId);
    $.get(`https://api.spotify.com/v1/artists/${artistId}/albums?country=GB`).done((data) => {
      console.log(data.items[0].uri);
      var albumUri = '';
      var albumUri = data.items[0].uri;
      console.log(albumUri);
      var contentString = '';
      var contentString = `<div id="sideNavAll"> <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="googleMap.closeNav()">&times;</a>
      <a href="#">Spotify Tracks</a>
      <iframe src="https://embed.spotify.com/?uri=${albumUri}" width="300" height="800" frameborder="0" allowtransparency="true"></iframe>
      </div>
      <span onclick="openNav()"></span>
      </div>`
      $('body').append(contentString);
      console.log(contentString);
      setTimeout(function(){
        document.getElementById('mySidenav').style.width = '300px';
      }, 100);
      console.log('clicked');
    });
  });
};

googleMap.closeNav = function() {
  $('#sideNavAll').empty();
  setTimeout(function() {
    document.getElementById('mySidenav').style.width = '0';
  });
};

googleMap.addInfoWindowForVenue = function(venue, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    var contentString = '';
    contentString += `<h4>${venue.name}</h4>`;
    $.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId=${ venue.ticketmasterId }&size=20&classificationName=Music`).done((data) => {
      $(data._embedded.events).each((index, gig) => {
        // console.log(gig);
        contentString += `<div><a class="modalWindow"><h6>${gig.name}</h6></a><p>${gig.dates.start.localDate}</p></div>`;
        if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
        this.infoWindow = new google.maps.InfoWindow({
          content: contentString
        });
        this.infoWindow.open(this.map, marker);
        this.map.setCenter(marker.getPosition());
        return gig.name;
      });

    });
    // this.map.setZoom(15);
  });
};



googleMap.createMarkerForVenue = function(venue) {
  var pinIcon = new google.maps.MarkerImage(
      'http://www.freeiconspng.com/uploads/microfono-microphone-icon-coloring-book-colouring-xanthochroi---2.png',
      null,
      null,
      null,
      new google.maps.Size(18, 28)
  );
  const latlng = new google.maps.LatLng(venue.lat, venue.lng);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    animation: google.maps.Animation.DROP,
    icon: pinIcon
  });
  googleMap.addInfoWindowForVenue(venue, marker);
};

googleMap.populateVenues = function(data) {
  $.each(data.venues, (index, venue) => {
    setTimeout(() => {
      googleMap.createMarkerForVenue(venue);
    }, index * 50);
  });
};

googleMap.getVenues = function() {
  $.get('http://localhost:3000/venues').done(this.populateVenues);
};

googleMap.mapSetup = function() {
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{'featureType': 'landscape.natural','elementType': 'geometry.fill','stylers': [{'visibility': 'on'},{'color': '#e0efef'}]},{'featureType': 'poi','elementType': 'geometry.fill','stylers': [{'visibility': 'on'},{'hue': '#1900ff'},{'color': '#c0e8e8'}]},{'featureType': 'road','elementType': 'geometry','stylers': [{'lightness': 100},{'visibility': 'simplified'}]},{'featureType': 'road','elementType': 'labels','stylers': [{'visibility': 'off'}]},{'featureType': 'transit.line','elementType': 'geometry','stylers': [{'visibility': 'on'},{'lightness': 700}]},{'featureType': 'water','elementType': 'all','stylers': [{'color': '#7dcdcd'}]}]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  $('body').on('click', '.modalWindow', googleMap.openNav);
  this.getVenues();
};


$(googleMap.mapSetup.bind(googleMap));
