
const { expect } = require('chai')
const { ethers } = require('hardhat')

let Loan, loan, signers
describe('Loan contract test', () => {
beforeEach(async () =>{
    await ethers.getSigners(0).then(res =>{
        signers = res
    })
    Loan = await ethers.getContractFactory('Loan')
    loan = await Loan.deploy(signers[0].address,signers[1].address,1,2)
})

describe('constructor works', ()=>{
it('should be equal', async ()=>{
    expect(await loan.payoffAmount()).to.equal(1)
})
})
})