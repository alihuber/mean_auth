module.exports = {
  'Login with no credentials' : function (browser) {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .assert.cssClassNotPresent('div.form-group', 'has-error')
      .setValue('#formly_1_input_username_0', '')
      .setValue('#formly_1_input_password_1', '')
      .click('#login_button')
      .assert.cssClassPresent('div.form-group', 'has-error')
      .end();
  },

  'Login with wrong credentials' : function (browser) {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .assert.containsText('div#alert_div', '')
      .setValue('#formly_1_input_username_0', 'wrong.name')
      .setValue('#formly_1_input_password_1', 'wrong.password')
      .click('#login_button')
      .assert.containsText("div#alert_div", "Invalid")
      .end();
  },

  'Login as normal user' : function (browser) {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .assert.containsText("div#alert_div", "")
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button')
      .expect.element('body').text.to.contain("User dashboard");
    browser
      .click('#logout_link')
      .assert.containsText('body', 'Hello there')
      .expect.element('body').text.to.not.contain("registered's profile");
    browser
      .end();
  },

  'Login as admin user' : function (browser) {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .assert.containsText("div#alert_div", "")
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .expect.element('body').text.to.contain("Admin dashboard");
    browser
      .click('#logout_link')
      .assert.containsText('body', 'Hello there')
      .expect.element('body').text.to.not.contain("admin's profile");
    browser
      .end();
  }
};
