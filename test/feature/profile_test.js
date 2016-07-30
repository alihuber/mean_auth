module.exports = {
  'Accessing profile page, not logged in' : function (browser) {
    browser
      .url('http://localhost:3001/profile')
      .waitForElementVisible('body', 1000)
      .assert.urlEquals('http://localhost:3001/')
      .end();
  }
};
