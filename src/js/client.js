const googleMap = googleMap || {};
const google = google;

googleMap.addInfoWindowForVenue = function(venue, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    $.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId=${ venue.ticketmasterId }&size=20&classificationName=Music`).done((data) => {
      $(data._embedded.events).each((index, gig) => {
        // console.log(gig.name);
        var contentstring = `<h3>${gig.name}</h3>`;
        // var gigImage = $('<img src="">').attr('src').html(gig.images[0].url);
        // var contentstring = $(`<h1>${ venue.name }</h1>`).html();
        // $(contentstring).append(gigName);
        // console.log(gigName);
        if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
        this.infoWindow = new google.maps.InfoWindow({
          content: contentstring
        });
        this.infoWindow.open(this.map, marker);
        this.map.setCenter(marker.getPosition());
      });
    });
    // this.map.setZoom(15);
  });
};

// googleMap.populateGigs = function(venue, gigs) {
//   console.log(venue, gigs);
// };

// googleMap.getGigs = function(venue) {
//   $.get('http://localhost:3000/gigs', function(data, success, venue) {
//     console.log(data);
//     console.log(venue);
//   });
// };

googleMap.createMarkerForVenue = function(venue) {
  const latlng = new google.maps.LatLng(venue.lat, venue.lng);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    animation: google.maps.Animation.DROP
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


googleMap.getGigs = function() {
  var result;
  $.ajax({
    url: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId=KovZ9177rr7&size=20',
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
      result = data;
    }
  });
  return result;
};

googleMap.getVenues = function() {
  $.get('http://localhost:3000/venues').done(this.populateVenues);
};

googleMap.mapSetup = function() {
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
  this.getVenues();
};

$(googleMap.mapSetup.bind(googleMap));
