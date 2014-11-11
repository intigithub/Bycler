var MarkerModalDetail = function (element) {
    console.log('Constructor de MarkerModalDetail');
}

MarkerModalDetail.prototype.setMarker = function (markerId) {
    var self = this;
    self.markerId = id;
    console.log('Marker: ' + self.markerId);
}

Template.markerModalDetail.rendered = function () {
    $('#datepicker-fecha').datepicker({ format: 'dd/mm/yy' });
    
    $('#eventMarker-asistentes').tagsinput();
}

Template.markerModalDetail.events({
    'click #btn-save': function (e) {
        e.preventDefault();
        var marker = Session.get('SelectedMarker');
        if(marker) {
            var nombre = $('#eventMarker-nombre').val();
            var donde = $('#eventMarker-donde').val();
            var cuando = $('#eventMarker-cuando').val();
            var hora = $('#eventMarker-hora').val();
            var asistentes = $('#eventMarker-asistentes').val();

            Markers.update(marker._id,  { 
                $set: { 'data.nombre' : nombre,'data.donde' : donde ,'data.cuando':cuando ,'data.hora':hora,'data.asistentes':asistentes }
            });
            
            if(nombre) marker.data.nombre = nombre;
            if(donde) marker.data.donde = donde;
            if(cuando) marker.data.cuando = cuando;
            if(hora) marker.data.hora = hora;
            if(asistentes) marker.data.asistentes = asistentes;
            
            Session.set('SelectedMarker', marker);
        }
        
        $('#basicModal').modal('hide');
    },
    'focus #basicModal': function (event) {
        event.preventDefault();
        console.log('Focusing');
    }
});

Template.markerModalDetail.helpers({
    eventMarker: function () {
        var marker = Session.get('SelectedMarker');
        if(marker) {
           return marker;
        }
    }
});