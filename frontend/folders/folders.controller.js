(function() {

  function AuthenticationException(message) {
    this.message = 'Error loading folders: ' + message;
  }

  angular
    .module('frontend')
    .controller('foldersCtrl', foldersCtrl);

  foldersCtrl.$inject = ['$location', 'flash', 'profileData'];
  function foldersCtrl($location, flash, profileData) {
    var vm       = this;
    var userId   = '';
    vm.newFolder = '';
    vm.submitted = false;

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

    vm.removeFolder = function(folder) {
      var index = vm.folders.indexOf(folder);
      if (index >= 0) {
        vm.folders.splice(index, 1);
      }
    };

    vm.updateFolder = function() {
      if(hasDuplicateFolders()) {
        vm.message = 'Folder name already taken.';
        $location.path($location.path());
        return;
      } else {
        flash.cleanMessages();
        vm.message = undefined;
      }
    };

    vm.addFolder = function($event) {
      if(isDuplicateFolder(vm.newFolder)) {
        vm.message = 'Folder name already taken.';
        $location.path($location.path());
        vm.submitted = false;
        return;
      }
      $event.preventDefault();
      vm.folders.push(vm.newFolder);
      vm.newFolder = '';
      vm.folderForm.$setPristine();
      vm.folderForm.$setUntouched();
      vm.submitted = false;
      flash.cleanMessages();
      vm.message = undefined;
    };

    /**
     * setup functions
     */
    profileData.getProfile()
      .success(function(data) {
        userId  = data._id;
        vm.user = data;
        vm.folders = data.folders;
        // data to update.
        // profile backend expects username, checkInterval, folders
        vm.dataToUpdate = { 
          username : vm.user.username,
          checkInterval : vm.user.checkInterval,
          folders : vm.folders
        };
      })
      .error(function(e) {
        throw new AuthenticationException(e);
      });


    /**
     * controller private functions
     */
    function hasDuplicateFolders() {
      var len = vm.folders.length,
          out = [],
          counts = {};

      for (var i = 0; i < len; i++) {
        var item = vm.folders[i];
        counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
        if (counts[item] === 2) {
          out.push(item);
        }
      }
      return out.length > 0;
    }

    function isDuplicateFolder(folder) {
      return vm.folders.indexOf(folder) >= 0 ? true : false;
    }

  } // end foldersCtrl

})();
