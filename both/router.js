/**
 * Created by zilnus on 20-10-14.
 */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

Router.configure({
    layoutTemplate: 'layout'/*,
     notFoundTemplate: 'notFound',
     loadingTemplate: 'loading'*/
});
Router.route('/userTrackDetail/:_id', {
    name: 'userTrackDetail', data: function () {
        var trackId = this.params._id;
        console.log(trackId);
        /*Variables para generacion de la data*/
        var maxSpeed = 0.0;
        var averageSpeed = 0.0;
        var prevWaypoint = null;
        var totalDistance = 0.0;
        var date1 = new Date();
        var date2 = new Date();
        var count = 1;
        /*------------------------------------*/
        var Track = UserTrack.findOne({_id: trackId});

        if (Track.isDataGenerated) {
            this.render('userTrackDetail')
            return UserTrack.findOne({_id: trackId});
        } else {
            var Waypoints = GeoLog.find({trackId: Track._id});
            Waypoints.forEach(function (waypoint) {
                if (prevWaypoint != null) {
                    //si existe punto previo calcula las distancias entre puntos y aumenta el contador
                    totalDistance = totalDistance + getDistanceFromLatLonInKm(prevWaypoint.location.latitude,
                        prevWaypoint.location.longitude, waypoint.location.latitude, waypoint.location.longitude);
                } else {
                    //si no existe punto previo es el primero y almacena el tiempo de ese punto (inicio de ruta)
                    date1 = new Date(waypoint.location.recorded_at);
                }
                // en caso de ser necesario reemplaza velocidad maxima
                if (maxSpeed < waypoint.location.speed) {
                    maxSpeed = waypoint.location.speed;
                }
                //acumula las velocidades de los puntos
                averageSpeed = averageSpeed + waypoint.location.speed;
                prevWaypoint = waypoint;
                if (count == Waypoints.count()) {
                    date2 = new Date(waypoint.location.recorded_at);
                }
                count++;
            });

            if (averageSpeed > 0.0) {
                averageSpeed = averageSpeed / waypoints.count();
            } else {
                averageSpeed = 0.0;
            }

            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var diffMs = (date2 - date1); // milliseconds between now & Christmas
            var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

            UserTrack.update({_id: trackId}
                , {
                    $set: {
                        isDataGenerated: true,
                        maxSpeed: maxSpeed,
                        averageSpeed: averageSpeed,
                        totalDistance: totalDistance,
                        timeDiff: timeDiff,
                        diffDays: diffDays,
                        diffMs: diffMs,
                        diffHrs: diffHrs,
                        diffMins: diffMins
                    }
                }
            );
            this.render('userTrackDetail')
            return UserTrack.findOne({_id: trackId});
        }
    }
});

/** Redirects user on login. */
Router.route('/login', {
    redirectOnLogin: function () {
        Router.go('/googleMap');
    }
}, function () {
    this.render('login');
});
/** Redirects user on login. */
Router.route('/', function () {
    this.render('login');
});
/** SeeYouLater (salir) redirect to home and logout */
Router.route('/seeYouLater', {
        onBeforeAction: function () {
            Meteor.logout();
            this.render('login');
        }
    }
);
/** Hacia donde lleva el redirect de login.*/
Router.route('/loginRedirectRoute', {
    action: function () {
        Router.go('/googleMap');
    }
});

/** Google Map Show */
Router.route('/googleMap', {}, function () {
    this.render('/googleMap');
});

/** Event List */
Router.route('/events', {
    loginRequired: 'login'
}, function () {
    this.render('events');
});

/** User Recorded Track List */
Router.route('/userTrackList', {
    loginRequired: 'login'
}, function () {
    this.render('userTrackList');
});

