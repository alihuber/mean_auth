(function() {

  angular
    .module('frontend')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['authentication'];
  function navigationCtrl(authentication) {
    var vm = this;
    vm.isLoggedIn  = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    if(typeof vm.currentUser !== 'undefined') {
      vm.isAdmin   = vm.currentUser.isAdmin;
    }
  }

})();
