/**
 * Created by zilnus on 20-10-14.
 */
Meteor.subscribe("user_tracks");
Meteor.subscribe("basic");

Template.userTrackList.helpers({
    userTracksList: function () {
        return UserTrack.find({});
    },
    userTracksListCount: function () {
        var count = UserTrack.find({}).count();
        return count > 0;
    }
});

Template.userTrackList.events({
    'click .view-track-btn' : function (event){
        var btn = event.currentTarget;
        var trackId = btn.id;
        Session.set('currentTrackId', trackId );
        Router.go('googleMap');
    }
});