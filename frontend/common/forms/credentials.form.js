(function() {

  angular
  .module('frontend')
  .factory('credentialsForm', credentialsForm);

  function credentialsForm() {
      var credentialsFields = [
        {
          key: 'username',
          type: 'input',
          templateOptions: {
            type: 'text',
            label: 'Username',
            placeholder: 'Enter your username',
            required: true
            }
        },
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Password',
            placeholder: 'Enter your password',
            required: true
          }
        }
      ];

      return {
        credentialsFields: credentialsFields
      };
  }
})();
