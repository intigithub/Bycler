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
    "appId": "1624038611156909",
    "secret": "66c008a07a435d9cafc7442300b74f89"
  });

});

