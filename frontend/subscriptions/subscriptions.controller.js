(function() {

  function AuthenticationException(message) {
    this.message = 'Error loading subscriptions: ' + message;
  }

  angular
    .module('frontend')
    .controller('subscriptionsCtrl', subscriptionsCtrl);

  subscriptionsCtrl.$inject = ['$location', 'flash', 'profileData'];
  function subscriptionsCtrl($location, flash, profileData) {
    var vm = this;
    vm.newSubscriptionURL = '';



    /**
     * setup functions
     */
    profileData.getProfile()
      .success(function(data) {
        userId  = data._id;
        vm.user = data;
        vm.subscriptions = data.subscriptions;
        vm.newSubscriptionFolder = vm.user.folders[0];
        // data to update.
        // profile backend expects username, checkInterval,
        // folders, subscriptions
        vm.dataToUpdate = { 
          username : vm.user.username,
          checkInterval : vm.user.checkInterval,
          folders : vm.user.folders,
          subscriptions : vm.subscriptions
        };
        vm.vmReady = true; // ng-cloak auf diesen Wert??
      })
      .error(function(e) {
        throw new AuthenticationException(e);
      });

    /**
     * vm functions
     */
    vm.updateProfile = function($event) {
      $event.preventDefault();
      profileData.updateProfile(userId, vm.dataToUpdate).success(function() {
        flash.setSuccessMessage('Profile was successfully updated.');
        $location.path('home');
      })
      .error(function(err) {
        vm.message = err.message;
        $location.path($location.path());
      });
    };

    vm.addSubscription = function($event) {
      if(isDuplicateURL(vm.newSubscriptionURL)) {
        vm.message = 'URL already subscribed.';
        $location.path($location.path());
        return;
      }
      $event.preventDefault();
      vm.subscriptions.push({'URL': vm.newSubscriptionURL,
                             'folder': vm.newSubscriptionFolder});
      vm.newSubscriptionFolder = vm.user.folders[0];
      vm.newSubscriptionURL = '';
      vm.subscriptionForm.$setPristine();
      vm.subscriptionForm.$setUntouched();
      flash.cleanMessages();
      vm.message = undefined;
    };

    vm.removeSubscription = function(subs) {
      var index = vm.subscriptions.indexOf(subs);
      if (index >= 0) {
        vm.subscriptions.splice(index, 1);
      }
    };

    function isDuplicateURL(url) {
      var urls = [];
      for (var i = 0, len = vm.user.subscriptions.length; i < len; i++) {
        var subscription = vm.user.subscriptions[i];
        urls.push(subscription.URL);
      }
      return urls.indexOf(url) >= 0 ? true : false;
    }

  } // end subscriptionsCtrl

})();

