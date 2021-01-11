describe('NF LOGIN Test Suite', () => {

    it('Verify NF Login test case', () => {
        cy.clearCookies()
        cy.visit('https://sandbox-nfconsole.io/login')
        cy.title().should('eq', 'NetFoundry: Login')
        cy.get('#tenantLabel').type('AMAZONORG').should('have.value', 'AMAZONORG')
        cy.get('#LoginButton').click()
        cy.get('[type="email"]').clear().type('siva.sajja@netfoundry.io').should('have.value', 'siva.sajja@netfoundry.io')
        cy.get('[type="password"]').clear().type('Tata@2019').should('have.value', 'Tata@2019')
        cy.get('.auth0-lock-submit').click()
        cy.wait(5000)
        cy.get('#CloseButton > .buttonLabel').click()
        cy.get('.main[id="ProfileButton"]').click()
        cy.get('.link[id="LogoutButton"]').click()
        cy.get('.confirm[id="ConfirmActionLogout"]').click()
    })
})