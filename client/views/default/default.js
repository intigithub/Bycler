/**
 * Created by zilnus on 20-10-14.
 */
Template.layout.helpers({
    logOutUser: function () {
        Meteor.logout();
    }
});