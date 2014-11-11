Meteor.subscribe('markers');
Meteor.subscribe('byclers');

var googleMapInstance, visibleMode = false, findmeMode = false, infobubbleInstance = false;

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
    
    googleMapInstance = self.gmap;

    // Seccion de control de marcadores
    var timeMillis = 0, initialClickPositionMap;

    self.infobubble = new InfoBubble({
        content: '<span class="bubble-evento-label-detalle">30/Oc/14<strong> - 23:30<strong></span>',
        alignBottom: true,
        pixelOffset: new google.maps.Size(-150, -40)
    });
    
    self.infobubble.modalDetail = $('#basicModal');
};


GoogleMap.prototype.showCurrLocationMarker = function () {
    var self = this;
    var latLng = Geolocation.latLng();
    var imgSrc = visibleMode?'/imgs/markers/my_bycler.png':'/imgs/markers/my_bycler_invi.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng ? latLng.lat : 0, latLng ? latLng.lng : 0),
        map: self.gmap,
        icon: new google.maps.MarkerImage(imgSrc, null, null, null,
            new google.maps.Size(40, 48))
    });

    Deps.autorun(function () {
        console.log('Autorun para marker-bycler');
        var latLng = Geolocation.latLng();

        if (latLng) {
            marker.setMap(self.gmap);
            if(findmeMode) {
                marker.setMap(self.gmap);
                marker.setCenter(latLng.lat, latLng.lng);
            } 

            marker.setPosition(new google.maps.LatLng(latLng.lat, latLng.lng));
        }
        
                    
        var imgSrc = visibleMode?'/imgs/markers/my_bycler.png':'/imgs/markers/my_bycler_invi.png';
        marker.setIcon(new google.maps.MarkerImage(imgSrc, null, null, null,
            new google.maps.Size(40, 48)));
    });
};


GoogleMap.prototype.getCenter = function () {
    return Geolocation.latLng();
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



// Funcion para cargar los estilos
GoogleMap.prototype.setStyle = function (styles) {
    var self = this;
    self.gmap.setOptions({styles: styles});
}

// Funcion para cargar los estilos
GoogleMap.prototype.getMapInstance = function () {
    var self = this;
    return self;
}


// Funcion que agrega una marca
GoogleMap.prototype.addMarker = function (marker) {
    var self = this;
    MarkerEditable = new google.maps.Marker({
        position: new google.maps.LatLng(marker.x, marker.y),
        map: self.gmap,
        icon: new google.maps.MarkerImage(getImgFromTypeMarker(marker.type), null, null, null,
            new google.maps.Size(48, 48))
    });
    
    if(marker.type==1) {
        google.maps.event.addListener(MarkerEditable, 'click', function() {
            console.log('Click en el addMarker NO IMPLEMENTADO');
        });
    }
};


// Funcion para inicializar el mapa con los marcadores
GoogleMap.prototype.init = function () {
    var self = this;
    var byclersCounter = 0;
    var markersCounter = 0;
        
    Markers.find({}).observe({
        added: function (marker) {
            // @TODO Improve the filter (radio, markerfilter)
            var googleMarker = new google.maps.Marker({
                position: new google.maps.LatLng(marker.x, marker.y),
                map: self.gmap,
                icon: new google.maps.MarkerImage(getImgFromTypeMarker(marker.type), null, null, null,
                    new google.maps.Size(48, 48))
            });
            
            self.markers[markersCounter] = googleMarker;
            
            if(marker.type==1) {
                google.maps.event.addListener(googleMarker, 'click', function() {
                    
                    var marker_ = Session.get('SelectedMarker');
                    if(marker_) {
                        console.log('Setting marker from Session scope');
                        marker = marker_;
                    } else {
                        console.log('Markerid: ' + marker._id);
                    }
                    if (!self.infobubble.isOpen()) {
                        console.log('Showing infobubble marker_=' + marker.data.nombre);
                        self.infobubble.setContent('<button id="btnid' + marker._id + '" class="btn btn-info"><span class="glyphicon glyphicon-info-sign"> </span> ' 
                                                   + marker.data.nombre + '</button><br/><span id="spn-event-detail" style="margin-left: 4px;">' 
                                                   + (marker.data.cuando?marker.data.cuando:'Sin fecha') + (marker.data.hora?' (' + (marker.data.hora) + ')':'')
                                                  + "</span>");
                        self.infobubble.open(googleMarker.getMap(), googleMarker);
                        Session.set('SelectedMarker', marker);
                        infobubbleInstance = self.infobubble;
                    } else {
                        console.log('Close infobubble from Markers.find({}).observe...');
                        Session.set('SelectedMarker', false);
                        self.infobubble.close();
                        infobubbleInstance = false;
                    }
                });
            }
            
            markersCounter++;
        },
        update: function(marker) {
            console.log('Updating marker');
        }
    });
}

Template.googleMap.rendered = function () {
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

    map.showCurrLocationMarker();
    
    var DateTime = new Date();
    var strHours = DateTime.getHours();
    console.log(strHours + 'Para revisar');
    if (strHours >= 7 && strHours <= 15) {

        var byclerStyles = [
            {
                "featureType": "water", "elementType": "geometry", "stylers": [
                {"color": "#a2daf2"}
            ]
            },
            {
                "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [
                {"color": "#718AA3"}
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

    } else if (strHours > 15 && strHours <= 19) {
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

Template.googleMap.events({
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
            type: getTypeMarker(event.target.src),
            x: MarkerEditable.getPosition().k,
            y: MarkerEditable.getPosition().B,
            data: { nombre: "Nuevo Evento", cuando: new Date(), donde: "Sin definir", hora: "08:30", asistentes:"" }
        });

        // InfoBubble EVENTOS AQUI!
        if(getTypeMarker(event.target.src)==1) {
            var map = MarkerEditable.getMap();
            google.maps.event.addListener(MarkerEditable, 'click', function() {
                var marker_ = Session.get('SelectedMarker');
                if(marker_) {
                    marker = marker_;
                }
                if (!self.infobubble.isOpen()) {
                    self.infobubble.setContent('<button id="btnid' + marker._id + '" class="btn btn-info"><span class="glyphicon glyphicon-info-sign"> </span> ' 
                                               + marker.data.nombre + '</button><br/><span id="spn-event-detail" style="margin-left: 4px;">' 
                                               + (marker.data.cuando?marker.data.cuando:'Sin fecha') + (marker.data.hora?' (' + (marker.data.hora) + ')':'')
                                              + "</span>");
                    self.infobubble.open(googleMarker.getMap(), googleMarker);
                    Session.set('SelectedMarker', marker);
                    infobubbleInstance = self.infobubble;
                } else {
                    Session.set('SelectedMarker', false);
                    self.infobubble.close();
                    infobubbleInstance = false;
                }
            });
        }        
    },
    'click #show-current-location-btn': function (event) {
        console.log("showcurrent-location toggling findmeMode: " + findmeMode);
        $('#show-current-location-btn').toggleClass("toggled");
        this.showCurrLocationMarker;
        findmeMode = !findmeMode;
    },
    'click #addmarker-btn': function (event) {
        console.log("add-marker toggling");
        $('#addmarker-btn').toggleClass("toggled");
        if(googleMapInstance) {
            MarkerEditable = new google.maps.Marker({
                position: googleMapInstance.getCenter(),
                draggable: true,
                map: googleMapInstance,
                icon: new google.maps.MarkerImage('/imgs/markers/ic_map_peligro.png', null, null, null,
                    new google.maps.Size(48, 48))
            });
            $("#markers-menu-wrapper").toggleClass("toggled");
        }
    },
    'click #visibility-btn': function (event) {
        if(!visibleMode) {
            console.log("visibility on");
            $('#visibility-icon').removeClass("glyphicon-eye-close");
            $('#visibility-icon').addClass("glyphicon-eye-open");
        } else {
            console.log("visibility off");
            $('#visibility-icon').removeClass("glyphicon-eye-open");
            $('#visibility-icon').addClass("glyphicon-eye-close");
        }
        visibleMode = !visibleMode;
    }
});

function getTypeMarker(imgSrc) {
  if(imgSrc.indexOf('estacionamiento')!=-1) return 0;
  if(imgSrc.indexOf('evento')!=-1) return 1;
  if(imgSrc.indexOf('servicentro')!=-1) return 2;
  if(imgSrc.indexOf('taller')!=-1) return 3;
  if(imgSrc.indexOf('tienda')!=-1) return 4;
  if(imgSrc.indexOf('robo')!=-1) return 5;
  if(imgSrc.indexOf('bici_publica')!=-1) return 6;
  return -1;
}

function getImgFromTypeMarker(idType) {
  var path = '/imgs/markers/ic_map_';
  switch(idType) {
      case 0: path = path + 'estacionamiento'; break;
      case 1: path = path + 'evento'; break;
      case 2: path = path + 'servicentro'; break;
      case 3: path = path + 'taller'; break;
      case 4: path = path + 'tienda'; break;
      case 5: path = path + 'robo'; break;
      case 6: path = path + 'bici_publica'; break;
      default: path = path + 'evento';
  }
  path = path + '.png';
  return path;
}

// Mobile Gps Tracker To Server
if (Meteor.isClient) {
    Meteor.subscribe('basic');
    //Click to start tracking event
    Template.googleMap.events({
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