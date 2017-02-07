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

    var updateProfile = function(id, credentials) {
      return $http.put('/api/profile', credentials, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      updateProfile : updateProfile
     };
  }

})();
