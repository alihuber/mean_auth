(function() {
  angular.module('frontend', ['ngRoute', 'formly', 'formlyBootstrap']);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: 'auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: 'profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/users', {
        templateUrl: 'users/users.view.html'
      })
      .when('/user/id/:id', {
        templateUrl: 'users/user.view.html',
        controller: 'userCtrl',
        controllerAs: 'vm'
      })
      .when('/user/id', {
        templateUrl: 'users/user.view.html',
        controller: 'userCtrl',
        controllerAs: 'vm'
      })
      .when('/logout', {
        templateUrl: 'home/home.view.html',
        controller: 'logoutCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart',
      function() {
        if($location.path() === '/profile' && !authentication.isLoggedIn()) {
          $location.path('/');
        }
        if($location.path() === '/users' && !authentication.isLoggedIn()) {
          $location.path('/');
        }
        if($location.path() === '/users' &&
            authentication.isLoggedIn() && !authentication.isAdmin()) {
          $location.path('/');
        }
      });
  }
  
  // order on angular module: .config(), .run(), controller()
  angular
  .module('frontend')
  .config(['$routeProvider', '$locationProvider', config])
  .run(['$rootScope', '$location', 'authentication', run]);

})();
