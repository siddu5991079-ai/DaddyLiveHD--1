







// ============ link capture with proxy and then use my ip soo error ============================


const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

// 🛡️ Tumhari Hardcoded Proxy
const PROXY_SERVER = 'http://31.59.20.176:6754';
const PROXY_USER = 'cjasfidu';
const PROXY_PASS = 'qhnyvm0qpf6p';

// 🌐 Stream Link
const TARGET_URL = 'https://dadocric.st/player.php?id=willowextra';

(async () => {
    console.log("[🚀] Chrome start kar raha hoon Proxy ke sath...");
    
    const browser = await puppeteer.launch({
        headless: "new", // Naya aur stable headless mode
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu', // Black screen roknay ke liye zaroori hai
            '--autoplay-policy=no-user-gesture-required', // Video khud play hogi
            `--proxy-server=${PROXY_SERVER}`
        ]
    });

    const page = await browser.newPage();
    
    // Proxy Login
    await page.authenticate({ username: PROXY_USER, password: PROXY_PASS });
    console.log("[✅] Proxy authenticated.");

    // Screen ki resolution exactly 720p set kardi
    await page.setViewport({ width: 1280, height: 720 });

    console.log(`[🌐] URL load kar raha hoon: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Agar stream pe koi fake play button hua toh usko press kardega
    await page.click('body').catch(() => {});

    // Recorder ki settings
    const recorder = new PuppeteerScreenRecorder(page, {
        fps: 30,
        quality: 100,
        videoFrame: { width: 1280, height: 720 }
    });

    console.log("[🎥] 20 seconds ki Tab Recording shuru ho gayi hai...");
    await recorder.start('final_tab_record.mp4');

    // 20 Second wait karega recording ke liye
    await new Promise(resolve => setTimeout(resolve, 20000));

    await recorder.stop();
    console.log("[✅] Recording mukammal ho gayi! File: 'final_tab_record.mp4'");

    await browser.close();
    console.log("[🧹] Browser band kar diya.");
})();




















// =============================================



// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { spawnSync } = require('child_process');

// // Tumhara iframe wala HTML code
// const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// <style>
//   body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: black; }
//   .fullscreen-iframe { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; border: none; }
// </style>
// </head>
// <body>
//   <iframe 
//     src="https://dlstreams.com/stream/stream-598.php" 
//     class="fullscreen-iframe" 
//     allowfullscreen 
//     scrolling="no">
//   </iframe>
// </body>
// </html>
// `;

// // HTML file ko temporarily save karna
// fs.writeFileSync('index.html', htmlContent);

// (async () => {
//     console.log("[🚀] Starting Chrome with Hardcoded Proxy...");

//     // Headless false rakhna zaroori hai taake GitHub Actions me Xvfb isko record kar sake
//     const browser = await puppeteer.launch({
//         headless: false, 
//         defaultViewport: { width: 1280, height: 720 },
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--proxy-server=http://31.59.20.176:6754', // Tumhari proxy
//             '--window-size=1280,720',
//             '--autoplay-policy=no-user-gesture-required'
//         ]
//     });

//     const page = await browser.newPage();

//     // Proxy Authentication
//     await page.authenticate({ username: 'cjasfidu', password: 'qhnyvm0qpf6p' });
//     console.log("[✅] Proxy authenticated.");

//     // Local HTML file open karna
//     const filePath = 'file://' + __dirname + '/index.html';
//     console.log(`[🌐] Navigating to ${filePath}`);
//     await page.goto(filePath, { waitUntil: 'networkidle2' });

//     // Stream play hone ke liye ek click trigger kar dete hain
//     await page.click('body').catch(() => {});
    
//     console.log("[🎥] Page loaded! Starting 20 seconds screen recording...");

//     // FFmpeg se Xvfb virtual screen (:99) ko 20 seconds ke liye record karna
//     try {
//         spawnSync('ffmpeg', [
//             '-y',
//             '-f', 'x11grab',          // Screen grab for Linux
//             '-video_size', '1280x720',
//             '-framerate', '30',
//             '-i', ':99.0',            // GitHub Actions default Xvfb display
//             '-t', '60',               // 20 Seconds duration
//             '-c:v', 'libx264',
//             '-preset', 'ultrafast',
//             'test_output.mp4'         // Output file name
//         ], { stdio: 'inherit' });
        
//         console.log("[✅] 20 Seconds Recording Finished!");
//     } catch (err) {
//         console.log("[❌] Recording failed:", err);
//     }

//     await browser.close();
//     // Temp HTML file delete kar do
//     fs.unlinkSync('index.html');
//     console.log("[🧹] Browser closed and cleanup done.");
// })();
