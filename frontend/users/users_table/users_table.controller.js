(function() {

  angular
    .module('frontend')
    .component('usersTable', {
      templateUrl: '/users/users_table/users_table.template.html',
      controller: usersTableCtrl,
      controllerAs: 'vm'
    });

  usersTableCtrl.$inject = ['$location', 'userData', 'flash'];
  function usersTableCtrl($location, userData, flash) {
    var vm            = this;
    vm.users          = {};
    vm.errorMessage   = flash.getErrorMessage();
    vm.successMessage = flash.getSuccessMessage();
    flash.cleanMessages();

    vm.editUser = function(id) {
      userData.setUserId(id);
      $location.path('user/id/' + id);
    };

    vm.newUser = function() {
      userData.setUserId("");
      $location.path('user/id/');
    };

    userData.getUsers()
      .success(function(data){
        vm.users = data.users;
      })
    .error(function(e){
      console.log(e);
    });
  }

})();
