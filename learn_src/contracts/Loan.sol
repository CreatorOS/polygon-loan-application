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
