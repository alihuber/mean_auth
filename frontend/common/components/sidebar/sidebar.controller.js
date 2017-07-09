(function() {

  function AuthenticationException(message) {
    this.message = "Error loading user: " + message;
  }

  angular
    .module('frontend')
    .component('sidebar', {
      templateUrl: '/common/components/sidebar/sidebar.template.html',
      controller: sidebarCtrl,
      controllerAs: 'vm'
    });

  sidebarCtrl.$inject = ['authentication', 'profileData'];
  function sidebarCtrl(authentication, profileData) {
    var vm = this;
    vm.isLoggedIn  = authentication.isLoggedIn();


    profileData.getProfile()
      .success(function(data) {
        userId  = data._id;
        vm.user = data;
        vm.folders = data.folders;
      })
      .error(function(e) {
        throw new AuthenticationException(e);
      });

  }

})();
