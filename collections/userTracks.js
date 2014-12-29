/**
 * Created by zilnus on 23-10-14.
 */
UserTracks = new Mongo.Collection('user_tracks');

UserTracks.allow({
    insert: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    update: function () {
        return true;
    }
});