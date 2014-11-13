var ERRORS_KEY = 'signinErrors';

Template.signin.created = function () {
    Session.set(ERRORS_KEY, {});
};

Template.signin.helpers({
    errorMessages: function () {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function (key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

Template.signin.events({
    'click #facebook-login-with': function (event) {
        event.preventDefault();
        Meteor.loginWithFacebook({
            requestPermissions: ['publish_actions']
        }, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log('go to map succes login facebook');
                Router.go('/googleMap');
            }
        });
    },
    'submit': function (event, template) {
        event.preventDefault();

        var email = template.$('[name=email]').val();
        var password = template.$('[name=password]').val();

        var errors = {};

        if (!email) {
            errors.email = 'Email is required';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return;
        }

        Meteor.loginWithPassword(email, password, function (error) {
            if (error) {
                return Session.set(ERRORS_KEY, {'none': error.reason});
            }

            Router.go('/googleMap');
        });
    }
});