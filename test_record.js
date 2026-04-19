







// ============ link capture with proxy and then use my ip soo error ============================


// const puppeteer = require('puppeteer');
// const { spawnSync } = require('child_process');
// const fs = require('fs');

// // ⚙️ SETTINGS
// const TARGET_URL = 'https://dlstreams.com/stream/stream-598.php';

// // 🛡️ HARDCODED PROXY
// const PROXY_IP = '31.59.20.176';
// const PROXY_PORT = '6754';
// const PROXY_USER = 'cjasfidu';
// const PROXY_PASS = 'qhnyvm0qpf6p';

// // ==========================================
// // 🔍 STEP 1: PUPPETEER SE M3U8 NIKALNA
// // ==========================================
// async function getStreamData() {
//     console.log(`\n[🔍 STEP 1] Puppeteer Chrome Start kar raha hoon Proxy ke sath...`);
    
//     let browserArgs = [
//         '--no-sandbox', 
//         '--disable-setuid-sandbox', 
//         '--disable-blink-features=AutomationControlled', 
//         '--mute-audio',
//         `--proxy-server=http://${PROXY_IP}:${PROXY_PORT}`
//     ];

//     const browser = await puppeteer.launch({ headless: true, args: browserArgs });
//     const page = await browser.newPage();

//     // Proxy Auth
//     await page.authenticate({ username: PROXY_USER, password: PROXY_PASS });
//     console.log(`[✅] Proxy Authenticated.`);

//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

//     let streamData = null;

//     // 📡 Network Requests Intercept (Tumhare bot ka real logic)
//     page.on('request', (request) => {
//         const url = request.url();
//         if (url.includes('.m3u8')) {
//             streamData = {
//                 url: url,
//                 referer: request.headers()['referer'] || TARGET_URL,
//                 cookie: request.headers()['cookie'] || ''
//             };
//             console.log(`[✅ BINGO] Stream (M3U8) Link pakar liya gaya!`);
//         }
//     });

//     try {
//         console.log(`[🌐] Direct URL par ja raha hoon: ${TARGET_URL}`);
//         await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        
//         // Agar play button ho toh usko click karne ki koshish karega
//         await page.click('body').catch(() => {});
        
//         // 10 second wait karega taake m3u8 link load ho jaye
//         for (let i = 1; i <= 2; i++) {
//             await new Promise(r => setTimeout(r, 5000)); 
//             if (streamData) break; 
//         }
//     } catch (e) { 
//         console.log(`[❌ ERROR] Page load nahi ho saka:`, e.message); 
//     }
    
//     await browser.close();
//     return streamData;
// }

// // ==========================================
// // 🎬 STEP 2: FFMPEG SE DIRECT RECORD KARNA
// // ==========================================
// async function recordStream(data, outputVid) {
//     if (!data || !data.url) {
//         console.log(`[❌] Stream data missing. Cannot record.`);
//         return false;
//     }

//     console.log(`\n[🎬 STEP 2] FFmpeg se M3U8 ko direct record kar raha hoon (20 Seconds)...`);
    
//     // Original headers bypass karne ke liye
//     const headersCmd = `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\nReferer: ${data.referer}\r\nCookie: ${data.cookie}\r\n`;
    
//     let args = [
//         "-y", 
//         "-headers", headersCmd, 
//         "-i", data.url,
//         "-c:v", "copy",   // Video stream ko directly copy karega (fastest)
//         "-c:a", "copy",   // Audio stream ko directly copy karega
//         "-t", "20",       // 20 Seconds duration
//         outputVid
//     ];

//     try {
//         // Output show karne ke liye stdio inherit rakha hai
//         spawnSync('ffmpeg', args, { stdio: 'inherit' });
        
//         if (fs.existsSync(outputVid) && fs.statSync(outputVid).size > 1000) {
//             console.log(`\n[✅ SUCCESS] 20 seconds ki video successfully save ho gayi: ${outputVid}`);
//             return true;
//         }
//     } catch (e) { 
//         console.log(`[❌] FFmpeg process fail!`); 
//     }
//     return false;
// }

// // ==========================================
// // 🚀 MAIN FLOW
// // ==========================================
// async function main() {
//     console.log("\n==================================================");
//     console.log("   🚀 DIRECT URL FLOW TEST STARTED");
//     console.log("==================================================");
    
//     let streamData = await getStreamData();
    
//     if (streamData) {
//         await recordStream(streamData, 'final_test_video.mp4');
//     } else {
//         console.log(`\n[🛑] Failed to extract M3U8. Yeh website shayad video blob mein hide kar rahi hai.`);
//     }
// }

// main();





















// =============================================



const puppeteer = require('puppeteer');
const fs = require('fs');
const { spawnSync } = require('child_process');

// Tumhara iframe wala HTML code
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<style>
  body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: black; }
  .fullscreen-iframe { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; border: none; }
</style>
</head>
<body>
  <iframe 
    src="https://dlstreams.com/stream/stream-598.php" 
    class="fullscreen-iframe" 
    allowfullscreen 
    scrolling="no">
  </iframe>
</body>
</html>
`;

// HTML file ko temporarily save karna
fs.writeFileSync('index.html', htmlContent);

(async () => {
    console.log("[🚀] Starting Chrome with Hardcoded Proxy...");

    // Headless false rakhna zaroori hai taake GitHub Actions me Xvfb isko record kar sake
    const browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: { width: 1280, height: 720 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--proxy-server=http://31.59.20.176:6754', // Tumhari proxy
            '--window-size=1280,720',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();

    // Proxy Authentication
    await page.authenticate({ username: 'cjasfidu', password: 'qhnyvm0qpf6p' });
    console.log("[✅] Proxy authenticated.");

    // Local HTML file open karna
    const filePath = 'file://' + __dirname + '/index.html';
    console.log(`[🌐] Navigating to ${filePath}`);
    await page.goto(filePath, { waitUntil: 'networkidle2' });

    // Stream play hone ke liye ek click trigger kar dete hain
    await page.click('body').catch(() => {});
    
    console.log("[🎥] Page loaded! Starting 20 seconds screen recording...");

    // FFmpeg se Xvfb virtual screen (:99) ko 20 seconds ke liye record karna
    try {
        spawnSync('ffmpeg', [
            '-y',
            '-f', 'x11grab',          // Screen grab for Linux
            '-video_size', '1280x720',
            '-framerate', '30',
            '-i', ':99.0',            // GitHub Actions default Xvfb display
            '-t', '60',               // 20 Seconds duration
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            'test_output.mp4'         // Output file name
        ], { stdio: 'inherit' });
        
        console.log("[✅] 20 Seconds Recording Finished!");
    } catch (err) {
        console.log("[❌] Recording failed:", err);
    }

    await browser.close();
    // Temp HTML file delete kar do
    fs.unlinkSync('index.html');
    console.log("[🧹] Browser closed and cleanup done.");
// })();
