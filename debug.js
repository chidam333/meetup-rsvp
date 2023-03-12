const puppeteer = require("puppeteer");
let [email, password, firstname, lastname, role, orgname] = [
    "chidam3abi@gmail.com",
    "3chidamnathan#",
    "chidam",
    "s",
    "student",
    "sastra_uni",
];
const fun = async()=>{
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Go to the login page
    await page.goto("https://meetup.com/login");

    // Enter the username and password
    await page.type("#email", email);
    await page.type("#current-password", password);
    await page.click(".p14rljdx");
    await page.waitForNavigation();
    await page.waitForTimeout(3000);
    await page.goto("https://www.meetup.com/your-events/");
    await page.waitForNavigation();
    await page.waitForTimeout(3000);
    const atags = await page.$$("div[data-testid='your-events-card'] div a");
    console.log({atags})
    let hrefs = await Promise.all(
      atags.map((element) => element.evaluate((node) => node.href))
    );
    for(const link of hrefs){
        await page.goto(link)
        await page.waitForTimeout(3000);
        await page.waitForSelector('button[data-event-label="edit-event"]', {
            timeout: 3000,
        });
        await page.click('button[data-event-label="edit-event"]')
        await page.click('[data-event-label="edit-rsvp-modal-not-going"]')
    }
    browser.close()
    // await page.waitForSelector('[data-testid="attend-online-btn"]', {
    //     timeout: 10000,
    // });
    // await page.click('[data-testid="attend-online-btn"]');
    // await page.click('[data-event-label="event-question-modal-confirm"]');
}
fun();