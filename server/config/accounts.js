// Set up login services
Meteor.startup(function() {
    // Remove configuration entries in case service is already configured
    ServiceConfiguration.configurations.remove({
        $or: [{
            service: "facebook"
        }]
    });

<<<<<<< HEAD
  // Add Facebook configuration entry
  ServiceConfiguration.configurations.insert({
    "service": "facebook",
    "appId": "1624038611156909",
    "secret": "66c008a07a435d9cafc7442300b74f89"
  });
=======
    // Add Facebook configuration entry
    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "304310749756322",
        "secret": "352b8ed5f9a2e614b11f9ad0696e8291"
    });

    //Leo Test mobile facebook 304310749756322 352b8ed5f9a2e614b11f9ad0696e8291

>>>>>>> 67fdd47f83b0d15824b1f091945b81b0fb04e3f9
});

