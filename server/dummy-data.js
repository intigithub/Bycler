// Fixture data 
if (Traker.find().count() === 0) {
    var points = [];
    var max = 0;
    var width = 840;
    var height = 800;
    var len = 300;

    while (len--) {
        var val = Math.floor(Math.random()*100);
        var radius = Math.floor(Math.random()*60);

        max = Math.max(max, val);

        Tracker.insert({
            id: i,
            x: x;
            y: y;
            valor: val;
            radio: radio;
        });
    }
}