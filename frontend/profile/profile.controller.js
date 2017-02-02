(function() {

  function AuthenticationException(message) {
    this.message = "Error loading profile: " + message;
  }

  angular
    .module('frontend')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'flash', 'profileData', 'profileForm'];
  function profileCtrl($location, flash, profileData, profileForm) {
    var vm            = this;
    var userId        = "";

    vm.updateProfile = function() {
      profileData.updateProfile(userId, vm.credentials).success(function() {
        flash.setSuccessMessage("Profile was successfully updated.");
        $location.path('home');
      })
      .error(function(err) {
        vm.message = err.message;
        $location.path($location.path());
      });
    };



    vm.profileFields = profileForm.profileFields;
    vm.user = {};

    profileData.getProfile()
      .success(function(data) {
        userId  = data._id;
        vm.user = data;
        vm.credentials = {
          username : vm.user.username,
          checkInterval : vm.user.checkInterval
        };
      })
      .error(function(e) {
        throw new AuthenticationException(e);
      });
  }

})();
