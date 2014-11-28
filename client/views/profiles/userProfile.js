/**
 * Created by meteor on 25-11-14.
 */
if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault("counter", 0);

    Template.userProfile.events({
        'click .img-circle': function () {
            $('#editYourAvatarModal').modal();
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
        $('.selectpickercountry').selectpicker();
        $('.selectpickercity').selectpicker();
    }

}
