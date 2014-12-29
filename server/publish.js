if(Meteor.isServer) {
    Meteor.publish("markers", function () {
        return Markers.find({});
    });
    Meteor.publish('basic', function () {
        return GeoLogs.find({userId: this.userId});
    });
    Meteor.publish("user_tracks", function () {
        return UserTracks.find({userId: this.userId});
    });
    Meteor.publish("userStatus", function() {
        return Meteor.users.find({});
    });
    Meteor.publish("markerRatings", function() {
        return MarkerRatings.find({});
    });
    Meteor.publish("users", function() {
        return Meteor.users.find({});
    });
}
