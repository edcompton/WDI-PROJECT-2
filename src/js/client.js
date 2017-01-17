const googleMap = googleMap || {};
const google = google;
googleMap.markersArray = [];
googleMap.latlngArray  = [];
googleMap.relatedArtists = [];
googleMap.relatedArtistsUrl = [];

googleMap.refocusMap = function() {
  var latlngbounds = new google.maps.LatLngBounds();
  console.log(googleMap.latlngArray);
  googleMap.latlngArray.forEach(function(latlng){
    latlngbounds.extend(latlng);
  });
  this.map.setCenter(latlngbounds.getCenter());
  this.map.fitBounds(latlngbounds);
};

googleMap.searchArtistGigs = function(e) {
  e.preventDefault();
  var search = ($('.searchInput').val());
  $.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&keyword=${search}`).done((data) => {
    if (data._embedded === undefined) {
      googleMap.noArtistText();
    } else {
      googleMap.clearOverlays();
      $(data._embedded.events).each((index, gig) => {
        const venues = (gig._embedded.venues[0].location);
        googleMap.newSearchMarkers(venues, gig);
        setTimeout(() => {
          googleMap.refocusMap();
        }, 1000);
      });
    }
  });
};

googleMap.noArtistText = function() {
  $('.missingArtist').show().fadeOut(1000);
};

googleMap.newSearchMarkers = function(venue, gig) {
  var pinIcon = new google.maps.MarkerImage(
    'http://icons.iconarchive.com/icons/martz90/circle/512/mic-icon.png',
    null,
    null,
    null,
    new google.maps.Size(25, 25)
  );
  const latlng = new google.maps.LatLng(venue.latitude, venue.longitude);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    animation: google.maps.Animation.DROP,
    icon: pinIcon
  });
  googleMap.latlngArray.push(latlng);
  googleMap.markersArray.push(marker);
  googleMap.addInfoWindowForSearchMarkers(gig, marker);
};

googleMap.addInfoWindowForSearchMarkers = function(gig, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    var contentString = '';
    contentString += `<div><h3>${gig._embedded.venues[0].name}</h3>`;
    var gigName = gig.name;
    if (gigName.indexOf('-') > -1) {
      gigName.split('-');
      gigName = gigName.substring(0, gigName.indexOf('-'));
    }
    if (gigName.indexOf(':') > -1) {
      gigName.split(':');
      gigName = gigName.substring(0, gigName.indexOf(':'));
    }
    if (gigName.indexOf(',') > -1) {
      gigName.split(',');
      gigName = gigName.substring(0, gigName.indexOf(','));
    }
    if (gigName.indexOf('presents') > -1) {
      gigName.split('presents');
      gigName = gigName.substring(0, gigName.indexOf('presents'));
    }
    contentString += `<a class="modalWindow"><h5 class="infoWindowContent" id=${gig.url}>${gigName}</h5></a><p style="color: #fff;" >${gig.dates.start.localDate}</p></div>`;
    if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: contentString,
      pixelOffset: new google.maps.Size(0, 20)
    });
    this.infoWindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
    return gig.name;
  });
};

googleMap.clearArtistArray = function() {
  googleMap.relatedArtists = [];
  googleMap.relatedArtistsUrl = [];
};

googleMap.noSpotifyInfoWindow = function() {
  $('.modal-content').html(`
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h3 class="modal-title">${googleMap.artist}</h3>
    </div>
    <div class="modal-body">

    <h5>Ticketmaster Event Page</h5>
    <a href=${googleMap.ticketmasterUrl} target="_blank" style="color: #fff;">${googleMap.ticketmasterUrl}</a>
    </div>
    <div class="modal-footer">

    </div>
    </form>`
  );
  $('.modal').modal('show');
};

googleMap.gigInfoWindow = function() {
  let relatedArtists = '';
  $(googleMap.relatedArtists).each((index, artist) => {
    if (index < 20) {
      relatedArtists += `<a href="${googleMap.relatedArtistsUrl[index]}" style="color: #fff;" target="_blank">${artist}</a>,  `;
    }
  });
  $('.modal-content').html(`
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h3 class="modal-title">${googleMap.artist}</h3>
    </div>
    <div class="modal-body">

    <div class="form-group">
    <img src="${googleMap.artistPicture1}" class="thumbnail artistPic">
    </div>

    <div class="form-group">
    <h5>Related Artists</h5>
    <p style="color: #fff;">${relatedArtists}</p>
    </div>

    <h5>Artist Spotify Page</h5>
    <a href=${googleMap.artistUrl} style="color: #fff;" target="_blank">${googleMap.artistUrl}</a>

    <h5>Ticketmaster Event Page</h5>
    <a href=${googleMap.ticketmasterUrl} style="color: #fff;" target="_blank">${googleMap.ticketmasterUrl}</a>
    </div>
    <div class="modal-footer">

    </div>
    </form>`
  );
  $('.modal').modal('show');
};

googleMap.clearOverlays = function() {
  for (var i = 0; i < googleMap.markersArray.length; i++ ) {
    googleMap.markersArray[i].setMap(null);
  }
  googleMap.markersArray.length = 0;
  // marker.setMap(null);
};


googleMap.searchArea = function(e) {
  e.preventDefault();
  googleMap.clearOverlays();
  googleMap.closeNav();
  $.get('http://localhost:3000/venues').done((data) => {
    $(data.venues).each((index, gig) => {
      setTimeout(() => {
        googleMap.createMarkerForNewVenues(gig);
      }, index * 50);
    });
  });
};

googleMap.createMarkerForNewVenues = function(venue) {
  var city = $('.cities').val();
  if (city === 'London') {
    city = '202';
    this.map.setCenter(new google.maps.LatLng(51.506178,-0.088369));
    this.map.setZoom(13);
  } else if (city === 'Los Angeles') {
    city = '27';
    this.map.setCenter(new google.maps.LatLng(33.929073, -118.049220));
    this.map.setZoom(10);
  } else if (city === 'New York') {
    city = '35';
    this.map.setCenter(new google.maps.LatLng(40.729074, -73.983468));
    this.map.setZoom(13);
  }
  if (venue.marketId === city) {
    var genre = $('.genres').val();
    if (genre === 'Genre') {
      genre = 'Music';
    }

    $.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId=${ venue.ticketmasterId }&size=20&classificationName=${ genre}`).done((data) => {
      if (data._embedded !== undefined) {
        var pinIcon = new google.maps.MarkerImage(
          'http://icons.iconarchive.com/icons/martz90/circle/512/mic-icon.png',
          null,
          null,
          null,
          new google.maps.Size(25, 25)
        );
        const latlng = new google.maps.LatLng(venue.lat, venue.lng);
        const marker = new google.maps.Marker({
          position: latlng,
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: pinIcon
        });
        googleMap.markersArray.push(marker);
        googleMap.addInfoWindowForNewVenue(venue, marker);
      }
    });
  }
};

googleMap.addInfoWindowForNewVenue = function(venue, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    var contentString = '';
    var genre = $('.genres').val();
    if (genre === 'Genre') {
      genre = 'Music';
    }
    contentString += `<h3>${venue.name}</h3>`;
    $.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId=${ venue.ticketmasterId }&size=20&classificationName=${genre}`).done((data) => {
      $(data._embedded.events).each((index, gig) => {
        var gigName = gig.name;
        if (gigName.indexOf('-') > -1) {
          gigName.split('-');
          gigName = gigName.substring(0, gigName.indexOf('-'));
        }
        if (gigName.indexOf(':') > -1) {
          gigName.split(':');
          gigName = gigName.substring(0, gigName.indexOf(':'));
        }
        if (gigName.indexOf(',') > -1) {
          gigName.split(',');
          gigName = gigName.substring(0, gigName.indexOf(','));
        }
        if (gigName.indexOf('presents') > -1) {
          gigName.split('presents');
          gigName = gigName.substring(0, gigName.indexOf('presents'));
        }
        contentString += `<div><a class="modalWindow" ><h5 class="infoWindowContent" id=${gig.url}>${gigName}</h5></a><p style="color: #fff;">${gig.dates.start.localDate}</p></div>`;
        if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
        this.infoWindow = new google.maps.InfoWindow({
          content: contentString
        });
        this.infoWindow.open(this.map, marker);
        this.map.setCenter(marker.getPosition());
        return gig.name;
      });
    });
  });
};

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Opening functions
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

googleMap.openNav = function(e) {
  if (document.getElementById('mySidenav') !== null) {
    $('#sideNavAll').remove();
  }
  var artist = ($(e.target).text());
  googleMap.ticketmasterUrl = ($(e.target).attr('id'));
  googleMap.artist = artist;
  $.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist`).done((data) => {
    if (data.artists.items[0] === undefined) {
      googleMap.noArtistText();
      googleMap.noSpotifyInfoWindow();
    }
    var artistId = data.artists.items[0].id;
    googleMap.artistPicture1 = data.artists.items[0].images[0].url;
    googleMap.artistUrl = data.artists.items[0].external_urls.spotify;
    $.get(`https://api.spotify.com/v1/artists/${artistId}/albums?country=GB`).done((data) => {
      var albumUri = data.items[0].uri;
      var contentString = `<div id="sideNavAll"> <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="googleMap.closeNav()">&times;</a>
      <a href="#" class="gigInfo" >Gig Information</a>
      <p>Spotify Tracks</p>
      <iframe src="https://embed.spotify.com/?uri=${albumUri}" width="300" height="630" frameborder="0" allowtransparency="true"></iframe>
      </div>
      <span onclick="openNav()"></span>
      </div>`;
      $('body').append(contentString);
      setTimeout(function(){
        document.getElementById('mySidenav').style.width = '300px';
      }, 100);
      $('.gigInfo').on('click', googleMap.gigInfoWindow);
      $.get(`https://api.spotify.com/v1/artists/${data.items[0].artists[0].id}/related-artists`).done((data) => {
        $(data.artists).each((index, gig) => {
          googleMap.relatedArtists.push(gig.name);
          googleMap.relatedArtistsUrl.push(gig.external_urls.spotify);
        });
      });
    });
  });
};

googleMap.closeNav = function() {
  $('#sideNavAll').remove();
  setTimeout(function() {
    document.getElementById('mySidenav').style.width = '0';
  });
};

googleMap.addInfoWindowForVenue = function(venue, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    var contentString = '';
    contentString += `<div><h3>${venue.name}</h3>`;
    $.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId=${ venue.ticketmasterId }&size=20&classificationName=Music`).done((data) => {
      $(data._embedded.events).each((index, gig) => {
        var gigName = gig.name;
        if (gigName.indexOf('-') > -1) {
          gigName.split('-');
          gigName = gigName.substring(0, gigName.indexOf('-'));
        }
        if (gigName.indexOf(':') > -1) {
          gigName.split(':');
          gigName = gigName.substring(0, gigName.indexOf(':'));
        }
        if (gigName.indexOf(',') > -1) {
          gigName.split(',');
          gigName = gigName.substring(0, gigName.indexOf(','));
        }
        if (gigName.indexOf('presents') > -1) {
          gigName.split('presents');
          gigName = gigName.substring(0, gigName.indexOf('presents'));
        }
        contentString += `<a class="modalWindow"><h5 class="infoWindowContent" id=${gig.url}>${gigName}</h5></a><p style="color: #fff;" >${gig.dates.start.localDate}</p></div>`;
        if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
        this.infoWindow = new google.maps.InfoWindow({
          content: contentString,
          pixelOffset: new google.maps.Size(0, 20)
        });
        this.infoWindow.open(this.map, marker);
        this.map.setCenter(marker.getPosition());
        return gig.name;
      });
    });
  });
};

googleMap.createMarkerForVenue = function(venue) {
  if (venue.marketId === '202') {
    var pinIcon = new google.maps.MarkerImage(
      'http://icons.iconarchive.com/icons/martz90/circle/512/mic-icon.png',
      null,
      null,
      null,
      new google.maps.Size(25, 25)
    );
    const latlng = new google.maps.LatLng(venue.lat, venue.lng);
    const marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: pinIcon
    });
    googleMap.markersArray.push(marker);
    google.maps.event.addListener(marker, 'click', function(){});
    googleMap.addInfoWindowForVenue(venue, marker);
  }
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
  $('body').on('click', '.gigInfo', googleMap.gigInfoWindow);
  $('body').on('click', '.close', googleMap.clearArtistArray);
  $('.gigSubmission').on('click', googleMap.searchArea);
  $('.searchSubmission').on('click', googleMap.searchArtistGigs);
  $('.missingArtist').hide();
  this.getVenues();
};


$(googleMap.mapSetup.bind(googleMap));
