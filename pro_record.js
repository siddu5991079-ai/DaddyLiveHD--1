const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

// Evasion Plugin Activate
puppeteer.use(StealthPlugin());

// 🛡️ Hardcoded Proxy Details
const proxyIpPort = '31.59.20.176:6754';
const proxyUser = 'cjasfidu';
const proxyPass = 'qhnyvm0qpf6p';

(async () => {
  console.log("[🚀] Launching Stealth Browser with Proxy (No Xvfb needed)...");
  
  const browser = await puppeteer.launch({
    headless: "new", // "new" rakha hai taake GitHub Actions par bina Xvfb ke chalay
    defaultViewport: { width: 1280, height: 720 },
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1280,720',
      '--autoplay-policy=no-user-gesture-required', 
      `--proxy-server=http://${proxyIpPort}` 
    ]
  });

  const page = await browser.newPage();
  
  // Base Page Proxy Auth
  await page.authenticate({ username: proxyUser, password: proxyPass });
  console.log("[✅] Proxy credentials applied successfully.");

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

  try {
    console.log("[🌐] Navigating to Homepage using Proxy...");
    await page.goto('https://dlstreams.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000));

    // 1. Click Cricket Category
    const cricketSelector = 'a[href="/index.php?cat=Cricket"]';
    await page.waitForSelector(cricketSelector, { visible: true, timeout: 10000 });
    const cricketBtn = await page.$(cricketSelector);
    if (cricketBtn) {
        const box = await cricketBtn.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
        await new Promise(r => setTimeout(r, 1000)); 
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }), 
            page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
        ]);
    }

    // 2. Scroll and Find IPL Match
    console.log("[🖱️] Scrolling and clicking IPL match...");
    await page.waitForSelector('div.schedule__event', { visible: true, timeout: 15000 });
    await page.mouse.wheel({ deltaY: 600 });
    await new Promise(r => setTimeout(r, 2000));

    const targetMatch = await page.evaluateHandle(() => {
        const events = Array.from(document.querySelectorAll('div.schedule__event'));
        return events.find(el => el.textContent.includes('Indian Premier League'));
    });

    const box = await targetMatch.boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
        await new Promise(r => setTimeout(r, 1000)); 
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        
        // 3. Click Willow 2
        console.log("[🖱️] Clicking 'Willow 2 Cricket'...");
        const willowSelector = 'a[data-ch="willow 2 cricket"]'; 
        await page.waitForSelector(willowSelector, { visible: true, timeout: 10000 });
        const willowBtn = await page.$(willowSelector);
        
        if (willowBtn) {
            const wBox = await willowBtn.boundingBox();
            await page.mouse.move(wBox.x + wBox.width / 2, wBox.y + wBox.height / 2, { steps: 15 });
            await new Promise(r => setTimeout(r, 1000)); 

            // Intercepting New Tab
            const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
            await page.mouse.click(wBox.x + wBox.width / 2, wBox.y + wBox.height / 2);
            
            const streamPage = await newPagePromise;
            if (streamPage) {
                console.log("[🔄] Shifted to Stream Tab! Authenticating proxy on new tab...");
                
                // NAYE TAB PAR BHI PROXY AUTHENTICATE KARNA ZAROORI HAI
                await streamPage.authenticate({ username: proxyUser, password: proxyPass });
                
                await streamPage.bringToFront();
                await streamPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
                await streamPage.setViewport({ width: 1280, height: 720 });
                
                // Anti-popup
                await streamPage.evaluateOnNewDocument(() => { window.open = () => null; });

                console.log("[⏳] Waiting 12 seconds for auto-refreshes...");
                await new Promise(r => setTimeout(r, 12000)); 
                
                console.log("[🧹] Destroying Ad-Trap & making player Full Screen...");
                await streamPage.evaluate(() => {
                    // Remove Ad Trap
                    const trap = document.querySelector('div#dontfoid');
                    if (trap) trap.remove();

                    // Iframe ko Full Screen CSS dena taake website ka kachra record na ho
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                        iframe.style.position = 'fixed';
                        iframe.style.top = '0';
                        iframe.style.left = '0';
                        iframe.style.width = '100vw';
                        iframe.style.height = '100vh';
                        iframe.style.zIndex = '99999';
                        document.body.style.overflow = 'hidden';
                    } else {
                        window.scrollBy({ top: 400, behavior: 'smooth' });
                    }
                });
                
                await new Promise(r => setTimeout(r, 2000));
                
                // Click Player to Play
                await streamPage.mouse.move(640, 360, { steps: 20 });
                await streamPage.mouse.click(640, 360);
                
                console.log("[🎥] SUCCESS! Video should be playing. Starting Tab Recorder...");
                
                // RECORDER SHURU KARIEN (Sirf Stream Page par)
                const recorder = new PuppeteerScreenRecorder(streamPage, {
                    fps: 30,
                    quality: 100,
                    videoFrame: { width: 1280, height: 720 }
                });

                await recorder.start('final_match_record.mp4');
                
                console.log("[⏳] Recording next 30 seconds...");
                await new Promise(r => setTimeout(r, 30000));

                await recorder.stop();
                console.log("[✅] Recording Complete! File saved as 'final_match_record.mp4'");
            }
        }
    } else {
        console.log("IPL Match nahi mila.");
    }

  } catch (error) {
    console.log("Execution stopped or error occurred:", error.message);
  }

  console.log("Closing browser...");
  await browser.close();
})();
