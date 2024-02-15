const { Builder, By } = require("selenium-webdriver");
const resemble = require("resemblejs");
const fs = require("fs");

describe("Ecommerce Site Homepage Visual Regression Test", function () {
  this.timeout(10000);

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().setRect({ width: 1536, height: 864 });
  });

  it("should match the homepage with the baseline image", async function () {
    await driver.get("https://ecommerce-playground.lambdatest.io/");
    await driver.takeScreenshot().then(function (image, err) {
      fs.writeFileSync("currentScreenshot.png", image, "base64");
      resemble("currentScreenshot.png")
        .compareTo("baselineScreenshot.png")
        .ignoreColors()
        .onComplete(function (result) {
          console.log(result);
          if (result.rawMisMatchPercentage > "20.0") {
            // Allowable difference of 20%
            throw new Error("Visual regression detected!");
          }
        });
    });
  });

  after(async function () {
    await driver.quit();
  });
});
