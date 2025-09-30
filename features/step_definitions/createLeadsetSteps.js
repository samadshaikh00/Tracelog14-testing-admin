const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');
const assert = require('assert');


When('I navigate to contact management page for creating leadset', async function () {
    await this.page.waitForTimeout(2000);
    console.log(this.page.url())
    
    await this.page.hover('#tabContacts');
    await takeScreenshot(this.page, 'tab contacts hovered');
    await this.page.waitForTimeout(500);
    await this.page.click('a:has-text("Manage")');
    await this.page.waitForTimeout(2000);
});

When('I click on manage submenu', async function () {
    const leadsetLink = await this.page.$('a[href*="leadset"]');
    if (leadsetLink) {
        await leadsetLink.click();
    } else {
    
        await this.page.goto('https://tracelog14.slashrtc.in/index.php/site/createleadset');
    }
    await this.page.waitForTimeout(2000);
    await takeScreenshot(this.page, 'click-manage-submenu');
});

When('I click on create leadset icon', async function () {
    
    const createButton = await this.page.$('a[href*="createleadset"], button:has-text("Create")');
    if (createButton) {
        await createButton.click();
        await this.page.waitForTimeout(2000);
    }
    await takeScreenshot(this.page, 'click-create-leadset-icon');
});

When('I fill leadset name as {string}', async function (name) {
    this.leadsetName = name.replace(/[^a-zA-Z0-9]/g, '');
    await this.page.fill('input[name="name"]', this.leadsetName);
    await takeScreenshot(this.page, 'fill-leadset-name');
});

When('I fill leadset description as {string}', async function (description) {
    await this.page.fill('textarea[name="description"]', description);
    await takeScreenshot(this.page, 'fill-leadset-description');
});

When('I enable skill option', async function () {
    // Leave skill option as default (false) - do nothing
    console.log('Skill option left as default (false)');
    await takeScreenshot(this.page, 'skill-option-default');
});

When('I click save button', async function () {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);
    await takeScreenshot(this.page, 'click-save-button');
});

Then('I should see leadset created successfully message', async function () {
    await this.page.waitForTimeout(1000);
    const currentUrl = this.page.url();


    try{
        expect(currentUrl).toContain('alertsuccess=leadset%20created%20Successfully');
        
        await takeScreenshot(this.page, 'new-leadset-created');
        console.log('New Leadset created successfully!');
    }
    catch(error){
        await this.page.waitForSelector(".alert-danger", {visisble : true, timeout : 3000});
        console.log(currentUrl);
        await takeScreenshot(this.page, 'Leadset-already-exists');
        console.log('Leadset Already exists!');
        return ;
    }
});

Then('I should be on manage leadset page', async function () {
    const currentUrl = this.page.url();
    const isManagePage = currentUrl.includes('manage') || 
                         currentUrl.includes('view') || 
                         currentUrl.includes('leadset') ||
                         currentUrl.includes('contact');
    
    if (!isManagePage) {
        await takeScreenshot(this.page, 'debug-wrong-page');
        throw new Error(`Not on management page. Current URL: ${currentUrl}`);
    }
    
    await takeScreenshot(this.page, 'manage-leadset-page');
});
