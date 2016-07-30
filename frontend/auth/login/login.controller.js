(function() {

  angular
  .module('meanApp')
  .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication', 'credentialsForm'];
  function loginCtrl($location, authentication, credentialsForm) {
    var vm = this;

    vm.credentials = {
      username : "",
      password : ""
    };

    vm.credentialsFields = credentialsForm.credentialsFields;

    vm.onSubmit = function() {
      authentication
        .login(vm.credentials)
        .error(function(err) {
          alert(err);
        })
        .then(function() {
          $location.path('profile');
        });
    };
  }

})();
