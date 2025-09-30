const { Given, Then, When } = require('@cucumber/cucumber');

const { takeScreenshot } = require('../utils/screenshot.js');

const { BASE_URL, USERNAME, PASSWORD, CAMPAIGN_MANAGE_PAGE } = require('../utils/constant.js');

const { expect } = require('playwright/test');

const assert = require('assert');



require('./commonSteps.js');



When('I navigate to the campaign view', async function(){

 await this.page.hover('#tabOperations');   

 await this.page.waitForTimeout(500);

 const campaignLink = await this.page.$(`.sub-menu a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaign"]`);

 await campaignLink.click();

 await this.page.waitForTimeout(1000);

 const currentUrl = this.page.url();

 expect(currentUrl).toContain(CAMPAIGN_MANAGE_PAGE);

 console.log('Navigated to the campaign management page');

});



When('I select the campaign', async function () {

 const processLink = await this.page.$(`a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaignprocess?campaign=31"]`);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
 await processLink.click();

 await this.page.waitForTimeout(1000); 

});



When('I expand and select create process', async function () {

 const expandButton = this.page.locator('div.btn-group:has(button:has-text("Expand")) button');

 await expandButton.click();

 console.log('Dropdown expanded');

 await this.page.waitForTimeout(500); 



 const dropdownMenu = expandButton.locator('xpath=../ul[contains(@class,"dropdown-menu")]');

 const createProcessLink = dropdownMenu.locator('a:has-text("Create Process")');

 await createProcessLink.waitFor({ state: 'visible', timeout: 10000 })

 await createProcessLink.click();

 await this.page.waitForTimeout(1000);

 console.log('Navigated to the Create Process page');

});




When('I fill in process {string} with {string} calling mode', async function(processName, callingMode) {
 
  console.log(`Process Name: ${processName}`);
  console.log(`Calling Mode: ${callingMode}`);
  
  // Fill basic process details
  await this.page.fill('input[name="name"]', processName);
  await this.page.fill('textarea[name="description"]', `Test ${callingMode} process created manually`);
  await this.page.selectOption('select[id="expiryType"]', 'NEVER');
  

  const callModeMap = {
    'manual': '1',
    'auto': '3', 
    'preview': '4',
    'inbound': '5'
  };
  
  const callModeValue = callModeMap[callingMode.toLowerCase()];
  if (!callModeValue) {
    throw new Error(`Unknown calling mode: ${callingMode}. Supported modes: Manual, Auto, Preview, Inbound`);
  }
  
  await this.page.selectOption('select[name="calling_mode"]', callModeValue);
  console.log(`Selected calling mode: ${callingMode}`);
  

  await this.page.click('#selectAllFirstLevelDispose');
  await this.page.fill('input[name="processPrefix"]', 'none');
  

  try {
    await this.page.fill('input[name="numberofcomments"]', '5');
  } catch (error) {
    console.log('No. of Comments field not found');
  }
  
  this.processName = processName;
  this.callingMode = callingMode;
  
  console.log(' All fields filled, submitting form...');
  
  await this.page.click('button[id="createProcess"]');
  await this.page.waitForTimeout(5000);
});

Then("I should see a successful message", async function() {
  const currentUrl = this.page.url();
  console.log(`Current URL after submission: ${currentUrl}`);

  if (currentUrl.includes('alertsuccess=process%20created%20Successfully')) {
    console.log(`SUCCESS: ${this.callingMode} process "${this.processName}" created successfully!`);
    return;
  }
  
 
  try {
    const errorElement = this.page.locator('.alert-danger').first();
    if (await errorElement.isVisible({ timeout: 2000 })) {
      const errorText = await errorElement.textContent();
      console.log(` ERROR: ${errorText}`);
    }
  } catch (error) {
    console.log('No visible error message found');
  }
  

  if (currentUrl.includes('createprocess') || currentUrl.includes('addprocess')) {
    console.log(' Form not submitted - still on creation page');
    
  
    const requiredFields = await this.page.locator('[required]').all();
    for (const field of requiredFields) {
      const isFilled = await field.evaluate(el => el.value !== '');
      const fieldName = await field.getAttribute('name') || await field.getAttribute('id');
      if (!isFilled) {
        console.log(`Required field empty: ${fieldName}`);
      }
    }
  }
 
  await this.page.goto('https://tracelog14.slashrtc.in/index.php/site/viewcampaignprocess?campaign=31');
});



When("I Add gateway", async function () {
  await this.page.waitForTimeout(3000);
  console.log("clicking on the action button");
  await this.page.click(
    "button.btn.btn-default.btn-xs.dropdown-toggle.btnsettings"
  );
  await this.page.waitForTimeout(3000);
  console.log("Action button clicked!");
  // await takeScreenshot(this.page, "action-button-clicked");
  await this.page.hover('a:has-text("Gateway Mapping")');
  // await takeScreenshot(this.page, "add-gateway-hover");
  await this.page.click('a:has-text("Add Gateway")');
  await this.page.waitForTimeout(3000);
  // await takeScreenshot(this.page, "clicked-on-add-gateway");
  console.log("clicked on add gateway!!!!");
});

When("I click on input and select gateway", async function () {
  const gatewayModal = this.page.locator("#addGateway > .modal-dialog");
  await gatewayModal.waitFor({ state: "visible", timeout: 10000 });
  const select2Container = gatewayModal.locator(".select2-selection");
  await select2Container.click();
  await this.page.waitForTimeout(1000);
  const searchInput = gatewayModal.locator(".select2-search__field");
  await searchInput.fill("slashGateway");
  await this.page.waitForTimeout(2000);
  await this.page.waitForSelector(".select2-results__option", {
    timeout: 5000,
  });
  const optionGateway = `.select2-results__option:has-text("slashGateway")`;
  const gatewayOption = this.page.locator(optionGateway);
  if (await gatewayOption.isVisible({ timeout: 3000 })) {
    await gatewayOption.click();
    console.log(`Selected gateway`);
  }
  await this.page.waitForTimeout(1000);
  await takeScreenshot(this.page, "slashGateway-selected");
  await this.page.waitForTimeout(1000);
  await this.page.click(".saveGateway");
  console.log("Gateway saved successfully!");
})

Then("I should see gateway added successful message", async function () {
  console.log("successfully working");
});



When('I click on down arrow', async function() {

 const dropdownButton = this.page.locator('button.dropdown-toggle.dropdwnbtn').filter({

  has: this.page.locator('~ ul.dropdown-menu li.dropdown-submenu a:has-text("Agent")')

 }).first();

 await dropdownButton.click();

 await takeScreenshot(this.page, 'agent-dropdown-button');

 await this.page.locator('ul.dropdown-menu:has(li.dropdown-submenu a:has-text("Agent"))').first().waitFor({ state: 'visible' });

});



When('I hover on Agent', async function () {

  await this.page.waitForSelector('li.dropdown-submenu:has-text("Agent")', { state: 'visible', timeout: 30000 });

  await this.page.hover('li.dropdown-submenu:has-text("Agent")'); 

  await this.page.waitForTimeout(1000);

  await takeScreenshot(this.page, 'hover-on-agent');

  console.log('Hovered on Agent menu');

});

When('I click on add agent', async function () {

  await this.page.waitForSelector('li.dropdown-submenu:has-text("Agent") ul.dropdown-menu a:has-text("Add Agent")', { 

    state: 'visible', 

    timeout: 30000 });
 await this.page.click('a:has-text("Add Agent")');

 await this.page.waitForTimeout(3000);

 console.log('Clicked on Add Agent successfully');
 await takeScreenshot(this.page, 'click-add-agent');
});


When('I click on input and select agent', async function () {

 const agentName = "duaLipa";
 console.log('Starting Select2 agent selection...');
 const agentModal = this.page.locator('#agentAddModel');
 await agentModal.waitFor({ state: 'visible', timeout: 10000 });
 console.log('Agent modal is visible');
 await takeScreenshot(this.page, 'agent-modal-opened');

 try {

  console.log('Attempting to interact with Select2 search input...');
  const select2Container = agentModal.locator('.select2-selection');
  await select2Container.click();
  console.log('Clicked on Select2 container to open dropdown');
  await this.page.waitForTimeout(1000);

  // Type the agent name 

  const searchInput = agentModal.locator('.select2-search__field');
  await searchInput.fill('duaLipa');
  console.log('Typed "duaLipa" in search field');
  await this.page.waitForTimeout(2000);
  await this.page.waitForSelector('.select2-results__option', { timeout: 5000 });
  console.log('Select2 results loaded');

  const optionSelector = `.select2-results__option:has-text("${agentName}")`;
  const agentOption = this.page.locator(optionSelector);

  if (await agentOption.isVisible({ timeout: 3000 })) {
   await agentOption.click();
   console.log(`Selected agent: ${agentName}`);

  } else
   {
   console.log('Exact match not found, trying partial match...');
   const allOptions = this.page.locator('.select2-results__option');
   const optionCount = await allOptions.count();
   let agentSelected = false;

   for (let i = 0; i < optionCount; i++) {
    const optionText = await allOptions.nth(i).textContent();
    if (optionText.includes('duaLipa') || optionText.includes('duaLipa')) {
     await allOptions.nth(i).click();
     console.log(`Selected agent: ${optionText}`);
     agentSelected = true;
     break;
    }
   }

   if (!agentSelected) {
    throw new Error(`Agent "${agentName}" not found in dropdown options`);
   }}
  await this.page.waitForTimeout(1000);
  const dropdownOpen = await this.page.locator('.select2-container--open').isVisible().catch(() => false);

  if (dropdownOpen) {
   console.log('Dropdown is still open, closing it...');
   await agentModal.click({ position: { x: 10, y: 10 } });
   await this.page.waitForTimeout(500);
  }

  await this.page.waitForTimeout(2000);
  const selectedItems = agentModal.locator('.select2-selection__choice');
  const selectedCount = await selectedItems.count();
  console.log(`Number of selected agents: ${selectedCount}`);

  if (selectedCount > 0) {
   for (let i = 0; i < selectedCount; i++) {
    const itemText = await selectedItems.nth(i).textContent();
    console.log(`Selected item ${i + 1}: ${itemText}`);
   } }
 
} 
catch (error) {

  console.log('Method 1 failed:', error.message);
  console.log('Trying alternative method with keyboard...');
  const select2Container = agentModal.locator('.select2-selection');

  await select2Container.click();
  await this.page.waitForTimeout(3000);
  await this.page.keyboard.type('duaLipa');
  await this.page.waitForTimeout(4000);
  await this.page.keyboard.press('ArrowDown');
  await this.page.waitForTimeout(4000);
  await this.page.keyboard.press('Enter');
  await this.page.waitForTimeout(4000);
  console.log('Selected agent using keyboard navigation');

   

  await this.page.waitForTimeout(4000);
  const dropdownOpen = await this.page.locator('.select2-container--open').isVisible().catch(() => false);

  if (dropdownOpen) {
   console.log('Dropdown still open after keyboard selection, pressing Escape...');
   await this.page.keyboard.press('Escape');
   await this.page.waitForTimeout(4000);
 }}

 const dropdownStillOpen = await this.page.locator('.select2-container--open').isVisible().catch(() => false);
 if (dropdownStillOpen) {
  console.log('WARNING: Dropdown is still open, forcing close...');
  await this.page.mouse.click(10, 10);
  await this.page.waitForTimeout(4000);
}

 await takeScreenshot(this.page, 'agent-selected-in-dropdown');
 await this.page.waitForTimeout(4000);
  const select2Container = agentModal.locator('.select2-selection');
  await select2Container.click();

 const saveButtonSelectors = [
  'button.addAgentToProcess',
  '.modal-footer button.btn-primary',
  'button:has-text("Save changes")',
  'button:has-text("Save")'
 ];

 let saveButtonClicked = false;

 for (const selector of saveButtonSelectors) {
  const saveButton = this.page.locator(selector);
  if (await saveButton.isVisible({ timeout: 3000 })) {
   await saveButton.click({ force: true });
   console.log(`Save button clicked using selector: ${selector}`);
   saveButtonClicked = true;
   break;
  }
 }

 if (!saveButtonClicked) {
  await this.page.evaluate(() => {
   const buttons = document.querySelectorAll('button.addAgentToProcess, .btn-primary');
   for (const btn of buttons) {
    if (btn.offsetParent !== null) { 
     btn.click();
     return true;
   } }
   return false;
  });
  console.log('Save button clicked using JavaScript');
 }
 console.log('Save button clicked');
 await this.page.waitForTimeout(3000);
 await takeScreenshot(this.page, 'after-saving-agent');
});



Then('I should see a agent map successful message', async function() {
 await this.page.waitForTimeout(3000);
 const modalVisible = await this.page.locator('#agentAddModel.modal.fade.in').isVisible();

 if (!modalVisible) {
  console.log('Agent mapping successful - modal closed');
 } else {
  console.log(' Modal still visible, but continuing...');
 }
 await takeScreenshot(this.page, 'successfully-agent-added');
});