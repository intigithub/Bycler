if(Meteor.isServer) {
  Meteor.publish("markers", function () {
    return Markers.find({});
  });
  
  Meteor.publish("byclers", function () {
    return Byclers.find({});
  });
}
