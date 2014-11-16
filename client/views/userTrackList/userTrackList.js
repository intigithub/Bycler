/**
 * Created by zilnus on 20-10-14.
 */
Template.userTrackList.helpers({
    userTracksList: function () {
        return UserTrack.find({}, {sort: {created: -1}});

    },
    userTracksListCount: function () {
        var count = UserTrack.find({}).count();
        return count > 0;
    },
    isTrackStillAlive: function (trackItemId) {
        var currentTrackId =
            Session.get('currentTrackId');
        if (currentTrackId != null) {
            if (trackItemId == currentTrackId) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isTrackEmpty: function (trackId) {
        var points = GeoLog.find({'trackId': trackId});
        console.log(points.count());
        if (points.count() > 1) {
            console.log('>1');        console.log('-------------------');

            return false;
        } else {
            var currentTrackId =
                Session.get('currentTrackId');
            console.log(currentTrackId);
            console.log(trackId);


            if (currentTrackId == trackId) {
                console.log('== trackId');        console.log('-------------------');

                return false;
            } else {
                console.log('!!= trackId');        console.log('-------------------');

                return true;
            }
        }

    }
});

Template.userTrackList.events({
    'click .view-track-btn': function (event) {
        event.preventDefault();
        var btn = event.currentTarget;
        var trackId = btn.id;
        console.log(trackId)
        Session.set('selectedTrackId', trackId);
        Router.go('googleMap');
    },
    'click .delete-track-btn': function (event) {
        var btn = event.currentTarget;
        var trackId = btn.id;
        if (Session.get('currentTrackId') != trackId) {
            var btn = event.currentTarget;
            UserTrack.remove(trackId);
        }
    }
});

UI.registerHelper("formatDate", function (datetime) {
    if (moment) {
        return moment(datetime).fromNow();
    }
    else {
        return datetime;
    }
});

