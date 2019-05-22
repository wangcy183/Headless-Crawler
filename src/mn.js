const puppeteer =require('puppeteer');
const {mn}=require('./config/default');
const srcToImg=require('./helper/srcToImg');


(async ()=>{
	//获取服务器对象
	const browser= await puppeteer.launch({
		executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: false
	});
	//打开一个页面
	const page =await browser.newPage();
	//跳转到百度图片
	await page.goto('https://image.baidu.com/');
	console.log('go to https://image.baidu.com/');
	//设置页面大小
	await page.setViewport({
		width:1920,
		height:1080
	});
	console.log('reset viewport');
	//获取焦点到搜索框
	await page.focus('#kw');
	//模拟键盘输入，在搜索框输入搜索内容
	await page.keyboard.sendCharacter('杨杰岚');
	//模拟点击事件，点击搜索按钮
	await page.click('.s_search');
	console.log('goto search list');
	//监控页面加载完成
	page.on('load',async ()=>{
		console.log('page loading done, start fetch ');
	
		/*const srcs=await page.evaluate(()=>{
			const images=document.querySelectorAll('img.main_img');
			return Array.prototype.map.call(images,img=>img.src);
		});*/
		//获取页面多有图片的路径
		const srcs=await page.$$eval('img.main_img',imgs => imgs.map(img => img.src));
		console.log(`get ${srcs.length} images, starting download`);
		//循环每一个路径传入下载函数srcToImg
		srcs.forEach(async (src)=>{
			//sleep 
			await page.waitFor(200);
			await srcToImg(src,mn);
		});
		//关闭浏览器对象
		await browser.close();
	});
})();