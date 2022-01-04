# Creating a Polygon loan application with hardhat
Hello, my dear geek! In this quest, we will learn how to create a simple loan dapp on Mumbai testnet. If you didn't complete the first quest in this Polygon series, then please do. We expect you to know how to do basic stuff with Hardhat and how to connect to Polygon.
Ready? Cool. First, make sure you have some test MATICs in your wallet. Second, you will need two Ethereum addresses for this quest. You can easily create a new one with MetaMask. In short, your _module.exports_ in _hardhat.config.js_ should look like this:
```js
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mumbai: {
      url: "", //Alchemy key here
      accounts: [
        "",
        ""
      ] //Two private keys here
    },
  }
  };
```
This quest is really simple, but yet quite informative. We will simply write two contracts that allow users to handle loan agreements. After that, we will write some tests. Let's get to it.
## Writing contracts - The Loan contract: 
in your _contracts_ directory, create a new file _Loan.sol_. Two contracts will live here, let's write the first one:
```js
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Loan {
    address public lender;
    address public borrower;
    uint256 public loanAmount;
    uint256 public dueDate;

    constructor(
        address _lender,
        address _borrower,
        uint256 _loanAmount,
        uint256 _loanDuration
    ) {
        lender = _lender;
        borrower = _borrower;
        loanAmount = _loanAmount;
        dueDate = block.timestamp + _loanDuration;
    }

    event LoanPaid(uint256 payTime);

    function updateLoanAmount(uint256 _loanAmountOffset) private {
        loanAmount -= _loanAmountOffset;
        emit LoanPaid(block.timestamp);
    }

    function partPayment() public payable {
        require(block.timestamp <= dueDate);
        payable(lender).transfer(msg.value);
        updateLoanAmount(msg.value);
    }

    function preClosure() public payable {
        require(msg.value == loanAmount, "Pay off amount value is not correct");
        payable(lender).transfer(msg.value);
        updateLoanAmount(0);
        finalize();
    }

    function finalize() private {
        selfdestruct(payable(lender));
    }
}
```
Nothing really complicated, the contract above allows creating a loan, paying a part of it, and closing it by paying the remaining debt. I know, the picture is not complete as of now, but it will once you add the next contract.

## Writing contracts - The LoanRequest contract:
This contract will have only one method. Just a method that the lender can call, signifying acceptance of the loan. In other words, the borrower deploys the LoanRequest and the lender accepts by calling this one function (_lendMatic()_). Then, a new _Loan_ instance is created, allowing further actions to take place. Let's see this in code:
```js
contract LoanRequest {
    address public borrower;
    string public loanPurpose;
    uint256 public loanAmount;
    uint256 public loanDuration;
    bool public accepted;

    constructor(
        string memory _loanPurpose,
        uint256 _loanAmount,
        uint256 _loanDuration
    ) {
        loanPurpose = _loanPurpose;
        loanAmount = _loanAmount;
        loanDuration = _loanDuration;
        borrower = msg.sender;
    }

    event LoanRequestAccepted(address loan);
    Loan public loan;

    function lendMatic() public payable {
        require(msg.value == loanAmount, "Pay off amount value is not correct");
        loan = new Loan(msg.sender, borrower, loanAmount, loanDuration);
        payable(borrower).transfer(loanAmount);
        accepted = true;
        emit LoanRequestAccepted(address(loan));
    }
}
```
Take some time to understand how these two contracts work in conjunction. Anyways, let's discover some of the possible scenarios in tests. We will write three test files, each targeting a specific function. To testing!

## Writing tests - The lendMatic function:
In your _test_ directory, create a lendMatic.js. We will be testing if this guy is doing what it is asked to do. Add this simple script:
```js

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
```
So, what is happening above? We just simulated deploying the _LoanRequest_ contract with the _borrower_ (your first address in hardhat config) and calling _lendMatic_ with your second address (the lender). Then we simply checked that changes were made to the contract state.

## Writing tests - the partPayment function:
Similarly, we test _PartPayment_. The function is there to allow paying partial payments. There is only one test case. Add these lines to a new partPayment.js file:
```js

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
```
We deploy _Loan_ with some debt, pay a certain part, test whether this part was deducted from the overall debt. Note that _sleep_ before querying the remaining debt. This is just to wait for the changes to be recorded. Cool? There is only one test file left!

## Writing tests - the preClosure function:
Create preClosure.js, we will do more or less the same. We start with deploying, then calling the target functions, and checking what really has happened.
```js
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
```
Does that _expect_ statement seem a bit weird? Why do we expect that call to revert? This is because _preClosure_ selfdestructs the contract, rendering it dysfunctional (no more calls).   

## Finally over
Run ``` npx hardhat test --network mumbai ``` in your terminal, and wait for all tests to pass!
And we are done, now you are more confident with deploying and testing Polygon contracts. A quick note: This is blockchain, some things may take a considerable amount of time. Some unexpected behaviors are, well, expected. Because of that, you may have to tweak the scripts above a bit (adding sleep statements). Sometimes some tests fail, but if you retry after a minute, they pass! That is part of the experience with blockchains. Don't worry and keep going, you've come a long way.