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
<<<<<<< HEAD
    });*/

    // EdU
    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "1620984164795687 ",
        "secret": "5ac1e79fd2444feafe5885d4c4b84866"
    });

=======
    })


    //Leo Test localhost facebook 304310749756322 352b8ed5f9a2e614b11f9ad0696e8291
    //Leo Test mobile device facebook 305948542925876 df05c0af61a70f92bbb6fcd3c0ce49d0
>>>>>>> babce7d88f011aeafb8e64d96a7f710b1e50e67f

});

