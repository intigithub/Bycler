/**
 * Created by zilnus on 20-10-14.
 */
GeoLog = new Mongo.Collection('geo_log');
UserTrack = new Mongo.Collection('user_tracks');

GeoLog.allow({ insert: function () { return true; }});
UserTrack.allow({ insert: function () { return true; }});

Markers = new Mongo.Collection("markers");
Byclers = new Mongo.Collection("byclers");

Markers.allow({
    insert: function () {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return doc.owner === userId;
    },
    remove: function (userId, doc) {
        return doc.owner === userId;
    },
    fetch: ['owner']
});

Markers.deny({
    update: function (userId, docs, fields, modifier) {
        return _.contains(fields, 'owner');
    },
    remove: function (userId, doc) {
        return doc.locked;
    },
    fetch: ['locked'] // no need to fetch 'owner'
});


Byclers.allow({
    insert: function () {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return doc.owner === userId;
    },
    remove: function (userId, doc) {
        return doc.owner === userId;
    },
    fetch: ['owner']
});

Byclers.deny({
    update: function (userId, docs, fields, modifier) {
        return _.contains(fields, 'owner');
    },
    remove: function (userId, doc) {
        return doc.locked;
    },
    fetch: ['locked'] // no need to fetch 'owner'
});