// Set up login services
Meteor.startup(function () {
    Accounts.onCreateUser(function (options, user) {
        if (options.profile) {
            //want the users facebook pic and it is not provided by the facebook.service
            options.profile.image = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            options.profile.name = giveMeUniqueName(options.profile.name);
            options.profile.fullName = '';
            options.profile.country = '';
            options.profile.city = '';
            options.profile.kmAccum = '';
            options.profile.level = 1;
            user.profile = options.profile;
        } else {
            var email = user.emails[0].address;
            user.profile = {
                image: "/imgs/navigation/foto_perfil_mdpi.png",
                picture: "/imgs/navigation/foto_perfil_mdpi.png",
                name: giveMeUniqueName(email.substring(0, email.indexOf('@'))),
                fullName: '',
                country: '',
                city: '',
                kmAccum: 0,
                level: 1
            }
            ;
        }
        // 0 = public 1 = friends 2 = no visible
        user.currentLocation = {
            latitude: 0,
            longitude: 0,
            allowViewLevel: 0
        };
        user.stats = {
            markersCount: 0,
            rating: 2.5
        };
        user.isUpdatedFields = '0.0.5';
        return user;
    });

    ServiceConfiguration.configurations.remove({
        $or: [{service: "facebook"}]
    });

    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "305948542925876",
        "secret": "df05c0af61a70f92bbb6fcd3c0ce49d0"
    });
    /*
     Leo:
     appId 305948542925876
     secret df05c0af61a70f92bbb6fcd3c0ce49d0
     Edu:
     appId 1620984164795687
     secret 5ac1e79fd2444feafe5885d4c4b84866
     Prod:
     appId 296870120500385
     secret 427f178bcbe43791448f361f72003c37
     */
})
;


