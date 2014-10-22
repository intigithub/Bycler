Template.login.helpers({
    checkUserLogin: function () {
        if(Meteor.user() != null){
            Router.go('googleMap')
        }
    }
});