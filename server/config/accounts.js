// Set up login services
Meteor.startup(function() {
    // Remove configuration entries in case service is already configured
    ServiceConfiguration.configurations.remove({
        $or: [{
            service: "facebook"
        }]
    });

    // LEO
    /*ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "304310749756322",
        "secret": "352b8ed5f9a2e614b11f9ad0696e8291"
    });*/

    // EdU
    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "1620984164795687 ",
        "secret": "5ac1e79fd2444feafe5885d4c4b84866"
    });
});

