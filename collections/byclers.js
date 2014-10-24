Byclers = new Mongo.Collection("byclers");

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