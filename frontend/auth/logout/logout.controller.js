(function() {

  angular
  .module('frontend')
  .controller('logoutCtrl', logoutCtrl);

  logoutCtrl.$inject = ['$location', 'authentication'];
  function logoutCtrl($location, authentication) {
    authentication.logout();
  }
})();
