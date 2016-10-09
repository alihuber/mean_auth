(function() {

  angular
    .module('frontend')
    .service('userData', userData);

  userData.$inject = ['$http', 'authentication'];
  function userData($http, authentication) {

    var getUsers = function() {
      return $http.get('/api/users', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getUsers : getUsers
    };
  }

})();
