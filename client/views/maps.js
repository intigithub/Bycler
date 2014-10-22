Meteor.subscribe('markers');
Meteor.subscribe('byclers');

var GoogleMap = function (element) {
<<<<<<< HEAD
  var self = this;

  self.element = element;
  self.markers = { };

  var lat = -36.832383, lng = -73.055458;
  var mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    disableDefaultUI: true,
    zoom: 17
  };
  self.gmap = new google.maps.Map(element, mapOptions);
  
  // Seccion de control de marcadores
  var timeMillis = 0, initialClickPositionMap;
  
  google.maps.event.addListener(self.gmap, "mousedown", function (event) {
    timeMillis = new Date().getTime();
    initialClickPositionMap = event.latLng;
  });

  google.maps.event.addListener(self.gmap, "mouseup", function (event) {
    if(initialClickPositionMap!=null && new Date().getTime() - timeMillis > 1000 
       && event.latLng.lat==initialClickPositionMap.lat 
       && event.latLng.lng==initialClickPositionMap.lng) {
      
      MarkerEditable = new google.maps.Marker({
        position: event.latLng,
        draggable: true, 
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/ic_map_peligro.png', null, null, null,
          new google.maps.Size(48, 48))
      });
      $("#markers-menu-wrapper").toggleClass("toggled");
    }
    timeMillis = 0;
  });
  
  google.maps.event.addListener(self.gmap, "drag", function(event) {
    initialClickPositionMap = null;
  });
=======
    var self = this;

    self.element = element;
    self.markers = {};
    self.selectedMarkerId = null,

        self.infowindow = new google.maps.InfoWindow({ content: "" });
    google.maps.event.addListener(self.infowindow, "closeclick", function () {
        if (self.selectedMarkerId) {
            self.selectedMarkerId.set(null);
        }
    });

    var lat = -36.832383, lng = -73.055458;
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        disableDefaultUI: true,
        zoom: 17
    };
    self.gmap = new google.maps.Map(element, mapOptions);
>>>>>>> 67fdd47f83b0d15824b1f091945b81b0fb04e3f9
};

// accepts reactive function that returns {lat: Number, lng: Number}
GoogleMap.prototype.setCenter = function (centerFunc) {
    var self = this;

    if (self.centerComputation) {
        self.centerComputation.stop();
    }

    self.centerComputation = Deps.autorun(function () {
        var center = centerFunc();

        if (self.selectedMarkerId && self.selectedMarkerId.get()) {
            // marker is currently selected, don't update the center until it's closed
            var markerId = self.selectedMarkerId.get();
            if (self.markers[markerId]) {
                var marker = self.markers[markerId];
                self.gmap.setCenter(marker.getPosition());
            }
            return;
        }

        if (center) {
            var latLng = new google.maps.LatLng(center.lat, center.lng);
            self.gmap.setCenter(latLng);
        }
    });
};

<<<<<<< HEAD
GoogleMap.prototype.showCurrLocationMarker = function () {
  var self = this;
  var latLng = Geolocation.latLng();
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(latLng?latLng.lat:0, latLng?latLng.lng:0),
    map: self.gmap,
    icon: new google.maps.MarkerImage('/imgs/markers/my_bycler.png', null, null, null,
      new google.maps.Size(40, 48))
  });

  Deps.autorun(function () {
    var latLng = Geolocation.latLng();

    if (latLng) {
      //marker.setMap(self.gmap);
      marker.setPosition(new google.maps.LatLng(latLng.lat, latLng.lng));
    }
  });
=======
// accepts minimongo cursor
// documents must have field marker: {lat: Number, lng: Number, infoWindowContent: String}
GoogleMap.prototype.setMarkers = function (cursor) {
    var self = this;

    if (self.liveQuery) {
        self.liveQuery.stop();
    }

    var latLng = Geolocation.latLng();
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng ? latLng.lat : 0, latLng ? latLng.lng : 0),
        map: self.gmap,
        ico: new google.maps.MarkerImage('/imgs/markers/ic_ladon_marcador.png', null, null, null,
            new google.maps.Size(64, 64))
    });

    /*self.liveQuery = cursor.observe({
     added: function (doc) {
     var marker = new google.maps.Marker({
     position: new google.maps.LatLng(doc.marker.lat, doc.marker.lng),
     map: self.gmap,
     ico: new google.maps.MarkerImage('/imgs/markers/robo.png', null, null, null,
     new google.maps.Size(64, 64))
     });

     self.markers[doc._id] = marker;

     if (doc.marker.infoWindowContent) {
     marker.infoWindowContent = doc.marker.infoWindowContent;

     google.maps.event.addListener(marker, "click", function () {
     self.selectMarker(doc._id);
     });
     }

     if (self.selectedMarkerId && self.selectedMarkerId.get() === doc._id) {
     self.syncWithSelectedMarkerId(doc._id);
     }
     },
     removed: function (doc) {
     self.markers[doc._id].setMap(null);
     delete markers[doc._id];
     },
     changed: function (doc) {
     self.markers[doc._id].setPosition(
     new google.maps.LatLng(doc.marker.lat, doc.marker.lng));
     marker.infoWindowContent = doc.marker.infoWindowContent;
     }
     });*/
};


GoogleMap.prototype.addTestMarkers = function () {
    var self = this;
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(-36.831407, -73.055569),
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/ic_map_servicentro.png', null, null, null,
            new google.maps.Size(64, 64))
    });

    marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(-36.830986, -73.053219),
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/ic_mapa_taller.png', null, null, null,
            new google.maps.Size(64, 64))
    });

    marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(-36.831238, -73.055424),
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/ic_map_estacionamiento.png', null, null, null,
            new google.maps.Size(64, 64))
    });

    marker3 = new google.maps.Marker({
        position: new google.maps.LatLng(-36.833758, -73.055183),
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/ic_map_estacionamiento.png', null, null, null,
            new google.maps.Size(64, 64))
    });
};

GoogleMap.prototype.showCurrLocationMarker = function () {
    var self = this;
    var latLng = Geolocation.latLng();
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng ? latLng.lat : 0, latLng ? latLng.lng : 0),
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/ic_ladon_marcador.png', null, null, null,
            new google.maps.Size(64, 64))
    });

    Deps.autorun(function () {
        var latLng = Geolocation.latLng();

        if (latLng) {
            marker.setMap(self.gmap);
            marker.setPosition(new google.maps.LatLng(latLng.lat, latLng.lng));
        }
    });
>>>>>>> 67fdd47f83b0d15824b1f091945b81b0fb04e3f9
};

// Funcion desactivada por ahora
GoogleMap.prototype.startAnimation = function () {
    var self = this, count = 0;

    var lineSymbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: '#FFE003'
    };
    var path = new google.maps.MVCArray;

    var topPosts = GeoLog.find();
    topPosts.forEach(function (post) {
        path.push(new google.maps.LatLng(post.location.latitude, post.location.longitude));
    });

    var line = new google.maps.Polyline({
        path: path,
        icons: [
            {
                icon: lineSymbol,
                offset: '100%'
            }
        ],
        map: self.gmap
    });

    Deps.autorun(function () {
        var count = 0;
        window.setInterval(function () {
            count = (count + 1) % 200;

            var icons = line.get('icons');
            icons[0].offset = (count / 2) + '%';
            line.set('icons', icons);
        }, 200);
    });
}


// accepts reactive var
GoogleMap.prototype.bindToSelectedMarkerId = function (selectedMarkerId) {
    var self = this;

    self.selectedMarkerId = selectedMarkerId;

    if (self.selectedMarkerIdComputation) {
        self.selectedMarkerIdComputation.stop();
    }

    self.selectedMarkerIdComputation = Deps.autorun(function () {
        var markerId = self.selectedMarkerId.get();

        if (markerId) {
            self.syncWithSelectedMarkerId(markerId);
        }
    });
};


GoogleMap.prototype.selectMarker = function (markerId) {
    var self = this;

    if (self.selectedMarkerId) {
        self.selectedMarkerId.set(markerId);
    }
};


GoogleMap.prototype.syncWithSelectedMarkerId = function (markerId) {
    var self = this;
    var marker = self.markers[markerId];

    if (marker) {
        self.infowindow.setContent(marker.infoWindowContent);
        self.infowindow.open(self.gmap, marker);
    }
};


// Funcion para cargar los estilos
GoogleMap.prototype.setStyle = function (styles) {
    var self = this;
    self.gmap.setOptions({styles: styles});
}


// Funcion que agrega una marca
GoogleMap.prototype.addMarker = function (marker) {
  var self = this;
  MarkerEditable = new google.maps.Marker({
    position: new google.maps.LatLng(marker.position.k, marker.position.B),
    map: self.gmap,
    icon: new google.maps.MarkerImage(marker.imgSrc, null, null, null,
                                      new google.maps.Size(48, 48))
  });
};


// Funcion para inicializar el mapa con los marcadores
GoogleMap.prototype.init = function () {
  var self = this;
  var byclersCounter = 0;
  var markersCounter = 0;
  
  Markers.find({}).observe({
    added: function(marker) {
      console.log('Huy, llego marker:' + marker);
       self.markers[markersCounter++] = new google.maps.Marker({
        position: new google.maps.LatLng(marker.position.k, marker.position.B),
        map: self.gmap,
        icon: new google.maps.MarkerImage(marker.imgSrc, null, null, null,
          new google.maps.Size(48, 48))
      });
    }
  });
  
  Byclers.find({}).observe({
    added: function(marker) {
      console.log('Huy, llego marker:' + marker);
      self.byclers[byclersCounter++] = new google.maps.Marker({
        position: new google.maps.LatLng(marker.position.k, marker.position.B),
        map: self.gmap,
        icon: new google.maps.MarkerImage(marker.imgSrc, null, null, null,
          new google.maps.Size(48, 48))
      });
    }
  });
}

Template.googleMap.rendered = function () {
    var template = this;

    var map = new GoogleMap(template.firstNode);
    var options = template.data;

<<<<<<< HEAD
  if (options.center) {
    map.setCenter(options.center);
  } else if (options.geolocate) {
    map.showCurrLocationMarker();
    map.setCenter(Geolocation.latLng);
  }
  
  var byclerStyles = [
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#7089d2' },
      { weight: 1.6 }
    ]
  }, {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      { saturation: -100 },
      { invert_lightness: true }
    ]
  }, {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#b7c4d2' }
    ]
  }, {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [
      { hue: '#0066ff' },
      { lightness: -15 },
      { saturation: 99 }
    ]
  }
  ];
  
  map.setStyle(byclerStyles);
  map.init();
};
=======
    if (options.center) {
        map.setCenter(options.center);
    } else if (options.geolocate) {
        map.showCurrLocationMarker();
        map.setCenter(Geolocation.latLng);
    }

    if (options.selectedMarkerId) {
        map.bindToSelectedMarkerId(options.selectedMarkerId);
    }

    /*var marker1 = new google.maps.Marker({
     position: new google.maps.LatLng(-36.831407, -73.055569),
     ico: new google.maps.MarkerImage('/imgs/markers/aire.png', null, null, null,
     new google.maps.Size(64, 64))});
     marker1.setMap(map);

     options.markers = [ marker1 ]; */
    map.setMarkers(options.markers);

    var byclerStyles = [
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                { color: '#7089d2' },
                { weight: 1.6 }
            ]
        },
        {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
                { saturation: -100 },
                { invert_lightness: true }
            ]
        },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
                { color: '#b7c4d2' }
            ]
        },
        {
            featureType: 'poi.school',
            elementType: 'geometry',
            stylers: [
                { hue: '#0066ff' },
                { lightness: -15 },
                { saturation: 99 }
            ]
        }
    ];

    map.setStyle(byclerStyles);
    map.addTestMarkers();
    map.startAnimation();
};


/*Mobile Gps Tracker To Server*/
if (Meteor.isClient) {
    Meteor.subscribe('basic');
    Template.googleMap.events({
        'click #play_button': function (event) {
            var btn = event.currentTarget;

            if (!GeolocationBG.isStarted) {
                if (!GeolocationBG.start()) {
                    return;
                }
                if (!GeolocationBG.isStarted) {
                    return;
                }
                return;
            }
            if (!GeolocationBG.stop()) {
                return;
            }
            if (GeolocationBG.isStarted) {
                return;
            }
            return;
        }
    });
}
if (Meteor.isCordova) {
    GeolocationBG.config({
        // your server url to send locations to
        //   YOU MUST SET THIS TO YOUR SERVER'S URL
        //   (see the setup instructions below)
        url: 'http://179.56.228.26:3000/api/geolocation',
        params: {
            // will be sent in with 'location' in POST data (root level params)
            // these will be added automatically in setup()
            userId: GeolocationBG.userId(),
            uuid: GeolocationBG.uuid(),
            device: GeolocationBG.device()
        },
        headers: {
            // will be sent in with 'location' in HTTP Header data
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 2,
        // Android ONLY, customize the title of the notification
        notificationTitle: 'Trazando Ruta',
        // Android ONLY, customize the text of the notification
        notificationText: 'Bycler',
        //
        activityType: 'AutomotiveNavigation',
        // enable this hear sounds for background-geolocation life-cycle.
        debug: false
    });
}
/*-------*/
>>>>>>> 67fdd47f83b0d15824b1f091945b81b0fb04e3f9
