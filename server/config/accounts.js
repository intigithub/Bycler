// Set up login services
Meteor.startup(function() {
    // Remove configuration entries in case service is already configured
    ServiceConfiguration.configurations.remove({
        $or: [{
            service: "facebook"
        }]
    });

    // Add Facebook configuration entry
    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "304310749756322",
        "secret": "352b8ed5f9a2e614b11f9ad0696e8291"
    });

    //Leo Test mobile facebook 304310749756322 352b8ed5f9a2e614b11f9ad0696e8291

});

