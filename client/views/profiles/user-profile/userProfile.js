// counter starts at 0
Session.setDefault("counter", 0);

Template.userProfile.events({
    'click .img-circle': function () {
        $('#editYourAvatarModal').modal();
    },
    'change #input-full-name': function() {
        var fullName = $('#input-full-name').val();
        $('#title-full-name').show();
        $('#div-full-name').hide();
        Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.fullName" : fullName } });
    },
    'change #input-user-name': function() {
        var lastUserName = Meteor.user().profile.name;
        var userName = $('#input-user-name').val();
        
        var exist = Meteor.users.find({ "profile.name" : userName }).count()==1;
        
        if(!exist) {
            Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.name" : userName } });
        } else {
            $('#input-user-name').val(lastUserName);
        }
    },
    'click #title-full-name': function() {
        $('#title-full-name').hide();
        $('#div-full-name').show();
        $('#input-full-name').select();
    }
});

Template.userProfile.helpers({
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
    }
});

Template.userProfile.rendered = function () {
    $('.rateit-profile').rateit();
}
