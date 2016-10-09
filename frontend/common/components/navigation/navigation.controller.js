(function() {

  angular
    .module('frontend')
    .component('navigation', {
      templateUrl: '/common/components/navigation/navigation.template.html',
      controller: navigationCtrl,
      controllerAs: 'vm'
    });

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
