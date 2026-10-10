const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const { pathToFileURL } = require('url');
const path = require('path');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>console.error(e));await page.goto(pathToFileURL(path.resolve('index.html')).href);await page.screenshot({path:'tmp/qa/home-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tmp/qa/home-mobile.png',fullPage:true});console.log(await page.title());await browser.close()})().catch(e=>{console.error(e);process.exit(1)});
