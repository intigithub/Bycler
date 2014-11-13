// Set up login services
Meteor.startup(function () {
    Accounts.onCreateUser(function (options, user) {
        if (options.profile) {
            //want the users facebook pic and it is not provided by the facebook.service
            options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            user.profile = options.profile;
        }
        return user;
    });
    // Remove configuration entries in case service is already configured
    ServiceConfiguration.configurations.remove({
        $or: [
            {
                service: "facebook"
            }
        ]
    });
    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "305948542925876",
        "secret": "df05c0af61a70f92bbb6fcd3c0ce49d0"
    });

    /*
     // EDU
     ServiceConfiguration.configurations.insert({
     "service": "facebook",
     "appId": "1620984164795687",
     "secret": "5ac1e79fd2444feafe5885d4c4b84866"
     });
     */
    //Productivo
    /*ServiceConfiguration.configurations.insert({
     "service": "facebook",
     "appId": "296870120500385",
     "secret": "427f178bcbe43791448f361f72003c37"
     });*/
});


