/**
 * Created by zilnus on 29-10-14.
 */
Meteor.subscribe('basic');
Template.userTrackDetail.helpers({
    trackObject: function () {
        var trackId = Session.get('trackIdInView');
        return UserTrack.findOne({_id: trackId});
    },
    isKmDistance: function () {
        var trackId = Session.get('trackIdInView');
        var Track = UserTrack.findOne({_id: trackId});
        if (Track.totalDistance >= 1000) {
            return true;
        } else {
            return false;
        }
    }
});
Template.userTrackDetail.events({
    'change .track-name': function (evt, template) {
        var trackId = template.find(".track-name").id;
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
    if (!Track.isDataGenerated) {
        //busca los puntos de la ruta
        var Waypoints = GeoLog.find({trackId: Track._id});
        var prevWaypoint = null;
        var maxSpeed = 0.0;
        var averageSpeed = 0.0;
        var totalDistance = 0.0;
        var date1 = new Date();
        var date2 = new Date();
        var count = 0;

        Waypoints.forEach(function (waypoint) {
                if (count > 0) {
                    totalDistance = totalDistance + distance_on_geoid(prevWaypoint.latitude,
                        prevWaypoint.longitude, waypoint.latitude, waypoint.longitude);
                    var speed = getSpeed2Points(prevWaypoint, waypoint);
                    GeoLog.update({_id: waypoint._id}, {$set: {"speed": speed}});
                    averageSpeed = averageSpeed + speed;
                    if (maxSpeed < speed) maxSpeed = speed;
                }
                else {
                    GeoLog.update({_id: waypoint._id}, {$set: {"speed": 0}});
                    date1 = waypoint.created;
                }

                prevWaypoint = waypoint;
                date2 = waypoint.created;
                count++;
            }
        );

        //calcula velocidad promedio -
        if (averageSpeed > 0.0) averageSpeed = (averageSpeed / Waypoints.count());
        else averageSpeed = 0.0;
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        var diffMs = (date2 - date1);
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
        var kmAccum = Meteor.user().profile.kmAccum;

            kmAccum = kmAccum + totalDistance;
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: {"profile.kmAccum": kmAccum}
            });
        Meteor.users.update({_id: Meteor.userId()}, {
            $set: {"profile.level": getLevelByKm()}
        });

    }

    Track = UserTrack.findOne({_id: trackId});
    var opts = {
        lines: 12,
        angle: 0.15,
        lineWidth: 0.44,
        pointer: {
            length: 0.9,
            strokeWidth: 0.035,
            color: '#ff6339'
        },
        limitMax: 'false',
        percentColors: [[0.0, "#95C0EF"], [0.50, "#596680"], [1.0, "#2F3C4C"]], // !!!!
        strokeColor: '#D3E0EE',
        generateGradient: true
    };
    var target = document.getElementById('max-speed-canvas');
    var gauge = new Gauge(target).setOptions(opts);
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

    if (Track.totalDistance >= 1000) {
        totalDistance = totalDistance / 1000;
    }
    var target3 = document.getElementById('distance-canvas');
    var gauge3 = new Gauge(target3).setOptions(opts);
    gauge3.animationSpeed = 32;
    gauge3.setTextField(document.getElementById('distance'))
    gauge3.maxValue = (totalDistance) * 2;
    gauge3.set(totalDistance);

    var target4 = document.getElementById('time-canvas');
    var gauge4 = new Gauge(target4).setOptions(opts);
    gauge4.animationSpeed = 32;
    gauge4.setTextField(document.getElementById('time'))
    gauge4.maxValue = (Track.diffMins) * 2;
    gauge4.set(Track.diffMins);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


function getSpeed2Points(p1, p2) {
    var dist = distance_on_geoid(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    var time_s = (p2.created - p1.created) / 1000.0;
    var speed_mps = dist / time_s;
    var speed_kph = (speed_mps * 3600.0) / 1000.0;
    return speed_kph;
}
function distance_on_geoid(lat1, lon1, lat2, lon2) {

    // Convert degrees to radians
    lat1 = lat1 * Math.PI / 180.0;
    lon1 = lon1 * Math.PI / 180.0;

    lat2 = lat2 * Math.PI / 180.0;
    lon2 = lon2 * Math.PI / 180.0;

    // radius of earth in metres
    var r = 6378100;

    // P
    var rho1 = r * Math.cos(lat1);
    var z1 = r * Math.sin(lat1);
    var x1 = rho1 * Math.cos(lon1);
    var y1 = rho1 * Math.sin(lon1);

    // Q
    var rho2 = r * Math.cos(lat2);
    var z2 = r * Math.sin(lat2);
    var x2 = rho2 * Math.cos(lon2);
    var y2 = rho2 * Math.sin(lon2);

    // Dot product
    var dot = (x1 * x2 + y1 * y2 + z1 * z2);
    var cos_theta = dot / (r * r);

    var theta = Math.acos(cos_theta);

    // Distance in Metres
    return r * theta;
}