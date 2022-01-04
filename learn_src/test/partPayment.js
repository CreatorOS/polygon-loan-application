
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("Testing the partPayment() function", () => {
    let Loan, loan, signers, loanAmount, loanDuration, borrower, lender
    beforeEach(async () => {
        signers = await ethers.getSigners()
        borrower = signers[0]
        lender = signers[1]
        loanAmount = ethers.utils.parseEther("0.000000001")
        loanDuration = 100000000000
        Loan = await ethers.getContractFactory("Loan")
        loan = await Loan.deploy(lender.address, borrower.address, loanAmount, loanDuration)
    })

    it("should decrease the debt", async () => {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        let overrides = {
            value: ethers.utils.parseEther("0.0000000003")
        }
        await loan.partPayment(overrides)
        sleep(30000)
        let remainingLoan = await loan.loanAmount()
        expect(remainingLoan.toString()).to.be.equal(ethers.utils.parseEther("0.0000000007").toString())
    })
})