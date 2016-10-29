module.exports = {
  'Accessing profile page, not logged in' : function (browser) {
    browser
      .url('http://localhost:3001/profile')
      .waitForElementVisible('navigation', 1000)
      .assert.urlEquals('http://localhost:3001/')
      .end();
  },

  'Accessing profile page as logged in user' : function (browser) {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css("div#alert_div");
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('a#profile_link', 1000)
      .click('#profile_link')
      .assert.containsText('body', 'Your username\nregistered');
    browser
      .end();
  }
};
