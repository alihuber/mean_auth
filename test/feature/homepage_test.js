module.exports = {
  'Homepage test' : function (browser) {
    browser
      .url('http://localhost:3001')
      .waitForElementVisible('navigation', 1000)
      .assert.containsText('h1', 'Hello there')
      .end();
  }
};
