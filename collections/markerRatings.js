MarkerRatings = new Mongo.Collection("markerRatings");

MarkerRatings.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function (userId, doc) {
        return doc.owner === userId;
    },
    fetch: ['owner']
});
MarkerRatings.deny({
    remove: function (userId, doc) {
        return doc.locked;
    },
    fetch: ['locked'] // no need to fetch 'owner'
});