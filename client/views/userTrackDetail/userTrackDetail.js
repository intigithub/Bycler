/**
 * Created by zilnus on 29-10-14.
 */
Template.userTrackDetail.created = function () {
    
}

Template.userTrackDetail.rendered = function () {
    console.log();

    var maxSpeed = new JustGage({
        id: "maxSpeed",
        value: Template.currentData().maxSpeed,
        min: 0,
        max: 100,
        title: "Velocidad Máxima"
    });
    var averageSpeed = new JustGage({
        id: "averageSpeed",
        value: Template.currentData().averageSpeed,
        min: 0,
        max: 100,
        title: "Velocidad Promedio"
    });
    var distance = new JustGage({
        id: "distance",
        value: Template.currentData().distance,
        min: 0,
        max: 100,
        title: " Kms recorridos"
    });
    var time = new JustGage({
        id: "time",
        value: Template.currentData().totalTimeInMinutes,
        min: 0,
        max: 500,
        title: "Velocidad Tiempo"
    });
}

