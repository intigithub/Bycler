Meteor.subscribe("markers");

Template.userEventList.helpers({
    userEventList: function () {
        return Markers.find({type: 1}, {sort: {fecha: -1}});
    },
    userEventListCount: function () {
        var count = Markers.find({type: 1}).count();
        return count > 0;
    }
});

Template.userEventList.events({
    'click .btn-voy': function (event) {
        event.preventDefault();
        var btn = event.currentTarget;
        debugger;
        var eventId = btn.id.substring(btn.id.indexOf('btn-voy') + 7);
        var selectedMarker = Markers.findOne(eventId);
        var asistentes = selectedMarker.data.asistentes;
        console.log(asistentes);
    },
    'click .btn-paso': function (event) {
        event.preventDefault();
        var btn = event.currentTarget;
        debugger;
        var eventId = btn.id.substring(btn.id.indexOf('btn-paso') + 8);
        var selectedMarker = Markers.findOne(eventId);
        var asistentes = selectedMarker.data.asistentes;
        console.log(asistentes);
    },
    'click .btn-go-event-marker': function (event) {
            event.preventDefault();
            var btn = event.currentTarget;
            var eventId = btn.id;
            var selectedMarker = Markers.findOne(eventId);
            Session.set('SelectedMarker', selectedMarker);
            Router.go('googleMap');
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