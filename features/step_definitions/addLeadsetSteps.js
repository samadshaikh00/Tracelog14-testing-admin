const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { BASE_URL, USERNAME, PASSWORD, CAMPAIGN_MANAGE_PAGE } = require('../utils/constant.js');
const { expect } = require('playwright/test');
const assert = require('assert');


var leadsetMapSuccessfulFlag = false;
When('I navigate in campaign view', async function(){
 await this.page.hover('#tabOperations');   
 await this.page.waitForTimeout(500);
 const campaignLink = await this.page.$(`.sub-menu a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaign"]`);
 await campaignLink.click();
 await this.page.waitForTimeout(1000);
 const currentUrl = this.page.url();
 expect(currentUrl).toContain(CAMPAIGN_MANAGE_PAGE);
 console.log('Navigated to the campaign management page');
});

When('I select a campaign id', async function () {
 const processLink = await this.page.$(`a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaignprocess?campaign=31"]`);
 await processLink.click();
 await this.page.waitForTimeout(1000); 
});

When('I click on process {string}', async function (processName) {
    const processSpan = this.page.locator(`span#proName141:has-text("${processName}")`);
    await processSpan.click();
    await this.page.waitForTimeout(1000);
});


When('I click on add leadset', async function () {
    const addButton = this.page.locator('button[processid="141"].leadsetAdd');
    await addButton.click();
    await this.page.waitForTimeout(1000);
});

When('I click on input and select leadset', async function () {
    const leadsetInput = await this.page.locator('input.select2-search__field[placeholder*="Leadset"]');
    await leadsetInput.click();
    await this.page.waitForTimeout(500);
    await leadsetInput.fill('sla');
    await this.page.waitForTimeout(1000);

    try{
        const option = await this.page.locator('li.select2-results__option:has-text("SlashrtcIntern")', {timeout : 5000});
        await option.click();
        await this.page.waitForTimeout(1000);
        const selectedTag = await this.page.locator('li.select2-selection__choice[title="SlashrtcIntern"]', {timeout : 1000});
        await selectedTag.click();
        await this.page.waitForTimeout(500);
        console.log("SlashrtcIntern mapped to the process");
        leadsetMapSuccessfulFlag = true;
    }
    catch(error){
        console.log("error : SlashrtcIntern leadset Already Mapped!!!");
        return;
    }
});



When('I click on save button', async function () {
    if(!leadsetMapSuccessfulFlag){
        const currentUrl = await this.page.url();
        await this.page.goto(currentUrl);
        return ;
    }

    await this.page.locator('.saveNewLead').click();
    const dialogPromise = new Promise((resolve) => {
      this.page.on('dialog', async (dialog) => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.accept();
        resolve(dialog.message());
        });
    });
    await dialogPromise;
    await this.page.waitForTimeout(10000); 
});





// When('I click on save button', async function () {
//     await this.page.waitForTimeout(1500);
//     await this.page.keyboard.press('Enter');
//     await this.page.waitForTimeout(2000);
//     const saveButton = this.page.locator('button.saveNewLead');
//     await saveButton.focus();
//     await saveButton.click({ force: true });
//     await this.page.waitForTimeout(3000);
//     await takeScreenshot(this.page,'leadset save btn clicked')   
// });

// When('I see alert message of leadset count', async function () {
//     // Set up dialog listener for native browser alerts
//     this.page.on('dialog', async (dialog) => {
//         console.log(`Alert message: ${dialog.message()}`);
//         expect(dialog.message()).toContain('Total Number Of Lead In The LeadSet : 4');
//         this.alertMessage = dialog.message();
//         await takeScreenshot(this.page,'see alert msg')
//     });
// });

// When('I click ok button', async function () {
//     await this.page.waitForTimeout(2000);
//     await takeScreenshot(this.page,'see alert clicked ok btn')
// });






// Then('I should see a leadset added successfully', async function () {
//     await this.page.waitForTimeout(4000);
    
//     // Check multiple possible success indicators
//     const checks = [
//         () => this.page.locator('text=/success/i').isVisible(),
//         () => this.page.locator('text=/added/i').isVisible(), 
//         () => this.page.locator('text=slashrtc').isVisible(),
//         () => this.page.locator('.alert-success, .success').isVisible()
//     ];
    
//     let successVerified = false;
    
//     for (const check of checks) {
//         const result = await check().catch(() => false);
//         if (result) {
//             successVerified = true;
//             break;
//         }
//     }
    
//     if (!successVerified) {
//         // Final check: see if modal closed and page state changed
//         const modalOpen = await this.page.locator('.modal.in').isVisible().catch(() => false);
//         if (!modalOpen) {
//             console.log('Modal closed - assuming success');
//             successVerified = true;
//         }
//     }
    
//     if (!successVerified) {
//         throw new Error('No success indicators found after leadset addition');
//     }
    
//     console.log('Leadset addition verified');
//     await takeScreenshot(this.page,'see leadset added successfully')
// });