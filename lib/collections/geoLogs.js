GeoLog = new Mongo.Collection('geo_log');

GeoLog.allow({
    insert: function () {
        return true;
    }
});
