"use strict";var googleMap=googleMap||{},google=google;googleMap.markersArray=[],googleMap.latlngArray=[],googleMap.relatedArtists=[],googleMap.relatedArtistsUrl=[],googleMap.refocusMap=function(){var e=new google.maps.LatLngBounds;console.log(googleMap.latlngArray),googleMap.latlngArray.forEach(function(o){e.extend(o)}),this.map.setCenter(e.getCenter()),this.map.fitBounds(e)},googleMap.searchArtistGigs=function(e){e.preventDefault();var o=$(".searchInput").val();$.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&keyword="+o).done(function(e){void 0===e._embedded?googleMap.noArtistText():(googleMap.clearOverlays(),$(e._embedded.events).each(function(e,o){var t=o._embedded.venues[0].location;googleMap.newSearchMarkers(t,o),setTimeout(function(){googleMap.refocusMap()},600)}))})},googleMap.noArtistText=function(){$(".missingArtist").show().fadeOut(1e3)},googleMap.newSearchMarkers=function(e,o){var t=new google.maps.LatLng(e.latitude,e.longitude),n=new google.maps.Marker({position:t,icon:{url:"../Images/newMicrophone.png",scaledSize:new google.maps.Size(30,30)},map:this.map,animation:google.maps.Animation.DROP});googleMap.latlngArray.push(t),googleMap.markersArray.push(n),googleMap.addInfoWindowForSearchMarkers(o,n)},googleMap.addInfoWindowForSearchMarkers=function(e,o){var t=this;google.maps.event.addListener(o,"click",function(){var n="";n+="<div><h3>"+e._embedded.venues[0].name+"</h3>";var a=e.name;return a.indexOf("-")>-1&&(a.split("-"),a=a.substring(0,a.indexOf("-"))),a.indexOf(":")>-1&&(a.split(":"),a=a.substring(0,a.indexOf(":"))),a.indexOf(",")>-1&&(a.split(","),a=a.substring(0,a.indexOf(","))),a.indexOf("presents")>-1&&(a.split("presents"),a=a.substring(0,a.indexOf("presents"))),n+='<a class="modalWindow"><h5 class="infoWindowContent" id='+e.url+">"+a+'</h5></a><p style="color: #fff;" >'+e.dates.start.localDate+"</p></div>","undefined"!=typeof t.infoWindow&&t.infoWindow.close(),t.infoWindow=new google.maps.InfoWindow({content:n,pixelOffset:new google.maps.Size(0,20)}),t.infoWindow.open(t.map,o),t.map.setCenter(o.getPosition()),e.name})},googleMap.clearArtistArray=function(){googleMap.relatedArtists=[],googleMap.relatedArtistsUrl=[]},googleMap.noSpotifyInfoWindow=function(){$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h3 class="modal-title">'+googleMap.artist+'</h3>\n    </div>\n    <div class="modal-body">\n\n    <h5>Ticketmaster Event Page</h5>\n    <a href='+googleMap.ticketmasterUrl+' target="_blank" style="color: #fff;">'+googleMap.ticketmasterUrl+'</a>\n    </div>\n    <div class="modal-footer">\n\n    </div>\n    </form>'),$(".modal").modal("show")},googleMap.gigInfoWindow=function(){var e="";$(googleMap.relatedArtists).each(function(o,t){o<20&&(e+='<a href="'+googleMap.relatedArtistsUrl[o]+'" style="color: #fff;" target="_blank">'+t+"</a>,  ")}),$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h3 class="modal-title">'+googleMap.artist+'</h3>\n    </div>\n    <div class="modal-body">\n\n    <div class="form-group">\n    <img src="'+googleMap.artistPicture1+'" class="thumbnail artistPic">\n    </div>\n\n    <div class="form-group">\n    <h5>Related Artists</h5>\n    <p style="color: #fff;">'+e+"</p>\n    </div>\n\n    <h5>Artist Spotify Page</h5>\n    <a href="+googleMap.artistUrl+' style="color: #fff;" target="_blank">'+googleMap.artistUrl+"</a>\n\n    <h5>Ticketmaster Event Page</h5>\n    <a href="+googleMap.ticketmasterUrl+' style="color: #fff;" target="_blank">'+googleMap.ticketmasterUrl+'</a>\n    </div>\n    <div class="modal-footer">\n\n    </div>\n    </form>'),$(".modal").modal("show")},googleMap.clearOverlays=function(){for(var e=0;e<googleMap.markersArray.length;e++)googleMap.markersArray[e].setMap(null);googleMap.markersArray.length=0},googleMap.searchArea=function(e){e.preventDefault(),googleMap.clearOverlays(),googleMap.closeNav(),$.get(window.location.origin+"/venues").done(function(e){$(e.venues).each(function(e,o){setTimeout(function(){googleMap.createMarkerForNewVenues(o)},50*e)})})},googleMap.createMarkerForNewVenues=function(e){var o=this,t=$(".cities").val();if("London"===t?(t="202",this.map.setCenter(new google.maps.LatLng(51.506178,(-.088369))),this.map.setZoom(13)):"Los Angeles"===t?(t="27",this.map.setCenter(new google.maps.LatLng(33.929073,(-118.04922))),this.map.setZoom(10)):"New York"===t&&(t="35",this.map.setCenter(new google.maps.LatLng(40.729074,(-73.983468))),this.map.setZoom(13)),e.marketId===t){var n=$(".genres").val();"Genre"===n&&(n="Music"),$.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId="+e.ticketmasterId+"&size=20&classificationName="+n).done(function(t){if(void 0!==t._embedded){var n=new google.maps.LatLng(e.lat,e.lng),a=new google.maps.Marker({position:n,icon:{url:"../Images/newMicrophone.png",scaledSize:new google.maps.Size(30,30)},map:o.map,animation:google.maps.Animation.DROP});googleMap.markersArray.push(a),googleMap.addInfoWindowForNewVenue(e,a)}})}},googleMap.addInfoWindowForNewVenue=function(e,o){var t=this;google.maps.event.addListener(o,"click",function(){var n="",a=$(".genres").val();"Genre"===a&&(a="Music"),n+="<h3>"+e.name+"</h3>",$.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId="+e.ticketmasterId+"&size=20&classificationName="+a).done(function(e){$(e._embedded.events).each(function(e,a){var s=a.name;return s.indexOf("-")>-1&&(s.split("-"),s=s.substring(0,s.indexOf("-"))),s.indexOf(":")>-1&&(s.split(":"),s=s.substring(0,s.indexOf(":"))),s.indexOf(",")>-1&&(s.split(","),s=s.substring(0,s.indexOf(","))),s.indexOf("presents")>-1&&(s.split("presents"),s=s.substring(0,s.indexOf("presents"))),n+='<div><a class="modalWindow" ><h5 class="infoWindowContent" id='+a.url+">"+s+'</h5></a><p style="color: #fff;">'+a.dates.start.localDate+"</p></div>","undefined"!=typeof t.infoWindow&&t.infoWindow.close(),t.infoWindow=new google.maps.InfoWindow({content:n}),t.infoWindow.open(t.map,o),t.map.setCenter(o.getPosition()),a.name})})})},googleMap.openNav=function(e){null!==document.getElementById("mySidenav")&&$("#sideNavAll").remove();var o=$(e.target).text();googleMap.ticketmasterUrl=$(e.target).attr("id"),googleMap.artist=o,$.get("https://api.spotify.com/v1/search?q="+o+"&type=artist").done(function(e){void 0===e.artists.items[0]&&(googleMap.noArtistText(),googleMap.noSpotifyInfoWindow());var o=e.artists.items[0].id;googleMap.artistPicture1=e.artists.items[0].images[0].url,googleMap.artistUrl=e.artists.items[0].external_urls.spotify,$.get("https://api.spotify.com/v1/artists/"+o+"/albums?country=GB").done(function(e){var o=e.items[0].uri,t='<div id="sideNavAll"> <div id="mySidenav" class="sidenav">\n      <a href="javascript:void(0)" class="closebtn" onclick="googleMap.closeNav()">&times;</a>\n      <a href="#" class="gigInfo" >Gig Information</a>\n      <p>Spotify Tracks</p>\n      <iframe src="https://embed.spotify.com/?uri='+o+'" width="300" height="630" frameborder="0" allowtransparency="true"></iframe>\n      </div>\n      <span onclick="openNav()"></span>\n      </div>';$("body").append(t),setTimeout(function(){document.getElementById("mySidenav").style.width="300px"},100),$(".gigInfo").on("click",googleMap.gigInfoWindow),$.get("https://api.spotify.com/v1/artists/"+e.items[0].artists[0].id+"/related-artists").done(function(e){$(e.artists).each(function(e,o){googleMap.relatedArtists.push(o.name),googleMap.relatedArtistsUrl.push(o.external_urls.spotify)})})})})},googleMap.closeNav=function(){$("#sideNavAll").remove(),setTimeout(function(){document.getElementById("mySidenav").style.width="0"})},googleMap.addInfoWindowForVenue=function(e,o){var t=this;google.maps.event.addListener(o,"click",function(){var n="";n+="<div><h3>"+e.name+"</h3>",$.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=S6Ne496thElaCfSl25nc9B3NkTEAk0o7&venueId="+e.ticketmasterId+"&size=20&classificationName=Music").done(function(e){$(e._embedded.events).each(function(e,a){var s=a.name;return s.indexOf("-")>-1&&(s.split("-"),s=s.substring(0,s.indexOf("-"))),s.indexOf(":")>-1&&(s.split(":"),s=s.substring(0,s.indexOf(":"))),s.indexOf(",")>-1&&(s.split(","),s=s.substring(0,s.indexOf(","))),s.indexOf("presents")>-1&&(s.split("presents"),s=s.substring(0,s.indexOf("presents"))),n+='<a class="modalWindow"><h5 class="infoWindowContent" id='+a.url+">"+s+'</h5></a><p style="color: #fff;" >'+a.dates.start.localDate+"</p></div>","undefined"!=typeof t.infoWindow&&t.infoWindow.close(),t.infoWindow=new google.maps.InfoWindow({content:n,pixelOffset:new google.maps.Size(0,20)}),t.infoWindow.open(t.map,o),t.map.setCenter(o.getPosition()),a.name})})})},googleMap.createMarkerForVenue=function(e){if("202"===e.marketId){var o=new google.maps.LatLng(e.lat,e.lng),t=new google.maps.Marker({position:o,icon:{url:"../Images/newMicrophone.png",scaledSize:new google.maps.Size(30,30)},map:this.map,animation:google.maps.Animation.DROP});googleMap.markersArray.push(t),google.maps.event.addListener(t,"click",function(){}),googleMap.addInfoWindowForVenue(e,t)}},googleMap.populateVenues=function(e){$.each(e.venues,function(e,o){setTimeout(function(){googleMap.createMarkerForVenue(o)},50*e)})},googleMap.getVenues=function(){$.get(window.location.origin+"/venues").done(this.populateVenues)},googleMap.mapSetup=function(){var e=document.getElementById("map-canvas"),o={zoom:12,center:new google.maps.LatLng(51.506178,(-.088369)),mapTypeId:google.maps.MapTypeId.ROADMAP,styles:[{featureType:"all",elementType:"all",stylers:[{hue:"#ff0000"},{saturation:-100},{lightness:-30}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#353535"}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#656565"}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{color:"#505050"}]},{featureType:"poi",elementType:"geometry.stroke",stylers:[{color:"#808080"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#454545"}]}]};this.map=new google.maps.Map(e,o),$("body").on("click",".modalWindow",googleMap.openNav),$("body").on("click",".gigInfo",googleMap.gigInfoWindow),$("body").on("click",".close",googleMap.clearArtistArray),$(".gigSubmission").on("click",googleMap.searchArea),$(".searchSubmission").on("click",googleMap.searchArtistGigs),$(".missingArtist").hide(),this.getVenues()},$(googleMap.mapSetup.bind(googleMap));