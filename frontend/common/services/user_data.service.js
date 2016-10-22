(function() {

  angular
    .module('frontend')
    .service('userData', userData);

  userData.$inject = ['$http', 'authentication'];
  function userData($http, authentication) {

    var userId = "";

    var setUserId = function(id) {
      this.userId = id;
    };

    var getUserId = function() {
      return this.userId;
    };

    var getUsers = function() {
      return $http.get('/api/users', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var getUser = function(id) {
      return $http.get('/api/user/' + id, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var deleteUser = function(id) {
      return $http.delete('/api/user/' + id, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var updateUser = function(id, credentials) {
      return $http.put('/api/user/' + id, credentials, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var createUser = function(credentials) {
      return $http.post('/api/user', credentials, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getUsers   : getUsers,
      getUser    : getUser,
      setUserId  : setUserId,
      getUserId  : getUserId,
      createUser : createUser,
      deleteUser : deleteUser,
      updateUser : updateUser
    };
  }

})();
