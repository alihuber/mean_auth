module.exports = {
  'Login with no credentials' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .assert.cssClassNotPresent('div.form-group', 'has-error')
      .setValue('#formly_1_input_username_0', '')
      .setValue('#formly_1_input_password_1', '')
      .click('#login_button')
      // does not work with firefox
      // .assert.cssClassPresent('div.form-group', 'has-error')
      .expect.element('body').text.to.not.contain('User dashboard');
    browser
      .end();
  },

  'Login with wrong credentials' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'wrong.name')
      .setValue('#formly_1_input_password_1', 'wrong.password')
      .click('#login_button')
      .assert.containsText('div#alert_div', 'Invalid')
      .end();
  },

  'Login as normal user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000)
      .expect.element('body').text.to.contain('User dashboard');
    browser
      .click('#logout_link')
      .assert.containsText('body', 'Hello there')
      .expect.element('body').text.to.not.contain("registered's profile");
    browser
      .end();
  },

  'Login as admin user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000)
      .expect.element('body').text.to.contain('Admin dashboard');
    browser
      .click('#logout_link')
      .assert.containsText('body', 'Hello there')
      .expect.element('body').text.to.not.contain("admin's profile");
    browser
      .end();
  }
};
