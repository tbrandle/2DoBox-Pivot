
const assert = require('assert');
const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');


test.describe('10+ cards testing', function () {
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

  test.it('will not show more than 10 ideas on the page', function () {
    //concept note: add a 'complete' class to the card on-click
    const title = driver.findElement({className: "title" })
    const task = driver.findElement({className: "body"})
    const saveButton = driver.findElement({className: "save"})
    title.sendKeys('test task ')
    task.sendKeys('go eat food')
    saveButton.click()
    for (let i = 0; i < 12; i++) {
      title.sendKeys(i)
      task.sendKeys(i)
      saveButton.click()
    }

    driver.findElements({className: 'card'}).then((cards) => {
      assert.equal(cards.length, 10)
    })
})




  test.it('restores hidden card on delete of visable card', function () {
    const title = driver.findElement({className: "title" })
    const task = driver.findElement({className: "body"})
    const saveButton = driver.findElement({className: "save"})
    title.sendKeys('test task ')
    task.sendKeys('go eat food')
    saveButton.click()
    for (let i = 0; i < 12; i++) {
      title.sendKeys(i)
      task.sendKeys(i)
      saveButton.click()
    }

    driver.findElement({className: 'close-card'}).click()

    driver.findElements({className: 'card'}).then((cards) => {
      assert.equal(cards.length, 10)
    })
  })
})
