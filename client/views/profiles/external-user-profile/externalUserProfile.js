Template.externalUserProfile.helpers({
    getBackgroundStyleForOthers: function (id) {
        console.log(id)
        user = Meteor.users.findOne({_id: id})
        if (user) {
            return (user.profile.image);
        } else {
            if (user.profile.picture) {
                return (user.profile.picture);
            }
            else {
                return "/imgs/navigation/foto_perfil_mdpi.png";
            }
        }
    },
    getFullNameForOthers: function (id) {
        user = Meteor.users.findOne({_id: id})
        if (user.profile.fullName)
            return user.profile.fullName;
        else
            return user.profile.name;
    },
    getLevelForOthers: function (level) {
        return level.toFixed(0);
    },
    getKmAccumOther : function (kmAccum){
        console.log(kmAccum);
        if(kmAccum == ""){
            return 0;
        }
        return kmAccum.toFixed(1);
    }
});
Template.externalUserProfile.rendered = function () {
    $('.rateit-profile-other').rateit();

}