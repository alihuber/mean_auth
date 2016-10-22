(function() {

  angular
    .module('frontend')
    .controller('userCtrl', userCtrl);

  userCtrl.$inject = ['$location', 'flash', 'userData', 'userForm'];
  function userCtrl($location, flash, userData, userForm) {
    var vm     = this;
    var userId = userData.getUserId();

    vm.saveUser = function() {
      userData.updateUser(userId, vm.credentials).success(function() {
        flash.setSuccessMessage("User was successfully updated.");
        $location.path('users');
      })
      .error(function(err) {
        vm.message = err.message;
        $location.path($location.path());
      });
    };

    vm.createUser = function() {
      userData.createUser(vm.credentials).success(function() {
        flash.setSuccessMessage("User was successfully created.");
        $location.path('users');
      })
      .error(function(e) {
        vm.message = err.message;
        $location.path($location.path());
      });
    };

    vm.deleteUser = function(id) {
      userData.deleteUser(id).success(function() {
        flash.setSuccessMessage("User was successfully deleted.");
        $location.path('users');
      })
      .error(function(e) {
        vm.message = err.message;
        $location.path($location.path());
      });
    };

    userData.getUser(userId)
      .success(function(data) {
        vm.user = data.user;
        if(data.user) {
          vm.credentials = {
            username : vm.user.username,
            isAdmin  : vm.user.isAdmin,
            password : ""
          };
        } else {
          vm.user = {};
          vm.credentials = {
            username : "",
            isAdmin  : false,
            password : ""
          };
        }
        vm.userFields = userForm.userFields;
      })
    .error(function(e){
      console.log(e);
    });

  }

})();
