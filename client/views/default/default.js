var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

Template.layout.helpers({
    logOutUser: function () {
        Meteor.logout();
    },
    connected: function () {
        if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});

var isOpen = false, bodyEl = $('body');

Template.layout.events({
    'click #open-button-slide-nav': function (e) {
        e.preventDefault();
        toggleMenu();
    },
    'click .icon-list-slide-nav a': function (e) {
        toggleMenu();
    },
    'click .content-wrap-slide-nav': function (e) {
        e.preventDefault();
    }
});

function toggleMenu() {
    console.log('Toggling');
    if (isOpen) {
        $('body').removeClass('show-menu-slide-nav');
    } else {
        $('body').addClass('show-menu-slide-nav');
    }
    isOpen = !isOpen;
}