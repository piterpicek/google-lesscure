const pupet = require('puppeteer')
const colors = require('colors')
const fs = require('fs')

var Counter, Empass;
var total = 0;
var C = 1

function delaySec(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const LessScure = async () => {
	if(Counter >= total){
		console.log(colors.blue('[DONE]'))
		process.exit()
	}

	const [ user, pass ] = Empass[Counter].split(',', 2)
	const browser = await pupet.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		], 
		headless: false
	})
	console.log(`${colors.green('[LOADING...]')} [${C}/${total}] ${user}`);
	const page = await browser.newPage()

	await page.goto('https://myaccount.google.com/lesssecureapps?pli=1', {waitUntil: 'networkidle0'})
	try{
		await (await page.click('#yDmH0d > c-wiz > div > div:nth-child(2) > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > c-wiz > section > div > div > div > div > div > div > div > div.qFiThd > div > div'))
		await delaySec(3000)
		try{
			await (await page.waitForXPath('//*[@id="identifierId"]', { timeout: 3000  })).type(user);
			await ( await page.waitForXPath('//*[@id="identifierNext"]')).click()
			await delaySec(3000)
			try{
				await page.keyboard.type(pass)
				await page.keyboard.press(String.fromCharCode(13))
				await delaySec(3000)
				if(await page.$('input[name=accept]') !== null){
					await (await page.waitForXPath('//*[@id="accept"]')).click()
					await delaySec(3000)
				}

				await page.goto("https://myaccount.google.com/lesssecureapps?pli=1", { waitUntil: 'networkidle0'})
				try{
					await page.keyboard.type(pass)
					await page.keyboard.press(String.fromCharCode(13))

					await delaySec(3000)
					
					await (await page.waitForXPath('//*[@id="yDmH0d"]/c-wiz/div/div[3]/c-wiz/div/div[2]/div/div/div/ul/li/div[1]/div/div[2]/div/div/div[2]/input')).click()
					console.log(`${colors.green('SUCCESS LessScure')} [${C}/${total}] ${user} | ${pass}`);
					fs.appendFileSync('SUCCESS_LESSSECURE.txt', Empass[Counter] + "\n");
				}catch(e){
					console.log(`${colors.red('Button can\'t be press!')} [${C}/${total}] ${user} | ${pass}`);
            		fs.appendFileSync('email_faled.TXT', user + "\n");
				}
			}catch(e){
				console.log(`${colors.red('Password Wrong!')} [${C}/${total}] ${user} | ${pass}`);
            	fs.appendFileSync('email_faled.TXT', user + "\n");

			}
		}catch(e){
			console.log(`${colors.red('Account Not Found!')} [${C}/${total}] ${user} | ${pass}`);
            fs.appendFileSync('email_faled.TXT', user + "\n");

		}
	}catch(e){
		console.log(e)
		console.log(`${colors.red('Error connection\/slow respown page')} [${C}/${total}] ${user} | ${pass}`);
        fs.appendFileSync('email_faled.TXT', user + "\n");

	}
	Counter++
	C++
	browser.close()
	await LessScure()
}


(async() => {
	Empass = fs.readFileSync(process.argv[2], 'utf-8').split('\n');
	total = Empass.length
	Counter = 0
	await LessScure()
})()