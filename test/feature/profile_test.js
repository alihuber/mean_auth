module.exports = {
  'Accessing profile page, not logged in' : (browser) => {
    browser
      .url('http://localhost:3001/profile')
      .waitForElementVisible('navigation', 1000)
      .assert.urlEquals('http://localhost:3001/')
      .end();
  },

  'Accessing profile page as logged in user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser.getValue("#formly_2_input_username_0", function(result) {
      this.assert.equal(result.value, 'registered');
    });
    browser
      .end();
  },

  'Updating profile' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser
      .clearValue("#formly_2_input_username_0")
      .setValue("#formly_2_input_username_0", 'new_name')
      .click('#profile_save_button')
      .waitForElementVisible('div#alert_div', 1000);
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser.getValue("#formly_2_input_username_0", function(result) {
      this.assert.equal(result.value, 'new_name');
    });
    browser
      .end();
  },

  'Updating profile with duplicate username' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'new_name')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser
      .clearValue("#formly_2_input_username_0")
      .setValue("#formly_2_input_username_0", 'admin')
      .click('#profile_save_button')
      .waitForElementVisible('div#alert_div', 1000);
    browser
      .assert.containsText('div#alert_div', 'different');
    browser
      .end();
  },

  'Updating profile with empty username' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'new_name')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser
      .clearValue("#formly_2_input_username_0")
      .click('#profile_save_button')
      .waitForElementVisible('div#alert_div', 1000);
    browser
      .assert.containsText('div#alert_div', 'failed');
    browser
      .end();
  },

  'Set profile back to beginning' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'new_name')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser
      .clearValue("#formly_2_input_username_0")
      .setValue("#formly_2_input_username_0", 'registered')
      .click('#profile_save_button')
      .waitForElementVisible('div#alert_div', 1000);
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser.getValue("#formly_2_input_username_0", function(result) {
      this.assert.equal(result.value, 'registered');
    });
    browser
      .end();
  },
};
