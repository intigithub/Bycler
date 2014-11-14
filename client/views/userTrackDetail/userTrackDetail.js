/**
 * Created by zilnus on 29-10-14.
 */
Meteor.subscribe('basic');
Template.userTrackDetail.helpers({
    trackObject: function () {
        var trackId = Session.get('trackIdInView');
        return UserTrack.findOne({_id: trackId});
    }
});
Template.userTrackDetail.events({
    'change .track-name': function (evt, template) {
        var trackId = template.find(".track-name").id;
        console.log('trackId' + trackId)
        UserTrack.update({_id: trackId}
            , {
                $set: {
                    name: template.find(".track-name").value
                }
            });
    }
});
Template.userTrackDetail.rendered = function () {
    var trackId = Session.get('trackIdInView');
    var Track = UserTrack.findOne({_id: trackId});
    //valida si se ah generado resumen de datos
    if (true) {
        //busca los puntos de la ruta
        var Waypoints = GeoLog.find({trackId: Track._id});

        var prevWaypoint = null;
        var maxSpeed = 0.0;
        var averageSpeed = 0.0;
        var totalDistance = 0.0;
        var date1 = new Date();
        var date2 = new Date();
        var count = 1;

        Waypoints.forEach(function (waypoint) {
                if (count > 1) {
                    totalDistance = totalDistance + getDistanceFromLatLonInKm(prevWaypoint.latitude,
                        prevWaypoint.longitude, waypoint.latitude, waypoint.longitude);
                }
                else {
                    date1 = waypoint.created;
                }
                if (maxSpeed < waypoint.speed) {
                    maxSpeed = waypoint.speed;
                }
                averageSpeed = averageSpeed + waypoint.speed;
                prevWaypoint = waypoint;
                date2 = waypoint.created;
                count++;
            }
        );

        //calcula velocidad promedio -
        if (averageSpeed > 0.0) averageSpeed = (averageSpeed / Waypoints.count());
        else averageSpeed = 0.0;//si por un caso la ruta tiene 0 puntos queda NaN, esto deberia cubrirlo, pero esa ruta no deberia existir.
        //calculo de inicio y fin de ruta - duracion de la ruta
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
    }


    Track = UserTrack.findOne({_id: trackId});

    var opts = {
        lines: 12,
        angle: 0.15,
        lineWidth: 0.44,
        pointer: {
            length: 0.9,
            strokeWidth: 0.035,
            color: '#000000'
        },
        limitMax: 'false',
        percentColors: [[0.0, "#a9d70b"], [0.50, "#f9c802"], [1.0, "#ff0000"]], // !!!!
        strokeColor: '#E0E0E0',
        generateGradient: true
    };
    var target = document.getElementById('max-speed-canvas');
    var gauge = new Gauge(target).setOptions(opts);
    console.log('Track.maxSpeed' + Track.maxSpeed)
    gauge.animationSpeed = 32;
    gauge.setTextField(document.getElementById('max-speed'));
    gauge.maxValue = Track.maxSpeed;
    gauge.set(Track.maxSpeed);

    var target2 = document.getElementById('average-speed-canvas');
    var gauge2 = new Gauge(target2).setOptions(opts);
    gauge2.animationSpeed = 32;
    gauge2.setTextField(document.getElementById('average-speed'))
    gauge2.maxValue = Track.averageSpeed * 2;
    gauge2.set(Track.averageSpeed);

    var target3 = document.getElementById('distance-canvas');
    var gauge3 = new Gauge(target3).setOptions(opts);
    gauge3.animationSpeed = 32;
    gauge3.setTextField(document.getElementById('distance'))
    gauge3.maxValue = (Track.totalDistance) * 2;
    gauge3.set(Track.totalDistance);


    var target4 = document.getElementById('time-canvas');
    var gauge4 = new Gauge(target4).setOptions(opts);
    gauge4.animationSpeed = 32;
    gauge4.setTextField(document.getElementById('time'))
    gauge4.maxValue = (Track.diffMins) * 2;
    gauge4.set(Track.diffMins);
}

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

UI.registerHelper("formatDate", function (datetime) {
    if (moment) {
        return moment(datetime).fromNow();
    }
    else {
        return datetime;
    }
});