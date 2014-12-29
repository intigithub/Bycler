Meteor.subscribe('userStatus');

var googleMapInstance;
var infobubbleInstance = false, MarkerEditable = false;

var GoogleMap = function (element) {
    var self = this;

    self.element = element;
    self.markers = {};

    self.infobubble = new InfoBubble({
        content: '<span class="bubble-evento-label-detalle">30/Oc/14<strong> - 23:30<strong></span>',
        alignBottom: true,
        pixelOffset: new google.maps.Size(-150, -40)
    });
    infobubbleInstance = self.infobubble;

    var latLng = Geolocation.latLng();
    var selectedMarker = Session.get('SelectedMarker');
    var initialPosition = new google.maps.LatLng(-33.459312, -70.647526);
    if (selectedMarker) {
        initialPosition = new google.maps.LatLng(selectedMarker.x, selectedMarker.y);
        Session.set('SelectedMarker', false);
        if (!$('#show-current-location-btn').hasClass('toggled')) $('#show-current-location-btn').toggleClass('toggled');
    } else {
        if (latLng) initialPosition = new google.maps.LatLng(latLng.lat, latLng.lng);
    }

    var mapOptions = {
        center: initialPosition,
        disableDefaultUI: true,
        zoom: (selectedMarker ? 19 : 12)
    };
    self.gmap = new google.maps.Map(element, mapOptions);

    googleMapInstance = self.gmap;

    self.infobubble.modalDetail = $('#basicModal');
};

/*GoogleMap.prototype.showCurrLocationMarker = function () {
    var self = this;
    var latLng = Geolocation.latLng();
    var visibleMode = Meteor.user().currentLocation?Meteor.user().currentLocation.allowViewLevel:-1;
    var imgSrc = visibleMode == 0 || visibleMode == 1 ? '/imgs/markers/my_bycler_invi.png' : '/imgs/markers/my_bycler.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng ? latLng.lat : 0, latLng ? latLng.lng : 0),
        map: self.gmap,
        icon: new google.maps.MarkerImage(imgSrc, null, null, null,
            new google.maps.Size(50, 61))
    });
    // violeta azul indigo, calipso, verde, amarillo, naranjo, rojo.
    Deps.autorun(function () {
        var visibleMode = Meteor.user().currentLocation?Meteor.user().currentLocation.allowViewLevel:-1;
        var imgSrc = visibleMode == 0 || visibleMode == 1 ? '/imgs/markers/my_bycler_invi.png' : '/imgs/markers/my_bycler.png';
        marker.setIcon(new google.maps.MarkerImage(imgSrc, null, null, null,
            new google.maps.Size(50, 61)));

        var latLngNew = Geolocation.latLng();

        if (latLngNew) {
            if (!$('#show-current-location-btn').hasClass("toggled")) {
                if (googleMapInstance)
                    googleMapInstance.setCenter(latLngNew);
            }
            marker.setPosition(latLngNew);

            var currentTrackId = Session.get('currentTrackId');
            if (currentTrackId != null) {
                var id = GeoLogs.insert({
                    created: new Date(),
                    userId: Meteor.userId(),
                    trackId: currentTrackId,
                    latitude: latLngNew.lat,
                    longitude: latLngNew.lng,
                    speed: 0
                });
            }
            
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: {"currentLocation.latitude": latLngNew.lat, "currentLocation.longitude": latLngNew.lng}
            });
        }
    });
};*/

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
    var geoLogs = GeoLogs.find({'trackId': trackId});
    geoLogs.forEach(function (geolog) {
        path.push(new google.maps.LatLng(geolog.location.latitude, geolog.location.longitude));
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

// Funcion para inicializar el mapa con los marcadores
GoogleMap.prototype.init = function () {
    var self = this;
    var markersCounter = 0;

    var map = googleMapInstance;
    var markers = [];
    
    // Autorun para la actualizacion de la geo-localizacion de usuario
    Deps.autorun(function () {
        var latLngNew = Geolocation.latLng();
        if(latLngNew) {
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: {"currentLocation.latitude": latLngNew.lat, "currentLocation.longitude": latLngNew.lng}
            });
        }
    });
    
    // Autorun para el trackeo de las rutas
    Deps.autorun(function () {
        var trackId = Session.get('currentTrackId');
        if(trackId) {
            this.startAnimation();
        }
    });
    

    // Dibuja los marcadores reactivamente
    Markers.find({}).observe({
        added: function (marker) {
            // Aquellos marker de tipo 'Evento' (marker.type==1) que estén caducados, deberán ser eliminados
            if (marker.type == 1) {  // 1 = Evento
                var parts = marker.data.cuando.split("/");
                var dt = new Date(parseInt(parts[2], 10) + 2000,
                                    parseInt(parts[1], 10) - 1,
                                    parseInt(parts[0], 10));

                dt = dt.setDate( dt.getDate() + 1);
                
                if(dt < new Date()) {
                    Markers.update({ _id: marker._id }, { $set: { deleted: true } });
                    return;
                }
            }
            
            // @TODO Improve the filter (radio, markerfilter)
            var googleMarker = new google.maps.Marker({
                position: new google.maps.LatLng(marker.x, marker.y),
                map: self.gmap,
                icon: new google.maps.MarkerImage(getImgFromTypeMarker(marker.type), null, null, null,
                    new google.maps.Size(48, 48))
            });

            self.markers[markersCounter] = googleMarker;
            markers.push(googleMarker);
            markersCounter++;

            if (marker.type == 1) {  // 1 = Evento
                google.maps.event.addListener(googleMarker, 'click', function () {
                    var marker_ = Session.get('SelectedMarker');
                    if (marker_ && marker_._id == marker._id) {
                        marker = marker_;
                    }
                    else {
                        self.infobubble.close();
                    }

                    marker = Markers.findOne(marker._id);

                    if (!self.infobubble.isOpen()) {
                        self.infobubble.setContent(getMarkerEventContent(marker));
                        self.infobubble.open(googleMarker.getMap(), googleMarker);
                        Session.set('SelectedMarker', marker);
                    } else {
                        Session.set('SelectedMarker', false);
                        self.infobubble.close();
                    }
                });
            } else {
                google.maps.event.addListener(googleMarker, 'click', function () {
                    var marker_ = Session.get('SelectedMarker');
                    if (marker_ && marker_._id == marker._id) {
                        marker = marker_;
                    }
                    else {
                        self.infobubble.close();
                    }

                    marker = Markers.findOne(marker._id);

                    if (!self.infobubble.isOpen()) {
                        self.infobubble.setContent(getContentForRatingMarkerWindows(marker));
                        self.infobubble.open(googleMarker.getMap(), googleMarker);
                        Session.set('SelectedMarker', marker);
                    } else {
                        Session.set('SelectedMarker', false);
                        self.infobubble.close();
                    }
                });
            }
        },
        update: function (marker) {
        }
    });

    var markerCluster = new MarkerClusterer(map, markers);
}

Template.googleMap.rendered = function () {
    //always first
    checkForVoidFields();
    //
    var template = this;

    //fix modal bloking google map
    var modal = template.find('#basicModal');
    modal.style.display = 'none';
    //
    visibleMode = Meteor.user().currentLocation.allowViewLevel;
    if (visibleMode == 2) {
        $('#visibility-icon').removeClass("glyphicon-eye-close");
        $('#visibility-icon').addClass("glyphicon-eye-open");
        $('#visibility-icon').removeClass('toggled');
    } else {
        $('#visibility-icon').removeClass("glyphicon-eye-open");
        $('#visibility-icon').addClass("glyphicon-eye-close");
        $('#visibility-icon').addClass('toggled');
    }

    if (Session.get('currentTrackId') == null)
        setPlayPauseStyle('play');
    else
        setPlayPauseStyle('pause');
    //geolocation code
    var map = new GoogleMap(template.firstNode);
    var options = template.data;

    //map.showCurrLocationMarker();

    var DateTime = new Date();
    var strHours = DateTime.getHours();
    if (strHours >= 7 && strHours <= 15) {
        var byclerStyles = dia;
    } else if (strHours > 15 && strHours <= 19) {
        var byclerStyles = tarde;
    } else {
        var byclerStyles = noche;
    }
    //init map here
    map.setStyle(byclerStyles);

    map.init();

    if (Session.get('selectedTrackId') != null) {
        map.startAnimation();
    }

    var userMarkers = [];

    Meteor.users.find({"status.online": true}).observe({
        added: function (bycler) {
            if (bycler.currentLocation.allowViewLevel == 2 || Meteor.user()._id==bycler._id ) {
                if (bycler.currentLocation) {
                    var latLng = new google.maps.LatLng(bycler.currentLocation.latitude, bycler.currentLocation.longitude)

                    var byclerImage = (bycler._id!=Meteor.user()._id) 
                                        ? '/imgs/useronmap/' + (Meteor.user().profile.level?Meteor.user().profile.level:1) + '.png' 
                                        : '/imgs/markers/my_bycler' + (bycler.currentLocation.allowViewLevel==2?'':'_invi') + '.png';
                    var xSize = (bycler._id!=Meteor.user()._id)?48:50;
                    var ySize = (bycler._id!=Meteor.user()._id)?48:61;
                    
                    var userMarkerOnMap = new google.maps.Marker({
                        position: latLng,
                        id: bycler._id,
                        clickable: true,
                        map: googleMapInstance,
                        icon: new google.maps.MarkerImage(byclerImage, null, null, null,
                            new google.maps.Size(xSize, ySize))
                    });
                    
                    if(Meteor.user()._id!=bycler._id) {
                        userMarkerOnMap.info = new google.maps.InfoWindow({
                            content: '<div style="height:32px">'
                            + '<b><span style="color:orange"> Nivel: ' + (bycler.profile.level).toFixed(0) + ' - </span></b>'
                            + '<a  href="/userProfile/' + bycler._id + '">' + '<b> Bycler: ' + bycler.profile.name + ' </b></a>'
                            + '</div>'
                        });
                        google.maps.event.addListener(userMarkerOnMap, 'click', function () {
                            userMarkerOnMap.info.open(googleMapInstance, userMarkerOnMap);
                        });
                    }
                    userMarkers.push(userMarkerOnMap);
                }
            } 
        },
        removed: function (bycler) {
            var indexOf = findInArray(userMarkers, 'id', bycler._id);
            if(userMarkers[indexOf]) {
                userMarkers[indexOf].setMap(null);
            }
        },
        changed: function (bycler) {
            var byclerImage, latLng, xSize, ySize;
            if (bycler.currentLocation.allowViewLevel == 2 && Meteor.user()._id!=bycler._id) {
                latLng = new google.maps.LatLng(bycler.currentLocation.latitude, bycler.currentLocation.longitude);
                byclerImage = '/imgs/useronmap/' + (Meteor.user().profile.level?Meteor.user().profile.level:1) + '.png';
                xSize = 48;
                ySize = 48;
            } else if(Meteor.user()._id==bycler._id) {
                latLng = Geolocation.latLng();
                byclerImage = '/imgs/markers/my_bycler' + (bycler.currentLocation.allowViewLevel==2?'':'_invi') + '.png';
                xSize = 50;
                ySize = 61;
            }
            
            if(bycler.currentLocation.allowViewLevel == 2 || (bycler.currentLocation.allowViewLevel != 2 && Meteor.user()._id==bycler._id)) {
                // Se cambian valores de acuerdo al cambio reactivo
                var indexOf = findInArray(userMarkers, 'id', bycler._id);
                if(userMarkers[indexOf]) {
                    userMarkers[indexOf].setPosition(latLng);
                    userMarkers[indexOf].setIcon(new google.maps.MarkerImage(byclerImage, null, null, null,
                                new google.maps.Size(xSize, ySize)));
                    userMarkers[indexOf].setMap(googleMapInstance);
                }
            } else {
                var indexOf = findInArray(userMarkers, 'id', bycler._id);
                if(userMarkers[indexOf]) {
                    userMarkers[indexOf].setMap(null);
                }
            }
        }
    });
};


function getTypeMarker(imgSrc) {
    if (imgSrc.indexOf('estacionamiento') != -1) return 0;
    if (imgSrc.indexOf('evento') != -1) return 1;
    if (imgSrc.indexOf('servicentro') != -1) return 2;
    if (imgSrc.indexOf('taller') != -1) return 3;
    if (imgSrc.indexOf('tienda') != -1) return 4;
    if (imgSrc.indexOf('robo') != -1) return 5;
    if (imgSrc.indexOf('bici_publica') != -1) return 6;
    return -1;
}

function getImgFromTypeMarker(idType) {
    var path = '/imgs/markers/ic_map_';
    switch (idType) {
        case 0:
            path = path + 'estacionamiento';
            break;
        case 1:
            path = path + 'evento';
            break;
        case 2:
            path = path + 'servicentro';
            break;
        case 3:
            path = path + 'taller';
            break;
        case 4:
            path = path + 'tienda';
            break;
        case 5:
            path = path + 'robo';
            break;
        case 6:
            path = path + 'bici_publica';
            break;
        default:
            path = path + 'evento';
    }
    path = path + '.png';
    return path;
}

Template.googleMap.events({
    'click #play-button': function (event) {
        var btn = event.currentTarget;
        if (Session.get('currentTrackId') != null) {
            setPlayPauseStyle('play');
            Session.set('currentTrackId', null);
        } else {
            setPlayPauseStyle('pause');
            var trackId = UserTracks.insert({
                name: moment().format("DD-MM-YYYY, h:mm:ss a"),
                created: new Date(),
                userId: Meteor.userId(),
                public: true,
                isDataGenerated: false,
                maxSpeed: 0,
                averageSpeed: 0,
                totalDistance: 0,
                timeDiff: 0,
                diffDays: 0,
                diffMs: 0,
                diffHrs: 0,
                diffMins: 0
            });
            Session.set('currentTrackId', trackId);
            Router.go('userTrackList');
        }
    },

    'click #menu-toggle': function (event) {
        event.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    'click .marker-add img': function (event) {
        $("#markers-menu-wrapper").toggleClass("toggled");
        $('#addmarker-btn').toggleClass("toggled");
        MarkerEditable.setIcon(new google.maps.MarkerImage(event.target.src.substr(event.target.src.indexOf('/imgs/markers/')),
            null, null, null,
            new google.maps.Size(48, 48)));
        MarkerEditable.setDraggable(false);
        var markerType = getTypeMarker(event.target.src);

        if (markerType == 1) {
            var markerId = Markers.insert({
                userId: Meteor.user()._id,
                ratingAverage: 0,
                fecha: new Date(),
                type: markerType,
                x: MarkerEditable.getPosition().lat(),
                y: MarkerEditable.getPosition().lng(),
                data: {
                    nombre: getTituloFromMarkerType(markerType),
                    cuando: moment().format('L'),
                    donde: "Sin definir",
                    hora: "08:30",
                    asistentes: ""
                }

            });

            var marker = Markers.findOne(markerId);
            var map = MarkerEditable.getMap();

            google.maps.event.addListener(MarkerEditable, 'click', function () {
                var marker = Markers.findOne(markerId);

                if (infobubbleInstance && !infobubbleInstance.isOpen()) {
                    infobubbleInstance.setContent(getMarkerEventContent(marker));
                    infobubbleInstance.setPosition(new google.maps.LatLng(marker.x, marker.y));
                    infobubbleInstance.open(map, MarkerEditable);
                    Session.set('SelectedMarker', marker);
                } else {
                    Session.set('SelectedMarker', false);
                    if (infobubbleInstance) infobubbleInstance.close();
                }
            });
        } else {
            var markerId = Markers.insert({
                fecha: new Date(),
                type: markerType,
                x: MarkerEditable.getPosition().lat(),
                y: MarkerEditable.getPosition().lng(),
                userId: Meteor.user()._id,
                ratingAverage: 0,
                ratingsCount: 0,
                titulo: getTituloFromMarkerType(markerType)
            });
            
            var count = Meteor.user().stats.markersCount;
            if (count >= 0) {
                count++
            }
            
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: { "stats.markersCount": count }
            });
            
            google.maps.event.addListener(MarkerEditable, 'click', function () {
                var marker_ = Session.get('SelectedMarker');
                if (marker_ && marker_._id == marker._id) {
                    marker = marker_;
                }
                else {
                    infobubbleInstance.close();
                }

                marker = Markers.findOne(markerId);

                if (!infobubbleInstance.isOpen()) {
                    infobubbleInstance.setContent(getContentForRatingMarkerWindows(marker));
                    infobubbleInstance.open(MarkerEditable.getMap(), MarkerEditable);
                    Session.set('SelectedMarker', marker);
                } else {
                    Session.set('SelectedMarker', false);
                    infobubbleInstance.close();
                }
            });
        }
    },
    'click #show-current-location-btn': function (event) {
        $('#show-current-location-btn').toggleClass("toggled");
        if (!$('#show-current-location-btn').hasClass("toggled")) {
            googleMapInstance.setCenter(Geolocation.latLng());
        }
    },
    'click #addmarker-btn': function (event) {
        $('#addmarker-btn').toggleClass("toggled");
        $("#markers-menu-wrapper").toggleClass("toggled");
        if (googleMapInstance) {
            if ($('#addmarker-btn').hasClass('toggled')) {
                MarkerEditable = new google.maps.Marker({
                    position: googleMapInstance.getCenter(),
                    draggable: true,
                    map: googleMapInstance,
                    icon: new google.maps.MarkerImage('/imgs/markers/ic_map_peligro.png', null, null, null,
                        new google.maps.Size(48, 48))
                });
            } else {
                MarkerEditable.setMap(null);
            }
        }
    },
    'click #visibility-btn': function (event) {
        $('#visibility-btn').toggleClass("toggled");
        visibleMode =  Meteor.user().currentLocation?Meteor.user().currentLocation.allowViewLevel:-1;
        if (visibleMode == 0) {
            $('#visibility-icon').removeClass("glyphicon-eye-open");
            $('#visibility-icon').addClass("glyphicon-eye-close");
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: {"currentLocation.allowViewLevel": 2}
            });
        } else {
            $('#visibility-icon').removeClass("glyphicon-eye-close");
            $('#visibility-icon').addClass("glyphicon-eye-open");
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: {"currentLocation.allowViewLevel": 0}
            });
        }
    }
});

function setPlayPauseStyle(playOrPause) {
    document.getElementById("play-pause-icon").className = 'glyphicon glyphicon-' + playOrPause;
}

// pintar ruta en mapa
GoogleMap.prototype.startAnimation = function () {
    var self = this, count = 0;

    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        strokeColor: '#ff6339',
        opacity: 0.8
    };
    var path = new google.maps.MVCArray;

    var trackId = Session.get('selectedTrackId');
    var trackPoints = GeoLogs.find({'trackId': trackId});
    trackPoints.forEach(function (point) {
        path.push(new google.maps.LatLng(point.latitude, point.longitude));
    });

    var line = new google.maps.Polyline({
        strokeColor: "#ff6339",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        path: path,
        icons: [
            {
                icon: lineSymbol,
                offset: '80%'
            }
        ],
        map: self.gmap
    });
    zoomToObject(line);

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

function zoomToObject(obj) {
    var bounds = new google.maps.LatLngBounds();
    var points = obj.getPath().getArray();
    for (var n = 0; n < points.length; n++) {
        bounds.extend(points[n]);
    }
    googleMapInstance.fitBounds(bounds);
}

var dia = [
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
var tarde = [{
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
var noche = [
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
