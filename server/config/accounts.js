// Set up login services
Meteor.startup(function () {
    Accounts.onCreateUser(function (options, user) {

        function giveMeUniqueName(nameUnique) {
            if (Meteor.users.find({'profile.name':'leoleo'}).count() == 0) {
                return nameUnique
            } else {
                for (var i = 1; i < 9999; i++) {
                    nameUnique = nameUnique + '_' + i.toString();
                    if (Meteor.users.find({'profile.name': nameUnique}).count() == 0) {
                        return nameUnique;
                    }
                }
            }
        }

        if (options.profile) {
            //want the users facebook pic and it is not provided by the facebook.service
            options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            options.profile.name = giveMeUniqueName(options.profile.name);
            user.profile = options.profile;
        } else {
            var email = user.emails[0].address;
            user.profile = {
                name: giveMeUniqueName(email.substring(0, email.indexOf('@')))
            };
        }
        user.currentLocation = {
            latitude: 0,
            longitude: 0
        };
        return user;
    });

    ServiceConfiguration.configurations.remove({
        $or: [{service: "facebook"}]
    });

    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "296870120500385",
        "secret": "427f178bcbe43791448f361f72003c37"
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
});


