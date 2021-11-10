const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const provider = waffle.provider;
let LoanRequest, loanRequest, signers, overrides, mutex = true, loanPurpose, loanAmount, payoffAmount, loanDuration
describe(('lendMatic function test'), () => {
    beforeEach(async () => {
        signers = await ethers.getSigners()
        if (mutex) {
            loanPurpose = Math.random().toString().substr(0, 4)
            loanAmount = ethers.utils.parseEther(parseInt(Math.floor(Math.random() * 2 + 1)).toString())
            payoffAmount = parseInt(Math.floor(Math.random() * 100));
            loanDuration = parseInt(Math.floor(Math.random() * 100))
            overrides = {
                value: loanAmount,
                from: signers[1].address
            }
            mutex = false
        }
        LoanRequest = await ethers.getContractFactory('LoanRequest')
        loanRequest = await LoanRequest.deploy(
            loanPurpose,
            loanAmount,
            payoffAmount,
            loanDuration
        )
    })
    describe('lendMatic function works', () => {
        it('creates new Loan instance', async () => {
            await loanRequest.connect(signers[1]).lendMatic(overrides)
            expect(await loanRequest.loan()).to.not.equal('0x0000000000000000000000000000000000000000')
        })
        it('funds the borrower', async () => {
            prevBalance = await provider.getBalance(signers[0].address)
            await loanRequest.connect(signers[1]).lendMatic(overrides)
            newBalance = await provider.getBalance(signers[0].address)
            expect(parseInt(newBalance)).to.be.at.least(parseInt(loanAmount) + parseInt(prevBalance))
        })
    })
})