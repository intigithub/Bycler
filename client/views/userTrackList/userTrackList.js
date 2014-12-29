/**
 * Created by zilnus on 20-10-14.
 */
Template.userTrackList.helpers({
    userTracksList: function () {
        return UserTracks.find({}, {sort: {created: -1}});

    },
    userTracksListCount: function () {
        var count = UserTracks.find({}).count();
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
        var points = GeoLogs.find({'trackId': trackId});
        if (points.count() > 1) {

            return false;
        } else {
            var currentTrackId =
                Session.get('currentTrackId');
            if (currentTrackId == trackId) {
                return false;
            } else {
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
        Session.set('selectedTrackId', trackId);
        Router.go('googleMap');
    },
    'click .delete-track-btn': function (event) {
        var btn = event.currentTarget;
        var trackId = btn.id;
        if (Session.get('currentTrackId') != trackId) {
            var btn = event.currentTarget;
            UserTracks.remove(trackId);
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

