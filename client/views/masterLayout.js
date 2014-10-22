Template.masterLayout.events({
  'click #menu-toggle': function (event) {
    event.preventDefault();
    $("#wrapper").toggleClass("toggled");
  },
  'click #tracker-toggle': function (event) {
    event.preventDefault();
    $("#markers-menu-wrapper").toggleClass("toggled");
  },
  'click .marker-add img': function (event) {
    event.preventDefault();
    $("#markers-menu-wrapper").toggleClass("toggled");
    
    MarkerEditable.setIcon(new google.maps.MarkerImage(event.target.src, null, null, null,
          new google.maps.Size(48, 48)));
    MarkerEditable.setDraggable(false);
    Markers.insert({
      fecha: new Date(), 
      imgSrc: event.target.src, 
      position: MarkerEditable.getPosition()
    });
  }
});

