/**
 * Created by zilnus on 20-10-14.
 */
Meteor.subscribe("user_tracks");
Meteor.subscribe("basic");

Template.userTrackList.helpers({
    userTracksList: function() {
        return UserTrack.find({userId: Meteor.userId()});
    }
});

