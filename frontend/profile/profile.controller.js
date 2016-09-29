(function() {

  function AuthenticationException(message) {
    this.message = "Error loading profile: " + message;
  }

  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData'];
  function profileCtrl($location, meanData) {
    var vm = this;

    vm.user = {};

    meanData.getProfile()
      .success(function(data) {
        vm.user = data;
      })
      .error(function(e) {
        throw new AuthenticationException(e);
      });
  }

})();
