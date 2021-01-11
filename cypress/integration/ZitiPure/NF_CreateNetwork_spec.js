
describe('NF Network Test Suite', () => {

    it('Test Case - 1 :: Verify NF Create Network', () => {
        const random = randomizeInteger(5000, 700000);
        cy.clearCookies()
        cy.visit('https://staging-nfconsole.io/login')
        cy.title().should('eq', 'NetFoundry: Login')
        cy.get('#tenantLabel').type('AMAZONORG').should('have.value', 'AMAZONORG')
        cy.get('#LoginButton').click();
        cy.get('[type="email"]').clear().type('siva.sajja@netfoundry.io').should('have.value', 'siva.sajja@netfoundry.io')
        cy.get('[type="password"]').clear().type('Tata@2019').should('have.value', 'Tata@2019')
        cy.get('.auth0-lock-submit').click()
        cy.wait(5000)
        const networkname = 'NewNetwork' + random
        cy.get('#NewNetworkName').clear().type(networkname).should('have.value', networkname)
        cy.wait(2000)
        cy.get('#CreateButton').click()
        cy.wait(5000)
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
                checkStatus('#ItemsList >div>div:nth-child(4)', 'PROVISIONED', 500000).then(result => {
                    cy.get('#ItemsList >div>div:nth-child(4)').each((item)=> {
                      cy.wrap(item).should('have.text', 'PROVISIONED');
                    });
                    // or
                    //expect(result).to.be(true);
                  });
                cy.get('#ItemsList >div>div:nth-child(4)').eq(index).then(function (NWstatus) {
                    const NetworkStatus = NWstatus.text().trim();
                    cy.log(NetworkStatus)
                    cy.wait('#ItemsList >div>div:nth-child(4)')
                    cy.get('#ItemsList >div>div:nth-child(4)').should('have.not.value', 'ERROR')
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

function checkStatus(selector, status, maxWait, alreadyWaited = 0) {
    const waitTime = 5000;
    // cy.get returns a thenebale
    return cy.get(selector).each((item) => {
        // it checks the text right now, without unnecessary waitings
        if (!item.text().trim() === status) {
            return false;
        }
        return true;
    }).then(result => {
        if (result) {
            // only when the condition passes it returns a resolving promise
            return Promise.resolve(true);
        }
        // waits for a fixed milliseconds amount
        cy.reload();
        cy.wait(waitTime);
        alreadyWaited++;
        // the promise will be resolved with false if the wait last too much
        if (waitTime * alreadyWaited > maxWait) {
            return Promise.reject(new Error('Awaiting timeout'))
        }
        // returns the same function recursively, the next `.then()` will be the status function itself
        return checkStatus(selector, status, maxWait, alreadyWaited);
    });
}
