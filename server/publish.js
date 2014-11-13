if(Meteor.isServer) {
    Meteor.publish("markers", function () {
        return Markers.find({});
    });
    Meteor.publish('basic', function () {
        return GeoLog.find({userId: this.userId});
    });
    Meteor.publish("user_tracks", function () {
        return UserTrack.find({userId: this.userId});
    });
    Meteor.publish("userStatus", function() {
        return Meteor.users.find({});
    });
}
