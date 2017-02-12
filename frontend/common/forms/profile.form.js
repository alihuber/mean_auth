(function() {

  angular
  .module('frontend')
  .factory('profileForm', profileForm);

  function profileForm() {
    var profileFields = [
      {
        key: 'username',
        type: 'input',
        templateOptions: {
          type: 'text',
          label: 'Username',
          placeholder: 'Username',
          required: true
        }
      }
    ];

    return {
      profileFields: profileFields
    };
  }
})();
