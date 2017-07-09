module.exports = {
  'Accessing foldes page, not logged in' : (browser) => {
    browser
      .url('http://localhost:3001/folders')
      .waitForElementVisible('navigation', 1000)
      .assert.urlEquals('http://localhost:3001/')
      .end();
  },

  'Accessing folders page as logged in user' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .end();
  },

  'Add/delete folder' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .setValue('#folder_input', 'my_folder')
      .click('#add_folder_button');
    browser
      .expect.element('body').to.have.css('#remove_folder_button_0');
    browser
      .click('#save_folder_button');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .waitForElementVisible('sidebar', 1000)
      .assert.containsText('sidebar', 'my_folder');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .click('#remove_folder_button_0')
      .click('#save_folder_button');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .waitForElementVisible('sidebar', 1000)
      .expect.element('sidebar').text.to.not.contain('my_folder');
    browser
      .end();
  },

  'Add duplicate folder' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .setValue('#folder_input', 'my_folder')
      .click('#add_folder_button');
    browser
      .expect.element('body').to.have.css('#remove_folder_button_0');
    browser
      .click('#save_folder_button');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .waitForElementVisible('sidebar', 1000)
      .assert.containsText('sidebar', 'my_folder');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .setValue('#folder_input', 'my_folder')
      .click('#add_folder_button');
    browser
      .assert.containsText('div#alert_div', 'already');
    browser
      .end();
  },

  'Add duplicate folder' : (browser) => {
    browser
      .url('http://localhost:3001/login')
      .waitForElementVisible('navigation', 1000)
      .expect.element('body').to.not.have.css('div#alert_div');
    browser
      .setValue('#formly_1_input_username_0', 'registered')
      .setValue('#formly_1_input_password_1', 'registered')
      .click('#login_button');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .setValue('#folder_input', 'my_folder1')
      .click('#add_folder_button');
    browser
      .setValue('#folder_input', 'my_folder2')
      .click('#add_folder_button');
    browser
      .expect.element('body').to.have.css('#remove_folder_button_0');
    browser
      .expect.element('body').to.have.css('#remove_folder_button_1');
    browser
      .click('#save_folder_button');
    browser
      .assert.containsText('div#alert_div', 'successful');
    browser
      .waitForElementVisible('sidebar', 1000)
      .assert.containsText('sidebar', 'my_folder1');
    browser
      .assert.containsText('sidebar', 'my_folder2');
    browser
      .waitForElementVisible('li#settings_link', 1000)
      .click('#settings_link')
      .click('#folders_link')
      .assert.containsText('body', 'Your folders');
    browser
      .clearValue("#folder_1")
      .setValue('#folder_1', 'my_folder1')
      .click('#edit_folder_button_1');
    browser
      .assert.containsText('div#alert_div', 'already');
    browser
      .end();
  }
};
