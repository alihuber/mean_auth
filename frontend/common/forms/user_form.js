(function() {

  angular
  .module('frontend')
  .factory('userForm', userForm);

  function userForm() {
      var userFields = [
        {
          key: 'username',
          type: 'input',
          templateOptions: {
            type: 'text',
            label: 'Username',
            placeholder: 'Username',
            required: true
            }
        },
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Password',
            placeholder: 'Password',
            required: true
          }
        },
        {
          key: 'isAdmin',
          type: 'checkbox',
          templateOptions: {
            type: 'checkbox',
            label: 'Administrator',
            required: false
          }
        }
      ];

      return {
        userFields: userFields
      };
  }
})();
