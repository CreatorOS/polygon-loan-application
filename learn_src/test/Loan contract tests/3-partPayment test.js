
const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const provider = waffle.provider;
let Loan, loan, signers, payoffAmount, loanDuration, mutex = true
describe('partPayment function test', () => {
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

    describe('partPayment function works', async () => {
        it('updates payoffAmount', async () => {
            await loan.partPayment(payoffAmount, 0)
            expect(await loan.payoffAmount()).to.equal(payoffAmount)
        })
        it('updates loanDuration', async () => {
            await loan.partPayment(0, loanDuration)
            expect(await loan.loanDuration()).to.equal(loanDuration)
        })
        it("updates lender's balance", async () => {
            const overrides = {
                value: ethers.utils.parseEther("0.0001"), //sending 0.0001 ether
                from: signers[2].address  
          }
            prevBalance = await provider.getBalance(signers[0].address)
            await loan.connect(signers[2]).partPayment(0,0,overrides)
            newBalance = await provider.getBalance(signers[0].address)
            expect(parseInt(newBalance)).to.equal(parseInt(overrides.value ) + parseInt(prevBalance))
        })
        //ToDo test block.timestamps require statement
        //ToDo: updated date?
    })
})