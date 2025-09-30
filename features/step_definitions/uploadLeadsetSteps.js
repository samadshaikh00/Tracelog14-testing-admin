const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

require('./commonSteps.js');

When('I navigate to contact management page', async function(){
  this.page.waitForTimeout(2000);
  await this.page.hover('#tabContacts');    
  await this.page.waitForTimeout(500);
  console.log('tab is hoverd');
  await this.page.waitForSelector('a[href="https://tracelog14.slashrtc.in/index.php/site/viewleadset"]', { visible: true, timeout: 30000 });
  await this.page.click('a[href="https://tracelog14.slashrtc.in/index.php/site/viewleadset"]');
  const currentUrl = this.page.url();

  expect(currentUrl).toContain('/site/viewleadset');
  await takeScreenshot(this.page, 'contacts-manage-clicked');
});



When('I click on existing leadset {string}', async function(leadsetName) {
    
    await this.page.waitForTimeout(4000);
    
    console.log('Waiting for slashrtc leadset...');
    
    await this.page.waitForSelector(`a:has-text("${leadsetName}")`, { timeout: 30000 });
    await this.page.click(`a:has-text("${leadsetName}")`);
    
    
    await takeScreenshot(this.page, 'slashrtc-leadset-clicked');
});


//Upload leadset
When('I click on upload button', async function() {
    console.log('Clicking upload button...');
    await this.page.waitForTimeout(3000);
      await this.page.click('a[href*="uploadlead?leadset=73"]');
    await this.page.waitForTimeout(2000);
    await takeScreenshot(this.page, 'upload-button-clicked');
    console.log('Upload button clicked successfully');
});

//choose file
When('I Choose csv file', async function () {
    const fileInput = 'input[name="csv"]';
    const filePath = '/home/intern/avinash/Tracelog14-testing-admin/data/Leadset1.csv';
    await this.page.setInputFiles(fileInput, filePath);
    await takeScreenshot(this.page, 'file uploaded');
    await this.page.waitForTimeout(1000);
});



//upload successfully
When('I clicked on upload button', async function () {
    await this.page.click('#uploadLeadUbmit');
    await this.page.waitForTimeout(3000);
});



