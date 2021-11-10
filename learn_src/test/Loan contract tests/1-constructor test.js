
const { expect } = require('chai')
const { ethers } = require('hardhat')

let Loan, loan, signers, payoffAmount, loanDuration, mutex = true
describe('Loan constructor test', () => {
    beforeEach(async () => {
        if (mutex) {
            loanDuration = parseInt(Math.floor(Math.random() * 100))
            payoffAmount = parseInt(Math.floor(Math.random() * 100))
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

    describe('constructor works and state fields are set', () => {
        it('sets lender', async () => {
            expect(await loan.lender()).to.equal(signers[0].address)
        })
        it('sets borrower', async () => {
            expect(await loan.borrower()).to.equal(signers[1].address)
        })
        it('sets payoffAmount', async () => {
            expect(await loan.payoffAmount()).to.equal(payoffAmount)
        })
        it('sets loanDuration', async () => {
            expect(await loan.loanDuration()).to.equal(loanDuration)
        })
        //ToDO: how to access block.timestamp
        /*it('updatedDate is set', async () => {
            expect(await loan.updatedDate()).to.equal(block.timestamp)
        })
        it('dueDate is set', async () => {
            expect(await loan.dueDate()).to.equal(block.timestamp + loanDuration)
        })*/
    })
})