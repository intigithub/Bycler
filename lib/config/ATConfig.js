
AccountsTemplates.removeField('email');
AccountsTemplates.addField({
    _id: 'email',
    type: 'email',
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'error.accounts.Invalid email',
    trim: true,
    lowercase: true,
});

/*
 AccountsTemplates.addField({
 _id: "username_and_email",
 type: "text",
 displayName: "Name or Email",
 placeholder: "name or email",
 });
 */


AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    displayName: {
        signIn: "Password"
    },
    placeholder: {
        signUp: "al menos 6 caracteres"
    },
    required: true,
    minLength: 6
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Full Name",
    //minLength: 5,
    //maxLength: 30,
    trim: true
});
/*
AccountsTemplates.addField({
    _id: 'phone',
    type: 'tel',
    displayName: "Phone"
});
*/
AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    overrideLoginErrors: true,
    sendVerificationEmail: false,

    showAddRemoveServices: true,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,

    privacyUrl: '/privacyPolicy',
    termsUrl: '/termsOfUse',

    continuousValidation: true,
    negativeFeedback: true,
    positiveFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
});


AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/signin',
    redirect: '/googleMap',
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/signup',
    redirect: '/googleMap',
});
AccountsTemplates.configureRoute('forgotPwd', {
    path: '/forgotpassword',
    layoutTemplate: 'simpleLayout',
});

//AccountsTemplates.configureRoute('changePwd' /*, {layoutTemplate: 'simpleLayout'}*/);
AccountsTemplates.configureRoute('resetPwd' /*, {layoutTemplate: 'simpleLayout'}*/);
AccountsTemplates.configureRoute('enrollAccount' /*, {layoutTemplate: 'simpleLayout'}*/);


Meteor.startup(function(){
    AccountsTemplates.init();
});

