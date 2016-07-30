module.exports = {
  'Homepage test' : function (browser) {
    browser
      .url('http://localhost:3001')
      .waitForElementVisible('body', 1000)
      .assert.containsText('h1', 'Hello there')
      .end();
  }
};
