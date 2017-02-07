(function() {

  angular
    .module('frontend')
    .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['authentication', 'flash'];
    function homeCtrl(authentication, flash) {
      var vm = this;
      vm.errorMessage   = flash.getErrorMessage();
      vm.successMessage = flash.getSuccessMessage();
      flash.cleanMessages();

      vm.isLoggedIn  = authentication.isLoggedIn();
      vm.currentUser = authentication.currentUser();
      if(typeof vm.currentUser !== 'undefined') {
        vm.isAdmin   = vm.currentUser.isAdmin;
      }
    }

})();
