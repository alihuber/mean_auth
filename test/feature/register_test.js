module.exports = {
  'Register with no credentials' : function (browser) {
    browser
      .url('http://localhost:3001/register')
      .waitForElementVisible('navigation', 1000)
      .assert.cssClassNotPresent('div.form-group', 'has-error')
      .setValue('#formly_1_input_username_0', '')
      .setValue('#formly_1_input_password_1', '')
      .click('#register_button')
      // does not work with firefox
      // .assert.cssClassPresent('div.form-group', 'has-error')
      .expect.element('body').text.to.not.contain("User dashboard");
    browser
      .end();
  },

  'Register with taken credentials' : function (browser) {
    browser
      .url('http://localhost:3001/register')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css("div#alert_div");
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'some.password')
      .click('#register_button')
      .assert.containsText('div#alert_div', 'Please')
      .end();
  },

  'Register and authenticate with correct credentials' : function (browser) {
    browser
      .url('http://localhost:3001/register')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css("div#alert_div");
    browser
      .setValue('#formly_1_input_username_0', 'new_user')
      .setValue('#formly_1_input_password_1', 'new_password')
      .click('#register_button')
      .waitForElementVisible('a#profile_link', 1000)
      .expect.element('body').text.to.contain("new_user's profile");
    browser
      .click('#logout_link')
      .assert.containsText('body', 'Hello there')
      .expect.element('body').text.to.not.contain("new_user's profile");
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css("div#alert_div");
    browser
      .setValue('#formly_1_input_username_0', 'new_user')
      .setValue('#formly_1_input_password_1', 'new_password')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000)
      .expect.element('body').text.to.contain("new_user's profile");
    browser
      .end();
  }
};
