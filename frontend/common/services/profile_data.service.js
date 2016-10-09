(function() {

  angular
    .module('frontend')
    .service('profileData', profileData);

  profileData.$inject = ['$http', 'authentication'];
  function profileData($http, authentication) {

    var getProfile = function() {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile
    };
  }

})();
