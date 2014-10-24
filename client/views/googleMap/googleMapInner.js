Meteor.subscribe('markers');
Meteor.subscribe('byclers');

var GoogleMap = function (element) {
    var self = this;

    self.element = element;
    self.markers = {};

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
        if (initialClickPositionMap != null && new Date().getTime() - timeMillis > 1000
            && event.latLng.lat == initialClickPositionMap.lat
            && event.latLng.lng == initialClickPositionMap.lng) {

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

    google.maps.event.addListener(self.gmap, "drag", function (event) {
        initialClickPositionMap = null;
    });
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

GoogleMap.prototype.showCurrLocationMarker = function () {
    var self = this;
    var latLng = Geolocation.latLng();
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng ? latLng.lat : 0, latLng ? latLng.lng : 0),
        map: self.gmap,
        icon: new google.maps.MarkerImage('/imgs/markers/my_bycler.png', null, null, null,
            new google.maps.Size(40, 48))
    });

    Deps.autorun(function () {
        var latLng = Geolocation.latLng();

        if (latLng) {
            marker.setPosition(new google.maps.LatLng(latLng.lat, latLng.lng));
        }
    });
};

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
};


// pintar ruta en mapa

GoogleMap.prototype.startAnimation = function () {
    var self = this, count = 0;

    var lineSymbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: '#FFE003'
    };
    var path = new google.maps.MVCArray;

    var trackId = Session.get('selectedTrackId');
    console.log(trackId);
    var topPosts = GeoLog.find({'trackId': trackId});
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
        added: function (marker) {
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
        added: function (marker) {
            console.log('Huy, llego byler:' + marker);
            self.byclers[byclersCounter++] = new google.maps.Marker({
                position: new google.maps.LatLng(marker.position.k, marker.position.B),
                map: self.gmap,
                icon: new google.maps.MarkerImage(marker.imgSrc, null, null, null,
                    new google.maps.Size(48, 48))
            });
        }
    });
}

Template.googleMapInner.rendered = function () {
    var template = this;

    if (!GeolocationBG.isStarted) {
        console.log(GeolocationBG.isStarted + 'play')
        setPlayPauseStyle('play')
    } else {
        console.log(GeolocationBG.isStarted + 'pause')
        setPlayPauseStyle('pause')
    }
    var map = new GoogleMap(template.firstNode);
    var options = template.data;

    if (options.center) {
        map.setCenter(options.center);
    } else if (options.geolocate) {
        map.showCurrLocationMarker();
        map.setCenter(Geolocation.latLng);
    }

    var DateTime = new Date();
    var strHours = DateTime.getHours();
    if (strHours >= 7 && strHours <= 19) {

        var byclerStyles = [
            {
                "featureType": "water", "elementType": "geometry", "stylers": [
                {"color": "#a2daf2"}
            ]
            },
            {
                "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [
                {"color": "#f7f1df"}
            ]
            },
            {
                "featureType": "landscape.natural", "elementType": "geometry", "stylers": [
                {"color": "#d0e3b4"}
            ]
            },
            {
                "featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "poi.park", "elementType": "geometry", "stylers": [
                {"color": "#bde6ab"}
            ]
            },
            {
                "featureType": "poi", "elementType": "labels", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "poi.medical", "elementType": "geometry", "stylers": [
                {"color": "#fbd3da"}
            ]
            },
            {
                "featureType": "poi.business", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "road", "elementType": "geometry.stroke", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "road", "elementType": "labels", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [
                {"color": "#ffe15f"}
            ]
            },
            {
                "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [
                {"color": "#efd151"}
            ]
            },
            {
                "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [
                {"color": "#ffffff"}
            ]
            },
            {
                "featureType": "road.local", "elementType": "geometry.fill", "stylers": [
                {"color": "black"}
            ]
            },
            {
                "featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [
                {"color": "#cfb2db"}
            ]
            }
        ];

    } else if (strHours > 19 && strHours <= 20) {
        var byclerStyles = [
            {
                "featureType": "road", "elementType": "labels", "stylers": [
                {"visibility": "simplified"},
                {"lightness": 20}
            ]
            },
            {
                "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "landscape.man_made", "elementType": "all", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "transit", "elementType": "all", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "road.local", "elementType": "labels", "stylers": [
                {"visibility": "simplified"}
            ]
            },
            {
                "featureType": "road.local", "elementType": "geometry", "stylers": [
                {"visibility": "simplified"}
            ]
            },
            {
                "featureType": "road.highway", "elementType": "labels", "stylers": [
                {"visibility": "simplified"}
            ]
            },
            {
                "featureType": "poi", "elementType": "labels", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "road.arterial", "elementType": "labels", "stylers": [
                {"visibility": "off"}
            ]
            },
            {
                "featureType": "water", "elementType": "all", "stylers": [
                {"hue": "#a1cdfc"},
                {"saturation": 30},
                {"lightness": 49}
            ]
            },
            {
                "featureType": "road.highway", "elementType": "geometry", "stylers": [
                {"hue": "#f49935"}
            ]
            },
            {
                "featureType": "road.arterial", "elementType": "geometry", "stylers": [
                {"hue": "#fad959"}
            ]
            }
        ];
    } else {
        var byclerStyles = [
            {
                "featureType": "water", "stylers": [
                {"color": "#021019"}
            ]
            },
            {
                "featureType": "landscape", "stylers": [
                {"color": "#08304b"}
            ]
            },
            {
                "featureType": "poi", "elementType": "geometry", "stylers": [
                {"color": "#0c4152"},
                {"lightness": 5}
            ]
            },
            {
                "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [
                {"color": "#000000"}
            ]
            },
            {
                "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [
                {"color": "#0b434f"},
                {"lightness": 25}
            ]
            },
            {
                "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [
                {"color": "#000000"}
            ]
            },
            {
                "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [
                {"color": "#0b3d51"},
                {"lightness": 16}
            ]
            },
            {
                "featureType": "road.local", "elementType": "geometry", "stylers": [
                {"color": "#000000"}
            ]
            },
            {
                "elementType": "labels.text.fill", "stylers": [
                {"color": "#ffffff"}
            ]
            },
            {
                "elementType": "labels.text.stroke", "stylers": [
                {"color": "#000000"},
                {"lightness": 13}
            ]
            },
            {
                "featureType": "transit", "stylers": [
                {"color": "#146474"}
            ]
            },
            {
                "featureType": "administrative", "elementType": "geometry.fill", "stylers": [
                {"color": "#000000"}
            ]
            },
            {
                "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [
                {"color": "#144b53"},
                {"lightness": 14},
                {"weight": 1.4}
            ]
            }
        ];
    }
    ;

    map.setStyle(byclerStyles);
    map.init();
    console.log(Session.get('selectedTrackId'));
    if (Session.get('selectedTrackId') != null) {
        map.startAnimation();
    }
};

Template.googleMapInner.events({
    'click #menu-toggle': function (event) {
        event.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    'click .marker-add img': function (event) {
        event.preventDefault();
        $("#markers-menu-wrapper").toggleClass("toggled");
        MarkerEditable.setIcon(new google.maps.MarkerImage(event.target.src.substr(event.target.src.indexOf('/imgs/markers/')),
            null, null, null,
            new google.maps.Size(48, 48)));
        MarkerEditable.setDraggable(false);
        Markers.insert({
            fecha: new Date(),
            imgSrc: event.target.src.substr(event.target.src.indexOf('/imgs/markers/')),
            position: MarkerEditable.getPosition()
        });
    }
});

// Mobile Gps Tracker To Server
if (Meteor.isClient) {
    Meteor.subscribe('basic');
    //Click to start tracking event
    Template.googleMapInner.events({
        'click #play-button': function (event) {
            var btn = event.currentTarget;

            if (!Meteor.isCordova) {
                console.log('Not Available, Not Cordova');
                setPlayPauseStyle('play')
                return;
            }
            if (!GeolocationBG.isStarted) {
                if (!GeolocationBG.start()) {
                    console.log('ERROR: Not Started, unable to start');
                    setPlayPauseStyle('play')
                    return;
                }
                if (!GeolocationBG.isStarted) {
                    setPlayPauseStyle('play')
                    console.log('ERROR: Not Started, status = false');
                    return;
                }
                setPlayPauseStyle('pause')
                console.log('Started (every few minutes there should be an update)');
                var trackId = UserTrack.insert({
                    name: moment().format("DD-MM-YYYY, h:mm:ss a"),
                    created: new Date(),
                    finish: new Date(),
                    userId: Meteor.userId(),
                    public: true
                });
                Session.set('currentTrackId', trackId);
                Router.go('userTrackList');
                return;
            }
            if (!GeolocationBG.stop()) {
                setPlayPauseStyle('pause');
                console.log('ERROR: Not Stopped, unable to stop');
                return;
            }
            else {
                Session.set('currentTrackId', null);
                setPlayPauseStyle('play');
                console.log('STOP TRACK:   Stopped');


                return;
            }
            if (GeolocationBG.isStarted) {
                setPlayPauseStyle('pause');
                console.log('ERROR: Not Stopped, status = true');
                return;
            }
            return;
        }
    })
    ;
}
function setPlayPauseStyle(playOrPause) {
    document.getElementById("play-pause-icon").className = 'glyphicon glyphicon-' + playOrPause;
}
if (Meteor.isCordova) {
    GeolocationBG.config({
        // your server url to send locations to
        //   YOU MUST SET THIS TO YOUR SERVER'S URL
        //   (see the setup instructions below)
        url: 'http://179.56.234.41:3000/api/geolocation',
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
        stationaryRadius: 10,
        distanceFilter: 2,
        // Android ONLY, customize the title of the notification
        notificationTitle: 'Trazando Ruta',
        // Android ONLY, customize the text of the notification
        notificationText: 'Bycler',
        //
        activityType: 'AutomotiveNavigation',
        // enable this hear sounds for background-geolocation life-cycle.
        debug: true
    });
}