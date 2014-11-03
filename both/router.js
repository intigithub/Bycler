/**
 * Created by zilnus on 20-10-14.
 */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
    /*   notFoundTemplate: 'notFound',*/
})
;

/** Redirects user on login. */
Router.route('/login', {
    redirectOnLogin: function () {
        if (Meteor.user()) {
            Router.go('/googleMap');
        }
        else {
            this.render('login');
        }

    }
}, function () {
    this.render('login');
});

/** Redirects user on login. */
Router.route('/', function () {
    this.render('login');
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
    name: 'userTrackDetail', loginRequired: 'login',
    waitOn: function () {
        return;
    },
    action: function () {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready())
            this.render('userTrackDetail');
        else
            this.render('Loading');
    }
});

