Router.configure({
    notFoundTemplate: 'pageNotFound',
    layoutTemplate: 'masterLayout',
    yieldTemplates: {
        nav: {
            to: 'nav'
        },
        footer: {
            to: 'footer'
        }
    }
});


Router.onRun(function(){setActiveLinks();});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'homeMain',
        onBeforeAction: function(){
            AccountsTemplates.setState('signIn');
        }
    });

<<<<<<< HEAD
    this.route('eventos', {
        path: '/eventos',
        template: 'eventos'
=======
    this.route('fullPage', {
        path: '/full',
        template: 'fullPage',
        onBeforeAction: function(){
            AccountsTemplates.setState('signIn');
         }
>>>>>>> 67fdd47f83b0d15824b1f091945b81b0fb04e3f9
    });

    this.route('profilePage', {
        path: '/profile',
        template: 'profile'
    });

    this.route('statesPage', {
        path: '/states',
        template: 'states',
        onBeforeAction: function(){
            AccountsTemplates.setState('signIn');
        }
    });

    this.route('mainContent', {
        path: '/mainContent',
        template: 'mainContent',
        onBeforeAction: AccountsTemplates.ensureSignedIn,
    });
});
