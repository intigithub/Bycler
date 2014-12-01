Meteor.subscribe("markers");

Template.userEventList.helpers({
    userEventList: function () {
        return Markers.find({type: 1}, {sort: {fecha: -1}});
    },
    userEventListCount: function () {
        var count = Markers.find({type: 1}).count();
        return count > 0;
    },
    userIsParticipant: function(markerId) {
        var marker = Markers.findOne(markerId);
        var sessionUsername = Meteor.user().profile.name;
        if(marker) {
            if(marker.data.asistentes.indexOf(sessionUsername)==-1) {
                return false;
            } else return true;
        } 
        return false;        
    }
});


Template.userEventList.events({
    'click .btn-asistencia': function (event) {
        event.preventDefault();
        var btn = event.currentTarget;
        var eventId = btn.id.substring(btn.id.indexOf('btn-asistencia') + 14);
        var selectedMarker = Markers.findOne(eventId);
        var asistentes = selectedMarker.data.asistentes;
        var arreglo = asistentes.split(','), index = -1, sessionUsername = Meteor.user().profile.name;
        asistentes = '';
        for(var i=0; i<arreglo.length; i++) {
            if(arreglo[i]==sessionUsername) {
                index = i;
            } else {
                asistentes = asistentes + arreglo[i] + ',';
            }
        }

        if(index==-1) {
            asistentes = asistentes + sessionUsername;
        }   
        
        Markers.update({_id: eventId}, {
            $set: {"data.asistentes": asistentes.substr(0, asistentes.length - (index==-1?0:1))}
        });
        
        $('#' + btn.id).toggleClass('btn-primary btn-default');
        $('#' + btn.id + ' label').toggleClass('glyphicon-thumbs-up glyphicon-thumbs-down');
        
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