(function() {
  
  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['authentication'];
    function homeCtrl(authentication) {
      var vm = this;
      vm.isLoggedIn  = authentication.isLoggedIn();
      vm.currentUser = authentication.currentUser();
      if(vm.currentUser !== undefined) {
        vm.isAdmin   = vm.currentUser.isAdmin;
      }
    }

})();
