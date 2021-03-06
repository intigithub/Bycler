var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
    // set up a swipe left / right handler
    // Only show the connection error box if it has been 5 seconds since
    // the app started
    setTimeout(function () {
        // Launch screen handle created in lib/router.js
        dataReadyHold.release();

        // Show the connection error box
        Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
    }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appBody.rendered = function () {
    this.find('#content-container')._uihooks = {
        insertElement: function (node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn(function () {
                });
        },
        removeElement: function (node) {
            $(node).fadeOut(function () {
                $(this).remove();
            });
        }
    };
};
Template.appBody.helpers({
    getUserId: function () {
      return Meteor.user()._id;
    },
    getBackgroundStyle: function () {
        if (Meteor.user().profile.image) {
            return (Meteor.user().profile.image);
        } else {
            if (Meteor.user().profile.picture) {
                return (Meteor.user().profile.picture);
            }
            else {
                return "/imgs/navigation/foto_perfil_mdpi.png";
            }
        }
    },
    // We use #each on an array of one item so that the "list" template is
    // removed and a new copy is added when changing lists, which is
    // important for animation purposes. #each looks at the _id property of it's
    // items to know when to insert a new item and when to update an old one.
    menuOpen: function () {
        return Session.get(MENU_KEY) && 'menu-open';
    },
    cordova: function () {
        return Meteor.isCordova && 'cordova';
    },
    emailLocalPart: function () {
        if (Meteor.user().services.facebook) {
            return Meteor.user().profile.name;
        } else {
            var email = Meteor.user().emails[0].address;
            return email.substring(0, email.indexOf('@'));
        }
    },
    getName: function () {
        if (Meteor.user().profile.name) {
            return Meteor.user().profile.name;
        } else {
            if (Meteor.user().services.facebook) {
                return Meteor.user().profile.name;
            } else {
                var email = Meteor.user().emails[0].address;
                return email.substring(0, email.indexOf('@'));
            }
        }
    },
    userMenuOpen: function () {
        return Session.get(USER_MENU_KEY);
    },
    connected: function () {
        if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});

Template.appBody.events({
    'click .js-menu': function () {
        Session.set(MENU_KEY, !Session.get(MENU_KEY));
    },

    'click .content-overlay': function (event) {
        Session.set(MENU_KEY, false);
        event.preventDefault();
    },

    'click .js-user-menu': function (event) {
        Session.set(USER_MENU_KEY, !Session.get(USER_MENU_KEY));
        // stop the menu from closing
        event.stopImmediatePropagation();
    },

    'click #menu a': function () {
        Session.set(MENU_KEY, false);
    },

    'click .js-logout': function () {
        Meteor.logout(function (err) {
            Router.go('signin');
        });
    }
});