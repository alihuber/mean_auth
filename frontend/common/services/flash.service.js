(function() {

  angular
    .module('frontend')
    .service('flash', flash);

  function flash() {

    var successMessage = "";
    var errorMessage = "";

    var getSuccessMessage = function() {
      return this.successMessage;
    };

    var setSuccessMessage = function (message) {
      this.successMessage = message;
    };

    var getErrorMessage = function() {
      return this.errorMessage;
    };

    var setErrorMessage = function(message) {
      this.errorMessage = message;
    };

    var cleanMessages = function() {
      this.errorMessage = undefined;
      this.successMessage = undefined;
    };

    return {
      getErrorMessage : getErrorMessage,
      getSuccessMessage : getSuccessMessage,
      setErrorMessage : setErrorMessage,
      setSuccessMessage : setSuccessMessage,
      cleanMessages : cleanMessages
    };
  }

})();
