const { Before, After, setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');
const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

setDefaultTimeout(60 * 1000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.videoInfo = null;
  }
}

setWorldConstructor(CustomWorld);

Before(async function (scenario) {
  const videosDir = path.join(process.cwd(), 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  this.browser = await playwright.chromium.launch({ 
    headless: true 
  });

  this.context = await this.browser.newContext({
    recordVideo: {
      dir: videosDir,
      size: { width: 1920, height: 1080 }
    }
  });

  this.page = await this.context.newPage();
  
  // Store video info for later use
  this.videoInfo = {
    scenarioName: scenario.pickle.name,
    startTime: new Date()
  };
});

After(async function (scenario) {
  const result = scenario.result?.status;
  
  if (this.page && this.page.video()) {
    try {
      const video = this.page.video();
      
      // Ensure all operations are complete
      await this.page.waitForTimeout(500);
      
      // Close context to finalize video
      await this.context.close();
      
      // Get video path and handle it
      const videoPath = await video.path();
      if (videoPath && fs.existsSync(videoPath)) {
        const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
        const status = result || 'unknown';
        const newVideoPath = path.join(
          path.dirname(videoPath),
          `${status}-${scenarioName}-${Date.now()}.webm`
        );
        
        fs.renameSync(videoPath, newVideoPath);
        console.log(`Video saved: ${newVideoPath}`);
      }
    } catch (error) {
      console.error('Error saving video:', error);
    }
  } else {
    // If no video, just close the context
    if (this.context) {
      await this.context.close();
    }
  }

  if (this.browser) {
    await this.browser.close();
  }
});