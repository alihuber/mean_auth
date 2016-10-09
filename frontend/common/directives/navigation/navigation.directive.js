(function() {

  angular
    .module('frontend')
    .directive('navigation', navigation);

  function navigation() {
    return {
      // restricts to attribute or element name,
      // everything in template will be inserted into <navigation>
      restrict: 'AE',
      templateUrl: '/common/directives/navigation/navigation.template.html',
      controller: 'navigationCtrl as navvm'
    };
  }

})();
