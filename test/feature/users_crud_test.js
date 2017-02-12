const should   = require('chai').should();

module.exports = {
  'Creating new user without all credentials' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser
      .click('#user_create_button')
      .waitForElementVisible('newheader', 1000);
    browser
      .setValue('#formly_2_input_username_0', 'other_user')
      .click('#user_create_button')
      .expect.element('body').text.to.not.contain('Users');
    browser
      .assert.urlEquals('http://localhost:3001/user/id');
    browser
      .end();
  },

  'Creating new user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser
      .click('#user_create_button')
      .waitForElementVisible('newheader', 1000);
    browser
      .setValue('#formly_2_input_username_0', 'other_user')
      .setValue('#formly_2_input_password_1', 'new_password')
      .click('#user_create_button')
      .waitForElementVisible('table.table', 1000);
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .expect.element('users_table').text.to.contain('other_user');
    browser
      .end();
  },

  'Accessing profile page with created user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'other_user')
      .setValue('#formly_1_input_password_1', 'new_password')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your profile');
    browser
      .getValue("#formly_2_input_username_0", function(result) {
        this.assert.equal(result.value, 'other_user');
    });
    browser
      .end();
  },

  'Create with duplicate username' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser
      .click('#user_create_button')
      .waitForElementVisible('newheader', 1000);
    browser
      .setValue('#formly_2_input_username_0', 'other_user')
      .setValue('#formly_2_input_password_1', 'other_password')
      .click('#user_create_button');
    browser
      .assert.containsText('div#alert_div', 'different')
      .end();
  },

  'Updating user without all credentials' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser
      .click('table.table a')
      .waitForElementVisible('defaultheader', 1000);
    browser
      .setValue('#formly_2_input_username_0', 'other_user')
      .click('#user_save_button')
      .expect.element('body').text.to.not.contain('Users');
    browser
      .assert.urlContains('http://localhost:3001/user/id');
    browser
      .end();
  },

  'Updating user with valid data' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser.elements('class name', 'glyphicon-check', (res) => {
      res.value.length.should.equal(1);
    });
    browser
      .click('table.table a')
      .waitForElementVisible('defaultheader', 1000);
    browser
      .setValue('#formly_2_input_username_0', 'other_user')
      .setValue('#formly_2_input_password_1', 'other_password')
      .click('#formly_2_checkbox_isAdmin_2')
      .click('#user_save_button')
      .waitForElementVisible('table.table', 1000);
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser.elements('class name', 'glyphicon-check', (res) => {
      res.value.length.should.equal(2);
    });
    browser
      .end();
  },

  'Deleting user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000)
      .assert.containsText('table.table', 'other_user');
    browser
      .click('table.table a')
      .waitForElementVisible('defaultheader', 1000);
    browser
      .click('#user_delete_button')
      .waitForElementVisible('table.table', 1000);
    browser
      .expect.element('table.table').text.to.not.contain('other_user');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .end();
  }
};
