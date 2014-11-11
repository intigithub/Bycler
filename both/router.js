/**
 * Created by zilnus on 20-10-14.
 */


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
    /*   notFoundTemplate: 'notFound',*/
})
;

/** Redirects user on login. */
Router.route('/login', {
    waitOn: function () {
        return;
    },
    onBeforeAction: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready())
            if (Meteor.user()) {
                Router.go('/googleMap');
            }
            else {
                this.render('Loading');
            }
    }
});

/** Redirects user on login. */
Router.route('/', {
    waitOn: function () {
        return;
    },
    onBeforeAction: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready())
            this.render('login');
        else {
            this.render('Loading');
        }
    }
});

/** SeeYouLater (salir) redirect to home and logout */
Router.route('/seeYouLater', {
        action: function () {
            Meteor.logout();
            this.render('login');
        }
    }
);

/** Hacia donde lleva el redirect de login.*/
Router.route('/loginRedirectRoute', {
    loginRequired: 'login'
}, {
    action: function () {
        Router.go('/googleMap');
    }
});

/** Google Map Show */
Router.route('/googleMap', {
    name: 'googleMap',
    waitOn: function () {
        Meteor.subscribe('basic');
        Meteor.subscribe('user_tracks')
        return Meteor.subscribe('markers');
    },
    onBeforeAction: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready())
            this.render('googleMap');
        else {
            this.render('Loading');
        }
    }
});

/** Event List */
Router.route('/userEventList', {
    name: 'userEventList', loginRequired: 'login',
    waitOn: function () {
        return Meteor.subscribe("markers");
    },
    action: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready())
            this.render('userEventList');
        else
            this.render('Loading');
    }
});
/** User Recorded Track List */
Router.route('/userTrackList', {
    name: 'userTrackList', loginRequired: 'login',
    waitOn: function () {
        return Meteor.subscribe("user_tracks");
    },
    action: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready())
            this.render('userTrackList');
        else
            this.render('Loading');
    }
});

Router.route('/userTrackDetail/:_id', {
    name: 'userTrackDetail', waitOn: function () {

        return Meteor.subscribe('user_tracks');
    }, data: function () {
        Session.set('trackIdInView', this.params._id);
        return trackId = this.params._id;
    },
    action: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready()) {
            this.render('userTrackDetail');
        }
        else
            this.render('Loading');
    }
})
;