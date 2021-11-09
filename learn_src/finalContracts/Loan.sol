//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Loan {
    address public lender;
    address public borrower;
    uint256 public payoffAmount;
    uint256 public dueDate;
    uint256 public loanDuration;
    uint256 public updatedDate;

    constructor(
        address _lender,
        address _borrower,
        uint256 _payoffAmount,
        uint256 _loanDuration
    ) {
        lender = _lender;
        borrower = _borrower;
        payoffAmount = _payoffAmount;
        loanDuration = _loanDuration;
        updatedDate = block.timestamp;
        dueDate = block.timestamp + loanDuration;
    }

    event LoanPaid(uint256, uint256, uint256);

    function updateLoan(uint256 _payoffAmount, uint256 _loanDuration) public {
        payoffAmount = _payoffAmount;
        loanDuration = _loanDuration;
        updatedDate = block.timestamp;
        emit LoanPaid(_payoffAmount, _loanDuration, block.timestamp);
    }

    function partPayment(uint256 _payoffAmount, uint256 _loanDuration)
        public
        payable
    {
        require(block.timestamp <= dueDate);

        payable(lender).transfer(msg.value);
        updateLoan(_payoffAmount, _loanDuration);
    }

    function preClosure() public payable {
        require(
            msg.value == payoffAmount,
            "Pay off amount value is not correct"
        );

        payable(lender).transfer(msg.value);
        updateLoan(0, 0);
        finalize();
    }

    function finalize() public {
        selfdestruct(payable(lender));
    }
}

contract LoanRequest {
    address public borrower;
    string public loanPurpose;
    uint256 public loanAmount;
    uint256 public payoffAmount;
    uint256 public loanDuration; //In hours

    constructor(
        string memory _loanPurpose,
        uint256 _loanAmount,
        uint256 _payoffAmount,
        uint256 _loanDuration
    ) {
        loanPurpose = _loanPurpose;
        loanAmount = _loanAmount;
        payoffAmount = _payoffAmount;
        loanDuration = _loanDuration;
        borrower = msg.sender;
    }

    event LoanRequestAccepted(address loan);
    Loan public loan;

    function lendMatic() public payable {
        require(msg.value == loanAmount);

        loan = new Loan(msg.sender, borrower, payoffAmount, loanDuration);

        //require(token.transferFrom(borrower, loan, collateralAmount));
        payable(borrower).transfer(loanAmount);
        emit LoanRequestAccepted(address(loan));
    }
}
