
var assert = require('assert');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');

//include timeout

test.describe('our test bundle', function () {
  let driver

  test.beforeEach(() => {
    this.timeout(10000);
    driver = new webdriver.Builder()
                                .forBrowser('chrome')
                                .build();
    driver.get('http://localhost:8080');
});

  test.afterEach(() => {
    driver.quit()
  })

  test.it('should open the browser', function () {
    const title = driver.findElement({className: "title" })

    title.sendKeys('hello')
    title.getAttribute('value').then((value) => {
      assert.equal(value, 'hello')
    })

    })
  })
