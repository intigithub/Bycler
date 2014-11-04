Template.login.helpers({
    checkUserLogin: function () {
        if (Meteor.user() != null) {
            Router.go('/googleMap')
        }
    }
});
Template.login.rendered = function () {
    //$('#myModal').modal('show');
}