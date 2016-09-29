(function() {

  angular
  .module('meanApp')
  .controller('logoutCtrl', logoutCtrl);

  logoutCtrl.$inject = ['$location', 'authentication'];
  function logoutCtrl($location, authentication) {
    authentication.logout();
  }
})();
