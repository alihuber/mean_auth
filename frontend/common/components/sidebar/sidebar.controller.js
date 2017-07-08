(function() {

  angular
    .module('frontend')
    .component('sidebar', {
      templateUrl: '/common/components/sidebar/sidebar.template.html',
      controller: sidebarCtrl,
      controllerAs: 'vm'
    });

  sidebarCtrl.$inject = ['authentication'];
  function sidebarCtrl(authentication) {
    var vm = this;
    vm.isLoggedIn  = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    if(typeof vm.currentUser !== 'undefined') {
      vm.isAdmin   = vm.currentUser.isAdmin;
    }
  }

})();
