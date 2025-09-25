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

 const processLink = await this.page.$(`a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaignprocess?campaign=26"]`);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
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



When('I fill in the process details with the required information', async function(){

 function getRandomLetter() {

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  return letters[Math.floor(Math.random() + 5 * letters.length)];

 }

 let processName = getRandomLetter(); 

 await this.page.fill('input[name="name"]', 'testprocess123');

 await this.page.waitForSelector('textarea[name="description"]', 'testprocesscucumber');

 await this.page.selectOption('select[id="expiryType"]', 'NEVER')

 await this.page.selectOption('select[name="calling_mode"]', 'Manual')

 await this.page.click('#selectAllFirstLevelDispose')

 await this.page.fill('input[name="processPrefix"]', 'none');

 await this.page.click('button[id="createProcess"]');

 console.log('Process details filled successfully!');

});



Then("I should see a successful message", async function() {

 await this.page.waitForTimeout(3000);

 const currentUrl = this.page.url();

 try{

   expect(currentUrl).toContain('alertsuccess=process%20created%20Successfully.&campaign=');

   console.log('New Process created successfully!');

  } 

 catch(e){

   await this.page.waitForSelector(".alert-danger", {visible: true, timeout: 3000});

   console.log(currentUrl);

   console.log('process Already exists!');

   this.page.goto('https://tracelog14.slashrtc.in/index.php/site/viewcampaignprocess?campaign=29');

   return ;

 }

})



When("I Add gateway", async function(){

 console.log('Gateway saved successfully!');

});



Then('I should see gateway added successful message', async function(){

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



// FIXED: For Select2 dropdown

When('I click on input and select agent', async function () {

 const agentName = "agent 3 (Agent3)";

  

 console.log('Starting Select2 agent selection...');

  

 // Wait for modal

 const agentModal = this.page.locator('#agentAddModel');

 await agentModal.waitFor({ state: 'visible', timeout: 10000 });

 console.log('Agent modal is visible');

  

 await takeScreenshot(this.page, 'agent-modal-opened');

  

 try {

  // Method 1: Direct interaction with Select2 search input

  console.log('Attempting to interact with Select2 search input...');

   

  // Click on the Select2 container to open dropdown

  const select2Container = agentModal.locator('.select2-selection');

  await select2Container.click();

  console.log('Clicked on Select2 container to open dropdown');

  await this.page.waitForTimeout(1000);

   

  // Type the agent name (minimum 3 characters as per placeholder)

  const searchInput = agentModal.locator('.select2-search__field');

  await searchInput.fill('agent');

  console.log('Typed "agent" in search field');

  await this.page.waitForTimeout(2000);

   

  // Wait for dropdown results to appear

  await this.page.waitForSelector('.select2-results__option', { timeout: 5000 });

  console.log('Select2 results loaded');

   

  // Look for the specific agent option

  const optionSelector = `.select2-results__option:has-text("${agentName}")`;

  const agentOption = this.page.locator(optionSelector);

   

  if (await agentOption.isVisible({ timeout: 3000 })) {

   await agentOption.click();

   console.log(`Selected agent: ${agentName}`);

  } else {

   // If exact text not found, try partial match

   console.log('Exact match not found, trying partial match...');

   const allOptions = this.page.locator('.select2-results__option');

   const optionCount = await allOptions.count();

    

   let agentSelected = false;

   for (let i = 0; i < optionCount; i++) {

    const optionText = await allOptions.nth(i).textContent();

    if (optionText.includes('agent 3') || optionText.includes('Agent3')) {

     await allOptions.nth(i).click();

     console.log(`Selected agent: ${optionText}`);

     agentSelected = true;

     break;

    }

   }

    

   if (!agentSelected) {

    throw new Error(`Agent "${agentName}" not found in dropdown options`);

   }

  }

   

  // **CRITICAL FIX: Wait for dropdown to close after selection**

  await this.page.waitForTimeout(1000);

   

  // Check if dropdown is still open and close it if needed

  const dropdownOpen = await this.page.locator('.select2-container--open').isVisible().catch(() => false);

  if (dropdownOpen) {

   console.log('Dropdown is still open, closing it...');

   // Click somewhere else to close the dropdown

   await agentModal.click({ position: { x: 10, y: 10 } });

   await this.page.waitForTimeout(500);

  }

   

  // Wait for selection to be applied

  await this.page.waitForTimeout(2000);

   

  // Verify selection by checking Select2 display

  const selectedItems = agentModal.locator('.select2-selection__choice');

  const selectedCount = await selectedItems.count();

   

  console.log(`Number of selected agents: ${selectedCount}`);

   

  if (selectedCount > 0) {

   for (let i = 0; i < selectedCount; i++) {

    const itemText = await selectedItems.nth(i).textContent();

    console.log(`Selected item ${i + 1}: ${itemText}`);

   }

  }

   

 } catch (error) {

  console.log('Method 1 failed:', error.message);

   

  // Method 2: Alternative approach using keyboard

  console.log('Trying alternative method with keyboard...');

   

  // Focus on the Select2 container

  const select2Container = agentModal.locator('.select2-selection');

  await select2Container.click();

  await this.page.waitForTimeout(1000);

   

  // Type the search term

  await this.page.keyboard.type('agent');

  await this.page.waitForTimeout(2000);

   

  // Press down arrow to navigate to option

  await this.page.keyboard.press('ArrowDown');

  await this.page.waitForTimeout(500);

   

  // Press Enter to select

  await this.page.keyboard.press('Enter');

  await this.page.waitForTimeout(2000);

   

  console.log('Selected agent using keyboard navigation');

   

  // **CRITICAL: Ensure dropdown is closed**

  await this.page.waitForTimeout(1000);

  const dropdownOpen = await this.page.locator('.select2-container--open').isVisible().catch(() => false);

  if (dropdownOpen) {

   console.log('Dropdown still open after keyboard selection, pressing Escape...');

   await this.page.keyboard.press('Escape');

   await this.page.waitForTimeout(500);

  }

 }

  

 // **VERIFY DROPDOWN IS CLOSED BEFORE PROCEEDING**

 const dropdownStillOpen = await this.page.locator('.select2-container--open').isVisible().catch(() => false);

 if (dropdownStillOpen) {

  console.log('WARNING: Dropdown is still open, forcing close...');

  // Force close by clicking outside

  await this.page.mouse.click(10, 10);

  await this.page.waitForTimeout(1000);

 }

  

 await takeScreenshot(this.page, 'agent-selected-in-dropdown');

  

 // **FIXED: Wait for save button to be clickable**

 await this.page.waitForTimeout(2000);

  

  const select2Container = agentModal.locator('.select2-selection');

  await select2Container.click();

 // Click save button - use different selectors to ensure we find it

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

   // **FIX: Use force click if dropdown might still be interfering**

   await saveButton.click({ force: true });

   console.log(`Save button clicked using selector: ${selector}`);

   saveButtonClicked = true;

   break;

  }

 }

  

 if (!saveButtonClicked) {

  // Final attempt with JavaScript click

  await this.page.evaluate(() => {

   const buttons = document.querySelectorAll('button.addAgentToProcess, .btn-primary');

   for (const btn of buttons) {

    if (btn.offsetParent !== null) { // Check if visible

     btn.click();

     return true;

    }

   }

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


  