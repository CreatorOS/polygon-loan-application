
const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const provider = waffle.provider;
let Loan, loan, signers, payoffAmount, loanDuration, mutex = true
describe('preClosure function test', () => {
    beforeEach(async () => {
        if (mutex) {
            loanDuration = parseInt(Math.floor(Math.random() * 100))
            payoffAmount = ethers.utils.parseEther(parseInt(Math.floor(Math.random() * 100)).toString())
            mutex = false
        }
        await ethers.getSigners().then(res => {
            signers = res
        })
        Loan = await ethers.getContractFactory('Loan')
        loan = await Loan.deploy(
            signers[0].address,
            signers[1].address,
            payoffAmount,
            loanDuration)
    })

    describe('preClosure function works', async () => {
        it('contract is destroyed', async () => {
            const overrides = {
                value: payoffAmount,
                from: signers[3].address
            }
            await loan.connect(signers[3]).preClosure(overrides)
            expect(loan.payoffAmount()).to.be.reverted //no more calls are allowed
        })
        it("lender is refunded", async () => {
            const overrides = {
                value: payoffAmount,
                from: signers[2].address
            }
            prevBalance = await provider.getBalance(signers[0].address)
            await loan.connect(signers[2]).preClosure(overrides)
            newBalance = await provider.getBalance(signers[0].address)
            expect(parseInt(newBalance)).to.equal(parseInt(overrides.value) + parseInt(prevBalance))
        })
    })
})