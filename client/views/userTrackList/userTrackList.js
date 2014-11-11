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
    }
});

Template.userTrackList.events({
    'click .view-track-btn': function (event) {
        var btn = event.currentTarget;
        var trackId = btn.id;
        Session.set('selectedTrackId', trackId);
        console.log('renderizando');
        Router.go('/googleMap');
        console.log('fin renderizando');

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
