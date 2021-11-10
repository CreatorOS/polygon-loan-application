const { expect } = require('chai')
const { ethers } = require('hardhat')

let LoanRequest, loanRequest, signers, loanPurpose, loanAmount, payoffAmount, loanDuration
describe('LoanRequest constructor test', () => {
    beforeEach(async () => {
        signers = await ethers.getSigners()
        loanPurpose = Math.random().toString().substr(0, 4)
        loanAmount = parseInt(Math.floor(Math.random() * 100));
        payoffAmount = parseInt(Math.floor(Math.random() * 100))
        loanDuration = parseInt(Math.floor(Math.random() * 100))
        LoanRequest = await ethers.getContractFactory('LoanRequest')
        loanRequest = await LoanRequest.deploy(
            loanPurpose,
            loanAmount,
            payoffAmount,
            loanDuration
        )
    })
    describe('constructor works and state fields are set', () => {
        it('sets borrower', async() =>{
            expect(await loanRequest.borrower()).to.equal(signers[0].address)
        })
        it('sets loanPurpose', async() =>{
            expect(await loanRequest.loanPurpose()).to.equal(loanPurpose)
        })
        it('sets loanAmount', async() =>{
            expect(await loanRequest.loanAmount()).to.equal(loanAmount)
        })
        it('sets payoffAmount', async() =>{
            expect(await loanRequest.payoffAmount()).to.equal(payoffAmount)
        })
        it('sets loanDuration', async() =>{
            expect(await loanRequest.loanDuration()).to.equal(loanDuration)
        })
    })
})