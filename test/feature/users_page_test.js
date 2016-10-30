module.exports = {
  'Accessing users page, not logged in' : (browser) => {
    browser
      .url('http://localhost:3001/users')
      .waitForElementVisible('navigation', 1000)
      .assert.urlEquals('http://localhost:3001/')
      .end();
  },

  'Accessing users page as non-admin user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css("div#alert_div");
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser
      .click('#home_link')
      .expect.element('body').text.to.not.contain('Users');
    browser
      .end();
  },

  'Accessing users page as admin user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css("div#alert_div");
    browser
      .setValue('#formly_1_input_username_0', 'admin')
      .setValue('#formly_1_input_password_1', 'admin')
      .click('#login_button')
      .waitForElementVisible('a#profile_link', 1000);
    browser
      .click('#home_link')
      .expect.element('body').text.to.contain('Users');
    browser
      .expect.element('users_table').text.to.contain('admin');
    browser
      .expect.element('users_table').text.to.contain('registered');
    browser
      .end();
  }
};
