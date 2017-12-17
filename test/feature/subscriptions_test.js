var mongoose     = require('mongoose');
mongoose.Promise = global.Promise;
require('../../backend/models/user');
var User         = mongoose.model('User');

module.exports = {
  'Accessing subscriptions page, not logged in' : (browser) => {
    browser
      .url('http://localhost:3001/subscriptions')
      .waitForElementVisible('navigation', 1000)
      .assert.urlEquals('http://localhost:3001/')
      .end();
  },

  'Accessing subscriptions page with no folders set' : (browser) => {
    User.findOne(function (err, user) {
      if (err) { return handleError(err); }
      if (user) {
        user.folders = [];
        user.save();
        browser
          .url('http://localhost:3001/login')
          .waitForElementVisible('navigation', 1000)
          .expect.element('body').to.not.have.css('div#alert_div');
        browser
          .setValue('#formly_1_input_username_0', 'registered')
          .setValue('#formly_1_input_password_1', 'registered')
          .click('#login_button');
        browser
          .waitForElementVisible('li#settings_link', 1000)
          .click('#settings_link')
          .click('#subscriptions_link')
          .assert.containsText('body', 'any folders yet.');
        browser
          .end();
      }
    });
  },

  'Accessing subscriptions page with folders set' : (browser) => {
    User.findOne(function (err, user) {
      if (err) { return handleError(err); }
      if (user) {
        user.folders = ['folder_1'];
        user.save();
        browser
          .url('http://localhost:3001/login')
          .waitForElementVisible('navigation', 1000)
          .expect.element('body').to.not.have.css('div#alert_div');
        browser
          .setValue('#formly_1_input_username_0', 'registered')
          .setValue('#formly_1_input_password_1', 'registered')
          .click('#login_button');
        browser
          .waitForElementVisible('li#settings_link', 1000)
          .click('#settings_link')
          .click('#subscriptions_link')
          .assert.containsText('sidebar', 'folder_1');
        browser
          .assert.elementPresent("#url_input");
        browser
          .end();
      }
    });
  },


  'Add/delete subscription' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#subscriptions_link')
    browser
      .setValue('#url_input', 'http://foo.bar.com')
      .click('#add_subscription_button');
    browser
      .expect.element('body').to.have.css('#remove_subscription_button_0');
    browser
      .click('#save_subscription_button');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#subscriptions_link')
      .waitForElementVisible('#subscription_0', 1000)
      .assert.containsText('#folderSelect', 'folder_1');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#subscriptions_link')
    browser.getValue("#subscription_0", function(result) {
      this.assert.equal(result.value, 'http://foo.bar.com');
    });
    browser
      .click('#remove_subscription_button_0')
      .click('#save_subscription_button');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#subscriptions_link')
      .expect.element('body').text.to.not.contain('http://foo.bar.com');
    browser
      .end();
  },
};
