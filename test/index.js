
var assert = require('assert');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');


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

  test.it('should enter a string into the title input', function () {
    const title = driver.findElement({className: 'title' })

    title.sendKeys('hello')
    title.getAttribute('value').then((value) => {
      assert.equal(value, 'hello')
    })
  })

  test.it('should append a TODO to the page', function () {

    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()


    driver.findElements({className: 'card'}).then((card) => {
      assert.equal(card.length, 2);
    })

  })

  test.it.skip('should be able to change the level of importance by up-voting or down-voting that specific TODO', function () {
    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})

    const upVote = driver.findElement({className: 'up-arrow'})
    const downVote = driver.findElement({className: 'down-arrow'})

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()


  })

  test.it.skip('Each TODO should start with a level of Normal')
  test.it.skip('should be able to change the level of importance by up-voting or down-voting that specific TODO')
  test.it.skip('The change of importance should persist after a page refresh')
  test.it.skip('should have 5 levels of importance')
})

  //
  //
  // Levels of Importance are as follows
  //
  // 1) Critical
  //
  // 2) High
  //
  // 3) Normal
  //
  // 4) Low
  //
  // 5) None
