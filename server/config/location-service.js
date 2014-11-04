if (Meteor.isServer) {
    Router.map(function () {
        // REST(ish) API
        // Cordova background/foreground can post GPS data HERE
        //
        // POST data should be in this format
        //   {
        //     location: {
        //       latitude: Number,
        //       longitude: Number,
        //       accuracy: Match.Optional(Number),
        //       speed: Match.Optional(Number),
        //       recorded_at: Match.Optional(String)s
        //     },
        //     userId: Match.Optional(String),
        //     uuid: Match.Optional(String),
        //     device: Match.Optional(String)
        //   }
        this.route('GeolocationBGRoute', {
            path: '/api/geolocation',
            where: 'server',
            action: function () {
                // GET, POST, PUT, DELETE
                var requestMethod = this.request.method;
                // Data from a POST request
                var requestData = this.request.body;

                // log stuff
                console.log('GeolocationBG post: ' + requestMethod);
                console.log(JSON.stringify(requestData));

                // TODO: security/validation
                //  require some security with data
                //  validate userId/uuid/etc (inside Meteor.call?)

                // Can insert into a Collection from the server (or whatever)
                var id = GeoLog.insert(requestData);
                if (id) {
                    console.log('GeolocationBG inserted to');
                    this.response.writeHead(200, {'Content-Type': 'application/json'});
                    this.response.end('ok');

                    var geoLogCurrent = GeoLog.findOne({'_id': id});
                    console.log('geoLogCurrent ' + geoLogCurrent);
                    var userId = geoLogCurrent.userId;
                    console.log('userId ' + userId);
                    var trackId = UserTrack.findOne({'userId': userId}, {sort: {created: -1}})._id;
                    console.log('trackId ' + trackId);
                    GeoLog.update({'_id': id}, {$set: {trackId: trackId, pointDateTime: new Date()}});
                    return;
                }
                // if we end up with an error case, you can return 500
                console.log('GeolocationBG failed to insert');
                this.response.writeHead(500, {'Content-Type': 'application/json'});
                this.response.end('failure');
            }
        });
    });
}

