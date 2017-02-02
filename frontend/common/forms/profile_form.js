(function() {

  angular
  .module('frontend')
  .factory('profileForm', profileForm);

  function profileForm() {
    var intervalOptions =
      [
        {"name": "Every 5 minutes", "value": "every 5 minutes"},
        {"name": "Every 10 minutes", "value": "every 10 minutes"},
        {"name": "Every 30 minutes", "value": "every 30 minutes"},
        {"name": "Every hour", "value": "every 1 h"},
        {"name": "Every 2 hour", "value": "every 2 hours"},
        {"name": "Every 3 hours", "value": "every 3 hours"},
        {"name": "Every 6 hours", "value": "every 6 hours"}
      ];
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
      },
      {
        key: 'checkInterval',
        type: 'select',
        templateOptions: {
          label: 'Check interval',
          options: intervalOptions
        }
      }
    ];

    return {
      profileFields: profileFields
    };
  }
})();
