
const assert = require('assert');
const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');


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

  test.it('can complete a task', function () {
    //concept note: add a 'complete' class to the card on-click
    const title = driver.findElement({className: "title" })
    const task = driver.findElement({className: "body"})
    const saveButton = driver.findElement({className: "save"})
    title.sendKeys('test task')
    task.sendKeys('go eat food')
    title.getAttribute('value').then((value) => {
      assert.equal(value, 'test task')
    })
    task.getAttribute('value').then((value) => {
      assert.equal(value, 'go eat food')
    })
    saveButton.click()

    const completeButton = driver.findElement({className: "complete-task"})
    completeButton.click()

    driver.findElement({className: 'card'})
      .getAttribute('class')
      .then((c) => assert.equal(c.split(' ')[1] || 'card does not have a second class', 'completed'))
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

  test.it('should remove an idea from the page once the delete button is clicked', function () {
    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()

    const deleteBtn = driver.findElement({className: 'close-card'})

    deleteBtn.click()

    driver.findElements({className: 'card'}).then((card) => {
      assert.equal(card.length, 1)
    })
  })

  test.it('User should be able to change the value of the card title', function () {
    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})

    title.sendKeys('this is a title')
    body.sendKeys('this is a body')
    saveBtn.click()

    const cardHeader = driver.findElement({className: 'card-header'})

    cardHeader.click()
    cardHeader.clear()
    cardHeader.sendKeys('I am now changing the cardHeader text\t')
    cardHeader.getText('value').then((value) => {
      assert.equal(value, 'I am now changing the cardHeader text')
    })
  })

  test.it('User should be able to change the value of the card body', function () {
    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})


    title.sendKeys('this is a title')
    body.sendKeys('this is a body')
    saveBtn.click()

    const cardBody = driver.findElement({className: 'card-body'})

    cardBody.click()
    cardBody.clear()
    cardBody.sendKeys('I am now changing the cardBody text\t')
    cardBody.getText('value').then((value) => {
      assert.equal(value, 'I am now changing the cardBody text')
    })
  })

  test.it('Each TODO should start with a level of Normal', function () {
    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()

    const cardQuality = driver.findElement({className: 'card-quality'})

    cardQuality.getText('value').then((value) =>{
      assert.equal(value, 'quality: normal');
    })
  })

  test.it('should be able to change the level of importance by up-voting or down-voting that specific TODO', function () {
    const title = driver.findElement({className: 'title'})
    const body = driver.findElement({className: 'body'})
    const saveBtn = driver.findElement({className: 'save'})

    title.sendKeys('this is the title')
    body.sendKeys('this is the body')
    saveBtn.click()

    const upVote = driver.findElement({className: 'up-arrow'})
    const downVote = driver.findElement({className: 'down-arrow'})
    let cardQuality = driver.findElement({className: 'card-quality'})

    cardQuality.getText('value').then((value) =>{
      assert.equal(value, 'quality: normal');
    })

    upVote.click()
    cardQuality = driver.findElement({className: 'card-quality'})

    cardQuality.getText('value').then((value) =>{
      assert.equal(value, 'quality: high');
    })
  })
})
