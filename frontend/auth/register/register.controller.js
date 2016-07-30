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
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .error(function(err) {
          alert(err);
        })
        .then(function() {
          $location.path('profile');
        });
    };
  }

})();
