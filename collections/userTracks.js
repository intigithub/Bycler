/**
 * Created by zilnus on 23-10-14.
 */
UserTrack = new Mongo.Collection('user_tracks');

UserTrack.allow({
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