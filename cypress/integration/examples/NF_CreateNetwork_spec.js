import 'cypress-wait-until'

describe('NF LOGIN Test Suite', () => {

    it('Verify NF Create Network test case', () => {
        const random = randomizeInteger(5000, 700000);
        cy.clearCookies()
        cy.visit('https://sandbox-nfconsole.io/login')
        cy.title().should('eq', 'NetFoundry: Login')
        cy.get('#tenantLabel').type('AMAZONORG').should('have.value', 'AMAZONORG')
        cy.get('#LoginButton').click()
        cy.get('[type="email"]').clear().type('siva.sajja@netfoundry.io').should('have.value', 'siva.sajja@netfoundry.io')
        cy.get('[type="password"]').clear().type('Tata@2019').should('have.value', 'Tata@2019')
        cy.get('.auth0-lock-submit').click()
        //cy.wait(5000)
        const networkname = 'NewNetwork' + random
        cy.get('#NewNetworkName').clear().type(networkname).should('have.value', networkname)
        //cy.wait(2000)
        cy.get('#CreateButton').click()
        cy.wait(5000)
        //const networkname = 'Network5'
        cy.log(networkname)
        cy.get('#NavigationButton > .main').click()
        cy.get('#currentNetwork').click()
        cy.wait(2000)
        cy.get('#ManageNetworkButton').click()
        cy.get('#NavigationButton > .main').click()
        cy.wait(5000)
        cy.get('#ItemsList >div>div:nth-child(2)').each(($ele, index, $list) => {
            const text = $ele.text()
            cy.log(text)
            if (text.includes(networkname)) {
                cy.get('#ItemsList >div>div:nth-child(4)').eq(index).then(function (NWstatus) {
                    const NetworkStatus = NWstatus.text()
                    cy.log(NetworkStatus)
                    let requestStarted = false;
                    //should('have.value', 'Homer')
                    //cy.get('#ItemsList >div>div:nth-child(4)').should('have.not.value', 'ERROR')
                    //cy.get('#ItemsList >div>div:nth-child(4)', { timeout: 60000 }).contains('ERROR')
                    cy.wait('#ItemsList >div>div:nth-child(4)')
                    cy.waitUntil(() =>
                        cy.get('#ItemsList >div>div:nth-child(4)')
                            .should('be.visible')
                            .contains('PROVISIONED')
                            .then(() => expect(NetworkStatus).to.contains('PROVISIONED'))
                        //.then(() => requestStarted === true)
                        , {
                            timeout: 90000,
                            interval: 1000,
                            errorMsg: 'PROVISIONED not sent `enter code here`within time limit'
                        })

                    /* cy.waitUntil(() => cy.get('#ItemsList >div>div:nth-child(4)').contains('PROVISIONED').then(win => win.foo === "PROVISIONED"), {
                            errorMsg: 'This is a custom error message', // overrides the default error message
                              timeout: 5000, // waits up to 2000 ms, default to 5000
                             interval: 500 // performs the check every 500 ms, default to 200
                          }); */

                    /* cy.get('#ItemsList >div>div:nth-child(4)').contains('PROVISIONING').catch((err) => {
                             cy.reload();
                             cy.wait(5000);
                             if (cy.get('#ItemsList >div>div:nth-child(4)').contains('PROVISIONED')) {
                                 cy.log('Came to if loop ==========>');
                             }
 
                         }) */
                        
                    expect(NetworkStatus).to.contains('PROVISIONED')
                })
            }
        })
        

    })
})

function randomizeInteger(min, max) {
    if (max == null) {
        max = (min == null ? Number.MAX_SAFE_INTEGER : min);
        min = 0;
    }
    min = Math.ceil(min);  // inclusive min
    max = Math.floor(max); // exclusive max

    if (min > max - 1) {
        throw new Error("Incorrect arguments.");
    }
    return min + Math.floor((max - min) * Math.random());
}
