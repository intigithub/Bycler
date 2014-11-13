Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'appNotFound',
    loadingTemplate: 'appLoading'
});

dataReadyHold = null;

if (Meteor.isClient) {
    dataReadyHold = LaunchScreen.hold();
    Router.onBeforeAction('loading', {except: ['join', 'signin']});
    Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
Router.route('join');
Router.route('signin');

Router.route('home', {
    path: '/',
    template: 'signin'
});
Router.route('/googleMap', {
    name: 'googleMap',
    template: 'googleMap',
    path: '/googleMap',
    waitOn: function () {
        Meteor.subscribe('basic');
        Meteor.subscribe('user_tracks')
        return Meteor.subscribe('markers');
    }
});
/** Event List */
Router.route('/userEventList', {
    name: 'userEventList',
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
    name: 'userTrackList',
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
if (Meteor.isClient) {
    Router.onBeforeAction('loading', {except: ['join', 'signin']});
    Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}