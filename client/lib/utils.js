<<<<<<< HEAD
=======
GeoLog = new Mongo.Collection('geo_log');

>>>>>>> 67fdd47f83b0d15824b1f091945b81b0fb04e3f9
setActiveLinks = _.debounce(function() {
    $("ul.nav.navbar-nav li.active").removeClass('active');
    $("ul.nav.navbar-nav li a[href='" + location.pathname + "']").parent().addClass('active');
});

Handlebars.registerHelper("not", function(obj) {
  return !obj;
});