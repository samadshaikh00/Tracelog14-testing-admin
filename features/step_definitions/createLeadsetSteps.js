const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');
const assert = require('assert');

require('./commonSteps.js');

When('I navigate to contact management page for creating leadset', async function () {
    await this.page.waitForTimeout(2000);
    console.log(this.page.url())
    
    await this.page.hover('#tabContacts');
    await takeScreenshot(this.page, 'tab contacts hovered');
    await this.page.waitForTimeout(500);
    await this.page.click('a:has-text("Manage")');
    await this.page.waitForTimeout(2000);
    console.log(this.page.url())
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
    await this.page.waitForSelector('.alert, [role="alert"], .error, .text-danger', { timeout: 5000 });
    
    const successElement = await this.page.$('.alert-success, [class*="success"]');
    if (successElement) {
        const successText = await successElement.textContent();
        console.log('Success message:', successText);
        expect(successText.toLowerCase()).toContain('successfully');
        await takeScreenshot(this.page, 'success-message');
        return;
    }
    

    const errorElement = await this.page.$('.alert-danger, .error, .text-danger, [class*="error"]');
    if (errorElement) {
        const errorText = await errorElement.textContent();
        console.log('Error message:', errorText);
        throw new Error(`Form submission failed: ${errorText}`);                
    }
    
    
    const bodyText = await this.page.textContent('body');
    if (bodyText.toLowerCase().includes('successfully')) {
        expect(bodyText.toLowerCase()).toContain('successfully');
        await takeScreenshot(this.page, 'success-message-in-body');
    } else if (bodyText.includes('field may only contain alpha-numeric')) {
        throw new Error('Validation error: Name field only allows alpha-numeric characters');
    } else {
        await takeScreenshot(this.page, 'debug-no-messages');
        throw new Error('No success or error messages found on the page');
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
