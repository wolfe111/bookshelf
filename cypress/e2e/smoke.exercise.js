// 🐨 you'll want a fake user to register as:
import {buildUser} from '../support/generate'

describe('smoke', () => {
  it('should allow a typical user flow', () => {
    // 🐨 create a fake user
    const user = buildUser()
    const bookName = 'Harry Potter and the Chamber of Secrets'
    // 🐨 visit '/' (📜 https://docs.cypress.io/api/commands/visit.html)
    cy.visit('/')
    // 🐨 find the button named "register" and click it
    cy.findByRole('button', {name: /register/i}).click()
    // 🐨 within the "dialog" find the username and password fields,
    //    type into them the values for your fake user, then click the register
    //    button to submit the form
    // 📜 https://docs.cypress.io/api/commands/within.html#Syntax
    // 📜 https://docs.cypress.io/api/commands/type.html#Syntax
    cy.findByRole('dialog').within(() => {
      cy.findByRole('textbox', {name: /username/i}).type(user.username)
      cy.findByLabelText('Password').type(user.password)
      cy.findByRole('button', {name: /register/i}).click()
    })
    // 🐨 within the "navigation", find the link named "discover" and click it
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /discover/i}).click()
    })
    //
    // 🐨 within the "main", type in the "searchbox" the title of a book and hit enter
    //   💰 when using "type" you can make it hit the enter key with "{enter}"
    //   🐨 within the listitem with the name of your book, find the button
    //      named "add to list" and click it.
    cy.findByRole('main').within(() => {
      cy.findByRole('searchbox', {name: /search/i})
        .type(bookName)
        .type('{enter}')
      cy.findByRole('listitem', {name: bookName}).within(() => {
        cy.findByRole('button', {name: /Add to list/i}).click()
      })
    })
    // 🐨 click the reading list link in the navigation
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /reading list/i}).click()
    })
    // 🐨 ensure the "main" only has one element "listitem"
    //   💰 https://docs.cypress.io/api/commands/should.html (.should('have.length', 1))
    //   🐨 click the link with the name of the book you added to the list to go to the book's page
    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', '1')
      cy.findByRole('listitem', {name: bookName}).click()
    })
    // 🐨 type in the notes textbox
    // The textbox is debounced, so the loading spinner won't show up immediately
    // so to make sure this is working, we need to wait for the spinner to show up
    // and *then* wait for it to go away.
    cy.findByRole('main').within(() => {
      cy.findByRole('textbox', {name: /notes/i}).type('Really cool notes')
      // 🐨 wait for the loading spinner to show up (💰 .should('exist'))
      // 🐨 wait for the loading spinner to go away (💰 .should('not.exist'))
      cy.findByLabelText('loading').should('exist')
      cy.findByLabelText('loading').should('not.exist')

      // 🐨 mark the book as read
      cy.findByRole('button', {name: 'Mark as read'}).click()

      // the radio buttons are fancy and the inputs themselves are visually hidden
      // in favor of nice looking stars, so we have to the force option to click.
      // 📜 https://docs.cypress.io/api/commands/click.html#Arguments
      // 🐨 click the 5 star rating radio button
      cy.findByRole('radio', {name: '5 stars'}).click({force: true})
    })

    // 🐨 navigate to the finished books page
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /finished/i}).click()
    })
    // 🐨 make sure there's only one listitem here (within "main")
    // 🐨 make sure the 5 star rating radio button is checked
    // 🐨 click the link for your book to go to the books page again
    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', '1')
      cy.findByRole('listitem', {name: bookName}).within(() => {
        cy.findByRole('radio', {name: '5 stars'}).should('be.checked')
        cy.findByRole('link').click()
      })
    })
    // 🐨 remove the book from the list
    // 🐨 ensure the notes textbox and the rating radio buttons are gone
    cy.findByRole('main').within(() => {
      cy.findByRole('button', {name: /remove from list/i}).click()
      cy.findByRole('textbox', {name: /notes/i}).should('not.exist')
      cy.findByRole('radio', {name: '5 stars'}).should('not.exist')
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /finished/i}).click()
    })
    // 🐨 ensure there are no books in the list

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', '0')
    })
  })
})
