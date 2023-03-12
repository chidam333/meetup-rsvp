const express = require("express");
const multer = require("multer");
const puppeteer = require("puppeteer");
const app = express();
const formObj = multer();

app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/post-meetup-details",formObj.none(), (req, res) => {
	console.log(req.body.emailId)
	app.locals.email = req.body.emailId;
	app.locals.password = req.body.pwd;
	app.locals.firstname = req.body.fname;
	app.locals.lastname = req.body.lname;
	app.locals.role = req.body.role;
	app.locals.orgname = req.body.orgName;
	if(req.body.all){
    let groupURL = JSON.parse(req.body.eventURL)
    console.log({groupURL})
    run(req.body.emailId,req.body.pwd,req.body.fname,req.body.lname,req.body.role,req.body.orgName,false,groupURL)
	}else{
    run(req.body.emailId,req.body.pwd,req.body.fname,req.body.lname,req.body.role,req.body.orgName,true,[])

	}
	console.log(app.locals)
});
async function run(inpEmail, inpPassword, inpFirstname, inpLastname, inpRole, inpOrgname, all, hrefs) {
  let [email, password, firstname, lastname, role, orgname] = [
    inpEmail,
    inpPassword,
    inpFirstname,
    inpLastname,
    inpRole,
    inpOrgname,
  ];
  console.log({all})
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let eventURL = []; //groupURL
  await page.goto("https://meetup.com/login");
  await page.type("#email", email);
  await page.type("#current-password", password);
  try{
    await page.click(".p14rljdx");
  }catch(e){
    console.log(e)
    return;
  }
  await page.waitForNavigation();
  if(all){
    console.log({all})
    await page.goto("https://meetup.com/groups");
    await page.waitForNavigation();
    await page.waitForTimeout(3000);
    const atags = await page.$$("section ul li a");
    hrefs = await Promise.all(
      atags.map((element) => element.evaluate((node) => node.href))
    );
  }
  console.log(hrefs);
  eventURL = [];
  for (const link of hrefs) {
    await page.goto(`${link}events`);
    const evatags = await page.$$(".eventList-list li div .eventCard--link");
    console.log({ evatags });
    const evhrefs = await Promise.all(
      evatags.map((element) => element.evaluate((node) => node.href))
    );
    console.log({ evhrefs });
    eventURL = [...eventURL, ...evhrefs];
  }
  console.log("ahh okay",{all,hrefs})
  console.log({ eventURL });
  for (const event of eventURL) {
    console.log(event);
    await page.goto(event);
    try {
      await page.waitForSelector('[data-testid="attend-irl-btn"]', {
        timeout: 3000,
      });
      await page.click('[data-testid="attend-irl-btn"]');
    } catch (err1) {
      try {
        let zbanner = await page.$('[data-testid="banner"]');
        console.log({ zbanner });
        if (zbanner != null) {
          console.log("Already registered !");
          continue;
        }
        let notOpen = await page.$('[data-testid="rsvp-not-open-btn"]');
        console.log({ notOpen });
        if (notOpen != null) {
          console.log("Registration Not open !");
          continue;
        }
        await page.waitForSelector('[data-testid="attend-online-btn"]', {
          timeout: 5000,
        });
        await page.click('[data-testid="attend-online-btn"]');
      } catch (err2) {
        console.log({ err1, err2 });
        continue;
      }
    }
    try {
      await page.type("#firstName", firstname);
      await page.type("#lastName", lastname);
    } catch (e) {
      console.log("Name inpt not there");
    }
    try {
      await page.type("#role", role);
    } catch (e) {
      console.log("No roles there");
    }
    try {
      await page.type("#company", orgname);
    } catch (e) {
      console.log("No company there");
    }
    try {
      await page.type("#topic", "i am very passionate about this !!");
    } catch (e) {
      console.log("No topic there");
    }
    try {
      await page.click('[data-testid="plusButton"]');
    } catch (e) {
      console.log("No plus button");
    }
    try {
      await page.click('[data-event-label="event-question-modal-confirm"]');
    } catch (e) {
      console.log(e);
    }
  }
  await browser.close()
}
app.listen(9696, () => {
  console.log(`Server listening on port 9696`);
});