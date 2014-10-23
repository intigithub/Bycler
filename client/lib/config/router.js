/**
 * Created by zilnus on 20-10-14.
 */
Router.configure({
    layoutTemplate: 'layout'/*,
     notFoundTemplate: 'notFound',
     loadingTemplate: 'loading'*/
});
Router.map(function () {
    /**
     * Redirects user on login.
     */
    this.route('login', {
        path: '/',
        template: 'login',
        redirectOnLogin: function () {
            Router.go('/googleMap');
        }
    });
    /**
     * SeeYouLater (salir) redirect to home and logout
     */
    this.route('seeYouLater', {
        path: '/seeYouLater',
        template: 'login',
        onBeforeAction: function () {
            Meteor.logout();
        }
    });

    /**
     * Sends user to map on login.
     */
    this.route('loginRedirectRoute', {
        action: function () {
            Router.go('/googleMap');
        }
    });
    /**
     * Show Bycler Map
     */
    this.route('googleMap', {
        path: '/googleMap',
        template: 'googleMap',
        loginRequired: 'login'
    });
    /**
     * Show Event List
     */
    this.route('events', {
        path: '/events',
        template: 'events',
        loginRequired: 'login'
    });
    /**
     * Show User Tracks List
     */
    this.route('userTrackList', {
        path: '/userTrackList',
        template: 'userTrackList',
        loginRequired: 'login'
    });
    /**
     * From userTrackList item to googleMap
     */
});