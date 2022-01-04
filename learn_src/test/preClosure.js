const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("Testing the preClosure() function", () => {
    let Loan, loan, signers, loanAmount, loanDuration, borrower, lender, overrides
    beforeEach(async () => {
        signers = await ethers.getSigners()
        borrower = signers[0]
        lender = signers[1]
        loanAmount = ethers.utils.parseEther(".0000000001")
        loanDuration = 100000000000
        Loan = await ethers.getContractFactory("Loan")
        loan = await Loan.deploy(lender.address, borrower.address, loanAmount, loanDuration)
    })

    it("should finalize the debt", async () => {
        overrides = {
            value: loanAmount
        }
        await loan.preClosure(overrides)
        expect(loan.loanAmount()).to.be.reverted
    })
})