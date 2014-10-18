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

    this.route('fullPage', {
        path: '/full',
        template: 'fullPage',
        onBeforeAction: function(){
            AccountsTemplates.setState('signIn');
         }
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
