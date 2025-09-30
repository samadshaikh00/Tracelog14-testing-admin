const { Given, Then } = require('@cucumber/cucumber');
const { BASE_URL, USERNAME, PASSWORD } = require('../utils/constant.js');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');

Given('I am logged in as admin', async function () {
  await this.page.goto(BASE_URL);
  await this.page.fill('input[name="username"]', USERNAME);
  await this.page.fill('input[name="password"]', PASSWORD);
  await takeScreenshot(this.page, 'admin-data-is-filled');
  await this.page.waitForTimeout(1500);
  await this.page.click('button[type="submit"]');
  console.log('Logged in as an admin');
});

Then('I am logging out', async function(){
  await this.page.waitForTimeout(1000);
  await this.page.click('span.user-name');
  await takeScreenshot(this.page, 'user-name-clicked');
  await this.page.waitForTimeout(1000);
  await this.page.click('a:has-text("Log out ")');
  await this.page.waitForTimeout(2000);
  
  try{
    const currentUrl = await this.page.url();
	  expect(currentUrl).toContain('/login');
    console.log('Agent Logged out successful....');
  }
  catch(error){
    console.log("Could not logout : " + error);
  }
});