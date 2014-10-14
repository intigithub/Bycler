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
    "appId": "296870120500385",
    "secret": "427f178bcbe43791448f361f72003c37"
  });

});

