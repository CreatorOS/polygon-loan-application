
const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const provider = waffle.provider;
let Loan, loan, signers, payoffAmount, loanDuration, mutex = true
describe('preClosure function test', () => {
    beforeEach(async () => {
        if (mutex) {
            loanDuration = parseInt(Math.floor(Math.random() * 100))
            payoffAmount = ethers.utils.parseEther(parseInt(Math.floor(Math.random() * 3) + 1).toString())
            mutex = false
        }
        signers = await ethers.getSigners()
        Loan = await ethers.getContractFactory('Loan')
        loan = await Loan.deploy(
            signers[0].address,
            signers[1].address,
            payoffAmount,
            loanDuration)
    })

    describe('preClosure function works', async () => {
        it('destroys the contract', async () => {
            const overrides = {
                value: payoffAmount,
                from: signers[3].address
            }
            await loan.connect(signers[3]).preClosure(overrides)
            expect(loan.payoffAmount()).to.be.reverted //no more calls are allowed
        })
        it("refunds the lender", async () => {
            const overrides = {
                value: payoffAmount,
                from: signers[2].address
            }
            prevBalance = await provider.getBalance(signers[0].address)
            await loan.connect(signers[2]).preClosure(overrides)
            newBalance = await provider.getBalance(signers[0].address)
            expect(parseInt(newBalance)).to.be.at.least(parseInt(overrides.value) + parseInt(prevBalance))
        })
    })
})