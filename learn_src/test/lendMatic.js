
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("Testing the lendMatic() function", () => {
    let signers, LoanRequest, loanRequest, overrides, loanPurpose, loanAmount, loanDuration, borrower, lender
    beforeEach(async () => {
        signers = await ethers.getSigners()
        borrower = signers[0]
        lender = signers[1]
        loanPurpose = "purpose"
        loanAmount = ethers.utils.parseEther("0.000000001")
        loanDuration = 100000000000
        overrides = {
            value: loanAmount,
            from: signers[1].address
        }
        LoanRequest = await ethers.getContractFactory("LoanRequest")
        loanRequest = await LoanRequest.deploy(
            loanPurpose,
            loanAmount,
            loanDuration
        )
    })
    it("should create an instance of the Loan contract", async () => {
        await loanRequest.connect(lender).lendMatic(overrides)
        expect(await loanRequest.loan()).to.not.equal('0x0000000000000000000000000000000000000000')
    })

    it("should lend Matic tokens to the borrower", async () => {
        await loanRequest.connect(lender).lendMatic(overrides)
        expect(await loanRequest.accepted()).to.equal(true)
    })

})