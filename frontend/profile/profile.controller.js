(function() {

  function AuthenticationException(message) {
    this.message = "Error loading profile: " + message;
  }

  angular
    .module('frontend')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'profileData'];
  function profileCtrl($location, profileData) {
    var vm = this;

    vm.user = {};

    profileData.getProfile()
      .success(function(data) {
        vm.user = data;
      })
      .error(function(e) {
        throw new AuthenticationException(e);
      });
  }

})();
