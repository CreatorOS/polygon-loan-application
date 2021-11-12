
const { expect } = require('chai')
const { ethers } = require('hardhat')

let Loan, loan, signers, payoffAmount, loanDuration, mutex = true
describe('updateLoan function test', () => {
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

    describe('updateLoan function works', async () => {
        it('updates payoffAmount', async () => {
            await loan.updateLoan(payoffAmount, 0)
            expect(await loan.payoffAmount()).to.equal(payoffAmount)
        })
        it('updates loanDuration', async () => {
            await loan.updateLoan(0, loanDuration)
            expect(await loan.loanDuration()).to.equal(loanDuration)
        })
        it('updates updatedDate', async () => {
            await loan.updateLoan(payoffAmount, loanDuration)
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
    })
})