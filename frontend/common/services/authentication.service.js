(function() {

  angular
    .module('frontend')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];
  function authentication($http, $window) {

    var saveToken = function(token) {
      $window.localStorage['session-token'] = token;
    };

    var getToken = function() {
      return $window.localStorage['session-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token) {
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var isAdmin = function() {
      var token = getToken();
      var payload;

      if(token) {
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.isAdmin;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()) {
        var token   = getToken();
        var payload = token.split('.')[1];
        payload     = $window.atob(payload);
        payload     = JSON.parse(payload);
        return {
          isAdmin  : payload.isAdmin,
          username : payload.username
        };
      }
    };

    var register = function(user) {
      return $http.post('/api/register', user).success(function(data) {
        saveToken(data.token);
      });
    };

    var login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('session-token');
    };

    return {
      currentUser: currentUser,
      saveToken  : saveToken,
      getToken   : getToken,
      isLoggedIn : isLoggedIn,
      isAdmin    : isAdmin,
      register   : register,
      login      : login,
      logout     : logout
    };
  }

})();
