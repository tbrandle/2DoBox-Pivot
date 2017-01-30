
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

  test.it('will not show more than 10 ideas on the page', function () {
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

  test.it('can filter results based off of importance', function () {
    const title = driver.findElement({className: "title" })
    const task = driver.findElement({className: "body"})
    const saveButton = driver.findElement({className: "save"})
    const highFilterButton = driver.findElement({name: "high"})
    title.sendKeys('test task ')
    task.sendKeys('go eat food')
    saveButton.click()
    for (let i = 0; i < 12; i++) {
      title.sendKeys(i)
      task.sendKeys(i)
      saveButton.click()
    }

    const upVote = driver.findElement({className: 'up-arrow'})
    const downVote = driver.findElement({className: 'down-arrow'})
    let filterCount = 0

    upVote.click()
    highFilterButton.click().then(() => {
      driver.findElements({className: 'card'}).then((cards) => {
        cards.forEach((card) => {
          card.isDisplayed().then((displayBoolean) => {
            if(displayBoolean) {
              filterCount++
            }
            assert.equal(filterCount, 1)
          })
        })
      })
    })
  })
})
