
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
        it('sets updatedDate', async () => {
            let updDate = await loan.updatedDate()
            let fqDate = loan.provider._fastQueryDate
            fqDate = fqDate.toString()
            updDate = updDate.toString()
            for (var i = 0; i <= fqDate.length - updDate.length + 1; i++) {
                updDate = updDate.concat('0')
            }
            updDate = parseInt(updDate)
            fqDate = parseInt(fqDate)
            expect(updDate).to.at.least(fqDate)
        })
        it('sets dueDate', async () => {
            let dDate = await loan.dueDate()
            let fqDate = loan.provider._fastQueryDate
            let lowerBoundDueDate = fqDate + loanDuration
            dDate = dDate.toString()
            lowerBoundDueDate = lowerBoundDueDate.toString()
            for (var i = 0; i <= lowerBoundDueDate.length - dDate.length + 1; i++) {
                dDate = dDate.concat('0')
            }
            dDate = parseInt(dDate)
            lowerBoundDueDate = parseInt(lowerBoundDueDate)
            expect(dDate).to.be.at.least(lowerBoundDueDate)
        })
    })
})