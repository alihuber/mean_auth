(function() {

  angular
    .module('meanApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication', 'credentialsForm'];
  function registerCtrl($location, authentication, credentialsForm) {
    var vm = this;

    vm.credentials = {
      username : "",
      password : ""
    };

    vm.credentialsFields = credentialsForm.credentialsFields;

    vm.onSubmit = function() {
      authentication
        .register(vm.credentials)
        .error(function(err) {
          vm.message = err;
          $location.path('register');
        })
        .then(function() {
          $location.path('profile');
        });
    };
  }

})();
