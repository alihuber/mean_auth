(function() {

  angular
    .module('frontend')
    .component('usersTable', {
      templateUrl: '/users/users_table/users_table.template.html',
      controller: usersTableCtrl,
      controllerAs: 'vm'
    });

  usersTableCtrl.$inject = ['userData'];
  function usersTableCtrl(userData) {
    var vm   = this;
    vm.users = {};
    userData.getUsers()
      .success(function(data){
        vm.users = data.users;
      })
    .error(function(e){
      console.log(e);
    });
  }

})();
