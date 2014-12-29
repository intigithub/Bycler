GeoLogs = new Mongo.Collection('geo_log');

GeoLogs.allow({
    insert: function () {
        return true;
    }, update: function () {
        return true;
    }
});
